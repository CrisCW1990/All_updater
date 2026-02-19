import React, { useEffect, useState } from 'react';
import type { HistoryItem } from '../shared/types';
import { clsx } from 'clsx';
import { Clock, CheckCircle2, XCircle, AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HistoryViewProps {
    onResetApp?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onResetApp }) => {
    const { t, setLanguage } = useLanguage();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [filter, setFilter] = useState<'all' | 'success' | 'issues' | 'failed' | 'inUse' | 'inapplicable' | 'reboot' | 'security'>('all');

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await window.ipcRenderer.invoke('history:get');
                setHistory(data);
            } catch (error) {
                console.error('[HistoryView] Failed to load history:', error);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };
        void loadHistory();
    }, []);

    const handleClearHistory = async () => {
        try {
            await window.ipcRenderer.invoke('history:clear');
            setLanguage('en');
            setHistory([]);
            setShowClearConfirm(false);
            onResetApp?.();
        } catch (error) {
            console.error('[HistoryView] Failed to clear history:', error);
        }
    };

    const getSatiricalStatus = (item: HistoryItem) => {
        if (item.status === 'success') return t('historySuccess');
        if (item.status === 'inapplicable') return t('historyInapplicable');
        if (item.status === 'skipped') return t('historySkipped');
        if (item.status === 'reboot') return t('historyReboot');
        if (item.status === 'in-use') return t('historyInUse');
        if (item.status === 'security-error') return t('statusSecurity');
        return item.details || t('historyBroken');
    };

    const formatVersionValue = (version: string | undefined) => {
        if (!version) return '-';
        const normalized = version.trim().toLowerCase();
        const isUnknown =
            normalized === 'unknown' ||
            normalized === '<unknown>' ||
            normalized === 'desconocido' ||
            normalized === '<desconocido>' ||
            normalized === 'desconocida' ||
            normalized === '<desconocida>' ||
            normalized === '-';

        return isUnknown ? version : `v${version}`;
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    // History check removed to allow header rendering
    const filteredHistory = history.filter((item) => {
        if (filter === 'all') return true;
        if (filter === 'success') return item.status === 'success';
        if (filter === 'issues') return item.status === 'failed' || item.status === 'inapplicable' || item.status === 'in-use' || item.status === 'skipped';
        if (filter === 'failed') return item.status === 'failed';
        if (filter === 'inUse') return item.status === 'in-use';
        if (filter === 'inapplicable') return item.status === 'inapplicable';
        if (filter === 'reboot') return item.status === 'reboot';
        if (filter === 'security') return item.status === 'security-error';
        return true;
    });

    return (
        <div className="space-y-6 relative">
            {showClearConfirm && (
                <div className="absolute top-0 right-0 left-0 z-50 flex flex-col gap-3 p-4 bg-md-surface-container-high rounded-lg shadow-xl border border-md-error/30 animate-in fade-in slide-in-from-top-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-md-error-container rounded-full text-md-error">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-black uppercase tracking-tight text-md-on-surface text-sm">{t('resetAppConfirm')}</h4>
                            <p className="text-xs font-bold text-md-on-surface-variant opacity-70 uppercase tracking-widest">{t('resetAppMessage')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                            onClick={() => setShowClearConfirm(false)}
                            className="px-3 py-1.5 text-xs font-black uppercase tracking-widest text-md-on-surface-variant hover:bg-md-on-surface/5 rounded-md transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={handleClearHistory}
                            className="px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white bg-md-error hover:bg-md-error/90 rounded-md shadow-sm transition-colors"
                        >
                            {t('confirm')}
                        </button>
                    </div>
                </div>
            )}

            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-md-on-surface transition-colors">{t('history')}</h2>
                    <p className="text-sm font-black text-md-on-surface-variant opacity-70 uppercase tracking-widest">
                        {t('historyRecord')}
                    </p>
                </div>
                {!showClearConfirm && (
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="text-[10px] px-4 py-2 rounded-full bg-md-error-container text-md-on-error-container hover:bg-md-error-container/80 transition-all font-black uppercase tracking-widest border border-md-error/20"
                    >
                        {t('resetApp')}
                    </button>
                )}
            </header>

            {history.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'all', label: t('historyFilterAll') },
                        { id: 'success', label: t('historyFilterSuccess') },
                        { id: 'issues', label: t('historyFilterIssues') },
                        { id: 'failed', label: t('historyFilterFailed') },
                        { id: 'inUse', label: t('historyFilterInUse') },
                        { id: 'inapplicable', label: t('historyFilterInapplicable') },
                        { id: 'reboot', label: t('historyFilterReboot') },
                        { id: 'security', label: t('historyFilterSecurity') }
                    ].map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setFilter(option.id as typeof filter)}
                            className={clsx(
                                "rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === option.id
                                    ? "border-md-primary bg-md-primary text-md-on-primary shadow-md"
                                    : "border-md-outline-variant bg-md-surface-container-low text-md-on-surface-variant hover:bg-md-surface-container-high hover:text-md-on-surface"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}

            {history.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-4 text-md-on-surface-variant/40">
                    <Clock className="h-16 w-16" strokeWidth={1.5} />
                    <div className="text-center">
                        <h2 className="text-xl font-black uppercase tracking-tight text-md-on-surface opacity-60">{t('historyEmpty')}</h2>
                        <p className="text-sm font-bold uppercase tracking-[0.2em]">{t('historyEmptySmall')}</p>
                    </div>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-2 text-md-on-surface-variant/40">
                    <AlertCircle className="h-10 w-10" />
                    <p className="text-sm font-black uppercase tracking-widest">{t('historyEmptySmall')}</p>
                </div>
            ) : (
                <div className="relative space-y-10 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-md-outline-variant/30 before:to-transparent">
                    {filteredHistory.map((item, idx) => (
                        <div key={idx} className="relative flex items-start group">
                            {/* Icon Indicator */}
                            <div className={clsx(
                                "absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-4 transition-all duration-300 shadow-sm",
                                item.status === 'success' ? "bg-emerald-500 border-emerald-500/20 text-white" :
                                    item.status === 'reboot' ? "bg-md-primary border-md-primary/20 text-md-on-primary" :
                                        item.status === 'in-use' ? "bg-amber-500 border-amber-500/20 text-white" :
                                            item.status === 'inapplicable' ? "bg-md-surface-variant border-md-outline-variant text-md-on-surface-variant" :
                                                item.status === 'security-error' ? "bg-orange-600 border-orange-500/20 text-white" :
                                                    "bg-md-error border-md-error/20 text-md-on-error"
                            )}>
                                {item.status === 'success' && <CheckCircle2 className="h-5 w-5" />}
                                {item.status === 'reboot' && <RefreshCw className="h-5 w-5" />}
                                {item.status === 'in-use' && <AlertTriangle className="h-5 w-5" />}
                                {item.status === 'inapplicable' && <AlertCircle className="h-5 w-5" />}
                                {item.status === 'security-error' && <AlertTriangle className="h-5 w-5" />}
                                {item.status === 'failed' && <XCircle className="h-5 w-5" />}
                                {item.status === 'skipped' && <AlertCircle className="h-5 w-5 opacity-70" />}
                            </div>

                            <div className="ml-16 w-full rounded-2xl bg-md-surface-container-low p-6 shadow-sm border border-md-outline-variant transition-all duration-300 group-hover:shadow-md group-hover:bg-md-surface-container-high group-hover:border-md-primary/20">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-black uppercase tracking-tight text-md-on-surface truncate">{item.appName}</h3>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-md-on-surface-variant opacity-60">
                                        <Clock className="h-3 w-3 text-md-primary" />
                                        {new Date(item.date).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-xs">
                                    <span className="rounded-full bg-md-surface-variant px-3 py-1 text-[9px] font-black uppercase tracking-widest text-md-on-surface-variant">
                                        {item.previousVersion
                                            ? `${formatVersionValue(item.previousVersion)} → ${formatVersionValue(item.version)}`
                                            : formatVersionValue(item.version)}
                                    </span>
                                    <div className={clsx(
                                        "font-black uppercase tracking-widest text-[10px] italic",
                                        item.status === 'success' ? "text-emerald-500" :
                                            item.status === 'reboot' ? "text-md-primary" :
                                                item.status === 'in-use' ? "text-amber-500" :
                                                    item.status === 'inapplicable' ? "text-md-on-surface-variant opacity-60" :
                                                        item.status === 'security-error' ? "text-orange-600" :
                                                            "text-md-error"
                                    )}>
                                        {getSatiricalStatus(item)}
                                    </div>
                                </div>
                                {item.details && (
                                    <div className="mt-4 rounded-xl border border-md-outline-variant bg-md-surface-container-highest/50 p-4 text-[10px] font-mono text-md-on-surface-variant/80 overflow-x-auto">
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
