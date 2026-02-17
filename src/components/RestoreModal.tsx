import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Zap, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RestoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void; // Proceed with restore
    onSkip: () => void;    // Proceed without restore
}

export const RestoreModal: React.FC<RestoreModalProps> = ({ isOpen, onClose, onConfirm, onSkip }) => {
    const { t } = useLanguage();
    const confirmRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        confirmRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            } else if (event.key === 'Enter') {
                event.preventDefault();
                onConfirm();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose, onConfirm]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-white/10 overflow-hidden"
                >
                    <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-8 w-8 text-white/90" />
                            <div>
                                <h2 className="text-xl font-bold">{t('safetyFirst')}</h2>
                                <p className="text-white/80 text-sm">{t('restoreAsk')}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-white/20 p-1 hover:bg-white/30 text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <p className="text-gray-900 dark:text-gray-300">
                            {t('restoreDesc')}
                        </p>

                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
                            <div className="flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-800 dark:text-amber-200">
                                    {t('restoreNote')}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button
                                onClick={onSkip}
                                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 p-4 hover:border-slate-400 hover:bg-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all"
                            >
                                <Zap className="h-6 w-6 text-slate-500 group-hover:text-slate-900 dark:text-gray-500 dark:group-hover:text-gray-300" />
                                <div className="text-center">
                                    <span className="block font-semibold text-slate-800 dark:text-gray-200">{t('skipUpdate')}</span>
                                    <span className="text-xs text-slate-800 dark:text-sky-300">{t('skipRisk')}</span>
                                </div>
                            </button>

                            <button
                                onClick={onConfirm}
                                ref={confirmRef}
                                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-50 p-4 ring-1 ring-blue-500 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-all"
                            >
                                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                <div className="text-center">
                                    <span className="block font-semibold text-blue-700 dark:text-blue-300">{t('createUpdate')}</span>
                                    <span className="text-xs text-blue-700 dark:text-blue-400/70">{t('recommended')}</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
