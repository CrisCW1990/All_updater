import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ShieldAlert, X, Wrench, ChevronRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { PreflightResult, ServiceRuntimeStatus, ServiceStartupType } from '../shared/types';
import { clsx } from 'clsx';

interface PreflightModalProps {
    isOpen: boolean;
    result: PreflightResult | null;
    onContinue: () => void;
    onCancel: () => void;
}

type CheckKey = keyof PreflightResult['checks'];

export const PreflightModal: React.FC<PreflightModalProps> = ({
    isOpen,
    result,
    onContinue,
    onCancel
}) => {
    const { t } = useLanguage();
    const [actionError, setActionError] = React.useState<string | null>(null);
    const handleCancel = React.useCallback(() => {
        setActionError(null);
        onCancel();
    }, [onCancel]);
    const handleContinue = React.useCallback(() => {
        setActionError(null);
        onContinue();
    }, [onContinue]);
    const checks: CheckKey[] = ['admin', 'winget', 'vssService', 'taskScheduler', 'restoreQuery'];
    const canContinue = result?.overall !== 'error';
    const continueRef = useRef<HTMLButtonElement>(null);
    const checkLabelKeys: Record<CheckKey, Parameters<typeof t>[0]> = {
        admin: 'preflightCheckAdmin',
        winget: 'preflightCheckWinget',
        vssService: 'preflightCheckVssService',
        taskScheduler: 'preflightCheckTaskScheduler',
        restoreQuery: 'preflightCheckRestoreQuery'
    };
    const runtimeKeyMap: Record<ServiceRuntimeStatus, Parameters<typeof t>[0]> = {
        running: 'preflightRuntimeRunning',
        stopped: 'preflightRuntimeStopped',
        paused: 'preflightRuntimePaused',
        missing: 'preflightRuntimeMissing',
        unknown: 'preflightRuntimeUnknown'
    };
    const startupKeyMap: Record<ServiceStartupType, Parameters<typeof t>[0]> = {
        automatic: 'preflightStartupAutomatic',
        manual: 'preflightStartupManual',
        disabled: 'preflightStartupDisabled',
        unknown: 'preflightStartupUnknown'
    };

    const stripStructuredDetail = (detail: string, prefix: string): string => {
        if (!detail.startsWith(prefix)) return detail;
        return detail.slice(prefix.length).trim();
    };

    const getCheckDetail = (key: CheckKey): string | undefined => {
        if (!result) return undefined;
        const fallback = result.details[key];
        if (key === 'admin' && fallback) {
            if (fallback.startsWith('code=not-elevated')) {
                return [t('preflightAdminAdvice'), t('preflightNoAutoFix')].join('\n');
            }
            if (fallback.startsWith('code=admin-check-failed;')) {
                const output = stripStructuredDetail(fallback, 'code=admin-check-failed; output=');
                return [t('preflightAdminCheckFailed'), output].join('\n');
            }
            return fallback;
        }

        if (key === 'winget' && fallback) {
            if (fallback.startsWith('code=winget-missing')) {
                return [t('preflightWingetMissingAdvice'), t('preflightNoAutoFix')].join('\n');
            }
            if (fallback.startsWith('code=winget-error;')) {
                const output = stripStructuredDetail(fallback, 'code=winget-error; output=');
                return [t('preflightWingetGeneralAdvice'), output].join('\n');
            }
            return fallback;
        }

        if (key !== 'vssService' && key !== 'taskScheduler') return fallback;

        const serviceState = result.serviceStates?.[key];
        if (!serviceState) return fallback;

        const lines = [
            `${t('preflightServiceRuntime')}: ${t(runtimeKeyMap[serviceState.status])}`,
            `${t('preflightServiceStartup')}: ${t(startupKeyMap[serviceState.startType])}`
        ];

        if (serviceState.startType === 'disabled') {
            lines.push(key === 'vssService' ? t('preflightVssAdviceDisabled') : t('preflightTaskAdviceDisabled'));
        } else if (serviceState.status !== 'running') {
            lines.push(key === 'vssService' ? t('preflightVssAdviceNotRunning') : t('preflightTaskAdviceNotRunning'));
        }

        lines.push(t('preflightNoAutoFix'));
        return lines.join('\n');
    };

    useEffect(() => {
        if (!isOpen || !result) return;
        continueRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleCancel();
            } else if (event.key === 'Enter' && canContinue) {
                event.preventDefault();
                handleContinue();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [canContinue, handleCancel, handleContinue, isOpen, result]);

    if (!isOpen || !result) return null;

    const runQuickAction = (action: () => Promise<void>) => {
        setActionError(null);
        void action().catch((error) => {
            console.error('[PreflightModal] Quick action failed:', error);
            setActionError(t('preflightActionFailed'));
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleCancel}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl overflow-hidden rounded-[28px] bg-md-surface-container-high shadow-2xl"
                >
                    <div className="bg-md-primary-container p-6 md:p-8 text-md-on-primary-container relative">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-md-primary text-md-on-primary shadow-sm">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{t('preflightTitle')}</h2>
                                <p className="text-sm font-bold opacity-80">{t('preflightDesc')}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-md-on-primary-container/10 text-md-on-primary-container transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        <div className={clsx(
                            "rounded-2xl px-6 py-4 text-sm font-black text-center uppercase tracking-widest transition-colors",
                            result.overall === 'ok' ? "bg-md-secondary-container/30 text-md-on-secondary-container" :
                                result.overall === 'warning' ? "bg-md-error-container/10 text-md-on-error-container" :
                                    "bg-md-error text-md-on-error"
                        )}>
                            {result.overall === 'ok' && t('preflightOverallOk')}
                            {result.overall === 'warning' && t('preflightOverallWarning')}
                            {result.overall === 'error' && t('preflightOverallError')}
                        </div>

                        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                            {checks.map((key) => {
                                const ok = result.checks[key];
                                const detail = getCheckDetail(key);
                                return (
                                    <div
                                        key={key}
                                        className="rounded-2xl bg-md-surface-container-highest p-4 transition-all hover:bg-md-surface-variant/20 hover:shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            {ok ? (
                                                <CheckCircle2 className="h-5 w-5 text-md-primary" />
                                            ) : (
                                                <AlertTriangle className="h-5 w-5 text-md-error" />
                                            )}
                                            <p className="text-sm font-black text-md-on-surface-variant">
                                                {t(checkLabelKeys[key])}
                                            </p>
                                        </div>
                                        {detail && (
                                            <div className="mt-3 flex gap-2">
                                                <ChevronRight className="h-3 w-3 mt-1 shrink-0 text-md-primary opacity-50" />
                                                <p className="text-[11px] font-mono font-medium text-md-on-surface-variant/70 whitespace-pre-wrap break-words">
                                                    {detail}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {(!result.checks.winget || !result.checks.vssService || !result.checks.taskScheduler || !result.checks.restoreQuery) && (
                            <div className="rounded-2xl border border-md-outline-variant/30 bg-md-surface-container-low p-4">
                                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-md-on-surface-variant opacity-70">
                                    {t('preflightQuickActions')}
                                </p>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {!result.checks.winget && (
                                        <button
                                            onClick={() => {
                                                runQuickAction(async () => {
                                                    await window.ipcRenderer.invoke('system:open-url', 'https://aka.ms/getwinget');
                                                });
                                            }}
                                            className="rounded-xl border border-md-primary/20 bg-md-surface px-3 py-2 text-xs font-bold text-md-primary transition-colors hover:bg-md-primary/10"
                                        >
                                            <span className="inline-flex items-center gap-1">
                                                <ExternalLink className="h-3.5 w-3.5" />
                                                {t('preflightActionGetWinget')}
                                            </span>
                                        </button>
                                    )}
                                    {(!result.checks.vssService || !result.checks.taskScheduler) && (
                                        <button
                                            onClick={() => {
                                                runQuickAction(async () => {
                                                    await window.ipcRenderer.invoke('system:open-services-console');
                                                });
                                            }}
                                            className="rounded-xl border border-md-outline/20 bg-md-surface px-3 py-2 text-xs font-bold text-md-on-surface transition-colors hover:bg-md-surface-variant/30"
                                        >
                                            {t('preflightActionOpenServices')}
                                        </button>
                                    )}
                                    {(!result.checks.restoreQuery || !result.checks.vssService || !result.checks.taskScheduler) && (
                                        <button
                                            onClick={() => {
                                                runQuickAction(async () => {
                                                    await window.ipcRenderer.invoke('system:open-system-restore');
                                                });
                                            }}
                                            className="rounded-xl border border-md-outline/20 bg-md-surface px-3 py-2 text-xs font-bold text-md-on-surface transition-colors hover:bg-md-surface-variant/30"
                                        >
                                            {t('preflightActionOpenSystemProtection')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {actionError && (
                            <div className="rounded-xl bg-md-error-container p-3 text-xs font-bold text-md-on-error-container">
                                {actionError}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button
                                onClick={handleCancel}
                                className="rounded-full px-6 py-4 text-sm font-black text-md-on-surface-variant hover:bg-md-surface-variant/50 transition-all active:scale-95"
                            >
                                {t('preflightCancel')}
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={!canContinue}
                                ref={continueRef}
                                className={clsx(
                                    "rounded-full px-6 py-4 text-sm font-black transition-all shadow-md active:scale-95",
                                    canContinue
                                        ? "bg-md-primary text-md-on-primary hover:shadow-lg"
                                        : "bg-md-surface-variant/30 text-md-on-surface-variant/40 cursor-not-allowed shadow-none"
                                )}
                            >
                                {canContinue ? t('preflightContinue') : t('preflightFixFirst')}
                            </button>
                        </div>

                        {!canContinue && (
                            <div className="rounded-2xl bg-md-error-container/20 p-4 flex items-center gap-3 animate-pulse">
                                <Wrench className="h-5 w-5 text-md-error" />
                                <p className="text-[11px] font-black uppercase tracking-tight text-md-on-error-container">
                                    {t('preflightBlockingNote')}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="pb-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-md-primary opacity-40">
                        SYSTEM INTEGRITY CHECK
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
