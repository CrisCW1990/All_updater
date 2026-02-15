import Store from 'electron-store';

interface UserSettings {
    theme: 'dark' | 'light' | 'system';
    language: 'en' | 'es';
    dontShowRestoreWarning: boolean;
    fontSize: 'small' | 'medium' | 'large';
    hasSeenOnboarding: boolean;
}

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
} as const;

export class SettingsService {
    private store: Store<UserSettings>;

    constructor() {
        this.store = new Store<UserSettings>({ schema });
        console.log('Settings file path:', this.store.path);
    }

    get<K extends keyof UserSettings>(key: K): UserSettings[K] {
        return this.store.get(key);
    }

    set<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
        this.store.set(key, value);
    }
}
