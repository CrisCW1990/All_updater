import React from 'react';
import type { AppUpdate } from '../shared/types';
import { clsx } from 'clsx';
import { AlertCircle, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface UpdateCardProps {
    update: AppUpdate;
    isSelected: boolean;
    onToggle: () => void;
}

export const UpdateCard: React.FC<UpdateCardProps> = ({ update, isSelected, onToggle }) => {
    const { t } = useLanguage();
    const isUnknown = update.version === 'Unknown' || update.version === '<unknown>';
    const isInapplicable = update.previousStatus === 'inapplicable';
    const isManualUninstall = update.previousDetails?.includes('Manual uninstall') || update.previousDetails?.includes('diferente');

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={isInapplicable ? undefined : onToggle}
            className={clsx(
                "group relative overflow-hidden rounded-xl border p-4 shadow-sm transition-all hover:shadow-md",
                isInapplicable
                    ? "cursor-default border-amber-300 bg-amber-50/50 dark:border-amber-500/30 dark:bg-amber-900/10"
                    : isSelected
                        ? "cursor-pointer border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-900/10"
                        : "cursor-pointer border-gray-300 bg-white hover:border-blue-500 dark:border-white/5 dark:bg-black/20 dark:hover:border-white/10 dark:hover:bg-black/30"
            )}
        >
            <div className="flex items-center gap-4">
                {/* Checkbox Area */}
                <div className={clsx(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all",
                    isInapplicable
                        ? "border-amber-500/50 text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400"
                        : isSelected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-gray-400 bg-transparent text-transparent group-hover:border-blue-500 dark:border-gray-600"
                )}>
                    {isInapplicable ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" strokeWidth={3} />}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-black dark:text-gray-100">{update.name}</h3>
                        {/* Source badge */}
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:bg-white/10 dark:text-gray-400">
                            {update.source || 'winget'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-400">
                        <span className="font-mono text-xs font-bold">{update.id}</span>
                    </div>

                    {isInapplicable ? (
                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
                            {isManualUninstall ? t('updateManualUninstall') : t('updateInapplicable')}
                        </div>
                    ) : (
                        <div className="mt-3 flex items-center gap-4 text-sm">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-600 dark:text-slate-500">{t('current')}</span>
                                <span className={clsx("font-bold text-sm", isUnknown ? "text-amber-700" : "text-black dark:text-gray-300")}>
                                    {isUnknown ? (
                                        <span className="flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" /> {t('unknown')}
                                        </span>
                                    ) : update.version}
                                </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-600 dark:text-slate-500">{t('new')}</span>
                                <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">{update.available}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
