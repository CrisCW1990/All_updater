import { app, dialog } from 'electron';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { DiagnosticsExportResult } from '../../shared/types';
import type { LoggerService } from './logger';

export class DiagnosticsService {
    private readonly logger: LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    private buildTimestamp(): string {
        return new Date().toISOString().replace(/[:.]/g, '-');
    }

    private readTail(filePath: string, maxLines = 250): string {
        if (!fs.existsSync(filePath)) return `File not found: ${filePath}`;
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split(/\r?\n/);
            return lines.slice(Math.max(lines.length - maxLines, 0)).join('\n');
        } catch (error) {
            return `Could not read ${filePath}: ${String(error)}`;
        }
    }

    private buildSystemSnapshot(): string {
        const userDataPath = app.getPath('userData');
        const logPath = this.logger.getLogPath();
        const restoreLogPath = path.join(userDataPath, 'restore_debug.txt');

        const sections = [
            '# All Updater Diagnostics',
            `GeneratedAt=${new Date().toISOString()}`,
            `AppVersion=${app.getVersion()}`,
            `AppName=${app.getName()}`,
            `Platform=${process.platform}`,
            `Arch=${process.arch}`,
            `OSRelease=${os.release()}`,
            `Locale=${Intl.DateTimeFormat().resolvedOptions().locale}`,
            `UserDataPath=${userDataPath}`,
            `AppLogPath=${logPath}`,
            `RestoreLogPath=${restoreLogPath}`,
            '',
            '## App Log (tail)',
            this.readTail(logPath),
            '',
            '## Restore Log (tail)',
            this.readTail(restoreLogPath)
        ];

        return sections.join('\n');
    }

    async exportDiagnostics(): Promise<DiagnosticsExportResult> {
        try {
            const folder = await dialog.showOpenDialog({
                title: 'Select folder for diagnostics / Selecciona carpeta para diagnóstico',
                defaultPath: app.getPath('downloads'),
                properties: ['openDirectory', 'createDirectory']
            });

            if (folder.canceled || folder.filePaths.length === 0) {
                return { success: false, canceled: true };
            }

            const targetFolder = folder.filePaths[0];
            const fileName = `all-updater-diagnostics-${this.buildTimestamp()}.txt`;
            const filePath = path.join(targetFolder, fileName);
            fs.writeFileSync(filePath, this.buildSystemSnapshot(), 'utf8');

            return { success: true, filePath };
        } catch (error) {
            return {
                success: false,
                error: String(error)
            };
        }
    }
}
