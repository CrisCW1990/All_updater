import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';
import type { RestoreFailureReason, RestorePointResult } from '../../shared/types';

export class SystemRestoreService {
    private getRestoreLogPath(): string {
        return path.join(app.getPath('userData'), 'restore_debug.txt');
    }

    private writeRestoreLog(message: string): void {
        try {
            const line = `[${new Date().toISOString()}] ${message}\n`;
            fs.appendFileSync(this.getRestoreLogPath(), line, 'utf8');
        } catch (error) {
            console.error('[Restore] Could not write restore log:', error);
        }
    }

    private async getLatestRestoreSequence(): Promise<number | null> {
        const script = "$ErrorActionPreference='SilentlyContinue'; $rp = Get-ComputerRestorePoint | Sort-Object SequenceNumber -Descending | Select-Object -First 1; if ($null -eq $rp) { '' } else { $rp.SequenceNumber }";
        const result = await execa('powershell', [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            script
        ], { reject: false });

        const raw = (result.stdout || '').trim();
        const parsed = Number(raw);
        return Number.isFinite(parsed) ? parsed : null;
    }

    private normalize(text: string): string {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    private classifyRestoreFailure(output: string): RestoreFailureReason {
        const normalized = this.normalize(output);

        if (
            /system protection.*(turned off|disabled)|system restore.*disabled|proteccion del sistema.*desactiv|restauracion del sistema.*desactiv|no hay unidades que tengan habilitada la proteccion/.test(normalized)
        ) {
            return 'system-protection-disabled';
        }

        if (
            /already been created within the past|restore point.*frequency|ya se ha creado.*punto de restauracion|limite de frecuencia/.test(normalized)
        ) {
            return 'frequency-limit';
        }

        if (
            /access is denied|permiso denegado|administrator privileges|required elevation|elevacion/.test(normalized)
        ) {
            return 'access-denied';
        }

        if (
            /vss|volume shadow copy|software shadow copy provider|task scheduler|programador de tareas|rpc server|servicio.*sombra|servicio.*deshabilitad|service.*disabled|service.*not running/.test(normalized)
        ) {
            return 'service-unavailable';
        }

        if (
            /checkpoint-computer|restore point|punto de restauracion/.test(normalized)
        ) {
            return 'command-failed';
        }

        return 'unknown';
    }

    private buildDetails(stdout: string, stderr: string, exitCode: number | null): string {
        const merged = [stdout, stderr].filter(Boolean).join('\n').trim();
        const compact = merged.replace(/\s+/g, ' ').trim();
        const limited = compact.length > 900 ? `${compact.slice(0, 900)}...` : compact;
        return `exitCode=${exitCode ?? 'null'}; output=${limited || 'n/a'}`;
    }

    async createRestorePoint(description: string = "All Updater Auto-Restore"): Promise<RestorePointResult> {
        this.writeRestoreLog(`Restore request received. Description="${description}"`);
        try {
            const beforeSequence = await this.getLatestRestoreSequence();
            const timestamp = new Date().toLocaleString();
            const fullDescription = `${description} (${timestamp})`;
            const escapedDescription = fullDescription.replace(/'/g, "''");
            const command = `Checkpoint-Computer -Description '${escapedDescription}' -RestorePointType 'MODIFY_SETTINGS' -ErrorAction Stop`;

            const result = await execa('powershell', [
                '-NoProfile',
                '-NonInteractive',
                '-Command',
                command
            ], { reject: false });

            if (result.stdout) {
                console.log('[Restore] stdout:', result.stdout);
                this.writeRestoreLog(`Checkpoint stdout: ${result.stdout.replace(/\r?\n/g, ' | ')}`);
            }
            if (result.stderr) {
                console.error('[Restore] stderr:', result.stderr);
                this.writeRestoreLog(`Checkpoint stderr: ${result.stderr.replace(/\r?\n/g, ' | ')}`);
            }

            if (result.exitCode !== 0) {
                this.writeRestoreLog(`Checkpoint command failed with exitCode=${result.exitCode}`);
                const details = this.buildDetails(result.stdout || '', result.stderr || '', result.exitCode ?? null);
                const reason = this.classifyRestoreFailure(`${result.stdout || ''}\n${result.stderr || ''}`);
                this.writeRestoreLog(`Classified restore failure reason=${reason} details="${details}"`);
                return { success: false, reason, details };
            }

            const afterSequence = await this.getLatestRestoreSequence();
            const created =
                (beforeSequence === null && afterSequence !== null) ||
                (beforeSequence !== null && afterSequence !== null && afterSequence > beforeSequence);

            if (!created) {
                this.writeRestoreLog(
                    `Checkpoint returned success but no new restore point detected. before=${beforeSequence ?? 'null'} after=${afterSequence ?? 'null'}`
                );
                const details = this.buildDetails(result.stdout || '', result.stderr || '', result.exitCode ?? null);
                this.writeRestoreLog(`Classified restore failure reason=verification-failed details="${details}"`);
                return { success: false, reason: 'verification-failed', details };
            }

            this.writeRestoreLog(`Restore point created successfully. sequence=${afterSequence}`);

            return { success: true };
        } catch (error) {
            console.error('[Restore] Failed to create restore point:', error);
            this.writeRestoreLog(`Restore creation threw error: ${String(error)}`);
            return {
                success: false,
                reason: 'unknown',
                details: String(error)
            };
        }
    }
}
