import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ShieldAlert, X, Wrench, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { PreflightResult } from '../shared/types';
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
            <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
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
                            onClick={onCancel}
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
                                const detail = result.details[key];
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

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button
                                onClick={onCancel}
                                className="rounded-full px-6 py-4 text-sm font-black text-md-on-surface-variant hover:bg-md-surface-variant/50 transition-all active:scale-95"
                            >
                                {t('preflightCancel')}
                            </button>
                            <button
                                onClick={onContinue}
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
