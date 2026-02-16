import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UpdateCard } from './components/UpdateCard';
import { RestoreModal } from './components/RestoreModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ConflictModal } from './components/ConflictModal';
import { HistoryView } from './components/HistoryView.tsx';
import type {
  AppUpdate,
  AppVersionCheckResult,
  HistoryItem,
  RestoreFailureReason,
  RestorePointResult
} from './shared/types';
import { RefreshCw, CheckCircle, Coffee, ArrowDownToLine, CheckSquare, Square, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ToastContainer, type ToastType } from './components/Toast';
import { useLanguage } from './context/LanguageContext';
import { clsx } from 'clsx';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

type ThemeMode = 'dark' | 'light' | 'system';

export default function App() {
  const { t } = useLanguage();
  const [updates, setUpdates] = useState<AppUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isCreatingRestore, setIsCreatingRestore] = useState(false);
  const [conflictState, setConflictState] = useState<{ appName: string, onRetry: () => void, onSkip: () => void } | null>(null);
  const [currentInstallingApp, setCurrentInstallingApp] = useState<string | null>(null);
  const [currentLogLine, setCurrentLogLine] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState<{ current: number, total: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [showSummary, setShowSummary] = useState(false);
  const [batchResults, setBatchResults] = useState<HistoryItem[]>([]);
  const [systemInfo, setSystemInfo] = useState<{ arch: string, locale: string } | null>(null);
  const [isWingetMissing, setIsWingetMissing] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [darkMode, setDarkMode] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [appUpdateInfo, setAppUpdateInfo] = useState<AppVersionCheckResult | null>(null);
  const [checkingAppVersion, setCheckingAppVersion] = useState(false);
  const [downloadingAppUpdate, setDownloadingAppUpdate] = useState(false);
  const [appUpdateProgress, setAppUpdateProgress] = useState<number | null>(null);
  const selectableUpdates = updates.filter(u => u.previousStatus !== 'inapplicable');
  const allSelectableSelected = selectableUpdates.length > 0 && selectedIds.size === selectableUpdates.length;
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  const getRestoreFailureMessage = (reason?: RestoreFailureReason): string => {
    if (reason === 'system-protection-disabled') return t('restoreFailDisabled');
    if (reason === 'frequency-limit') return t('restoreFailFrequency');
    if (reason === 'access-denied') return t('restoreFailAccess');
    if (reason === 'service-unavailable') return t('restoreFailService');
    if (reason === 'verification-failed') return t('restoreFailVerification');
    if (reason === 'command-failed') return t('restoreFailCommand');
    return t('restoreFailUnknown');
  };

  const resolveDarkMode = (mode: ThemeMode): boolean => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  };

  useEffect(() => {
    const handleLog = (_event: unknown, log: string) => {
      const cleanLog = log.replace(/\[#+ -+\]/g, '').trim();
      if (cleanLog) setCurrentLogLine(cleanLog);
    };

    window.ipcRenderer.on('winget:log', handleLog);
    return () => window.ipcRenderer.off('winget:log', handleLog);
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const info = await window.ipcRenderer.invoke('system:get-info');
        setSystemInfo(info);
      } catch (error) {
        console.error('[App] Failed to load system info:', error);
      }

      try {
        const theme = await window.ipcRenderer.invoke('settings:get', 'theme');
        const normalizedTheme: ThemeMode = theme === 'dark' || theme === 'light' || theme === 'system' ? theme : 'system';
        setThemeMode(normalizedTheme);
        setDarkMode(resolveDarkMode(normalizedTheme));
      } catch (error) {
        console.error('[App] Failed to load theme settings:', error);
        setThemeMode('system');
        setDarkMode(resolveDarkMode('system'));
      }

      try {
        const hasSeenOnboarding = await window.ipcRenderer.invoke('settings:get', 'hasSeenOnboarding');
        if (!hasSeenOnboarding) setShowOnboarding(true);
      } catch (error) {
        console.error('[App] Failed to load onboarding settings:', error);
        setShowOnboarding(true);
      }

      void window.ipcRenderer
        .invoke('system:check-app-update')
        .then((result) => setAppUpdateInfo(result))
        .catch((error) => console.error('[App] Silent app-update check failed:', error));
    };

    void initializeApp();
  }, []);

  useEffect(() => {
    const handleAppUpdateProgress = (_event: unknown, progress: { percent: number | null }) => {
      setAppUpdateProgress(progress.percent);
    };

    window.ipcRenderer.on('app-update:download-progress', handleAppUpdateProgress);
    return () => window.ipcRenderer.off('app-update:download-progress', handleAppUpdateProgress);
  }, []);

  useEffect(() => {
    if (themeMode !== 'system' || typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setDarkMode(mediaQuery.matches);
    handleChange();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [themeMode]);

  const toggleTheme = () => {
    const previousMode = themeMode;
    const previousDark = darkMode;
    const nextMode: ThemeMode = darkMode ? 'light' : 'dark';
    setThemeMode(nextMode);
    setDarkMode(nextMode === 'dark');
    void window.ipcRenderer.invoke('settings:set', 'theme', nextMode).catch((error) => {
      console.error('[App] Failed to persist theme:', error);
      setThemeMode(previousMode);
      setDarkMode(previousDark);
      addToast(t('settingsSaveWarning'), 'warning');
    });
  };

  const handleOnboardingClose = (dontShowAgain: boolean) => {
    setShowOnboarding(false);
    if (dontShowAgain) {
      void window.ipcRenderer.invoke('settings:set', 'hasSeenOnboarding', true).catch((error) => {
        console.error('[App] Failed to persist onboarding preference:', error);
        setShowOnboarding(true);
        addToast(t('settingsSaveWarning'), 'warning');
      });
    }
  };

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const checkAppUpdate = async (silent = false) => {
    setCheckingAppVersion(true);
    try {
      const result = await window.ipcRenderer.invoke('system:check-app-update');
      setAppUpdateInfo(result);

      if (silent) return;

      if (!result.success) {
        if (result.offline) {
          addToast(t('appUpdateOffline'), 'info');
        } else {
          addToast(t('appUpdateCheckFailed'), 'warning');
        }
        return;
      }

      if (result.hasUpdate) {
        addToast(`${t('appUpdateAvailable')}: v${result.latestVersion}`, 'info');
      } else {
        addToast(t('appUpdateNoUpdates'), 'info');
      }
    } catch (error) {
      console.error('[App] Failed to check app version:', error);
      if (!silent) {
        addToast(t('appUpdateCheckFailed'), 'warning');
      }
    } finally {
      setCheckingAppVersion(false);
    }
  };

  const downloadAppUpdate = async () => {
    if (!appUpdateInfo?.assetUrl || !appUpdateInfo.assetName) {
      addToast(t('appUpdateMissingAsset'), 'warning');
      return;
    }

    setDownloadingAppUpdate(true);
    setAppUpdateProgress(0);
    try {
      const result = await window.ipcRenderer.invoke(
        'system:download-app-update',
        appUpdateInfo.assetUrl,
        appUpdateInfo.assetName
      );

      if (result.canceled) {
        addToast(t('appUpdateDownloadCanceled'), 'info');
        return;
      }

      if (result.success) {
        addToast(t('appUpdateDownloadSuccess'), 'success');
        return;
      }

      console.error('[App] App update download failed:', result.error);
      addToast(t('appUpdateDownloadFailed'), 'error');
    } catch (error) {
      console.error('[App] App update download threw error:', error);
      addToast(t('appUpdateDownloadFailed'), 'error');
    } finally {
      setDownloadingAppUpdate(false);
      setTimeout(() => setAppUpdateProgress(null), 500);
    }
  };

  const checkUpdates = async () => {
    setLoading(true);
    setUpdates([]);
    setHasChecked(false);
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 800));
    const fetchUpdates = window.ipcRenderer.invoke('winget:check-updates');

    try {
      const [available] = await Promise.all([fetchUpdates, minLoadTime]);
      setUpdates(available);
      // Only auto-select updates that are NOT inapplicable
      const installable = available.filter((u) => u.previousStatus !== 'inapplicable');
      setSelectedIds(new Set(installable.map((u) => u.id)));
      setHasChecked(true);
      setIsWingetMissing(false);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.error("[App] Failed to check updates:", error);
      if (
        errorMessage.includes('WingetNotFound') ||
        errorMessage.includes('ENOENT') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('not recognized')
      ) {
        setIsWingetMissing(true);
        setHasChecked(true);
      } else if (errorMessage.includes('WingetSourceIssue')) {
        setIsWingetMissing(false);
        addToast(t('wingetSourceIssue'), 'warning');
        setHasChecked(false);
      } else if (errorMessage.includes('WingetAccessDenied')) {
        setIsWingetMissing(false);
        addToast(t('wingetPermissionIssue'), 'error');
        setHasChecked(false);
      } else if (
        errorMessage.includes('WingetOutputUnparseable') ||
        errorMessage.includes('WingetOutputParseError')
      ) {
        setIsWingetMissing(false);
        addToast(t('wingetParseIssue'), 'error');
        setHasChecked(false);
      } else {
        setIsWingetMissing(false);
        addToast(t('checkFailedTryAgain'), 'error');
        setHasChecked(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === selectableUpdates.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableUpdates.map(u => u.id)));
    }
  };

  const handleUpdateClick = () => {
    if (selectedIds.size === 0) return;
    setShowRestoreModal(true);
  };

  const processUpdates = async (createRestore: boolean) => {
    setShowRestoreModal(false);
    setIsInstalling(true);
    setBatchResults([]);
    let operationMarked = false;
    try {
      await window.ipcRenderer.invoke('system:set-operation-active', true);
      operationMarked = true;

      if (createRestore) {
        setIsCreatingRestore(true);
        setCurrentLogLine(t('creatingRestore'));
        try {
          const result = await window.ipcRenderer.invoke('system:create-restore-point', "All Updater Auto-Restore") as RestorePointResult;
          if (!result.success) {
            const specificMessage = getRestoreFailureMessage(result.reason);
            console.error('[App] Restore point failed:', result);
            addToast(specificMessage, "error");
            setCurrentLogLine(specificMessage);
            return; // ABORT updates
          }
        } catch (e) {
          console.error("Failed to create restore point", e);
          addToast(`${t('restoreFailedAbort')} ${t('restoreFailUnknown')}`, "error");
          setCurrentLogLine(null);
          return; // ABORT updates
        } finally {
          setIsCreatingRestore(false);
        }
      }

      const total = selectedIds.size;
      let current = 0;
      const currentResults: HistoryItem[] = [];
      setInstallProgress({ current, total });

      const queue = Array.from(selectedIds);

      // Iteration using while to allow "retry" without complex index math
      let i = 0;
      while (i < queue.length) {
        const id = queue[i];
        const update = updates.find(u => u.id === id);
        const appName = update?.name || id;
        const appVersion = update?.available || 'unknown';

        try {
          setCurrentInstallingApp(appName);

          // Wait for conflict resolution if needed
          let retry = true;
          while (retry) {
            try {
              retry = false;
              await window.ipcRenderer.invoke('winget:install-update', id);
            } catch (e: unknown) {
              const errorMessage = getErrorMessage(e);
              // Check specifically for AppInUse
              if (errorMessage.includes('AppInUse')) {
                // Show Conflict Modal and wait for user decision
                const userDecision = await new Promise<'retry' | 'skip'>((resolve) => {
                  setConflictState({
                    appName,
                    onRetry: () => resolve('retry'),
                    onSkip: () => resolve('skip')
                  });
                });

                setConflictState(null); // Close modal

                if (userDecision === 'retry') {
                  retry = true;
                  continue; // Loop internal while
                } else {
                  // Skip
                  throw e; // Re-throw to hit catch block as failed/skipped
                }
              }
              throw e; // Throw other errors
            }
          }

          const historyEntry: Omit<HistoryItem, 'date'> = {
            id,
            appName,
            version: appVersion, // This is the new version
            previousVersion: update?.version, // This is the old version
            status: 'success'
          };
          await window.ipcRenderer.invoke('history:add', historyEntry);
          currentResults.push({ ...historyEntry, date: new Date().toISOString() });

          addToast(`${t('updateSuccess')} ${appName}`, 'success');

          setUpdates(prev => prev.filter(u => u.id !== id));
          setSelectedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        } catch (e: unknown) {
          const errorMessage = getErrorMessage(e);
          console.error(`Failed to update ${id}`, e);
          const isInapplicable = errorMessage.includes('Inapplicable');
          const isReboot = errorMessage.includes('RebootRequired');
          const isInUse = errorMessage.includes('AppInUse');
          const isSecurity = errorMessage.includes('HashMismatch');

          let status: 'failed' | 'inapplicable' | 'reboot' | 'in-use' | 'security-error' = 'failed';
          if (isInapplicable) status = 'inapplicable';
          if (isReboot) status = 'reboot';
          if (isInUse) status = 'in-use'; // Only if skipped
          if (isSecurity) status = 'security-error';

          const historyEntry: Omit<HistoryItem, 'date'> = {
            id,
            appName,
            version: appVersion,
            previousVersion: update?.version,
            status,
            details: errorMessage
          };
          await window.ipcRenderer.invoke('history:add', historyEntry);
          currentResults.push({ ...historyEntry, date: new Date().toISOString() });

          if (isInapplicable) {
            addToast(`${appName}: ${t('updateSkipped')}`, 'warning');
          } else if (isSecurity) {
            addToast(`${appName}: ${t('updateSecuritySkipped')}`, 'error');
          } else if (isInUse) {
            addToast(`${appName}: ${t('updateInUseSkipped')}`, 'warning');
          } else {
            addToast(`${t('updateFailed')} ${appName}`, 'error');
          }
        }
        current++;
        setInstallProgress({ current, total });
        i++;
      }

      setBatchResults(currentResults);
      if (currentResults.length > 0) {
        setShowSummary(true);
      }
    } finally {
      setIsInstalling(false);
      setIsCreatingRestore(false);
      setInstallProgress(null);
      setCurrentInstallingApp(null);
      setCurrentLogLine(null);
      setConflictState(null);
      if (operationMarked) {
        try {
          await window.ipcRenderer.invoke('system:set-operation-active', false);
        } catch (cleanupError) {
          console.error('Failed to reset operation state', cleanupError);
        }
      }
    }
  };

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleTheme}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'dashboard' ? (
        <div className="mx-auto flex w-full max-w-7xl h-full flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white transition-colors">{t('dashboard')}</h2>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-400">{t('manageApps')}</p>
                {systemInfo && (
                  <span className="flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {systemInfo.arch} • {systemInfo.locale}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {!isInstalling && !isCreatingRestore && (
                <button
                  onClick={() => checkAppUpdate(false)}
                  className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-slate-700 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-blue-400"
                  title={t('appUpdateCheck')}
                >
                  <RefreshCw className={clsx("h-5 w-5", checkingAppVersion && "animate-spin")} />
                </button>
              )}

              {updates.length > 0 && !loading && !isInstalling && (
                <button
                  onClick={checkUpdates}
                  className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-slate-700 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-blue-400"
                  title={t('refresh')}
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              )}

              {(isInstalling || isCreatingRestore) && (
                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 dark:border-blue-900/30 dark:bg-blue-900/20">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {isCreatingRestore ? t('creatingRestore') + '...' : `${t('updatingApp')} ${installProgress?.current || 0}/${installProgress?.total || 0}`}
                  </span>
                </div>
              )}

              {updates.length > 0 && !isInstalling && (
                <button
                  onClick={handleUpdateClick}
                  disabled={selectedIds.size === 0}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:from-blue-500 hover:to-indigo-500 disabled:scale-100 disabled:opacity-50 disabled:grayscale"
                >
                  <ArrowDownToLine className="h-5 w-5" />
                  <span>{t('updateSelected')} ({selectedIds.size})</span>
                </button>
              )}
            </div>
          </div>

          {appUpdateInfo?.success && appUpdateInfo.hasUpdate && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 dark:border-blue-500/20 dark:bg-blue-900/10">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-300">{t('appUpdateAvailable')}</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t('appUpdateCurrent')}: v{appUpdateInfo.currentVersion} • {t('appUpdateLatest')}: v{appUpdateInfo.latestVersion}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {t('appUpdatePrivacyNote')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadAppUpdate}
                    disabled={downloadingAppUpdate || !appUpdateInfo.assetUrl || !appUpdateInfo.assetName}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloadingAppUpdate ? t('appUpdateDownloading') : t('appUpdateDownload')}
                  </button>
                  {appUpdateInfo.releaseUrl && (
                    <button
                      onClick={() => window.ipcRenderer.invoke('system:open-url', appUpdateInfo.releaseUrl!)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      {t('appUpdateOpenRelease')}
                    </button>
                  )}
                </div>
              </div>

              {downloadingAppUpdate && (
                <div className="mt-3">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300 dark:bg-blue-400"
                      style={{ width: `${appUpdateProgress ?? 0}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-slate-700 dark:text-slate-400">
                    {appUpdateProgress !== null
                      ? `${t('appUpdateDownloading')} ${appUpdateProgress}%`
                      : t('appUpdateDownloading')}
                  </p>
                </div>
              )}
            </div>
          )}

          {isWingetMissing ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-6 py-20 text-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-red-500/20 blur-xl dark:bg-red-400/10" />
                <XCircle className="relative h-24 w-24 text-red-500" strokeWidth={1} />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{t('wingetMissing')}</h3>
                <p className="text-slate-700 dark:text-slate-400">
                  {t('wingetMissingDesc')}
                </p>
                <button
                  onClick={() => window.ipcRenderer.invoke('system:open-url', 'https://aka.ms/getwinget')}
                  className="mt-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {t('getWinget')}
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-8 py-20 text-center animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-blue-500/10 blur-2xl animate-pulse dark:bg-blue-400/5" />
                <div className="relative flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin dark:border-slate-800 dark:border-t-blue-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-900 shadow-inner" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 animate-pulse transition-all">
                  {t('checking')}...
                </h3>
                <p className="text-black dark:text-slate-300 font-bold max-w-xs mx-auto leading-relaxed text-lg">
                  {t('scanningBody')}
                </p>
              </div>
            </div>
          ) : !hasChecked ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-6 py-20 text-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-blue-500/20 blur-xl dark:bg-blue-400/10" />
                <Coffee className="relative h-24 w-24 text-slate-900/40 dark:text-slate-600" strokeWidth={1} />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-2xl font-bold text-black dark:text-white">{t('readyTitle')}</h3>
              <p className="font-medium text-slate-700 dark:text-slate-400">{t('readyDesc')}</p>
              </div>
              <button
                onClick={checkUpdates}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-slate-900 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
              >
                <RefreshCw className="h-6 w-6 transition-transform group-hover:rotate-180" />
                {t('checkUpdates')}
              </button>
              <p className="text-xl sm:text-2xl mt-8 font-bold text-slate-700 dark:text-slate-400 animate-in fade-in slide-in-from-top-2 duration-700 delay-300 max-w-2xl px-4 leading-relaxed">
                {t('footerLove')} <span className="text-blue-600 dark:text-blue-400">Samuel</span>.
                <br />
                {t('footerAI')}
                <span className="inline-block align-middle ml-2 animate-pulse">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500" style={{ shapeRendering: 'crispEdges' }}>
                    <path d="M4 4h4v4H4zM16 4h4v4h-4zM2 8h4v4H2zM8 8h8v4H8zM18 8h4v4h-4zM2 12h4v4H2zM6 16h4v4H6zM10 20h4v4h-4zM14 16h4v4h-4zM18 12h4v4h-4z" fill="currentColor" />
                  </svg>
                </span>
              </p>
            </div>
          ) : updates.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-6 py-20 text-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-xl dark:bg-emerald-400/10" />
                <CheckCircle className="relative h-24 w-24 text-emerald-600 dark:text-emerald-500" strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white">{t('allClean')}</h3>
              <p className="font-medium text-slate-700 dark:text-slate-400 text-lg">{t('allCleanDesc')}</p>
              <button
                onClick={checkUpdates}
                className="mt-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {t('checkAgain')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-black/20">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                >
                  {allSelectableSelected ? (
                    <CheckSquare className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-400" />
                  )}
                  <span>{t('selectAll')}</span>
                </button>
                <span className="text-sm font-medium text-slate-500">
                  {updates.length} {t('updatesAvailable')}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {updates.map(update => (
                  <UpdateCard
                    key={update.id}
                    update={update}
                    isSelected={selectedIds.has(update.id)}
                    onToggle={() => toggleSelect(update.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <HistoryView
          onResetApp={() => {
            setShowOnboarding(true);
            setActiveTab('dashboard');
            setHasChecked(false);
            setUpdates([]);
            setSelectedIds(new Set());
            setShowSummary(false);
            setIsWingetMissing(false);
          }}
        />
      )}

      {/* Summary Report Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-800 border border-black/10 dark:border-white/10 max-h-[80vh] flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('summaryTitle')}</h3>
                <p className="text-slate-700 dark:text-slate-400">{t('summaryDesc')}</p>
              </div>
              <button
                onClick={() => {
                  setShowSummary(false);
                  checkUpdates();
                }}
                className="rounded-full p-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                <XCircle className="h-6 w-6 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Logic for summary message */}
              {(() => {
                const total = batchResults.length;
                const failed = batchResults.filter(
                  r => r.status === 'failed' || r.status === 'inapplicable' || r.status === 'in-use' || r.status === 'security-error'
                ).length;

                let message = t('summarySuccess');

                if (failed === total) {
                  message = t('summaryFailed'); // Or use specific "inapplicable" one if needed
                } else if (failed > 0) {
                  message = t('summaryPartial');
                }

                return (
                  <div className="mb-4 rounded-2xl border border-slate-300 bg-slate-100 p-6 dark:border-white/10 dark:bg-white/5">
                    <p className="text-xl text-slate-700 dark:text-slate-200 italic text-center font-medium leading-relaxed">
                      {message}
                    </p>
                  </div>
                );
              })()}

              {batchResults.map((res, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-300 bg-slate-100 p-4 dark:border-white/5 dark:bg-white/5">
                  <div className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm",
                    res.status === 'success' ? "bg-green-500 text-white" :
                      res.status === 'reboot' ? "bg-blue-600 text-white" :
                        res.status === 'in-use' ? "bg-amber-500 text-white" :
                          res.status === 'inapplicable' ? "bg-amber-500 text-white" :
                        res.status === 'security-error' ? "bg-orange-600 text-white" :
                          "bg-red-500 text-white"
                  )}>
                    {res.status === 'success' && <CheckCircle className="h-5 w-5" />}
                    {res.status === 'reboot' && <RefreshCw className="h-5 w-5" />}
                    {res.status === 'in-use' && <AlertTriangle className="h-5 w-5" />}
                    {res.status === 'inapplicable' && <AlertCircle className="h-5 w-5" />}
                    {res.status === 'security-error' && <AlertTriangle className="h-5 w-5" />}
                    {res.status === 'failed' && <XCircle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{res.appName}</h4>
                    <p className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
                      {t('versionLabel')} {res.version}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-400 italic font-medium">
                      {res.status === 'success' ? t('statusSuccess') :
                        res.status === 'reboot' ? t('statusReboot') :
                          res.status === 'in-use' ? t('statusInUse') :
                            res.status === 'inapplicable' ? t('statusInapplicable') :
                              res.status === 'security-error' ? t('statusSecurity') :
                                t('statusFailed')}
                    </p>
                  </div>
                </div>
              ))}

              {batchResults.some(r => r.status === 'success' || r.status === 'reboot') && (
                <div className="rounded-2xl bg-blue-500/10 p-4 border border-blue-500/20">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    {t('restartRecommendation')}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowSummary(false);
                checkUpdates();
              }}
              className="mt-8 w-full rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 dark:hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              {(() => {
                const total = batchResults.length;
                const failed = batchResults.filter(
                  r => r.status === 'failed' || r.status === 'inapplicable' || r.status === 'in-use' || r.status === 'security-error'
                ).length;
                return failed === total ? t('thanksNothing') : t('closeSuccess');
              })()}
            </button>
          </div>
        </div>
      )}

      {/* Conflict Modal */}
      {conflictState && (
        <ConflictModal
          appName={conflictState.appName}
          onRetry={conflictState.onRetry}
          onSkip={conflictState.onSkip}
        />
      )}

      {/* Onboarding Modal */}
      {showOnboarding && <OnboardingModal onClose={handleOnboardingClose} />}

      <RestoreModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onConfirm={() => processUpdates(true)}
        onSkip={() => processUpdates(false)}
      />

      {isCreatingRestore && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all">
          <div className="flex flex-col items-center space-y-6 rounded-3xl bg-white p-12 shadow-2xl dark:bg-slate-800 border border-white/10">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
              <RefreshCw className="relative h-16 w-16 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('creatingRestore')}</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-xs">
                {t('restoreWait')}
              </p>
            </div>
          </div>
        </div>
      )}

      {isInstalling && !isCreatingRestore && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all">
          <div className="flex flex-col items-center space-y-6 rounded-3xl bg-white p-12 shadow-2xl dark:bg-slate-800 border border-white/10">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
              <ArrowDownToLine className="relative h-16 w-16 animate-bounce text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('installingUpdates')}</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-xs font-medium">
                {t('updatingApp')} <span className="text-blue-600 dark:text-blue-400">{currentInstallingApp}</span>
              </p>
              {currentLogLine && (
                <p className="text-[10px] text-blue-700/80 dark:text-blue-400/50 italic animate-pulse truncate max-w-[250px]">
                  {currentLogLine}
                </p>
              )}
            </div>
            <div className="h-1.5 w-64 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full bg-blue-600 transition-all duration-500 dark:bg-blue-500"
                style={{ width: `${((installProgress?.current || 0) / (installProgress?.total || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout>
  );
}
