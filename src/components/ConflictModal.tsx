import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useEffect, useRef } from 'react';

interface ConflictModalProps {
    appName: string;
    onRetry: () => void;
    onSkip: () => void;
}

export function ConflictModal({ appName, onRetry, onSkip }: ConflictModalProps) {
    const { t } = useLanguage();
    const retryRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        retryRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onSkip();
            } else if (event.key === 'Enter') {
                event.preventDefault();
                onRetry();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onRetry, onSkip]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onSkip}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-md-surface-container-high shadow-2xl"
            >
                <div className="bg-md-error-container p-6 text-md-on-error-container flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-md-error text-md-on-error">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight">{t('conflictTitle')}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Critical Process Block</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <p className="text-base font-medium text-md-on-surface-variant leading-relaxed">
                        {t('conflictBody').replace('{app}', appName)}
                    </p>

                    <div className="rounded-2xl bg-md-secondary-container/30 p-4">
                        <p className="text-xs font-bold text-md-on-secondary-container opacity-90 leading-relaxed">
                            {t('conflictTip')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onRetry}
                            ref={retryRef}
                            className="flex items-center justify-center gap-3 rounded-full bg-md-primary px-6 py-4 font-black text-md-on-primary shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <RefreshCw className="h-5 w-5" />
                            {t('retry')}
                        </button>

                        <button
                            onClick={onSkip}
                            className="flex items-center justify-center gap-3 rounded-full bg-md-surface-variant/50 px-6 py-4 font-black text-md-on-surface-variant transition-all hover:bg-md-surface-variant hover:text-md-on-surface active:scale-95"
                        >
                            <Play className="h-5 w-5" />
                            {t('skip')}
                        </button>
                    </div>
                </div>

                <p className="pb-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-md-error opacity-40">
                    PENDING USER DECISION
                </p>
            </motion.div>
        </div>
    );
}
