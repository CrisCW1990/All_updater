import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RestoreFailureModalProps {
    isOpen: boolean;
    message: string;
    details?: string;
    onContinue: () => void;
    onCancel: () => void;
}

export const RestoreFailureModal: React.FC<RestoreFailureModalProps> = ({
    isOpen,
    message,
    details,
    onContinue,
    onCancel
}) => {
    const { t } = useLanguage();
    const continueRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        continueRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCancel();
            } else if (event.key === 'Enter') {
                event.preventDefault();
                onContinue();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onCancel, onContinue]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-white/10 overflow-hidden"
                >
                    <div className="relative bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="h-8 w-8 text-white/90" />
                            <div>
                                <h2 className="text-xl font-bold">{t('restoreDecisionTitle')}</h2>
                                <p className="text-white/85 text-sm">{t('restoreDecisionDesc')}</p>
                            </div>
                        </div>
                        <button onClick={onCancel} className="absolute top-4 right-4 rounded-full bg-white/20 p-1 hover:bg-white/30 text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                            <div className="flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
                            </div>
                        </div>

                        {details && (
                            <div className="rounded-lg border border-slate-300 bg-slate-100 p-3 text-xs font-mono text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-slate-400 overflow-x-auto">
                                {details}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={onCancel}
                                className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                            >
                                {t('restoreDecisionCancel')}
                            </button>
                            <button
                                onClick={onContinue}
                                ref={continueRef}
                                className="rounded-xl border border-orange-500/40 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/30"
                            >
                                {t('restoreDecisionContinue')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
