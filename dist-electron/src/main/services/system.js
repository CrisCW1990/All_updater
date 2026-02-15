import os from 'node:os';
export class SystemService {
    getSystemInfo() {
        return {
            platform: process.platform,
            arch: process.arch,
            release: os.release(),
            // Intlhacks for simple locale detection in node
            locale: Intl.DateTimeFormat().resolvedOptions().locale
        };
    }
    getWingetArch() {
        switch (process.arch) {
            case 'x64': return 'x64';
            case 'arm64': return 'arm64';
            case 'ia32': return 'x86';
            default: return process.arch;
        }
    }
}
