import { execa } from 'execa';
import type { AppUpdate } from '../../shared/types';
import { SystemService } from './system';

export class WingetService {
    private systemService: SystemService;
    private historyService: any; // Using any to avoid circularity issues if needed or specific typing

    constructor(systemService: SystemService = new SystemService(), historyService?: any) {
        this.systemService = systemService;
        this.historyService = historyService;
    }

    async getAvailableUpdates(): Promise<AppUpdate[]> {
        try {
            console.log('[WingetService] Starting update check...');

            // PRIMARY: Use 'list --upgrade-available' instead of 'upgrade' for better compatibility
            // This command works more reliably on Spanish locale systems where 'upgrade' alone can fail
            // Note: 'list' command only accepts --accept-source-agreements, not --accept-package-agreements
            const args = ['list', '--upgrade-available', '--accept-source-agreements'];

            const { stdout } = await execa('winget', args, {
                all: true,
                reject: false,
                timeout: 60000,
                encoding: 'utf8'
            });

            console.log('[WingetService] Winget command finished. Parsing output...');
            console.log('[WingetService] Raw stdout length:', stdout.length);
            console.log('[WingetService] First 500 chars:', stdout.substring(0, 500));

            let updates = this.parseWingetOutput(stdout);
            console.log('[WingetService] Parsed updates count:', updates.length);
            if (updates.length > 0) {
                console.log('[WingetService] First update:', JSON.stringify(updates[0]));
            }

            // AUTO-HEALING: Only if search fails with known error codes or specific "ambiguous" output that isn't really ambiguous (winget quirk)
            const isAmbiguousError = stdout.includes('Se encontraron varios paquetes instalados') || stdout.includes('coinciden con los criterios de entrada');
            const isSourceError = stdout.includes('0x8a15005e') || stdout.includes('0x8a150001');

            if (updates.length === 0 && (isSourceError || isAmbiguousError)) {
                console.warn('[WingetService] Source error or Ambiguous output detected. Retrying with minimal flags...');

                // If it was a source error, try to heal sources first
                if (isSourceError) {
                    await this.ensureSourcesHealthy();
                }

                // Retry with a minimal command (no --include-unknown, no --architecture explicit)
                // This often fixes the "ambiguous" list behavior on some systems
                const { stdout: retryStdout } = await execa('winget', ['upgrade', '--accept-source-agreements', '--accept-package-agreements'], {
                    all: true,
                    reject: false,
                    timeout: 45000,
                    encoding: 'utf8'
                });
                updates = this.parseWingetOutput(retryStdout);
            }

            if (this.historyService) {
                // updates = updates.filter(u => !this.historyService.isVersionSkipped(u.id, u.available));
                const history = this.historyService.getHistory(); // Assuming getHistory is public or I can access it
                updates = updates.map(u => {
                    const found = history.find((h: any) => h.id === u.id && h.version === u.available);
                    if (found && (found.status === 'inapplicable' || found.status === 'skipped')) {
                        return { ...u, previousStatus: found.status, previousDetails: found.details };
                    }
                    return u;
                });
            }

            console.log(`[WingetService] Parsed ${updates.length} updates after filtering.`);
            return updates;
        } catch (error) {
            console.error('[WingetService] Failed to check updates:', error);
            throw error;
        }
    }

    async ensureSourcesHealthy(): Promise<void> {
        try {
            console.log('[WingetService] Resetting winget sources...');
            await execa('winget', ['source', 'reset', '--force'], { timeout: 30000 });
            await execa('winget', ['source', 'update'], { timeout: 60000 });
        } catch (e) {
            console.error('[WingetService] Failed to heal sources:', e);
        }
    }

