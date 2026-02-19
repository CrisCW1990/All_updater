import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Languages, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '../context/LanguageContext';

interface OnboardingModalProps {
    onClose: (dontShowAgain: boolean) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
    const { t, setLanguage } = useLanguage();
    // Start at language step, then welcome
    const [step, setStep] = useState<'language' | 'welcome'>('language');
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const startRef = useRef<HTMLButtonElement>(null);

    const handleLanguageSelect = (lang: 'en' | 'es') => {
        setLanguage(lang);
        setStep('welcome');
    };

    useEffect(() => {
        if (step !== 'welcome') return;
        startRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                onClose(dontShowAgain);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [step, dontShowAgain, onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
                <div className="relative w-full max-w-lg">
                    <AnimatePresence mode="wait">
                        {step === 'language' && (
                            <motion.div
                                key="step-language"
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                                className="relative overflow-hidden rounded-[28px] bg-md-surface-container-high p-8 shadow-2xl text-center"
                            >
                                <div className="mb-6 flex justify-center">
                                    <div className="p-4 rounded-[20px] bg-md-primary-container text-md-on-primary-container">
                                        <Languages className="h-10 w-10" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-md-on-surface mb-2 tracking-tight">
                                    Choose Your Dialect
                                </h2>
                                <p className="text-sm font-bold text-md-on-surface-variant mb-8 opacity-70">
                                    How shall I deliver my judgments?
                                </p>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <button
                                        onClick={() => handleLanguageSelect('en')}
                                        className="flex flex-col items-center justify-center gap-4 rounded-[24px] bg-md-surface-variant/30 p-8 hover:bg-md-primary/10 hover:shadow-md transition-all group"
                                    >
                                        <span className="text-4xl group-hover:scale-110 transition-transform">🇺🇸</span>
                                        <span className="text-base font-black text-md-on-surface">English</span>
                                    </button>
                                    <button
                                        onClick={() => handleLanguageSelect('es')}
                                        className="flex flex-col items-center justify-center gap-4 rounded-[24px] bg-md-surface-variant/30 p-8 hover:bg-md-primary/10 hover:shadow-md transition-all group"
                                    >
                                        <span className="text-4xl group-hover:scale-110 transition-transform">🇪🇸</span>
                                        <span className="text-base font-black text-md-on-surface">Español</span>
                                    </button>
                                </div>

                                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-md-primary opacity-50">
                                    REVERSIBLE OPERATION
                                </p>
                            </motion.div>
                        )}

                        {step === 'welcome' && (
                            <motion.div
                                key="step-welcome"
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                                className="relative overflow-hidden rounded-[28px] bg-md-surface-container-high p-8 shadow-2xl text-center"
                            >
                                <div className="mb-6 flex justify-center">
                                    <div className="p-4 rounded-[20px] bg-md-secondary-container text-md-on-secondary-container">
                                        <ShieldCheck className="h-10 w-10" />
                                    </div>
                                </div>

                                <h2 className="text-3xl font-black text-md-on-surface mb-4 tracking-tight">
                                    {t('onboardingTitle')}
                                </h2>

                                <p className="mb-8 text-base font-medium text-md-on-surface-variant leading-relaxed opacity-90">
                                    {t('onboardingBody')}
                                </p>

                                <div className="space-y-6">
                                    {/* M3 Checkbox Implementation */}
                                    <label className="flex items-center justify-center gap-4 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={dontShowAgain}
                                                onChange={() => setDontShowAgain(!dontShowAgain)}
                                                className="peer sr-only"
                                            />
                                            {/* Checkbox with Surface/Primary colors - improved visibility */}
                                            <div className={clsx(
                                                "h-6 w-6 rounded-md transition-all flex items-center justify-center border-2",
                                                dontShowAgain
                                                    ? "bg-md-primary border-md-primary text-md-on-primary"
                                                    : "bg-md-surface-variant border-md-outline-variant text-transparent"
                                            )}>
                                                <Check className={clsx("h-4 w-4 stroke-[4px] transition-opacity", dontShowAgain ? "opacity-100" : "opacity-0")} />
                                            </div>
                                            <div className="absolute inset-[-12px] rounded-full bg-md-primary/0 transition-colors peer-hover:bg-md-primary/10 active:peer-hover:bg-md-primary/20" />
                                        </div>
                                        <span className="text-sm font-black text-md-on-surface-variant group-hover:text-md-on-surface transition-colors">
                                            {t('onboardingDontShow')}
                                        </span>
                                    </label>

                                    <button
                                        onClick={() => onClose(dontShowAgain)}
                                        ref={startRef}
                                        className="w-full px-8 py-4 rounded-full bg-md-primary text-md-on-primary font-black text-lg shadow-lg hover:shadow-md-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                                    >
                                        {t('onboardingBtn')}
                                    </button>
                                </div>

                                <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-md-secondary opacity-50">
                                    DIRECTIVE INITIATED
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
