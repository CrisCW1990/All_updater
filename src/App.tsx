import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UpdateCard } from './components/UpdateCard';
import { RestoreModal } from './components/RestoreModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ConflictModal } from './components/ConflictModal';
import { HistoryView } from './components/HistoryView.tsx';
import type { AppUpdate, HistoryItem } from './shared/types';
import { RefreshCw, CheckCircle, Coffee, ArrowDownToLine, CheckSquare, Square, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ToastContainer, type ToastType } from './components/Toast';
import { useLanguage } from './context/LanguageContext';
import { clsx } from 'clsx';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

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
  const [darkMode, setDarkMode] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleLog = (_: any, log: string) => {
      const cleanLog = log.replace(/\[#+ -+\]/g, '').trim();
      if (cleanLog) setCurrentLogLine(cleanLog);
    };

    window.ipcRenderer.on('winget:log', handleLog);
    return () => window.ipcRenderer.off('winget:log', handleLog);
  }, []);

  useEffect(() => {
    loadSettings();
    loadSystemInfo();
  }, []);

  const loadSystemInfo = async () => {
    const info = await window.ipcRenderer.invoke('system:get-info');
    setSystemInfo(info);
  };


  const loadSettings = async () => {
    const theme = await window.ipcRenderer.invoke('settings:get', 'theme');
    if (theme) setDarkMode(theme === 'dark');

    const hasSeenOnboarding = await window.ipcRenderer.invoke('settings:get', 'hasSeenOnboarding');
    if (!hasSeenOnboarding) setShowOnboarding(true);
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    window.ipcRenderer.invoke('settings:set', 'theme', newMode ? 'dark' : 'light');
  };

  const handleOnboardingClose = (dontShowAgain: boolean) => {
    setShowOnboarding(false);
    if (dontShowAgain) {
      window.ipcRenderer.invoke('settings:set', 'hasSeenOnboarding', true);
    }
  };

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
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
      const installable = available.filter((u: any) => u.previousStatus !== 'inapplicable');
      setSelectedIds(new Set(installable.map((u: any) => u.id)));
      setHasChecked(true);
      setIsWingetMissing(false);
    } catch (error: any) {
      console.error("[App] Failed to check updates:", error);
      if (error.message?.includes('ENOENT') || error.message?.includes('not found')) {
        setIsWingetMissing(true);
      }
      setHasChecked(true);
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
    // Filter out inapplicable updates from being selectable
    const selectableUpdates = updates.filter(u => u.previousStatus !== 'inapplicable');

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
    await window.ipcRenderer.invoke('system:set-operation-active', true);

    if (createRestore) {
      setIsCreatingRestore(true);
      setCurrentLogLine(t('creatingRestore'));
      try {
        const success = (await window.ipcRenderer.invoke('system:create-restore-point', "All Updater Auto-Restore")) as unknown as boolean;
        if (!success) {
          throw new Error("System Restore failed");
        }
      } catch (e) {
        console.error("Failed to create restore point", e);
        addToast(t('restoreFailedAbort'), "error");
        setIsCreatingRestore(false); // Reset state
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
          } catch (e: any) {
            // Check specifically for AppInUse
            if (e.message?.includes('AppInUse')) {
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
      } catch (e: any) {
        console.error(`Failed to update ${id}`, e);
        const isInapplicable = e.message?.includes('Inapplicable');
        const isReboot = e.message?.includes('RebootRequired');
        const isInUse = e.message?.includes('AppInUse');
        const isSecurity = e.message?.includes('HashMismatch');

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
          details: e.message
        };
        await window.ipcRenderer.invoke('history:add', historyEntry);
        currentResults.push({ ...historyEntry, date: new Date().toISOString() });

        if (isInapplicable) {
          addToast(`${appName} skipped: No applicable update found`, 'warning');
        } else if (isSecurity) {
          addToast(`${appName} skipped: Security Verification Failed`, 'error');
        } else if (isInUse) {
          addToast(`${appName} skipped: Application was in use`, 'warning');
        } else {
          addToast(`Failed to update ${appName}`, 'error');
        }
      }
      current++;
      setInstallProgress({ current, total });
      i++;
    }

    setBatchResults(currentResults);
    setIsInstalling(false);
    setInstallProgress(null);
    setCurrentInstallingApp(null);
    setCurrentLogLine(null);
    await window.ipcRenderer.invoke('system:set-operation-active', false);

    if (currentResults.length > 0) {
      setShowSummary(true);
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
                <p className="text-sm font-medium text-gray-900 dark:text-slate-400">{t('manageApps')}</p>
                {systemInfo && (
                  <span className="flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {systemInfo.arch} • {systemInfo.locale}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
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

          {isWingetMissing ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-6 py-20 text-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-red-500/20 blur-xl dark:bg-red-400/10" />
                <XCircle className="relative h-24 w-24 text-red-500" strokeWidth={1} />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{t('wingetMissing')}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('wingetMissingDesc')}
                </p>
                <button
                  onClick={() => window.ipcRenderer.invoke('settings:set', 'open-url', 'https://aka.ms/getwinget')}
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
                <p className="text-gray-900 dark:text-slate-400 font-medium">{t('readyDesc')}</p>
              </div>
              <button
                onClick={checkUpdates}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-slate-900 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-gray-100"
              >
                <RefreshCw className="h-6 w-6 transition-transform group-hover:rotate-180" />
                {t('checkUpdates')}
              </button>
              <p className="text-xl sm:text-2xl mt-8 font-bold text-slate-600 dark:text-slate-400 animate-in fade-in slide-in-from-top-2 duration-700 delay-300 max-w-2xl px-4 leading-relaxed">
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
              <p className="text-gray-900 dark:text-slate-400 font-medium text-lg">{t('allCleanDesc')}</p>
              <button
                onClick={checkUpdates}
                className="mt-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {t('checkAgain')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/40 px-4 py-3 backdrop-blur-md dark:bg-black/20">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                >
                  {selectedIds.size === updates.length ? (
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
        <HistoryView />
      )}

      {/* Summary Report Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-800 border border-black/10 dark:border-white/10 max-h-[80vh] flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('summaryTitle')}</h3>
                <p className="text-slate-600 dark:text-slate-400">{t('summaryDesc')}</p>
              </div>
              <button
                onClick={() => {
                  setShowSummary(false);
                  checkUpdates();
                }}
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <XCircle className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Logic for summary message */}
              {(() => {
                const total = batchResults.length;
                const failed = batchResults.filter(r => r.status === 'failed' || r.status === 'inapplicable' || r.status === 'in-use').length;

                let message = t('summarySuccess');

                if (failed === total) {
                  message = t('summaryFailed'); // Or use specific "inapplicable" one if needed
                } else if (failed > 0) {
                  message = t('summaryPartial');
                }

                return (
                  <div className="mb-4 rounded-2xl bg-slate-50 p-6 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <p className="text-xl text-slate-700 dark:text-slate-200 italic text-center font-medium leading-relaxed">
                      {message}
                    </p>
                  </div>
                );
              })()}

              {batchResults.map((res, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl bg-slate-100/50 p-4 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                  <div className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm",
                    res.status === 'success' ? "bg-green-500 text-white" :
                      res.status === 'inapplicable' ? "bg-amber-500 text-white" :
                        res.status === 'security-error' ? "bg-orange-600 text-white" :
                          "bg-red-500 text-white"
                  )}>
                    {res.status === 'success' && <CheckCircle className="h-5 w-5" />}
                    {res.status === 'inapplicable' && <AlertCircle className="h-5 w-5" />}
                    {res.status === 'security-error' && <AlertTriangle className="h-5 w-5" />}
                    {res.status === 'failed' && <XCircle className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{res.appName}</h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Version {res.version}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-400 italic font-medium">
                      {res.status === 'success' ? t('statusSuccess') :
                        res.status === 'inapplicable' ? t('statusInapplicable') :
                          res.status === 'reboot' ? t('statusReboot') :
                            res.status === 'in-use' ? t('statusInUse') :
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
              className="mt-8 w-full rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {(() => {
                const total = batchResults.length;
                const failed = batchResults.filter(r => r.status === 'failed' || r.status === 'inapplicable' || r.status === 'in-use').length;
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
              <p className="text-slate-500 dark:text-slate-400 max-w-xs">
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
              <p className="text-slate-500 dark:text-slate-400 max-w-xs font-medium">
                {t('updatingApp')} <span className="text-blue-600 dark:text-blue-400">{currentInstallingApp}</span>
              </p>
              {currentLogLine && (
                <p className="text-[10px] text-blue-500/70 dark:text-blue-400/50 italic animate-pulse truncate max-w-[250px]">
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
