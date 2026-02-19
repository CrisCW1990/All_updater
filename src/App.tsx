import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Layout } from './components/Layout';
import { UpdateCard } from './components/UpdateCard';
import { RestoreModal } from './components/RestoreModal';
import { RestoreFailureModal } from './components/RestoreFailureModal';
import { RestoreVerificationAlertModal } from './components/RestoreVerificationAlertModal';
import { PreflightModal } from './components/PreflightModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ConflictModal } from './components/ConflictModal';
import { HistoryView } from './components/HistoryView.tsx';
import { AppUpdateModal } from './components/AppUpdateModal';
import type {
  AppUpdate,
  AppVersionCheckResult,
  HistoryItem,
  PreflightResult,
  RestoreFailureReason,
  RestorePointResult,
  RestorePointVerificationResult
} from './shared/types';
import { RefreshCw, CheckCircle, Coffee, ArrowDownToLine, CheckSquare, Square, AlertCircle, XCircle, AlertTriangle, FileText, Wifi, WifiOff } from 'lucide-react';
import { ToastContainer, type ToastType } from './components/Toast';
import { useLanguage } from './context/LanguageContext';
import { clsx } from 'clsx';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface RestoreVerificationSummaryState {
  status: 'confirmed' | 'missing' | 'unverified';
  message: string;
  details?: string;
}

type ThemeMode = 'dark' | 'light' | 'system';
type AppProgressMode = 'real' | 'estimated';

const parsePercentFromWingetLog = (logLine: string): number | null => {
  const matches = Array.from(logLine.matchAll(/(^|[^0-9])([0-9]{1,3})%(?![0-9])/g));
  if (matches.length === 0) return null;
  const raw = Number(matches[matches.length - 1][2]);
  if (!Number.isFinite(raw)) return null;
  return Math.max(0, Math.min(100, raw));
};

const normalizeWingetLog = (value: string): string => (
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
);

