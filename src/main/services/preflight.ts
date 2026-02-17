import { execa } from 'execa';
import type { PreflightResult, ServiceRuntimeStatus, ServiceStartupType } from '../../shared/types';

type DetailKey = 'admin' | 'winget' | 'vssService' | 'taskScheduler' | 'restoreQuery';

export class PreflightService {
    private async runPowerShell(script: string): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
        const result = await execa('powershell', [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            script
        ], { reject: false });

        return {
            stdout: result.stdout || '',
            stderr: result.stderr || '',
            exitCode: result.exitCode ?? null
        };
    }

    private async checkAdmin(): Promise<{ ok: boolean; detail?: string }> {
        try {
            await execa('net', ['session'], { reject: true });
            return { ok: true };
        } catch {
            try {
                const result = await this.runPowerShell(
                    "([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)"
                );
                const ok = result.stdout.trim().toLowerCase() === 'true';
                return ok
                    ? { ok: true }
                    : { ok: false, detail: 'code=not-elevated' };
            } catch (error) {
                return { ok: false, detail: `code=admin-check-failed; output=${String(error)}` };
            }
        }
    }

    private async checkWinget(): Promise<{ ok: boolean; detail?: string }> {
        try {
            const result = await execa('winget', ['--version'], { reject: false });
            if (result.exitCode === 0) return { ok: true };
            const detail = `${result.stdout || ''}\n${result.stderr || ''}`.trim() || `exitCode=${result.exitCode ?? 'null'}`;
            const normalized = detail.toLowerCase();
            if (
                /not found|not recognized|no se reconoce|enoent|comando no encontrado/.test(normalized)
            ) {
                return { ok: false, detail: 'code=winget-missing' };
            }
            return { ok: false, detail: `code=winget-error; output=${detail}` };
        } catch (error) {
            const detail = String(error);
            const normalized = detail.toLowerCase();
            if (
                /not found|not recognized|no se reconoce|enoent|comando no encontrado|resourceunavailable/.test(normalized)
            ) {
                return { ok: false, detail: 'code=winget-missing' };
            }
            return { ok: false, detail: `code=winget-error; output=${detail}` };
        }
    }

    private normalizeRuntimeStatus(raw: string): ServiceRuntimeStatus {
        const normalized = raw.trim().toLowerCase();
        if (normalized === 'running') return 'running';
        if (normalized === 'stopped') return 'stopped';
        if (normalized === 'paused') return 'paused';
        if (normalized === 'missing') return 'missing';
        return 'unknown';
    }

    private normalizeStartupType(raw: string): ServiceStartupType {
        const normalized = raw.trim().toLowerCase();
        if (normalized === 'auto' || normalized === 'automatic' || normalized === 'automaticdelayedstart') return 'automatic';
        if (normalized === 'manual') return 'manual';
        if (normalized === 'disabled') return 'disabled';
        return 'unknown';
    }

    private async checkService(serviceName: string): Promise<{ ok: boolean; detail?: string; state: { status: ServiceRuntimeStatus; startType: ServiceStartupType } }> {
        const result = await this.runPowerShell(
            `$svc = Get-CimInstance Win32_Service -Filter "Name='${serviceName}'" -ErrorAction SilentlyContinue; if ($null -eq $svc) { 'missing|unknown' } else { "$($svc.State)|$($svc.StartMode)" }`
        );

        const raw = result.stdout.trim();
        if (!raw) {
            return {
                ok: false,
                detail: result.stderr.trim() || 'runtime=unknown; startup=unknown',
                state: { status: 'unknown', startType: 'unknown' }
            };
        }

        const [rawStatus = 'unknown', rawStartType = 'unknown'] = raw.split('|');
        const status = this.normalizeRuntimeStatus(rawStatus);
        const startType = this.normalizeStartupType(rawStartType);
        const detail = `runtime=${status}; startup=${startType}`;
        const ok = status === 'running' && startType !== 'disabled';
        return {
            ok,
            detail,
            state: { status, startType }
        };
    }

    private async checkRestoreQuery(): Promise<{ ok: boolean; detail?: string }> {
        const script = "$ErrorActionPreference='Stop'; try { Get-ComputerRestorePoint | Out-Null; 'ok' } catch { 'error: ' + $_.Exception.Message }";
        const result = await this.runPowerShell(script);
        const output = `${result.stdout}\n${result.stderr}`.trim();
        if (/^ok$/i.test(output)) return { ok: true };
        return { ok: false, detail: output || `exitCode=${result.exitCode ?? 'null'}` };
    }

    async run(): Promise<PreflightResult> {
        const details: Partial<Record<DetailKey, string>> = {};

        try {
            const [admin, winget, vssService, taskScheduler, restoreQuery] = await Promise.all([
                this.checkAdmin(),
                this.checkWinget(),
                this.checkService('VSS'),
                this.checkService('Schedule'),
                this.checkRestoreQuery()
            ]);

            if (admin.detail) details.admin = admin.detail;
            if (winget.detail) details.winget = winget.detail;
            if (vssService.detail) details.vssService = vssService.detail;
            if (taskScheduler.detail) details.taskScheduler = taskScheduler.detail;
            if (restoreQuery.detail) details.restoreQuery = restoreQuery.detail;

            const checks = {
                admin: admin.ok,
                winget: winget.ok,
                vssService: vssService.ok,
                taskScheduler: taskScheduler.ok,
                restoreQuery: restoreQuery.ok
            };

            let overall: PreflightResult['overall'] = 'ok';
            if (!checks.admin || !checks.winget) {
                overall = 'error';
            } else if (!checks.vssService || !checks.taskScheduler || !checks.restoreQuery) {
                overall = 'warning';
            }

            return {
                success: true,
                overall,
                checks,
                details,
                serviceStates: {
                    vssService: vssService.state,
                    taskScheduler: taskScheduler.state
                }
            };
        } catch (error) {
            return {
                success: false,
                overall: 'error',
                checks: {
                    admin: false,
                    winget: false,
                    vssService: false,
                    taskScheduler: false,
                    restoreQuery: false
                },
                details: {
                    admin: String(error)
                },
                serviceStates: {
                    vssService: { status: 'unknown', startType: 'unknown' },
                    taskScheduler: { status: 'unknown', startType: 'unknown' }
                }
            };
        }
    }
}
