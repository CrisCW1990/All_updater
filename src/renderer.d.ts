import type { AppUpdate } from './shared/types';

export interface IElectronAPI {
    invoke(channel: 'winget:check-updates'): Promise<AppUpdate[]>;
    invoke(channel: 'winget:install-update', id: string): Promise<void>;
    invoke(channel: 'winget:install-all'): Promise<void>;
    invoke(channel: 'system:create-restore-point', description: string): Promise<void>;
    invoke(channel: 'system:open-logs'): Promise<void>;
    invoke(channel: 'system:is-elevated'): Promise<boolean>;
    invoke(channel: 'system:get-info'): Promise<any>;
    invoke(channel: 'settings:get', key: string): Promise<any>;
    invoke(channel: 'settings:set', key: string, value: any): Promise<void>;
    invoke(channel: 'system:set-operation-active', active: boolean): Promise<void>;
    invoke(channel: 'history:get'): Promise<HistoryItem[]>;
    invoke(channel: 'history:add', entry: Omit<HistoryItem, 'date'>): Promise<void>;
    invoke(channel: 'history:clear'): Promise<void>;
    invoke(channel: 'system:get-userdata-path'): Promise<string>;

    on(channel: string, listener: (event: any, ...args: any[]) => void): void;
    off(channel: string, listener: (event: any, ...args: any[]) => void): void;
    send(channel: 'log:info', message: string): void;
    send(channel: 'log:error', message: string): void;
}

declare global {
    interface Window {
        ipcRenderer: IElectronAPI;
    }
}
