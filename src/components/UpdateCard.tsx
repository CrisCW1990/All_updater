import React from 'react';
import type { AppUpdate } from '../shared/types';
import { clsx } from 'clsx';
import { AlertCircle, ArrowRight, Check, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface UpdateCardProps {
    update: AppUpdate;
    isSelected: boolean;
    onToggle: () => void;
}

export const UpdateCard: React.FC<UpdateCardProps> = ({ update, isSelected, onToggle }) => {
    const { t } = useLanguage();
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

    return (
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
                {/* Compact Indicator */}
                <div className="py-0.5">
                    <div className={clsx(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        isInapplicable
                            ? "bg-md-surface-dim text-md-on-surface-variant/40"
                            : isSelected
                                ? "bg-md-primary text-md-on-primary"
                                : "bg-md-surface-container-highest text-transparent group-hover:bg-md-surface-container-highest/80"
                    )}>
                        {isInapplicable ? <AlertCircle className="h-3 w-3" /> : <Check className={clsx("h-3 w-3 stroke-[3px] transition-opacity", isSelected ? "opacity-100" : "opacity-0")} />}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-8 w-8 rounded-lg bg-md-primary/10 flex items-center justify-center text-md-primary shrink-0">
                            <Box className="h-4 w-4" />
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

                    <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-[9px] font-bold text-md-on-surface-variant/60 truncate">
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
                                <span className={clsx(
                                    "font-black text-xs",
                                    isSelected ? "text-md-on-secondary-container" : "text-md-primary"
                                )}>
                                    {update.available}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isSelected && (
                <div className="absolute top-0 right-0 h-24 w-24 bg-md-primary/10 blur-2xl rounded-full -mr-12 -mt-12 pointer-events-none" />
            )}
        </motion.div>
    );
};
