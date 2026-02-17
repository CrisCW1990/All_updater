import { ipcMain, shell } from 'electron';
import { WingetService } from './services/winget.js';
import { SystemRestoreService } from './services/restore.js';
import { SettingsService } from './services/settings.js';
import { LoggerService } from './services/logger.js';
import { SystemService } from './services/system.js';
import { HistoryService } from './services/history.js';
import { AppUpdateService } from './services/app-update.js';
import { PreflightService } from './services/preflight.js';
import { DiagnosticsService } from './services/diagnostics.js';
import log from 'electron-log/main'; // Import directly to access transport
const historyService = new HistoryService();
const wingetService = new WingetService(new SystemService(), historyService);
const restoreService = new SystemRestoreService();
const settingsService = new SettingsService();
const logger = new LoggerService();
const systemService = new SystemService();
const appUpdateService = new AppUpdateService();
const preflightService = new PreflightService();
const diagnosticsService = new DiagnosticsService(logger);
const settingKeys = [
    'theme',
    'language',
    'fontSize',
    'hasSeenOnboarding'
];
function isSettingsKey(key) {
    return settingKeys.includes(key);
}
function setSettingSafely(key, value) {
    switch (key) {
        case 'theme':
            if (value === 'dark' || value === 'light' || value === 'system') {
                settingsService.set('theme', value);
                return;
            }
            break;
        case 'language':
            if (value === 'en' || value === 'es') {
                settingsService.set('language', value);
                return;
            }
            break;
        case 'fontSize':
            if (value === 'small' || value === 'medium' || value === 'large') {
                settingsService.set('fontSize', value);
                return;
            }
            break;
        case 'hasSeenOnboarding':
            if (typeof value === 'boolean') {
                settingsService.set('hasSeenOnboarding', value);
                return;
            }
            break;
        default:
            break;
    }
    throw new Error(`Invalid value for setting ${key}`);
}
export function setupIPC() {
    console.log('[IPC] Setting up IPC handlers...');
    // Winget
    ipcMain.handle('winget:check-updates', async () => {
        console.log('[IPC] winget:check-updates handler called');
        logger.info('Checking for updates...');
        return await wingetService.getAvailableUpdates();
    });
    console.log('[IPC] IPC handlers registered successfully');
    ipcMain.handle('winget:install-update', async (event, id) => {
        logger.info(`Installing update for ${id}`);
        return await wingetService.installUpdate(id, (logLine) => {
            event.sender.send('winget:log', logLine);
        });
    });
    // System Restore
    ipcMain.handle('system:create-restore-point', async (_, description) => {
        logger.info(`Creating restore point: ${description}`);
        const result = await restoreService.createRestorePoint(description);
        if (result.success) {
            logger.info('Restore point created successfully.');
        }
        else {
            logger.warn(`Restore point creation failed. reason=${result.reason || 'unknown'} details=${result.details || 'n/a'}`);
        }
        return result;
    });
    // Settings
    ipcMain.handle('settings:get', (_, key) => {
        if (!isSettingsKey(key)) {
            throw new Error(`Invalid settings key: ${key}`);
        }
        return settingsService.get(key);
    });
    ipcMain.handle('settings:set', (_, key, value) => {
        if (!isSettingsKey(key)) {
            throw new Error(`Invalid settings key: ${key}`);
        }
        setSettingSafely(key, value);
    });
    // Logs
    ipcMain.handle('system:open-logs', async () => {
        try {
            const logFile = log.transports.file.getFile();
            // Try enabling console logging too
            log.transports.console.level = 'debug';
            if (logFile) {
                console.log('Opening log file at:', logFile.path);
                await shell.showItemInFolder(logFile.path);
            }
            else {
                console.error('Log file object is null');
            }
        }
        catch (error) {
            console.error(`Failed to open logs: ${error}`);
        }
    });
    ipcMain.handle('system:is-elevated', async () => {
        return await wingetService.isElevated();
    });
    ipcMain.handle('system:get-info', async () => {
        return systemService.getSystemInfo();
    });
    ipcMain.handle('system:get-userdata-path', async () => {
        return (await import('electron')).app.getPath('userData');
    });
    ipcMain.handle('system:open-url', async (_, url) => {
        if (!/^https?:\/\//i.test(url)) {
            throw new Error('Invalid URL protocol');
        }
        await shell.openExternal(url);
    });
    ipcMain.handle('system:show-item-in-folder', async (_, targetPath) => {
        if (!targetPath || typeof targetPath !== 'string') {
            throw new Error('Invalid path.');
        }
        await shell.showItemInFolder(targetPath);
    });
    ipcMain.handle('system:check-app-update', async () => {
        logger.info('Checking for app updates (GitHub release)...');
        return await appUpdateService.checkLatestVersion();
    });
    ipcMain.handle('system:download-app-update', async (event, assetUrl, fileName, expectedSha256) => {
        logger.info(`Downloading app update asset: ${fileName}`);
        return await appUpdateService.downloadUpdateAsset(event.sender, assetUrl, fileName, expectedSha256);
    });
    ipcMain.handle('system:run-preflight', async () => {
        logger.info('Running preflight checks...');
        return await preflightService.run();
    });
    ipcMain.handle('system:export-diagnostics', async () => {
        logger.info('Exporting diagnostics package...');
        return await diagnosticsService.exportDiagnostics();
    });
    // History
    ipcMain.handle('history:get', async () => historyService.getHistory());
    ipcMain.handle('history:add', async (_, entry) => historyService.addEntry(entry));
    ipcMain.handle('history:clear', async () => {
        historyService.clearHistory();
        settingsService.set('language', 'en');
        settingsService.set('hasSeenOnboarding', false);
    });
    // Logger Pass-through
    ipcMain.on('log:info', (_, msg) => logger.info(msg));
    ipcMain.on('log:error', (_, msg) => logger.error(msg));
}
