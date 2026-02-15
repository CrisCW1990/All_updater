import { execa } from 'execa';
import { SystemService } from './system';
export class WingetService {
    systemService;
    historyService;
    constructor(systemService = new SystemService(), historyService) {
        this.systemService = systemService;
        this.historyService = historyService;
    }
    isSpanishSystemLocale() {
        const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
        return locale.startsWith('es');
    }
    isDisableInteractivityUnsupported(output) {
        return /(disable-interactivity).*(unknown|unsupported|invalid|unrecognized)|unknown option.*disable-interactivity|no option named.*disable-interactivity/i.test(output);
    }
    async runWingetCommandWithFallback(args, options) {
        const attempts = [
            [...args, '--disable-interactivity'],
            args
        ];
        for (const attemptArgs of attempts) {
            const result = await execa('winget', attemptArgs, {
                reject: false,
                timeout: options.timeout,
                encoding: 'utf8',
                ...(options.includeAll ? { all: true } : {})
            });
            const stdout = result.stdout || '';
            const stderr = result.stderr || '';
            const allOutput = options.includeAll
                ? result.all || `${stdout}\n${stderr}`
                : `${stdout}\n${stderr}`;
            const combined = `${stdout}\n${stderr}\n${allOutput}`;
            if (attemptArgs.includes('--disable-interactivity') && this.isDisableInteractivityUnsupported(combined)) {
                console.warn('[WingetService] --disable-interactivity unsupported. Retrying without it...');
                continue;
            }
            return { stdout, stderr, all: allOutput };
        }
        return { stdout: '', stderr: '', all: '' };
    }
    containsNoUpdatesMessage(output) {
        const normalized = output
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        const includeChecks = [
            'no se han encontrado actualizaciones',
            'no se encontraron actualizaciones disponibles',
            'no hay actualizaciones disponibles',
            'no updates found',
            'no updates available',
            'no available upgrade found',
            'no applicable update found',
            'no installed package found matching input criteria',
            'no packages found matching input criteria',
            'up to date',
            'esta actualizado'
        ];
        if (includeChecks.some(pattern => normalized.includes(pattern))) {
            return true;
        }
        const regexChecks = [
            /no se encontr.*paquete.*coincid.*criterios? de entrada/,
            /no installed package found matching input criteria/,
            /no packages found matching input criteria/
        ];
        return regexChecks.some(regex => regex.test(normalized));
    }
    isProgressOnlyNoise(output) {
        const lines = output
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
        if (lines.length === 0)
            return false;
        const progressLikeLines = lines.filter(line => /\b\d{1,3}%\b/.test(line) || /ÔûÆ|â–|█|▒|▓/.test(line));
        const meaningfulTextLines = lines.filter(line => /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(line) && !/\b\d{1,3}%\b/.test(line));
        return progressLikeLines.length > 0 && meaningfulTextLines.length === 0;
    }
    async getAvailableUpdates() {
        try {
            console.log('[WingetService] Starting update check...');
            let updates = await this.tryGetUpdatesFromJson();
            let textOutput = '';
            let retriedWithUpgrade = false;
            if (updates === null) {
                // Fallback: localized text parsing for older/quirky winget outputs.
                const args = ['list', '--upgrade-available', '--include-unknown', '--accept-source-agreements'];
                const textResult = await this.runWingetCommandWithFallback(args, {
                    timeout: 60000,
                    includeAll: true
                });
                textOutput = textResult.all;
                console.log('[WingetService] Winget text command finished. Parsing output...');
                console.log('[WingetService] Raw stdout length:', textOutput.length);
                console.log('[WingetService] First 500 chars:', textOutput.substring(0, 500));
                try {
                    updates = this.parseWingetOutput(textOutput);
                }
                catch (parseError) {
                    if (this.containsNoUpdatesMessage(textOutput)) {
                        console.log('[WingetService] No updates detected from text output.');
                        updates = [];
                    }
                    else {
                        console.warn('[WingetService] Primary text parse failed. Retrying with upgrade output...', parseError);
                        const retryResult = await this.runWingetCommandWithFallback(['upgrade', '--include-unknown', '--accept-source-agreements', '--accept-package-agreements'], { timeout: 45000, includeAll: true });
                        textOutput = retryResult.all;
                        retriedWithUpgrade = true;
                        if (this.containsNoUpdatesMessage(textOutput)) {
                            console.log('[WingetService] No updates detected after upgrade retry.');
                            updates = [];
                        }
                        else {
                            updates = this.parseWingetOutput(textOutput);
                        }
                    }
                }
            }
            console.log('[WingetService] Parsed updates count:', updates.length);
            if (updates.length > 0) {
                console.log('[WingetService] First update:', JSON.stringify(updates[0]));
            }
            // AUTO-HEALING: Only if search fails with known error codes or specific "ambiguous" output that isn't really ambiguous (winget quirk)
            const isAmbiguousError = textOutput.includes('Se encontraron varios paquetes instalados') || textOutput.includes('coinciden con los criterios de entrada');
            const isSourceError = textOutput.includes('0x8a15005e') || textOutput.includes('0x8a150001');
            if (!retriedWithUpgrade && textOutput && updates.length === 0 && (isSourceError || isAmbiguousError)) {
                console.warn('[WingetService] Source error or Ambiguous output detected. Retrying with minimal flags...');
                // If it was a source error, try to heal sources first
                if (isSourceError) {
                    await this.ensureSourcesHealthy();
                }
                // Retry with a minimal upgrade command.
                // This often fixes the "ambiguous" list behavior on some systems.
                const retryResult = await this.runWingetCommandWithFallback(['upgrade', '--include-unknown', '--accept-source-agreements', '--accept-package-agreements'], {
                    timeout: 45000,
                    includeAll: true
                });
                updates = this.containsNoUpdatesMessage(retryResult.all)
                    ? []
                    : this.parseWingetOutput(retryResult.all);
                retriedWithUpgrade = true;
            }
            if (this.historyService) {
                // updates = updates.filter(u => !this.historyService.isVersionSkipped(u.id, u.available));
                const history = this.historyService.getHistory(); // Assuming getHistory is public or I can access it
                updates = updates
                    .filter(u => {
                    // If the installed version is unknown and this exact target version
                    // was already installed successfully, hide it in subsequent checks.
                    if (!this.isUnknownInstalledVersion(u.version))
                        return true;
                    const alreadyInstalled = history.some(h => h.id === u.id &&
                        h.version === u.available &&
                        (h.status === 'success' || h.status === 'reboot'));
                    return !alreadyInstalled;
                })
                    .map(u => {
                    const found = history.find((h) => h.id === u.id && h.version === u.available);
                    if (found && (found.status === 'inapplicable' || found.status === 'skipped')) {
                        return { ...u, previousStatus: found.status, previousDetails: found.details };
                    }
                    return u;
                });
            }
            console.log(`[WingetService] Parsed ${updates.length} updates after filtering.`);
            return updates;
        }
        catch (error) {
            const err = error;
            if (err.code === 'ENOENT' ||
                /ENOENT|not found|not recognized|No se reconoce/i.test(err.message || '')) {
                throw new Error('WingetNotFound: winget executable is missing.');
            }
            console.error('[WingetService] Failed to check updates:', error);
            throw error;
        }
    }
    async ensureSourcesHealthy() {
        try {
            console.log('[WingetService] Resetting winget sources...');
            await execa('winget', ['source', 'reset', '--force'], { timeout: 30000 });
            await execa('winget', ['source', 'update'], { timeout: 60000 });
        }
        catch (e) {
            console.error('[WingetService] Failed to heal sources:', e);
        }
    }
    async installUpdate(id, onLog) {
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
        const runCmd = async (args) => {
            const subprocess = execa('winget', args);
            if (onLog && subprocess.stdout) {
                subprocess.stdout.on('data', (data) => {
                    const line = data.toString().trim();
                    if (line)
                        onLog(line);
                });
            }
            try {
                await subprocess;
            }
            catch (error) {
                const wingetError = error;
                const code = wingetError.exitCode;
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
        }
        catch (error) {
            const wingetError = error;
            // Check for inapplicability or other common Winget "not found" quirks
            const isInapplicable = (wingetError.message || '').includes('Inapplicable') ||
                wingetError.stdout?.includes('No se ha encontrado ninguna actualización aplicable') ||
                wingetError.stdout?.includes('No se encontró ningún paquete') ||
                wingetError.stdout?.includes('No applicable update found') ||
                wingetError.stdout?.includes('No update needed') ||
                wingetError.exitCode === -1978335221;
            const isTechMismatch = wingetError.exitCode === 2316632107 ||
                wingetError.exitCode === -1978335189 ||
                wingetError.stdout?.includes('tecnología de instalación es diferente') ||
                wingetError.stdout?.includes('installation technology is different');
            // NEW: Hash Mismatch (0x8a150011 / 2316632081)
            const isHashMismatch = wingetError.exitCode === 2316632081 ||
                wingetError.stdout?.includes('Installer hash does not match') ||
                wingetError.stdout?.includes('El hash del instalador no coincide');
            // NEW: File in Use (Exit Code 6 or specific text)
            // Note: Exit Code 6 is generic "handle invalid", but in context of installers often means in use.
            const isFileInUse = wingetError.exitCode === 6 ||
                wingetError.stdout?.includes('Files modified by the installer are currently in use') ||
                wingetError.stdout?.includes('Otra aplicación está usando los archivos modificados') ||
                wingetError.stdout?.includes('File in use') ||
                wingetError.stdout?.includes('Archivo en uso');
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
                    }
                    catch (fallbackError) {
                        console.error(`[WingetService] Force install fallback for ${id} failed:`, fallbackError);
                        throw new Error(`Inapplicable: Manual uninstall required. Different installation technology and force install failed.`);
                    }
                }
                try {
                    await runCmd([...baseArgs, '--force']);
                    console.log(`[WingetService] Force update for ${id} succeeded.`);
                    return;
                }
                catch {
                    console.error(`[WingetService] Force update for ${id} also failed.`);
                    throw new Error(`Inapplicable: The installer reports no update is needed for ${id} on this system, or the package ID is temporarily unreachable.`);
                }
            }
            throw error;
        }
    }
    async isElevated() {
        try {
            await execa('net', ['session'], { reject: true });
            return true;
        }
        catch {
            return false;
        }
    }
    async tryGetUpdatesFromJson() {
        const jsonArgsCandidates = [
            ['list', '--upgrade-available', '--include-unknown', '--accept-source-agreements', '--output', 'json'],
            ['upgrade', '--include-unknown', '--accept-source-agreements', '--accept-package-agreements', '--output', 'json']
        ];
        for (const args of jsonArgsCandidates) {
            try {
                const { stdout } = await this.runWingetCommandWithFallback(args, {
                    timeout: 60000,
                    includeAll: false
                });
                const parsed = this.parseWingetJsonOutput(stdout);
                if (parsed !== null) {
                    return parsed;
                }
            }
            catch (error) {
                console.warn('[WingetService] JSON output parsing failed, falling back to text parser:', error);
            }
        }
        return null;
    }
    parseWingetJsonOutput(rawOutput) {
        if (!rawOutput?.trim())
            return null;
        const firstBrace = rawOutput.indexOf('{');
        const firstBracket = rawOutput.indexOf('[');
        const startCandidates = [firstBrace, firstBracket].filter(index => index >= 0);
        if (startCandidates.length === 0)
            return null;
        const jsonStart = Math.min(...startCandidates);
        const jsonText = rawOutput.slice(jsonStart);
        let payload;
        try {
            payload = JSON.parse(jsonText);
        }
        catch {
            return null;
        }
        const packageObjects = this.extractPackageObjects(payload);
        if (!packageObjects)
            return null;
        const updates = packageObjects
            .map(pkg => this.mapJsonPackageToUpdate(pkg))
            .filter((pkg) => pkg !== null);
        return updates;
    }
    extractPackageObjects(payload) {
        if (!payload || typeof payload !== 'object')
            return null;
        const root = payload;
        if (Array.isArray(root.Packages)) {
            return root.Packages.filter(item => item && typeof item === 'object');
        }
        if (Array.isArray(root.Sources)) {
            const packages = [];
            for (const source of root.Sources) {
                if (!source || typeof source !== 'object')
                    continue;
                const sourceRecord = source;
                if (Array.isArray(sourceRecord.Packages)) {
                    packages.push(...sourceRecord.Packages.filter(item => item && typeof item === 'object'));
                }
            }
            return packages;
        }
        if (Array.isArray(payload)) {
            return payload.filter(item => item && typeof item === 'object');
        }
        return null;
    }
    mapJsonPackageToUpdate(pkg) {
        const name = this.readFirstString(pkg, ['PackageName', 'Name']);
        const id = this.readFirstString(pkg, ['PackageIdentifier', 'Id', 'PackageId']);
        const version = this.readFirstString(pkg, ['InstalledVersion', 'Version']) || 'Unknown';
        const available = this.readFirstString(pkg, ['AvailableVersion', 'Available']);
        const source = this.readFirstString(pkg, ['Source']) || 'winget';
        if (!name || !available || !this.isLikelyPackageId(id, { name, version, available })) {
            return null;
        }
        return { name, id, version, available, source };
    }
    readFirstString(obj, keys) {
        for (const key of keys) {
            const value = obj[key];
            if (typeof value === 'string' && value.trim()) {
                return value.trim();
            }
        }
        return '';
    }
    isLikelyPackageId(id, context) {
        const value = id.trim();
        if (!value || value === '-' || value.toUpperCase() === 'ID')
            return false;
        if (/\s/.test(value))
            return false;
        const currentVersion = context?.version?.trim();
        const nextVersion = context?.available?.trim();
        if (currentVersion && value === currentVersion)
            return false;
        if (nextVersion && value === nextVersion)
            return false;
        if (/^\d+(?:[.\-_]\d+)+$/.test(value))
            return false;
        if (/^v?\d+(?:\.\d+){1,}$/.test(value))
            return false;
        if (value.length < 2)
            return false;
        return true;
    }
    isUnknownInstalledVersion(version) {
        const normalized = version.trim().toLowerCase();
        return normalized === 'unknown' ||
            normalized === '<unknown>' ||
            normalized === 'desconocido' ||
            normalized === '<desconocido>' ||
            normalized === '-';
    }
    parseWingetOutput(output) {
        // Clean ANSI escape codes and progress bar artifacts
        // eslint-disable-next-line no-control-regex
        let cleaned = output.replace(/\x1b\[[0-9;]*m/g, ''); // Remove ANSI color codes
        cleaned = cleaned.replace(/\r/g, '\n'); // Treat CR as new line to split progress frames
        const lines = cleaned.split('\n');
        const updates = [];
        const prefersSpanish = this.isSpanishSystemLocale();
        const idTokens = ['Id', 'ID'];
        const versionTokens = prefersSpanish ? ['Versión', 'Version', 'Versin'] : ['Version', 'Versión', 'Versin'];
        const availableTokens = prefersSpanish ? ['Disponible', 'Available', 'Disponble'] : ['Available', 'Disponible', 'Disponble'];
        const sourceTokens = prefersSpanish ? ['Origen', 'Source'] : ['Source', 'Origen'];
        // Find the header line - skip lines with leading garbage
        const headerIndex = lines.findIndex(line => {
            const trimmed = line.trim();
            return idTokens.some(token => trimmed.includes(token)) &&
                versionTokens.some(token => trimmed.includes(token));
        });
        console.log('[WingetService] Header index:', headerIndex);
        if (headerIndex >= 0) {
            console.log('[WingetService] Header line:', lines[headerIndex]);
        }
        if (headerIndex === -1) {
            const noUpdates = this.containsNoUpdatesMessage(output) || output.trim() === '';
            if (noUpdates) {
                return [];
            }
            if (this.isProgressOnlyNoise(output)) {
                throw new Error('WingetOutputParseError: Unparseable progress output detected.');
            }
            throw new Error('WingetOutputParseError: Could not find updates table header.');
        }
        const headerLine = lines[headerIndex];
        // Helper to find start index of specific column headers
        const findCol = (keywords) => {
            for (const kw of keywords) {
                const idx = headerLine.indexOf(kw);
                if (idx !== -1)
                    return idx;
            }
            return -1;
        };
        const idStart = findCol(idTokens);
        const versionStart = findCol(versionTokens);
        const availableStart = findCol(availableTokens);
        const sourceStart = findCol(sourceTokens);
        console.log('[WingetService] Column positions - Id:', idStart, 'Version:', versionStart, 'Available:', availableStart, 'Source:', sourceStart);
        // Fallback to dash detection if keywords are not found exactly
        if (idStart === -1 || versionStart === -1 || availableStart === -1) {
            const dataLines = lines.slice(headerIndex + 2);
            for (const line of dataLines) {
                const trimmed = line.trim();
                if (!trimmed ||
                    trimmed.startsWith('-') ||
                    trimmed.startsWith('No se han') ||
                    trimmed.startsWith('No updates found') ||
                    trimmed.startsWith('No applicable update found') ||
                    trimmed.startsWith('No installed package found matching input criteria') ||
                    trimmed.includes('actualizaciones disponibles') ||
                    /^\d+\s+paquete/.test(trimmed) ||
                    /^\d+\s+package/.test(trimmed)) {
                    continue;
                }
                const match = line.match(/^(.*?)\s{2,}(\S+)\s{2,}(\S+)\s{2,}(\S+)(?:\s{2,}(\S+))?\s*$/);
                if (!match)
                    continue;
                const [, rawName, rawId, rawVersion, rawAvailable, rawSource] = match;
                const name = rawName.trim();
                const id = rawId.trim();
                const version = rawVersion.trim();
                const available = rawAvailable.trim();
                const source = rawSource?.trim() || 'winget';
                if (!name || !available || !this.isLikelyPackageId(id, { name, version, available }))
                    continue;
                updates.push({ name, id, version, available, source });
            }
            return updates;
        }
        const dataLines = lines.slice(headerIndex + 2);
        console.log('[WingetService] Processing', dataLines.length, 'data lines');
        for (const line of dataLines) {
            if (!line.trim() ||
                line.includes('actualizaciones disponibles') ||
                line.startsWith('No se han') ||
                line.startsWith('No updates found') ||
                line.startsWith('No applicable update found') ||
                line.startsWith('No installed package found matching input criteria') ||
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
            if (name && available && this.isLikelyPackageId(id, { name, version, available })) {
                updates.push({ name, id, version, available, source });
            }
            else {
                console.log('[WingetService] Rejected - invalid ID');
            }
        }
        return updates;
    }
}
