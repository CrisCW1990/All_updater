import log from 'electron-log/main';
import path from 'path';
import { app } from 'electron';

// Set precise log location
const projectLogPath = path.join(app.getPath('userData'), 'app_debug.log');
log.transports.file.resolvePathFn = () => projectLogPath;
log.initialize();

export class LoggerService {
    constructor() {
        log.info('LoggerService initialized');
        log.info(`Logs are being written to: ${projectLogPath}`);
    }

    info(message: string, ...args: unknown[]) {
        log.info(message, ...args);
    }

    error(message: string, ...args: unknown[]) {
        log.error(message, ...args);
    }

    warn(message: string, ...args: unknown[]) {
        log.warn(message, ...args);
    }

    getLogPath() {
        return log.transports.file.getFile().path;
    }
}
