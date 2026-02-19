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
                    className="w-full max-w-lg rounded-[28px] bg-md-surface-container-high shadow-2xl overflow-hidden"
                >
                    <div className="relative bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="h-8 w-8 text-white/90" />
                            <div>
                                <h2 className="text-xl font-black tracking-tight">{t('restoreDecisionTitle')}</h2>
                                <p className="text-white/85 text-sm font-medium">{t('restoreDecisionDesc')}</p>
                            </div>
                        </div>
                        <button onClick={onCancel} className="absolute top-4 right-4 rounded-full bg-white/20 p-1 hover:bg-white/30 text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="rounded-2xl bg-md-error-container p-4">
                            <div className="flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-md-on-error-container shrink-0 mt-0.5" />
                                <p className="text-sm font-bold text-md-on-error-container">{message}</p>
                            </div>
                        </div>

                        {details && (
                            <div className="rounded-xl bg-md-surface-container-highest p-3 text-xs font-mono text-md-on-surface-variant overflow-x-auto">
                                {details}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={onCancel}
                                className="rounded-full bg-md-surface-variant/30 px-4 py-3 text-sm font-black text-md-on-surface-variant transition-colors hover:bg-md-surface-variant/50"
                            >
                                {t('restoreDecisionCancel')}
                            </button>
                            <button
                                onClick={onContinue}
                                ref={continueRef}
                                className="rounded-full bg-md-error px-4 py-3 text-sm font-black text-md-on-error transition-colors hover:bg-md-error/90 shadow-lg hover:shadow-xl"
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
