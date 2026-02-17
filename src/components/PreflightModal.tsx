import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ShieldAlert, X, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { PreflightResult } from '../shared/types';

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

    useEffect(() => {
        if (!isOpen || !result) return;
        continueRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCancel();
            } else if (event.key === 'Enter' && canContinue) {
                event.preventDefault();
                onContinue();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [canContinue, isOpen, onCancel, onContinue, result]);

    if (!isOpen || !result) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[170] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-white/10 overflow-hidden"
                >
                    <div className="relative bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="h-8 w-8 text-white/90" />
                            <div>
                                <h2 className="text-xl font-bold">{t('preflightTitle')}</h2>
                                <p className="text-white/85 text-sm">{t('preflightDesc')}</p>
                            </div>
                        </div>
                        <button onClick={onCancel} className="absolute top-4 right-4 rounded-full bg-white/20 p-1 hover:bg-white/30 text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                            {result.overall === 'ok' && t('preflightOverallOk')}
                            {result.overall === 'warning' && t('preflightOverallWarning')}
                            {result.overall === 'error' && t('preflightOverallError')}
                        </div>

                        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                            {checks.map((key) => {
                                const ok = result.checks[key];
                                const detail = result.details[key];
                                return (
                                    <div
                                        key={key}
                                        className="rounded-lg border border-slate-300 bg-white p-3 dark:border-white/10 dark:bg-slate-900/40"
                                    >
                                        <div className="flex items-center gap-2">
                                            {ok ? (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                            )}
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                {t(checkLabelKeys[key])}
                                            </p>
                                        </div>
                                        {detail && (
                                            <p className="mt-2 text-xs text-slate-700 dark:text-slate-400 whitespace-pre-wrap break-words font-mono">
                                                {detail}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onCancel}
                                className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                            >
                                {t('preflightCancel')}
                            </button>
                            <button
                                onClick={onContinue}
                                disabled={!canContinue}
                                ref={continueRef}
                                className="rounded-lg border border-blue-500/40 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
                            >
                                {canContinue ? t('preflightContinue') : t('preflightFixFirst')}
                            </button>
                        </div>

                        {!canContinue && (
                            <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300 flex items-center gap-2">
                                <Wrench className="h-4 w-4" />
                                {t('preflightBlockingNote')}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
