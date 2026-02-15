import type { AppUpdate, HistoryItem } from './shared/types';

interface SystemInfo {
    arch: string;
    locale: string;
}

interface SettingsMap {
    theme: 'dark' | 'light' | 'system';
    language: 'en' | 'es';
    dontShowRestoreWarning: boolean;
    fontSize: 'small' | 'medium' | 'large';
    hasSeenOnboarding: boolean;
}

interface RendererEventMap {
    'winget:log': [log: string];
    'main-process-message': [message: string];
}

export interface IElectronAPI {
    invoke(channel: 'winget:check-updates'): Promise<AppUpdate[]>;
    invoke(channel: 'winget:install-update', id: string): Promise<void>;
    invoke(channel: 'system:create-restore-point', description: string): Promise<void>;
    invoke(channel: 'system:open-logs'): Promise<void>;
    invoke(channel: 'system:is-elevated'): Promise<boolean>;
    invoke(channel: 'system:get-info'): Promise<SystemInfo>;
    invoke<K extends keyof SettingsMap>(channel: 'settings:get', key: K): Promise<SettingsMap[K]>;
    invoke<K extends keyof SettingsMap>(channel: 'settings:set', key: K, value: SettingsMap[K]): Promise<void>;
    invoke(channel: 'system:set-operation-active', active: boolean): Promise<void>;
    invoke(channel: 'system:open-url', url: string): Promise<void>;
    invoke(channel: 'history:get'): Promise<HistoryItem[]>;
    invoke(channel: 'history:add', entry: Omit<HistoryItem, 'date'>): Promise<void>;
    invoke(channel: 'history:clear'): Promise<void>;
    invoke(channel: 'system:get-userdata-path'): Promise<string>;

    on<K extends keyof RendererEventMap>(
        channel: K,
        listener: (event: unknown, ...args: RendererEventMap[K]) => void
    ): void;
    off<K extends keyof RendererEventMap>(
        channel: K,
        listener: (event: unknown, ...args: RendererEventMap[K]) => void
    ): void;
    send(channel: 'log:info', message: string): void;
    send(channel: 'log:error', message: string): void;
}

declare global {
    interface Window {
        ipcRenderer: IElectronAPI;
    }
}