const parseEstimatedPercentFromWingetLog = (logLine: string): number | null => {
  const normalized = normalizeWingetLog(logLine);
  // Phases ordered by typical install timeline.
  // Download gets a wide range (20-62%) since it's the longest phase.
  const phaseRules: Array<{ percent: number, regex: RegExp }> = [
    { percent: 5, regex: /\bstarting|iniciando|initializing|inicializando|preparing|preparando|resolving|resolviendo\b/ },
    { percent: 12, regex: /\bfound|encontrado|located|locating|searching|buscando|checking source|comprobando fuente\b/ },
    { percent: 20, regex: /\bdownloading|download|descargando|descarga|transferring|transfer|fetching|fetch|retrieving|obteniendo\b/ },
    { percent: 62, regex: /\bextract|unpack|decompress|descomprim|expandiendo|unpacking|desempaquetando\b/ },
    { percent: 72, regex: /\binstalling|install|instaland|aplicando|applying|executing|ejecutando|running installer|ejecutando instalador\b/ },
    { percent: 85, regex: /\bverifying|verify|verificando|verificar|hash|checksum|validating|validando|integrity\b/ },
    { percent: 92, regex: /\bregistering|registrando|configuring|configurando|setting up|configuracion\b/ },
    { percent: 97, regex: /\bfinalizing|finalizando|completing|completion|completado|completed|done|hecho|terminado|installed successfully|instalado correctamente|successfully installed\b/ }
  ];

  for (const rule of phaseRules) {
    if (rule.regex.test(normalized)) {
      return rule.percent;
    }
  }

  return null;
};

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
  const [restoreDecisionState, setRestoreDecisionState] = useState<{ message: string, details?: string, onContinue: () => void, onCancel: () => void } | null>(null);
  const [restoreVerificationAlert, setRestoreVerificationAlert] = useState<{ message: string, details?: string } | null>(null);
  const [currentInstallingApp, setCurrentInstallingApp] = useState<string | null>(null);
  const [currentLogLine, setCurrentLogLine] = useState<string | null>(null);
  const [currentAppProgress, setCurrentAppProgress] = useState<number | null>(null);
  const [currentAppProgressMode, setCurrentAppProgressMode] = useState<AppProgressMode | null>(null);
  const [slowConnectionMsg, setSlowConnectionMsg] = useState<string | null>(null);
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
  const [showAppUpdateModal, setShowAppUpdateModal] = useState(false);
  const [lastDownloadedUpdatePath, setLastDownloadedUpdatePath] = useState<string | null>(null);
  const [preflightResult, setPreflightResult] = useState<PreflightResult | null>(null);
  const [runningPreflight, setRunningPreflight] = useState(false);
  const [exportingDiagnostics, setExportingDiagnostics] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [restoreVerificationSummary, setRestoreVerificationSummary] = useState<RestoreVerificationSummaryState | null>(null);
  const initializedRef = useRef(false);
  const themeSaveAttemptRef = useRef(0);
  const historyWriteWarningShownRef = useRef(false);
  const pendingSelectedIdsRef = useRef<Set<string> | null>(null);
  const estimatedProgressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastLogTimestampRef = useRef<number>(0);
  const progressHistoryRef = useRef<{ percent: number; time: number }[]>([]);
  const [currentEta, setCurrentEta] = useState<string | null>(null);
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

  const stopEstimatedAppProgress = useCallback(() => {
    if (estimatedProgressTimerRef.current !== null) {
      clearInterval(estimatedProgressTimerRef.current);
      estimatedProgressTimerRef.current = null;
    }
  }, []);

  const startEstimatedAppProgress = useCallback(() => {
    stopEstimatedAppProgress();
    setCurrentAppProgressMode('estimated');
    estimatedProgressTimerRef.current = setInterval(() => {
      setCurrentAppProgress((prev) => {
        if (prev === null) return 3;
        if (prev >= 92) return prev;
        const step = prev < 25 ? 3 : prev < 55 ? 2 : 1;
        return Math.min(prev + step, 92);
      });
    }, 1200);
  }, [stopEstimatedAppProgress]);

  // Slow connection detection: if progress hasn't moved in 15s, show a satirical message
  const slowConnectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProgressValueRef = useRef<number | null>(null);
  const slowMsgIndexRef = useRef(0);
  const slowMsgKeys = ['slowConnection1', 'slowConnection2', 'slowConnection3', 'slowConnection4'] as const;

  useEffect(() => {
    if (!isInstalling || currentAppProgress === null) {
      if (slowConnectionTimerRef.current) clearTimeout(slowConnectionTimerRef.current);
      setSlowConnectionMsg(null);
      return;
    }
    // Progress moved — reset stall timer
    if (currentAppProgress !== lastProgressValueRef.current) {
      lastProgressValueRef.current = currentAppProgress;
      setSlowConnectionMsg(null);
      if (slowConnectionTimerRef.current) clearTimeout(slowConnectionTimerRef.current);
      slowConnectionTimerRef.current = setTimeout(() => {
        const key = slowMsgKeys[slowMsgIndexRef.current % slowMsgKeys.length];
        slowMsgIndexRef.current++;
        setSlowConnectionMsg(t(key));
      }, 15000);
    }
    return () => {
      if (slowConnectionTimerRef.current) clearTimeout(slowConnectionTimerRef.current);
    };
  }, [isInstalling, currentAppProgress, t]);

  // ETA calculation: sliding window over last 5 real data points
  const computeEta = (history: { percent: number; time: number }[], currentPercent: number): string | null => {
    if (history.length < 2) return null;
    const window = history.slice(-5);
    const oldest = window[0];
    const newest = window[window.length - 1];
    const deltaPercent = newest.percent - oldest.percent;
    const deltaTime = newest.time - oldest.time; // ms
    if (deltaPercent <= 0 || deltaTime <= 0) return null;
    const ratePerMs = deltaPercent / deltaTime;
    const remaining = 100 - currentPercent;
    const etaMs = remaining / ratePerMs;
    const etaSec = Math.round(etaMs / 1000);
    if (etaSec <= 0) return null;
    if (etaSec < 60) return t('etaSeconds').replace('{n}', String(etaSec));
    return t('etaMinutes').replace('{n}', String(Math.round(etaSec / 60)));
  };

  useEffect(() => {
    const handleLog = (_event: unknown, log: string) => {
      const cleanLog = log.replace(/\[#+ -+\]/g, '').trim();
      if (!cleanLog) return;
      setCurrentLogLine(cleanLog);
      const realPercent = parsePercentFromWingetLog(cleanLog);
      if (realPercent !== null) {
        stopEstimatedAppProgress();
        setCurrentAppProgressMode('real');
        setCurrentAppProgress((prev) => {
          const next = Math.max(prev ?? 0, realPercent);
          // Record data point for ETA
          const now = Date.now();
          progressHistoryRef.current = [...progressHistoryRef.current, { percent: next, time: now }].slice(-10);
          const eta = computeEta(progressHistoryRef.current, next);
          setCurrentEta(eta);
          return next;
        });
        return;
      }

      const estimatedPercent = parseEstimatedPercentFromWingetLog(cleanLog);
      if (estimatedPercent !== null) {
        setCurrentAppProgressMode((prev) => prev === 'real' ? prev : 'estimated');
        setCurrentAppProgress((prev) => Math.max(prev ?? 0, estimatedPercent));
      }
    };

    window.ipcRenderer.on('winget:log', handleLog);
    return () => {
      window.ipcRenderer.off('winget:log', handleLog);
      stopEstimatedAppProgress();
    };
  }, [stopEstimatedAppProgress]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

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
        .then((result) => {
          setAppUpdateInfo(result);
          if (result.success && result.hasUpdate) {
            setShowAppUpdateModal(true);
          }
        })
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

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const toggleTheme = () => {
    const previousMode = themeMode;
    const previousDark = darkMode;
    const nextMode: ThemeMode = darkMode ? 'light' : 'dark';
    const saveAttempt = ++themeSaveAttemptRef.current;
    setThemeMode(nextMode);
    setDarkMode(nextMode === 'dark');
    void window.ipcRenderer.invoke('settings:set', 'theme', nextMode).catch((error) => {
      if (saveAttempt !== themeSaveAttemptRef.current) return;
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

  const addHistoryEntrySafely = async (entry: Omit<HistoryItem, 'date'>): Promise<void> => {
    try {
      await window.ipcRenderer.invoke('history:add', entry);
    } catch (error) {
      console.error('[App] Failed to write history entry:', error, entry);
      if (!historyWriteWarningShownRef.current) {
        historyWriteWarningShownRef.current = true;
        addToast(t('historyWriteWarning'), 'warning');
      }
    }
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
        setShowAppUpdateModal(true);
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
    setLastDownloadedUpdatePath(null);
    try {
      const result = await window.ipcRenderer.invoke(
        'system:download-app-update',
        appUpdateInfo.assetUrl,
        appUpdateInfo.assetName,
        appUpdateInfo.assetSha256
      );

      if (result.canceled) {
        addToast(t('appUpdateDownloadCanceled'), 'info');
        return;
      }

      if (result.success) {
        addToast(t('appUpdateDownloadSuccess'), 'success');
        if (result.filePath) {
          setLastDownloadedUpdatePath(result.filePath);
          addToast(`${t('appUpdateSavedTo')} ${result.filePath}`, 'info');
        }
        if (result.hashVerified) {
          addToast(t('appUpdateHashVerified'), 'success');
        } else {
          addToast(t('appUpdateHashUnavailable'), 'warning');
        }
        const isZip = !!appUpdateInfo?.assetName && /\.zip$/i.test(appUpdateInfo.assetName);
        addToast(isZip ? t('appUpdateAfterDownloadZip') : t('appUpdateAfterDownloadExe'), 'warning');
        return;
      }

      console.error('[App] App update download failed:', result.error);
      if ((result.error || '').includes('HashMismatch')) {
        addToast(t('appUpdateHashMismatch'), 'error');
        return;
      }
      addToast(t('appUpdateDownloadFailed'), 'error');
    } catch (error) {
      console.error('[App] App update download threw error:', error);
      addToast(t('appUpdateDownloadFailed'), 'error');
    } finally {
      setDownloadingAppUpdate(false);
      setTimeout(() => setAppUpdateProgress(null), 500);
    }
  };

  const exportDiagnostics = async () => {
    setExportingDiagnostics(true);
    try {
      const result = await window.ipcRenderer.invoke('system:export-diagnostics');
      if (result.canceled) {
        addToast(t('exportDiagnosticsCanceled'), 'info');
        return;
      }
      if (result.success) {
        addToast(t('exportDiagnosticsSuccess'), 'success');
        if (result.filePath) {
          addToast(`${t('appUpdateSavedTo')} ${result.filePath}`, 'info');
        }
        return;
      }
      addToast(t('exportDiagnosticsFailed'), 'error');
    } catch (error) {
      console.error('[App] Failed to export diagnostics:', error);
      addToast(t('exportDiagnosticsFailed'), 'error');
    } finally {
      setExportingDiagnostics(false);
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
      const installableIds = new Set(installable.map((u) => u.id));
      setSelectedIds((previous) => {
        const preserved = new Set(Array.from(previous).filter((id) => installableIds.has(id)));
        if (preserved.size > 0 || (hasChecked && previous.size === 0)) {
          return preserved;
        }
        return new Set(installable.map((u) => u.id));
      });
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

  const handleUpdateClick = async (selectedOverride?: Set<string>) => {
    const effectiveSelected = selectedOverride ?? selectedIds;
    if (effectiveSelected.size === 0) return;
    pendingSelectedIdsRef.current = new Set(effectiveSelected);
    setRunningPreflight(true);
    try {
      const result = await window.ipcRenderer.invoke('system:run-preflight');
      if (!result.success || result.overall !== 'ok') {
        setPreflightResult(result);
        return;
      }
      setShowRestoreModal(true);
    } catch (error) {
      console.error('[App] Preflight failed unexpectedly:', error);
      addToast(t('preflightUnexpectedFailure'), 'warning');
      setShowRestoreModal(true);
    } finally {
      setRunningPreflight(false);
    }
  };

  const askContinueWithoutRestore = (message: string, details?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setRestoreDecisionState({
        message,
        details,
        onContinue: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });
  };

  const processUpdates = async (createRestore: boolean) => {
    setShowRestoreModal(false);
    setIsInstalling(true);
    setBatchResults([]);
    setRestoreVerificationSummary(null);
    historyWriteWarningShownRef.current = false;
    let operationMarked = false;
    let createdRestoreMeta: { sequenceNumber: number; description: string } | null = null;
    const selectedSnapshot = pendingSelectedIdsRef.current
      ? new Set(pendingSelectedIdsRef.current)
      : new Set(selectedIds);
    pendingSelectedIdsRef.current = null;
    if (selectedSnapshot.size === 0) {
      setIsInstalling(false);
      addToast(t('summaryRetryNothing'), 'info');
      return;
    }
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
            const continueWithoutRestore = await askContinueWithoutRestore(specificMessage, result.details);
            setRestoreDecisionState(null);
            if (!continueWithoutRestore) {
              addToast(t('restoreFailedAbort'), "warning");
              return;
            }
            addToast(t('restoreContinueWithoutPoint'), "warning");
          } else if (typeof result.sequenceNumber === 'number' && typeof result.description === 'string') {
            createdRestoreMeta = {
              sequenceNumber: result.sequenceNumber,
              description: result.description
            };
          }
        } catch (e) {
          console.error("Failed to create restore point", e);
          const details = getErrorMessage(e);
          const unknownMessage = t('restoreFailUnknown');
          addToast(`${t('restoreFailedAbort')} ${unknownMessage}`, "error");
          setCurrentLogLine(unknownMessage);
          const continueWithoutRestore = await askContinueWithoutRestore(unknownMessage, details);
          setRestoreDecisionState(null);
          if (!continueWithoutRestore) {
            setCurrentLogLine(null);
            return;
          }
          addToast(t('restoreContinueWithoutPoint'), "warning");
        } finally {
          setIsCreatingRestore(false);
        }
      }

      const total = selectedSnapshot.size;
      let current = 0;
      const currentResults: HistoryItem[] = [];
      setInstallProgress({ current, total });

      const queue = Array.from(selectedSnapshot);

      // Iteration using while to allow "retry" without complex index math
      let i = 0;
      while (i < queue.length) {
        const id = queue[i];
        const update = updates.find(u => u.id === id);
        const appName = update?.name || id;
        const appVersion = update?.available || 'unknown';

        try {
          setCurrentInstallingApp(appName);
          setCurrentLogLine(null);
          setCurrentAppProgress(3);
          setCurrentAppProgressMode('estimated');
          setCurrentEta(null);
          progressHistoryRef.current = [];
          startEstimatedAppProgress();

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
          await addHistoryEntrySafely(historyEntry);
          currentResults.push({ ...historyEntry, date: new Date().toISOString() });

          addToast(`${t('updateSuccess')} ${appName}`, 'success');
          stopEstimatedAppProgress();
          setCurrentAppProgressMode('real');
          setCurrentAppProgress(100);

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
          const isFileLockDetected = errorMessage.includes('FileLockDetected');

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
          await addHistoryEntrySafely(historyEntry);
          currentResults.push({ ...historyEntry, date: new Date().toISOString() });

          if (isInapplicable) {
            addToast(`${appName}: ${t('updateSkipped')}`, 'warning');
          } else if (isSecurity) {
            addToast(`${appName}: ${t('updateSecuritySkipped')}`, 'error');
          } else if (isReboot) {
            addToast(`${appName}: ${t('updateRebootPending')}`, 'warning');
            setUpdates(prev => prev.filter(u => u.id !== id));
            setSelectedIds(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          } else if (isInUse) {
            addToast(`${appName}: ${t('updateInUseSkipped')}`, 'warning');
          } else if (isFileLockDetected) {
            addToast(`${appName}: ${t('updateFileLockDetected')}`, 'warning');
          } else {
            addToast(`${t('updateFailed')} ${appName}`, 'error');
          }
        }
        current++;
        setInstallProgress({ current, total });
        stopEstimatedAppProgress();
        setCurrentAppProgress(null);
        setCurrentAppProgressMode(null);
        i++;
      }

      if (createdRestoreMeta) {
        try {
          const verification = await window.ipcRenderer.invoke(
            'system:verify-restore-point',
            createdRestoreMeta.sequenceNumber,
            createdRestoreMeta.description
          ) as RestorePointVerificationResult;

          if (!verification.confirmed) {
            const message = t('restorePostBatchMissing');
            const detailLines = [
              `${t('restoreSequenceLabel')}: ${verification.sequenceNumber}`,
              `${t('restoreExpectedDescriptionLabel')}: ${verification.expectedDescription}`
            ];

            if (verification.actualDescription) {
              detailLines.push(`${t('restoreActualDescriptionLabel')}: ${verification.actualDescription}`);
            }
            if (verification.details) {
              detailLines.push(verification.details);
            }

            setRestoreVerificationAlert({
              message,
              details: detailLines.join('\n')
            });
            setRestoreVerificationSummary({
              status: 'missing',
              message,
              details: detailLines.join('\n')
            });
            addToast(message, 'error');
          } else {
            const detailLines = [
              `${t('restoreSequenceLabel')}: ${verification.sequenceNumber}`,
              `${t('restoreExpectedDescriptionLabel')}: ${verification.expectedDescription}`
            ];
            if (verification.actualDescription) {
              detailLines.push(`${t('restoreActualDescriptionLabel')}: ${verification.actualDescription}`);
            }
            setRestoreVerificationSummary({
              status: 'confirmed',
              message: t('restorePostBatchConfirmed'),
              details: detailLines.join('\n')
            });
          }
        } catch (verificationError) {
          const message = t('restorePostBatchUnverified');
          const details = getErrorMessage(verificationError);
          setRestoreVerificationAlert({ message, details });
          setRestoreVerificationSummary({
            status: 'unverified',
            message,
            details
          });
          addToast(message, 'warning');
        }
      }

      setBatchResults(currentResults);
      if (currentResults.length > 0) {
        setShowSummary(true);
      }
    } finally {
      stopEstimatedAppProgress();
      setIsInstalling(false);
      setIsCreatingRestore(false);
      setInstallProgress(null);
      setCurrentInstallingApp(null);
      setCurrentLogLine(null);
      setCurrentAppProgress(null);
      setCurrentAppProgressMode(null);
      setConflictState(null);
      setRestoreDecisionState(null);
      setPreflightResult(null);
      if (operationMarked) {
        try {
          await window.ipcRenderer.invoke('system:set-operation-active', false);
        } catch (cleanupError) {
          console.error('Failed to reset operation state', cleanupError);
        }
      }
    }
  };

  const retryFailedFromSummary = async () => {
    const retryableStatuses = new Set(['failed', 'in-use', 'inapplicable', 'security-error']);
    const availableIds = new Set(updates.map((u) => u.id));
    const retryIds = batchResults
      .filter((item) => retryableStatuses.has(item.status))
      .map((item) => item.id)
      .filter((id) => availableIds.has(id));

    if (retryIds.length === 0) {
      addToast(t('summaryRetryNothing'), 'info');
      return;
    }

    setSelectedIds(new Set(retryIds));
    setShowSummary(false);
    await handleUpdateClick(new Set(retryIds));
  };

  const summaryTotal = batchResults.length;
  const summaryFailedCount = batchResults.filter(
    r => r.status === 'failed' || r.status === 'inapplicable' || r.status === 'in-use' || r.status === 'security-error'
  ).length;
  const retryableStatuses = new Set(['failed', 'in-use', 'inapplicable', 'security-error']);
  const availableUpdateIds = new Set(updates.map((u) => u.id));
  const retryableSummaryIds = batchResults
    .filter((r) => retryableStatuses.has(r.status))
    .map((r) => r.id)
    .filter((id) => availableUpdateIds.has(id));
  const hasRetryableSummaryItems = retryableSummaryIds.length > 0;


  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleTheme}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'dashboard' ? (
        <div className="mx-auto flex w-full h-full flex-col gap-8">
          {/* Dashboard Header - M3 Style */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between px-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="h-2 w-2 rounded-full bg-md-primary animate-pulse" />
                <h2 className="text-3xl font-black tracking-tight text-md-on-surface uppercase">{t('dashboard')}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-bold text-md-on-surface-variant opacity-70">{t('manageApps')}</p>
                {systemInfo && (
                  <span className="flex items-center gap-2 rounded-full bg-md-secondary-container px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.15em] text-md-on-secondary-container border border-md-on-secondary-container/10">
                    {systemInfo.arch} <span className="opacity-30">|</span> {systemInfo.locale}
                  </span>
                )}
                <span className={clsx(
                  "flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                  isOnline
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300"
                )}>
                  {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                  {isOnline ? t('networkOnline') : t('networkOffline')}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:flex-1 lg:justify-end">
              {!isInstalling && !isCreatingRestore && (
                <button
                  onClick={() => checkAppUpdate(false)}
                  disabled={!isOnline || checkingAppVersion}
                  className="group flex items-center gap-4 rounded-2xl bg-md-surface-container-high px-5 py-3 text-md-on-surface transition-all hover:bg-md-surface-container-highest hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={t('appUpdateCheck')}
                >
                  <div className={clsx("p-2 rounded-xl bg-md-primary-container text-md-on-primary-container", checkingAppVersion && "animate-spin")}>
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div className="text-left leading-tight pr-2">
                    <span className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">{t('appUpdateHeaderHint')}</span>
                    <span className="block text-xs font-black">
                      {t('appUpdateCurrent')}: {appUpdateInfo?.currentVersion ? `v${appUpdateInfo.currentVersion}` : t('unknown')}
                    </span>
                  </div>
                </button>
              )}

              {!isInstalling && !isCreatingRestore && (
                <button
                  onClick={exportDiagnostics}
                  disabled={exportingDiagnostics}
                  className="flex items-center justify-center rounded-2xl bg-md-surface-container-high p-4 text-md-on-surface transition-all hover:bg-md-surface-container-highest hover:shadow-sm disabled:opacity-30 active:scale-95"
                  title={t('exportDiagnostics')}
                >
                  <FileText className={clsx("h-6 w-6", exportingDiagnostics && "animate-pulse")} />
                </button>
              )}

              {updates.length > 0 && !loading && !isInstalling && (
                <button
                  onClick={checkUpdates}
                  className="flex items-center justify-center rounded-2xl bg-md-surface-container-high p-4 text-md-on-surface transition-all hover:bg-md-surface-container-highest hover:shadow-sm active:scale-95"
                  title={t('refresh')}
                >
                  <RefreshCw className="h-6 w-6" />
                </button>
              )}

              {(isInstalling || isCreatingRestore) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="flex items-center gap-4 rounded-2xl bg-md-primary-container/50 px-6 py-3 border border-md-primary/20 backdrop-blur-sm"
                >
                  <div className="h-2 w-2 rounded-full bg-md-primary animate-ping" />
                  <span className="text-sm font-black uppercase tracking-widest text-md-on-primary-container">
                    {isCreatingRestore ? t('creatingRestore') : `${t('updatingApp')} ${installProgress?.current || 0}/${installProgress?.total || 0}`}
                  </span>
                </motion.div>
              )}

              {updates.length > 0 && !isInstalling && (
                <button
                  onClick={() => { void handleUpdateClick(); }}
                  disabled={selectedIds.size === 0 || runningPreflight}
                  className="flex items-center gap-4 rounded-2xl bg-md-primary px-8 py-4 font-black uppercase tracking-widest text-md-on-primary shadow-xl shadow-md-primary/20 transition-all hover:scale-[1.02] hover:shadow-2xl disabled:grayscale disabled:opacity-50 active:scale-95"
                >
                  <ArrowDownToLine className={clsx("h-6 w-6", runningPreflight && "animate-pulse")} />
                  <span className="font-black tracking-widest uppercase">{runningPreflight ? t('preflightRunning') : `${t('updateSelected')} (${selectedIds.size})`}</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1">
            {isWingetMissing ? (
              <div className="flex flex-1 flex-col items-center justify-center space-y-8 py-20 text-center">
                <div className="relative">
                  <div className="absolute -inset-10 rounded-full bg-md-error/10 blur-3xl" />
                  <div className="p-8 rounded-[32px] bg-md-error-container text-md-on-error-container shadow-2xl relative">
                    <XCircle className="h-20 w-20" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="max-w-md space-y-4">
                  <h3 className="text-3xl font-black uppercase tracking-tight text-md-on-surface">{t('wingetMissing')}</h3>
                  <p className="text-md-on-surface-variant font-bold leading-relaxed">
                    {t('wingetMissingDesc')}
                  </p>
                  <button
                    onClick={() => window.ipcRenderer.invoke('system:open-url', 'https://aka.ms/getwinget')}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-md-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-md-on-primary shadow-lg hover:shadow-xl transition-all active:scale-95"
                  >
                    {t('getWinget')}
                  </button>
                </div>
              </div>
            ) : loading ? (
              <div className="flex flex-1 flex-col items-center justify-center space-y-12 py-32 text-center animate-in fade-in duration-700">
                <div className="relative">
                  {/* Sentient Spinner Style */}
                  <div className="h-32 w-32 rounded-full border-8 border-md-surface-container-highest flex items-center justify-center relative shadow-inner">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[-8px] rounded-full border-8 border-transparent border-t-md-primary"
                    />
                    <div className="h-16 w-16 rounded-full bg-md-primary/10 flex items-center justify-center animate-pulse">
                      <RefreshCw className="h-8 w-8 text-md-primary" />
                    </div>
                  </div>
                  <div className="absolute -inset-20 bg-md-primary/5 blur-[100px] -z-10" />
                </div>

                <div className="space-y-4 max-w-sm px-4">
                  <h3 className="text-4xl font-black uppercase tracking-tighter text-md-primary">
                    {t('checking')}
                  </h3>
                  <p className="text-lg font-black leading-relaxed text-md-on-surface-variant opacity-80 uppercase tracking-widest">
                    {t('scanningBody')}
                  </p>
                </div>
              </div >
            ) : !hasChecked ? (
              <div className="flex flex-1 flex-col items-center justify-center space-y-8 py-8 lg:py-24 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="relative">
                  <div className="absolute -inset-10 rounded-full bg-md-secondary-container/30 blur-[120px] animate-pulse" />
                  <div className="relative p-6 lg:p-10 rounded-[32px] lg:rounded-[40px] bg-md-surface-container-high shadow-2xl">
                    <Coffee className="h-16 w-16 lg:h-24 lg:w-24 text-md-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="max-w-lg space-y-2 lg:space-y-4 px-6">
                  <h3 className="text-2xl lg:text-4xl font-black uppercase tracking-tight text-md-on-surface">{t('readyTitle')}</h3>
                  <p className="text-sm lg:text-lg font-bold text-md-on-surface-variant leading-relaxed uppercase tracking-widest opacity-70">{t('readyDesc')}</p>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-md-primary/20 blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <button
                    onClick={checkUpdates}
                    className="relative group flex items-center gap-4 overflow-hidden rounded-[24px] bg-md-primary px-8 py-4 lg:px-10 lg:py-6 text-lg lg:text-xl font-black uppercase tracking-widest text-md-on-primary shadow-2xl transition-all hover:scale-[1.05] active:scale-95"
                  >
                    <RefreshCw className="h-6 w-6 lg:h-8 lg:w-8 transition-transform duration-700 group-hover:rotate-180" />
                    {t('checkUpdates')}
                  </button>
                </div>

                <p className="text-[10px] lg:text-sm font-black text-md-on-surface-variant/40 uppercase tracking-[0.3em] max-w-2xl px-8 leading-loose transition-all hover:text-md-primary/50 cursor-default">
                  {t('footerLove')} <span className="text-md-primary">Chris</span>.
                  <br />
                  {t('footerAI')}
                  <span className="inline-block align-middle ml-2 lg:ml-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-md-error opacity-70 animate-pulse lg:w-6 lg:h-6">
                      <path d="M4 4h4v4H4zM16 4h4v4h-4zM2 8h4v4H2zM8 8h8v4H8zM18 8h4v4h-4zM2 12h4v4H2zM6 16h4v4H6zM10 20h4v4h-4zM14 16h4v4h-4zM18 12h4v4h-4z" fill="currentColor" />
                    </svg>
                  </span>
                </p>
              </div>
            ) : updates.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center space-y-4 lg:space-y-6 py-12 lg:py-20 text-center">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-xl dark:bg-emerald-400/10" />
                  <CheckCircle className="relative h-16 w-16 lg:h-24 lg:w-24 text-emerald-600 dark:text-emerald-500" strokeWidth={1} />
                </div>
                <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-md-on-surface">{t('allClean')}</h3>
                <p className="font-black text-md-on-surface-variant opacity-70 text-base lg:text-lg uppercase tracking-widest">{t('allCleanDesc')}</p>
                <button
                  onClick={checkUpdates}
                  className="mt-4 lg:mt-6 px-6 py-3 rounded-full bg-md-secondary-container text-md-on-secondary-container text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  {t('checkAgain')}
                </button>
              </div >
            ) : (
              <div className="space-y-4 pb-24">
                <div className="flex items-center justify-between rounded-xl border border-md-outline-variant bg-md-surface-container-high px-4 py-3 backdrop-blur-md">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-3 text-sm font-bold text-md-on-surface-variant hover:text-md-primary transition-colors"
                  >
                    {allSelectableSelected ? (
                      <CheckSquare className="h-5 w-5 text-md-primary shadow-sm" />
                    ) : (
                      <Square className="h-5 w-5 text-md-outline" />
                    )}
                    <span>{t('selectAll')}</span>
                  </button>
                  <span className="text-sm font-black uppercase tracking-widest text-md-primary opacity-60">
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
      )
      }

      {/* Summary Report Modal */}
      {
        showSummary && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-md-scrim/60 backdrop-blur-md transition-all p-4">
            <div className="w-full max-w-xl rounded-3xl bg-md-surface-container-high p-8 shadow-2xl border border-md-outline-variant max-h-[80vh] flex flex-col relative overflow-hidden">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-md-on-surface">{t('summaryTitle')}</h3>
                  <p className="text-sm font-bold text-md-on-surface-variant opacity-70 uppercase tracking-widest">{t('summaryDesc')}</p>
                </div>
                <button
                  onClick={() => {
                    setShowSummary(false);
                    checkUpdates();
                  }}
                  className="rounded-full p-2 hover:bg-md-on-surface/10 transition-colors"
                >
                  <XCircle className="h-6 w-6 text-md-on-surface-variant" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {/* Logic for summary message */}
                {(() => {
                  let message = t('summarySuccess');

                  if (summaryFailedCount === summaryTotal) {
                    message = t('summaryFailed'); // Or use specific "inapplicable" one if needed
                  } else if (summaryFailedCount > 0) {
                    message = t('summaryPartial');
                  }

                  return (
                    <div className="mb-4 rounded-2xl border border-md-primary/20 bg-md-primary-container/30 p-6">
                      <p className="text-xl text-md-on-primary-container italic text-center font-black uppercase tracking-tight leading-relaxed">
                        {message}
                      </p>
                    </div>
                  );
                })()}

                {restoreVerificationSummary && (
                  <div className={clsx(
                    "rounded-2xl border p-4",
                    restoreVerificationSummary.status === 'confirmed'
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20"
                      : restoreVerificationSummary.status === 'missing'
                        ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20"
                        : "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20"
                  )}>
                    <p className={clsx(
                      "text-sm font-bold",
                      restoreVerificationSummary.status === 'confirmed'
                        ? "text-emerald-800 dark:text-emerald-300"
                        : restoreVerificationSummary.status === 'missing'
                          ? "text-red-800 dark:text-red-300"
                          : "text-amber-800 dark:text-amber-300"
                    )}>
                      {restoreVerificationSummary.message}
                    </p>
                    {restoreVerificationSummary.details && (
                      <p className="mt-2 whitespace-pre-wrap text-xs font-mono text-slate-900 dark:text-sky-100">
                        {restoreVerificationSummary.details}
                      </p>
                    )}
                  </div>
                )}

                {batchResults.map((res, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl border border-md-outline-variant bg-md-surface-container-low p-4">
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
                      <h4 className="font-bold text-md-on-surface truncate">{res.appName}</h4>
                      <p className="text-[10px] text-md-primary font-black uppercase tracking-widest mb-1 opacity-70">
                        {t('versionLabel')} {res.version}
                      </p>
                      <p className="text-xs text-md-on-surface-variant italic font-bold">
                        {res.status === 'success' ? t('statusSuccess') :
                          res.status === 'reboot' ? t('statusReboot') :
                            res.status === 'in-use' ? t('statusInUse') :
                              res.status === 'inapplicable' ? t('statusInapplicable') :
                                res.status === 'security-error' ? t('statusSecurity') :
                                  t('statusFailed')}
                      </p>
                    </div>
                  </div>
                ))
                }

                {
                  batchResults.some(r => r.status === 'success' || r.status === 'reboot') && (
                    <div className="rounded-2xl bg-blue-500/10 p-4 border border-blue-500/20">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        {t('restartRecommendation')}
                      </p>
                    </div>
                  )
                }
              </div >

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {hasRetryableSummaryItems && (
                  <button
                    onClick={() => { void retryFailedFromSummary(); }}
                    className="rounded-2xl border border-amber-300 bg-amber-50 py-3 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30"
                  >
                    {t('summaryRetryFailed')}
                  </button>
                )}
                <button
                  onClick={exportDiagnostics}
                  disabled={exportingDiagnostics}
                  className={clsx(
                    "rounded-2xl border py-3 text-sm font-bold transition-colors",
                    exportingDiagnostics
                      ? "cursor-not-allowed border-slate-300 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
                      : "border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-sky-100 dark:hover:bg-white/10"
                  )}
                >
                  {exportingDiagnostics ? `${t('exportDiagnostics')}...` : t('summaryExportDiagnostics')}
                </button>
              </div>

              <button
                onClick={() => {
                  setShowSummary(false);
                  checkUpdates();
                }}
                className="mt-8 w-full rounded-2xl bg-md-primary py-4 font-black uppercase tracking-widest text-md-on-primary shadow-xl shadow-md-primary/20 transition-all hover:bg-md-primary/90 hover:scale-[1.02] active:scale-95"
              >
                {summaryFailedCount === summaryTotal ? t('thanksNothing') : t('closeSuccess')}
              </button>
            </div >
          </div >
        )
      }

      {/* Conflict Modal */}
      {
        conflictState && (
          <ConflictModal
            appName={conflictState.appName}
            onRetry={conflictState.onRetry}
            onSkip={conflictState.onSkip}
          />
        )
      }

      {
        restoreDecisionState && (
          <RestoreFailureModal
            isOpen={Boolean(restoreDecisionState)}
            message={restoreDecisionState.message}
            details={restoreDecisionState.details}
            onContinue={() => {
              restoreDecisionState.onContinue();
              setRestoreDecisionState(null);
            }}
            onCancel={() => {
              restoreDecisionState.onCancel();
              setRestoreDecisionState(null);
            }}
          />
        )
      }

      {
        restoreVerificationAlert && (
          <RestoreVerificationAlertModal
            isOpen={Boolean(restoreVerificationAlert)}
            message={restoreVerificationAlert.message}
            details={restoreVerificationAlert.details}
            onClose={() => setRestoreVerificationAlert(null)}
          />
        )
      }

      {
        preflightResult && (
          <PreflightModal
            isOpen={Boolean(preflightResult)}
            result={preflightResult}
            onContinue={() => {
              const canContinue = preflightResult.overall !== 'error';
              setPreflightResult(null);
              if (canContinue) {
                setShowRestoreModal(true);
              } else {
                pendingSelectedIdsRef.current = null;
              }
            }}
            onCancel={() => {
              pendingSelectedIdsRef.current = null;
              setPreflightResult(null);
            }}
          />
        )
      }

      {/* Onboarding Modal */}
      {showOnboarding && <OnboardingModal onClose={handleOnboardingClose} />}

      <AppUpdateModal
        isOpen={showAppUpdateModal}
        onClose={() => {
          setShowAppUpdateModal(false);
          if (!downloadingAppUpdate && !lastDownloadedUpdatePath) {
            addToast(t('appUpdateDownloadCanceled'), 'warning');
          }
        }}
        updateInfo={appUpdateInfo}
        onDownload={downloadAppUpdate}
        downloading={downloadingAppUpdate}
        progress={appUpdateProgress}
      />

      <RestoreModal
        isOpen={showRestoreModal}
        onClose={() => {
          pendingSelectedIdsRef.current = null;
          setShowRestoreModal(false);
        }}
        onConfirm={() => processUpdates(true)}
        onSkip={() => processUpdates(false)}
      />

      {
        isCreatingRestore && (
          <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-md-scrim/60 backdrop-blur-md transition-all">
            <div className="flex flex-col items-center space-y-6 rounded-3xl bg-md-surface-container-high p-12 shadow-2xl border border-md-outline-variant">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-md-primary/20 blur-xl animate-pulse" />
                <RefreshCw className="relative h-16 w-16 animate-spin text-md-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight text-md-on-surface">{t('creatingRestore')}</h3>
                <p className="text-sm font-bold text-md-on-surface-variant opacity-70 uppercase tracking-widest max-w-xs">
                  {t('restoreWait')}
                </p>
              </div>
            </div>
          </div>
        )
      }

      {
        isInstalling && !isCreatingRestore && (
          <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-md-scrim/60 backdrop-blur-md transition-all">
            <div className="flex flex-col items-center space-y-6 rounded-3xl bg-md-surface-container-high p-12 shadow-2xl border border-md-outline-variant">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-md-primary/20 blur-xl animate-pulse" />
                <ArrowDownToLine className="relative h-16 w-16 animate-bounce text-md-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight text-md-on-surface">{t('installingUpdates')}</h3>
                <p className="text-sm font-bold text-md-on-surface-variant opacity-70 uppercase tracking-widest max-w-xs">
                  {t('updatingApp')} <span className="text-md-primary">{currentInstallingApp}</span>
                </p>
                {currentLogLine && (
                  <p className="text-[10px] text-md-primary opacity-50 italic animate-pulse truncate max-w-[250px]">
                    {currentLogLine}
                  </p>
                )}
                {slowConnectionMsg && (
                  <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest animate-pulse max-w-[280px] text-center">
                    ⚠ {slowConnectionMsg}
                  </p>
                )}
              </div>
              <div className="w-full max-w-xs space-y-3">
                <div>
                  <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-md-on-surface-variant opacity-60">
                    {t('appProgress')}: {currentAppProgress !== null ? `${currentAppProgress}%` : t('unknown')}
                    {currentAppProgress !== null && currentAppProgressMode === 'estimated' ? ` (${t('estimatedLabel')})` : ''}
                    {currentAppProgressMode === 'real' && currentAppProgress !== null && currentAppProgress < 100 && (
                      <span className="ml-1 text-md-primary">
                        — {currentEta ?? t('etaCalculating')}
                      </span>
                    )}
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-md-surface-container-low">
                    {currentAppProgress !== null ? (
                      <div
                        className="h-full bg-md-primary transition-all duration-300"
                        style={{ width: `${currentAppProgress}%` }}
                      />
                    ) : (
                      <div className="h-full w-1/3 animate-pulse rounded-full bg-md-primary/30" />
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-md-on-surface-variant opacity-60">
                    {t('batchProgress')}: {installProgress?.current || 0}/{installProgress?.total || 0}
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-md-surface-container-low">
                    <div
                      className="h-full bg-md-secondary transition-all duration-500"
                      style={{ width: `${((installProgress?.current || 0) / (installProgress?.total || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Layout >
  );
}
