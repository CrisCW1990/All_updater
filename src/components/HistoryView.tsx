import React, { useEffect, useState } from 'react';
import type { HistoryItem } from '../shared/types';
import { clsx } from 'clsx';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HistoryView: React.FC = () => {
    const { t } = useLanguage();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    useEffect(() => {
        const loadHistory = async () => {
            const data = await window.ipcRenderer.invoke('history:get');
            setHistory(data);
            setLoading(false);
        };
        loadHistory();
    }, []);

    const handleClearHistory = async () => {
        await window.ipcRenderer.invoke('history:clear');
        window.location.reload();
    };

    const getSatiricalStatus = (item: HistoryItem) => {
        if (item.status === 'success') return t('historySuccess');
        if (item.status === 'inapplicable') return t('historyInapplicable');
        if (item.status === 'skipped') return t('historySkipped');
        if (item.status === 'reboot') return t('historyReboot');
        if (item.status === 'in-use') return t('historyInUse');
        return item.details || t('historyBroken');
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    // History check removed to allow header rendering

    return (
        <div className="space-y-6 relative">
            {showClearConfirm && (
                <div className="absolute top-0 right-0 left-0 z-50 flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-red-200 dark:border-red-900/50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{t('resetAppConfirm')}</h4>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{t('resetAppMessage')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowClearConfirm(false)}
                            className="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={handleClearHistory}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors"
                        >
                            {t('confirm')}
                        </button>
                    </div>
                </div>
            )}

            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white transition-colors">{t('history')}</h2>
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-400">
                        {t('historyRecord')}
                    </p>
                </div>
                {!showClearConfirm && (
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors font-medium border border-red-200 dark:border-transparent"
                    >
                        {t('resetApp')}
                    </button>
                )}
            </header>

            {history.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-4 opacity-50 text-slate-600 dark:text-slate-400">
                    <Clock className="h-16 w-16" />
                    <h2 className="text-xl font-bold">{t('historyEmpty')}</h2>
                    <p>{t('historyEmptySmall')}</p>
                </div>
            ) : (
                <div className="relative space-y-10 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent dark:before:via-white/5">
                    {history.map((item, idx) => (
                        <div key={idx} className="relative flex items-start group">
                            <div className={clsx(
                                "absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-4 transition-all duration-300",
                                item.status === 'success' ? "bg-green-500 border-green-500/20 text-white" :
                                    item.status === 'inapplicable' ? "bg-amber-500 border-amber-500/20 text-white" :
                                        "bg-red-500 border-red-500/20 text-white"
                            )}>
                                {item.status === 'success' && <CheckCircle2 className="h-5 w-5" />}
                                {item.status === 'inapplicable' && <AlertCircle className="h-5 w-5" />}
                                {item.status === 'failed' && <XCircle className="h-5 w-5" />}
                                {item.status === 'skipped' && <AlertCircle className="h-5 w-5 opacity-70" />}
                            </div>

                            <div className="ml-16 w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10 transition-all duration-300 group-hover:shadow-md dark:group-hover:bg-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-black dark:text-white">{item.appName}</h3>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-slate-400">
                                        <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                        {new Date(item.date).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-slate-400">
                                    <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold dark:bg-white/10 uppercase text-gray-900 dark:text-slate-300">
                                        {item.previousVersion ? `v${item.previousVersion} -> v${item.version}` : `v${item.version}`}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-700" />
                                    <span className={clsx(
                                        "font-medium italic",
                                        item.status === 'success' ? "text-green-600 dark:text-green-400" :
                                            item.status === 'inapplicable' ? "text-amber-600 dark:text-amber-400" :
                                                "text-red-600 dark:text-red-400"
                                    )}>
                                        {getSatiricalStatus(item)}
                                    </span>
                                </div>
                                {item.details && (
                                    <div className="mt-3 p-3 rounded bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto">
                                        {item.details}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
