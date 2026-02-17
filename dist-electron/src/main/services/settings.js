import Store from 'electron-store';
import fs from 'node:fs';
import path from 'node:path';
const schema = {
    theme: {
        type: 'string',
        enum: ['dark', 'light', 'system'],
        default: 'system'
    },
    language: {
        type: 'string',
        enum: ['en', 'es'],
        default: 'en'
    },
    fontSize: {
        type: 'string',
        enum: ['small', 'medium', 'large'],
        default: 'medium'
    },
    hasSeenOnboarding: {
        type: 'boolean',
        default: false
    }
};
export class SettingsService {
    store;
    constructor() {
        this.store = new Store({
            schema,
            clearInvalidConfig: true
        });
        console.log('Settings file path:', this.store.path);
    }
    get(key) {
        return this.store.get(key);
    }
    backupStoreFile() {
        try {
            const sourcePath = this.store.path;
            if (!fs.existsSync(sourcePath))
                return;
            const backupPath = path.join(path.dirname(sourcePath), `${path.parse(sourcePath).name}.bak.json`);
            fs.copyFileSync(sourcePath, backupPath);
        }
        catch (error) {
            console.error('[SettingsService] Failed to backup settings file:', error);
        }
    }
    set(key, value) {
        this.store.set(key, value);
        this.backupStoreFile();
    }
}
