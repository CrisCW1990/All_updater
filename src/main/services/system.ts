import os from 'node:os';
import path from 'node:path';
import { shell } from 'electron';

export interface SystemInfo {
    platform: string;
    arch: string;
    release: string;
    locale: string;
}

export class SystemService {
    getSystemInfo(): SystemInfo {
        return {
            platform: process.platform,
            arch: process.arch,
            release: os.release(),
            // Intlhacks for simple locale detection in node
            locale: Intl.DateTimeFormat().resolvedOptions().locale
        };
    }

    getWingetArch(): string {
        switch (process.arch) {
            case 'x64': return 'x64';
            case 'arm64': return 'arm64';
            case 'ia32': return 'x86';
            default: return process.arch;
        }
    }

    async openSystemProtection(): Promise<void> {
        const windowsDir = process.env.WINDIR || 'C:\\Windows';
        const target = path.join(windowsDir, 'System32', 'SystemPropertiesProtection.exe');
        const error = await shell.openPath(target);
        if (error) {
            throw new Error(error);
        }
    }

    async openServicesConsole(): Promise<void> {
        const windowsDir = process.env.WINDIR || 'C:\\Windows';
        const target = path.join(windowsDir, 'System32', 'services.msc');
        const error = await shell.openPath(target);
        if (error) {
            throw new Error(error);
        }
    }
}
