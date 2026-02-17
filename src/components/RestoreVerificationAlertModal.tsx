import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RestoreVerificationAlertModalProps {
    isOpen: boolean;
    message: string;
    details?: string;
    onClose: () => void;
}

export const RestoreVerificationAlertModal: React.FC<RestoreVerificationAlertModalProps> = ({
    isOpen,
    message,
    details,
    onClose
}) => {
    const { t } = useLanguage();
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        closeRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' || event.key === 'Enter') {
                event.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[165] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-white/10 overflow-hidden"
                >
                    <div className="relative bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="h-8 w-8 text-white/90" />
                            <div>
                                <h2 className="text-xl font-bold">{t('restorePostBatchTitle')}</h2>
                                <p className="text-white/85 text-sm">{t('restorePostBatchDesc')}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-white/20 p-1 hover:bg-white/30 text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/50 dark:bg-orange-900/20">
                            <div className="flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-orange-700 dark:text-orange-300 shrink-0 mt-0.5" />
                                <p className="text-sm text-orange-900 dark:text-orange-200">{message}</p>
                            </div>
                        </div>

                        {details && (
                            <div className="rounded-lg border border-slate-300 bg-slate-100 p-3 text-xs font-mono text-slate-900 dark:border-white/10 dark:bg-black/20 dark:text-sky-200 overflow-x-auto whitespace-pre-wrap break-words">
                                {details}
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            ref={closeRef}
                            className="w-full rounded-xl border border-orange-500/40 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/30"
                        >
                            {t('restorePostBatchAcknowledge')}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