    async installUpdate(id: string, onLog?: (log: string) => void): Promise<void> {
        console.log(`[WingetService] Installing update: ${id}`);
        const arch = this.systemService.getWingetArch();

        const baseArgs = [
            'upgrade',
            '--id', id,
            '--silent',
            '--force',
            '--architecture', arch,
            '--include-unknown',
            '--accept-package-agreements',
            '--accept-source-agreements'
        ];

        const runCmd = async (args: string[]) => {
            const subprocess = execa('winget', args);

            if (onLog && subprocess.stdout) {
                subprocess.stdout.on('data', (data) => {
                    const line = data.toString().trim();
                    if (line) onLog(line);
                });
            }

            try {
                await subprocess;
            } catch (error: any) {
                const code = error.exitCode;
                // 3010: Reboot required, 0x8A15001A: Reboot required
                if (code === 3010 || code === -1978335206) {
                    throw new Error(`RebootRequired: The update for ${id} was installed but a system restart is required.`);
                }
                // 0x8A150005: App in use
                if (code === -1978335227) {
                    throw new Error(`AppInUse: Could not update ${id} because it is currently running.`);
                }
                throw error;
            }
        };

        try {
            await runCmd(baseArgs);
        } catch (error: any) {
            // Check for inapplicability or other common Winget "not found" quirks
            const isInapplicable =
                error.message.includes('Inapplicable') ||
                error.stdout?.includes('No se ha encontrado ninguna actualización aplicable') ||
                error.stdout?.includes('No se encontró ningún paquete') ||
                error.stdout?.includes('No applicable update found') ||
                error.stdout?.includes('No update needed') ||
                error.exitCode === -1978335221;

            const isTechMismatch =
                error.exitCode === 2316632107 ||
                error.exitCode === -1978335189 ||
                error.stdout?.includes('tecnología de instalación es diferente') ||
                error.stdout?.includes('installation technology is different');

            // NEW: Hash Mismatch (0x8a150011 / 2316632081)
            const isHashMismatch =
                error.exitCode === 2316632081 ||
                error.stdout?.includes('Installer hash does not match') ||
                error.stdout?.includes('El hash del instalador no coincide');

            // NEW: File in Use (Exit Code 6 or specific text)
            // Note: Exit Code 6 is generic "handle invalid", but in context of installers often means in use.
            const isFileInUse =
                error.exitCode === 6 ||
                error.stdout?.includes('Files modified by the installer are currently in use') ||
                error.stdout?.includes('Otra aplicación está usando los archivos modificados') ||
                error.stdout?.includes('File in use') ||
                error.stdout?.includes('Archivo en uso');

            if (isHashMismatch) {
                console.warn(`[WingetService] Hash mismatch for ${id}. Security risk.`);
                throw new Error(`HashMismatch: Installer security check failed. The vendor may have changed the file.`);
            }

            if (isFileInUse) {
                console.warn(`[WingetService] File in use for ${id}.`);
                throw new Error(`AppInUse: The application is currently running. Please close it.`);
            }

            if (isInapplicable || isTechMismatch) {
                console.warn(`[WingetService] Update for ${id} is inapplicable/mismatch. Retrying with force for good measure, or failing gracefully.`);

                // If it's tech mismatch, attempt force install fallback
                if (isTechMismatch) {
                    console.warn(`[WingetService] Tech mismatch for ${id}. Attempting fallback to 'install --force'...`);
                    try {
                        // Use 'install' instead of 'upgrade' to bypass the check, with --force
                        const fallbackArgs = [
                            'install',
                            '--id', id,
                            '--silent',
                            '--force',
                            '--architecture', arch,
                            '--accept-package-agreements',
                            '--accept-source-agreements'
                        ];
                        await execa('winget', fallbackArgs);
                        console.log(`[WingetService] Force install fallback for ${id} succeeded.`);
                        return;
                    } catch (fallbackError: any) {
                        console.error(`[WingetService] Force install fallback for ${id} failed:`, fallbackError);
                        throw new Error(`Inapplicable: Manual uninstall required. Different installation technology and force install failed.`);
                    }
                }

                try {
                    await runCmd([...baseArgs, '--force']);
                    console.log(`[WingetService] Force update for ${id} succeeded.`);
                    return;
                } catch (forceError: any) {
                    console.error(`[WingetService] Force update for ${id} also failed.`);
                    throw new Error(`Inapplicable: The installer reports no update is needed for ${id} on this system, or the package ID is temporarily unreachable.`);
                }
            }
            throw error;
        }
    }

    async installAll(): Promise<void> {
        console.log('[WingetService] Installing all updates...');
        const arch = this.systemService.getWingetArch();
        await execa('winget', [
            'upgrade',
            '--all',
            '--include-unknown',
            '--architecture', arch,
            '--accept-source-agreements',
            '--accept-package-agreements',
            '--silent'
        ]);
    }

    async isElevated(): Promise<boolean> {
        try {
            await execa('net', ['session'], { reject: true });
            return true;
        } catch {
            return false;
        }
    }

