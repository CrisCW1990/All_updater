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

export type RestoreFailureReason =
    | 'system-protection-disabled'
    | 'frequency-limit'
    | 'access-denied'
    | 'service-unavailable'
    | 'verification-failed'
    | 'command-failed'
    | 'unknown';

export interface RestorePointResult {
    success: boolean;
    reason?: RestoreFailureReason;
    details?: string;
}

export interface AppVersionCheckResult {
    success: boolean;
    offline?: boolean;
    hasUpdate: boolean;
    currentVersion: string;
    latestVersion?: string;
    releaseUrl?: string;
    assetName?: string;
    assetUrl?: string;
    assetSha256?: string;
    error?: string;
}

export interface AppUpdateDownloadProgress {
    fileName: string;
    downloadedBytes: number;
    totalBytes: number;
    percent: number | null;
}

export interface AppUpdateDownloadResult {
    success: boolean;
    canceled?: boolean;
    filePath?: string;
    hashVerified?: boolean;
    hashExpected?: string;
    hashActual?: string;
    error?: string;
}

export interface PreflightResult {
    success: boolean;
    overall: 'ok' | 'warning' | 'error';
    checks: {
        admin: boolean;
        winget: boolean;
        vssService: boolean;
        taskScheduler: boolean;
        restoreQuery: boolean;
    };
    details: Partial<Record<'admin' | 'winget' | 'vssService' | 'taskScheduler' | 'restoreQuery', string>>;
}

export interface DiagnosticsExportResult {
    success: boolean;
    canceled?: boolean;
    filePath?: string;
    error?: string;
}
