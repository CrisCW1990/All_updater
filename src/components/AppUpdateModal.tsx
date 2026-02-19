import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpCircle, Download, ExternalLink, RefreshCw, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { AppVersionCheckResult } from '../shared/types';

interface AppUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    updateInfo: AppVersionCheckResult | null;
    onDownload: () => void;
    downloading: boolean;
    progress: number | null;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
    isOpen,
    onClose,
    updateInfo,
    onDownload,
    downloading,
    progress
}) => {
    const { t } = useLanguage();

    if (!updateInfo) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-md-scrim/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-md-surface-container-high shadow-2xl border border-md-outline-variant"
                    >
                        {/* Header Decor */}
                        <div className="relative h-32 bg-md-primary flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-white/20 blur-3xl animate-pulse" />
                                <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-white/20 blur-3xl animate-pulse delay-1000" />
                            </div>
                            <div className="relative p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-inner">
                                <ArrowUpCircle className="h-10 w-10 text-md-on-primary" />
                            </div>

                            {/* Standard Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 rounded-full bg-white/20 p-1.5 hover:bg-white/30 text-white transition-colors"
                                title={t('troubleshootingClose')}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-md-on-surface">
                                    {t('appUpdateAvailable')}
                                </h2>
                                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[.25em] text-md-primary opacity-60">
                                    <span>{t('appUpdateCurrent')}: v{updateInfo.currentVersion}</span>
                                    <span className="opacity-30">|</span>
                                    <span>{t('appUpdateLatest')}: v{updateInfo.latestVersion}</span>
                                </div>
                            </div>

                            <p className="text-xs font-bold leading-relaxed text-md-on-surface-variant opacity-70 uppercase tracking-widest text-center">
                                {t('appUpdatePrivacyNote')}
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={onDownload}
                                    disabled={downloading || !updateInfo.assetUrl}
                                    className="relative group flex items-center justify-center gap-4 overflow-hidden rounded-full bg-md-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-md-on-primary shadow-xl shadow-md-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale disabled:opacity-50"
                                >
                                    {downloading ? (
                                        <>
                                            <RefreshCw className="h-5 w-5 animate-spin" />
                                            <span>{t('appUpdateDownloading')} {progress !== null ? `${progress}%` : ''}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-5 w-5" />
                                            <span>{t('appUpdateDownload')}</span>
                                        </>
                                    )}
                                </button>

                                <div className="flex gap-3">
                                    {updateInfo.releaseUrl && (
                                        <button
                                            onClick={() => window.ipcRenderer.invoke('system:open-url', updateInfo.releaseUrl!)}
                                            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-md-surface-container-highest px-3 py-4 text-[10px] font-black uppercase tracking-widest text-md-on-surface-variant transition-all hover:bg-md-primary/10 hover:text-md-primary border border-md-outline-variant/30 text-center"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            {t('appUpdateOpenRelease')}
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="flex-1 rounded-2xl border border-md-outline px-3 py-4 text-[10px] font-black uppercase tracking-widest text-md-on-surface-variant transition-all hover:bg-md-error/5 hover:text-md-error hover:border-md-error/30 text-center"
                                    >
                                        {t('troubleshootingClose')}
                                    </button>
                                </div>
                            </div>

                            {downloading && progress !== null && (
                                <div className="space-y-1">
                                    <div className="h-1 w-full overflow-hidden rounded-full bg-md-primary/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-md-primary transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
