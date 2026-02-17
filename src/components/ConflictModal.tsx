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
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800 border-2 border-amber-500"
            >
                <div className="bg-amber-500 p-4 text-white flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6" />
                    <h3 className="text-lg font-bold">{t('conflictTitle')}</h3>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-slate-900 dark:text-sky-200">
                        {t('conflictBody').replace('{app}', appName)}
                    </p>

                    <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                            {t('conflictTip')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={onRetry}
                            ref={retryRef}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
                        >
                            <RefreshCw className="h-5 w-5" />
                            {t('retry')}
                        </button>

                        <button
                            onClick={onSkip}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-sky-200 dark:hover:bg-slate-700 active:scale-95"
                        >
                            <Play className="h-5 w-5" />
                            {t('skip')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
