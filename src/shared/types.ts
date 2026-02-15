export interface AppUpdate {
    name: string;
    id: string;
    version: string;
    available: string;
    source: string;
    previousStatus?: 'inapplicable' | 'failed' | 'skipped';
    previousDetails?: string;
}

export interface WingetResult {
    updates: AppUpdate[];
    rawOutput: string;
}

export interface HistoryItem {
    id: string;
    appName: string;
    version: string;
    previousVersion?: string;
    status: 'success' | 'failed' | 'skipped' | 'inapplicable' | 'reboot' | 'in-use' | 'security-error';
    date: string;
    details?: string;
}
