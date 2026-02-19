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
                    className="w-full max-w-lg rounded-[28px] bg-md-surface-container-high shadow-2xl overflow-hidden"
                >
                    <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-8 w-8 text-white/90" />
                            <div>
                                <h2 className="text-xl font-black tracking-tight">{t('safetyFirst')}</h2>
                                <p className="text-white/80 text-sm font-medium">{t('restoreAsk')}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="absolute top-4 right-4 rounded-full bg-white/20 p-1 hover:bg-white/30 text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <p className="text-md-on-surface-variant font-medium leading-relaxed">
                            {t('restoreDesc')}
                        </p>

                        <div className="rounded-2xl bg-amber-500/10 p-4">
                            <div className="flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div className="text-sm font-bold text-amber-900 dark:text-amber-100 opacity-90">
                                    {t('restoreNote')}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button
                                onClick={onSkip}
                                className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-md-surface-variant/30 p-4 hover:bg-md-surface-variant/50 transition-all active:scale-95"
                            >
                                <Zap className="h-6 w-6 text-md-on-surface-variant opacity-60 group-hover:opacity-100" />
                                <div className="text-center">
                                    <span className="block font-black text-md-on-surface-variant">{t('skipUpdate')}</span>
                                    <span className="text-xs font-bold text-md-on-surface-variant opacity-50">{t('skipRisk')}</span>
                                </div>
                            </button>

                            <button
                                onClick={onConfirm}
                                ref={confirmRef}
                                className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-md-primary-container p-4 hover:bg-md-primary/20 transition-all active:scale-95 shadow-sm hover:shadow-md"
                            >
                                <ShieldCheck className="h-6 w-6 text-md-primary" />
                                <div className="text-center">
                                    <span className="block font-black text-md-on-primary-container">{t('createUpdate')}</span>
                                    <span className="text-xs font-bold text-md-primary opacity-80">{t('recommended')}</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
