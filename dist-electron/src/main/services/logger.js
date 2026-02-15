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
    info(message, ...args) {
        log.info(message, ...args);
    }
    error(message, ...args) {
        log.error(message, ...args);
    }
    warn(message, ...args) {
        log.warn(message, ...args);
    }
    getLogPath() {
        return log.transports.file.getFile().path;
    }
}
