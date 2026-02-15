import Store from 'electron-store';
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
    dontShowRestoreWarning: {
        type: 'boolean',
        default: false
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
        this.store = new Store({ schema });
        console.log('Settings file path:', this.store.path);
    }
    get(key) {
        return this.store.get(key);
    }
    set(key, value) {
        this.store.set(key, value);
    }
}