    private parseWingetOutput(output: string): AppUpdate[] {
        // Clean ANSI escape codes and progress bar artifacts
        // eslint-disable-next-line no-control-regex
        let cleaned = output.replace(/\x1b\[[0-9;]*m/g, ''); // Remove ANSI color codes
        cleaned = cleaned.replace(/\r/g, '\n'); // Treat CR as new line to split progress frames

        const lines = cleaned.split('\n');
        const updates: AppUpdate[] = [];

        // Find the header line - skip lines with leading garbage
        // Find the header line - skip lines with leading garbage
        let headerIndex = lines.findIndex(line => {
            const trimmed = line.trim();
            // Header should contain at least proper column names
            // We removed strict start check because of potential invisible chars
            return (trimmed.includes('Id') || trimmed.includes('ID')) &&
                (trimmed.includes('Version') || trimmed.includes('Versión') || trimmed.includes('Versin'));
        });

        console.log('[WingetService] Header index:', headerIndex);
        if (headerIndex >= 0) {
            console.log('[WingetService] Header line:', lines[headerIndex]);
        }

        if (headerIndex === -1) {
            // Check if it's just "no updates found" which is common and not an error
            const noUpdates = output.includes('No se han encontrado actualizaciones') ||
                output.includes('No updates found') ||
                output.includes('reajusta tu') ||
                output.includes('up to date') ||
                output.includes('está actualizado') ||
                output.trim() === '';

            if (!noUpdates) {
                console.warn('[WingetService] Could not find header in winget output.');
            }
            return [];
        }

        const headerLine = lines[headerIndex];

        // Helper to find start index of specific column headers
        const findCol = (keywords: string[]) => {
            for (const kw of keywords) {
                const idx = headerLine.indexOf(kw);
                if (idx !== -1) return idx;
            }
            return -1;
        };

        const idStart = findCol(['Id', 'ID']);
        const versionStart = findCol(['Versión', 'Version', 'Versin']);
        const availableStart = findCol(['Disponible', 'Available', 'Disponble']);
        const sourceStart = findCol(['Origen', 'Source']);

        console.log('[WingetService] Column positions - Id:', idStart, 'Version:', versionStart, 'Available:', availableStart, 'Source:', sourceStart);

        // Fallback to dash detection if keywords are not found exactly
        if (idStart === -1 || versionStart === -1 || availableStart === -1) {
            const separatorLine = lines[headerIndex + 1] || '';
            const colMatches = Array.from(separatorLine.matchAll(/-+/g));
            if (colMatches.length < 4) return [];
            const colBounds = colMatches.map(m => ({ start: m.index!, end: m.index! + m[0].length }));

            const dataLines = lines.slice(headerIndex + 2);
            for (const line of dataLines) {
                if (!line.trim() || line.includes('actualizaciones disponibles')) continue;
                updates.push({
                    name: line.substring(0, colBounds[1].start).trim(),
                    id: line.substring(colBounds[1].start, colBounds[1].end).trim(),
                    version: line.substring(colBounds[2].start, colBounds[2].end).trim(),
                    available: line.substring(colBounds[3].start, colBounds[3].end).trim(),
                    source: colBounds[4] ? line.substring(colBounds[4].start).trim() : 'winget'
                });
            }
            return updates;
        }

        const dataLines = lines.slice(headerIndex + 2);
        console.log('[WingetService] Processing', dataLines.length, 'data lines');

        for (const line of dataLines) {
            if (!line.trim() ||
                line.includes('actualizaciones disponibles') ||
                line.startsWith('No se han') ||
                line.trim().startsWith('-') || // Skip separator lines
                /^\d+\s+paquete/.test(line.trim()) || // Skip footer notes (ES)
                /^\d+\s+package/.test(line.trim()) // Skip footer notes (EN)
            ) {
                console.log('[WingetService] Skipping line:', line.substring(0, 50));
                continue;
            }

            // Extract substrings based on header keyword positions
            // Name is before ID
            const name = line.substring(0, idStart).trim();
            // ID is from idStart to start of Version
            const id = line.substring(idStart, versionStart).trim();
            // Current Version
            const version = line.substring(versionStart, availableStart).trim();
            // Available Version
            const available = sourceStart !== -1
                ? line.substring(availableStart, sourceStart).trim()
                : line.substring(availableStart).trim();
            const source = sourceStart !== -1 ? line.substring(sourceStart).trim() : 'winget';

            console.log('[WingetService] Parsed line - Name:', name, 'ID:', id, 'Version:', version, 'Available:', available);

            if (id && id !== '-' && id !== 'ID') {
                updates.push({ name, id, version, available, source });
            } else {
                console.log('[WingetService] Rejected - invalid ID');
            }
        }

        return updates;
    }
}
