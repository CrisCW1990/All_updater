import React, { useState, useEffect } from 'react';
import type { AppUpdate, PackageInfo } from '../shared/types';
import { clsx } from 'clsx';
import { AlertCircle, ArrowRight, Check, Box, Newspaper, ExternalLink, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface UpdateCardProps {
    update: AppUpdate;
    isSelected: boolean;
    onToggle: () => void;
}

export const UpdateCard: React.FC<UpdateCardProps> = ({ update, isSelected, onToggle }) => {
    const { t } = useLanguage();
    const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);
    const [iconError, setIconError] = useState(false);

    const normalizedInstalledVersion = update.version.trim().toLowerCase();
    const isUnknown =
        normalizedInstalledVersion === 'unknown' ||
        normalizedInstalledVersion === '<unknown>' ||
        normalizedInstalledVersion === 'desconocido' ||
        normalizedInstalledVersion === '<desconocido>' ||
        normalizedInstalledVersion === 'desconocida' ||
        normalizedInstalledVersion === '<desconocida>' ||
        normalizedInstalledVersion === '-';
    const isInapplicable = update.previousStatus === 'inapplicable';
    const isManualUninstall = update.previousDetails?.includes('Manual uninstall') || update.previousDetails?.includes('diferente');

    // Auto-fetch icon + info on mount
    useEffect(() => {
        let cancelled = false;
        const doFetch = async () => {
            setLoadingInfo(true);
            try {
                const info = await window.ipcRenderer.invoke('winget:get-package-info', update.id, update.available);
                if (!cancelled) setPackageInfo(info);
            } catch {
                if (!cancelled) setPackageInfo({});
            } finally {
                if (!cancelled) setLoadingInfo(false);
            }
        };
        void doFetch();
        return () => { cancelled = true; };
    }, [update.id, update.available]);

    const hasReleaseInfo = packageInfo?.releaseNotes || packageInfo?.releaseNotesUrl;

    const handleWhatsNew = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowChangelog(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={isInapplicable ? undefined : onToggle}
                className={clsx(
                    "group relative overflow-hidden rounded-2xl p-4 transition-all duration-200",
                    isInapplicable
                        ? "bg-md-surface-container-highest/40 opacity-50 cursor-default"
                        : isSelected
                            ? "bg-md-secondary-container shadow-md cursor-pointer transform scale-[1.01]"
                            : "bg-md-surface-container-low hover:bg-md-surface-container-high hover:shadow-lg cursor-pointer shadow-sm"
                )}
            >
                <div className="flex items-start gap-3">
                    {/* Checkbox indicator */}
                    <div className="py-0.5">
                        <div className={clsx(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                            isInapplicable
                                ? "bg-md-surface-dim text-md-on-surface-variant/40"
                                : isSelected
                                    ? "bg-md-primary text-md-on-primary"
                                    : "bg-md-surface-container-highest text-transparent group-hover:bg-md-surface-container-highest/80"
                        )}>
                            {isInapplicable
                                ? <AlertCircle className="h-3 w-3" />
                                : <Check className={clsx("h-3 w-3 stroke-[3px] transition-opacity", isSelected ? "opacity-100" : "opacity-0")} />
                            }
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            {/* App icon — auto-loaded on mount, fallback to Box */}
                            <div className="h-8 w-8 rounded-lg bg-md-primary/10 flex items-center justify-center text-md-primary shrink-0 overflow-hidden">
                                {loadingInfo ? (
                                    <Loader2 className="h-4 w-4 animate-spin opacity-40" />
                                ) : packageInfo?.iconUrl && !iconError ? (
                                    <img
                                        src={packageInfo.iconUrl}
                                        alt=""
                                        className="h-full w-full object-contain"
                                        onError={() => setIconError(true)}
                                    />
                                ) : (
                                    <Box className="h-4 w-4" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className={clsx(
                                    "text-sm font-bold tracking-tight truncate leading-tight",
                                    isSelected ? "text-md-on-secondary-container" : "text-md-on-surface"
                                )}>
                                    {update.name}
                                </h3>
                            </div>

                            <span className={clsx(
                                "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                                isSelected ? "bg-md-on-secondary-container/10 text-md-on-secondary-container" : "bg-md-surface-container-highest text-md-on-surface-variant"
                            )}>
                                {update.source || 'winget'}
                            </span>
                        </div>

                        <div className="mb-3">
                            <span className="font-mono text-[9px] font-bold text-md-on-surface-variant/60 truncate block">
                                {update.id}
                            </span>
                        </div>

                        {isInapplicable ? (
                            <div className="flex items-center gap-2 rounded-lg bg-md-error-container px-3 py-2">
                                <AlertCircle className="h-3.5 w-3.5 text-md-on-error-container" />
                                <span className="text-[10px] font-bold uppercase tracking-tight text-md-on-error-container">
                                    {isManualUninstall ? t('updateManualUninstall') : t('updateInapplicable')}
                                </span>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
                                    <div className="flex flex-col gap-0.5 items-start">
                                        <span className={clsx("text-[8px] font-black uppercase tracking-widest opacity-60", isSelected ? "text-md-on-secondary-container" : "text-md-on-surface-variant")}>{t('current')}</span>
                                        <div className={clsx(
                                            "flex items-center gap-1.5 font-bold text-xs",
                                            isUnknown ? "text-md-error" : (isSelected ? "text-md-on-secondary-container" : "text-md-on-surface")
                                        )}>
                                            {isUnknown && <AlertCircle className="h-3 w-3" />}
                                            <span className="truncate max-w-[100px]">
                                                {isUnknown ? t('unknown') : update.version}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={clsx(
                                        "flex items-center justify-center p-1.5 rounded-full",
                                        isSelected ? "bg-md-on-secondary-container/10" : "bg-md-surface-container-highest"
                                    )}>
                                        <ArrowRight className={clsx("h-3 w-3", isSelected ? "text-md-on-secondary-container" : "text-md-outline")} />
                                    </div>

                                    <div className="flex flex-col gap-0.5 items-end">
                                        <span className={clsx("text-[8px] font-black uppercase tracking-widest opacity-60", isSelected ? "text-md-on-secondary-container" : "text-md-on-surface-variant")}>{t('new')}</span>
                                        <span className={clsx("font-black text-xs", isSelected ? "text-md-on-secondary-container" : "text-md-primary")}>
                                            {update.available}
                                        </span>
                                    </div>
                                </div>

                                {/* What's new button */}
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={handleWhatsNew}
                                        className={clsx(
                                            "flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all",
                                            isSelected
                                                ? "bg-md-on-secondary-container/10 text-md-on-secondary-container hover:bg-md-on-secondary-container/20"
                                                : "bg-md-surface-container-highest text-md-on-surface-variant hover:bg-md-primary/10 hover:text-md-primary"
                                        )}
                                    >
                                        <Newspaper className="h-3 w-3" />
                                        {t('whatsNew')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {isSelected && (
                    <div className="absolute top-0 right-0 h-24 w-24 bg-md-primary/10 blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none" />
                )}
            </motion.div>

            {/* Changelog modal */}
            <AnimatePresence>
                {showChangelog && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowChangelog(false)}
                            className="absolute inset-0 bg-md-scrim/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 16 }}
                            className="relative w-full max-w-lg rounded-3xl bg-md-surface-container-high border border-md-outline-variant shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-md-outline-variant/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-md-primary/10 flex items-center justify-center text-md-primary overflow-hidden shrink-0">
                                        {packageInfo?.iconUrl && !iconError ? (
                                            <img src={packageInfo.iconUrl} alt="" className="h-full w-full object-contain" onError={() => setIconError(true)} />
                                        ) : (
                                            <Box className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black uppercase tracking-tight text-md-on-surface">{update.name}</h3>
                                        <p className="text-[10px] font-bold text-md-primary opacity-70 uppercase tracking-widest">{t('whatsNewVersion')} {update.available}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowChangelog(false)}
                                    className="rounded-full p-1.5 hover:bg-md-on-surface/10 transition-colors"
                                >
                                    <X className="h-5 w-5 text-md-on-surface-variant" />
                                </button>
                            </div>

                            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-4">
                                {loadingInfo ? (
                                    <div className="flex items-center justify-center gap-3 py-10">
                                        <Loader2 className="h-5 w-5 animate-spin text-md-primary" />
                                        <span className="text-[10px] font-bold text-md-on-surface-variant opacity-60 uppercase tracking-widest">{t('whatsNewLoading')}</span>
                                    </div>
                                ) : !hasReleaseInfo ? (
                                    <p className="text-sm font-bold text-md-on-surface-variant opacity-50 uppercase tracking-widest text-center py-10 italic">
                                        {t('whatsNewUnavailable')}
                                    </p>
                                ) : (
                                    <>
                                        {packageInfo?.releaseNotes && (
                                            <pre className="whitespace-pre-wrap text-xs font-mono text-md-on-surface leading-relaxed bg-md-surface-container-highest/50 rounded-2xl p-4 border border-md-outline-variant/30">
                                                {packageInfo.releaseNotes}
                                            </pre>
                                        )}
                                        {packageInfo?.releaseNotesUrl && (
                                            <button
                                                onClick={() => window.ipcRenderer.invoke('system:open-url', packageInfo.releaseNotesUrl!)}
                                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-md-primary hover:underline"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                                {t('whatsNewOpenUrl')}
                                            </button>
                                        )}
                                    </>
                                )}
                                {packageInfo?.homepage && (
                                    <button
                                        onClick={() => window.ipcRenderer.invoke('system:open-url', packageInfo.homepage!)}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-md-on-surface-variant hover:text-md-primary transition-colors"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        {t('whatsNewHomepage')}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
