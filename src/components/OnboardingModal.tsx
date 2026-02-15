import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OnboardingModalProps {
    onClose: (dontShowAgain: boolean) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
    const { t, setLanguage } = useLanguage();
    // Start at language step, then welcome
    const [step, setStep] = useState<'language' | 'welcome'>('language');
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleLanguageSelect = (lang: 'en' | 'es') => {
        setLanguage(lang);
        setStep('welcome');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
                <div className="relative w-full max-w-lg">
                    <AnimatePresence mode="wait">
                        {step === 'language' && (
                            <motion.div
                                key="step-language"
                                initial={{ scale: 0.9, opacity: 0, x: -20 }}
                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                exit={{ scale: 0.9, opacity: 0, x: 20 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
                            >
                                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none" />
                                <div className="relative p-8 flex flex-col items-center text-center">
                                    <h2 className="mb-8 text-2xl font-bold text-white tracking-tight">
                                        Select Language / Seleccione Idioma
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                                        <button
                                            onClick={() => handleLanguageSelect('en')}
                                            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-800 p-6 border border-slate-700 hover:bg-slate-700 hover:border-blue-500 hover:scale-[1.02] transition-all group"
                                        >
                                            <span className="text-3xl">🇺🇸</span>
                                            <span className="text-lg font-bold text-white group-hover:text-blue-400">English</span>
                                        </button>
                                        <button
                                            onClick={() => handleLanguageSelect('es')}
                                            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-800 p-6 border border-slate-700 hover:bg-slate-700 hover:border-blue-500 hover:scale-[1.02] transition-all group"
                                        >
                                            <span className="text-3xl">🇪🇸</span>
                                            <span className="text-lg font-bold text-white group-hover:text-blue-400">Español</span>
                                        </button>
                                    </div>

                                    <p className="text-xs text-slate-500">
                                        You can change this later / Puede cambiarlo después
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 'welcome' && (
                            <motion.div
                                key="step-welcome"
                                initial={{ scale: 0.9, opacity: 0, x: 20 }}
                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                exit={{ scale: 0.9, opacity: 0, x: -20 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
                            >
                                {/* Decorative Header Background */}
                                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none" />

                                <div className="relative p-8 flex flex-col items-center text-center">

                                    {/* Icon */}
                                    <div className="mb-6 rounded-full bg-blue-500/20 p-4 ring-1 ring-blue-500/30">
                                        <Info className="h-10 w-10 text-blue-400" />
                                    </div>

                                    {/* Title */}
                                    <h2 className="mb-4 text-2xl font-bold text-white tracking-tight">
                                        {t('onboardingTitle')}
                                    </h2>

                                    {/* Body Text */}
                                    <p className="mb-8 text-base text-slate-300 leading-relaxed max-w-md">
                                        {t('onboardingBody')}
                                    </p>

                                    {/* Checkbox */}
                                    <div
                                        className="mb-8 flex items-center gap-3 cursor-pointer group"
                                        onClick={() => setDontShowAgain(!dontShowAgain)}
                                    >
                                        <div className={`
                                            flex h-5 w-5 items-center justify-center rounded border transition-all duration-200
                                            ${dontShowAgain
                                                ? 'border-blue-500 bg-blue-500 text-white'
                                                : 'border-slate-600 bg-slate-800/50 group-hover:border-slate-500'}
                                        `}>
                                            {dontShowAgain && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                                        </div>
                                        <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 select-none">
                                            {t('onboardingDontShow')}
                                        </span>
                                    </div>

                                    {/* Button */}
                                    <button
                                        onClick={() => onClose(dontShowAgain)}
                                        className="w-full max-w-xs rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98]"
                                    >
                                        {t('onboardingBtn')}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
