import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../shared/translations';
import type { Language, TranslationKey } from '../shared/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLangState] = useState<Language>('en');
    const saveAttemptRef = useRef(0);

    useEffect(() => {
        const loadLang = async () => {
            try {
                const saved = await window.ipcRenderer.invoke('settings:get', 'language');
                if (saved === 'en' || saved === 'es') {
                    setLangState(saved);
                }
            } catch (error) {
                console.error('[LanguageContext] Failed to load language:', error);
            }
        };
        void loadLang();
    }, []);

    const setLanguage = (lang: Language) => {
        const previous = language;
        const saveAttempt = ++saveAttemptRef.current;
        setLangState(lang);
        void window.ipcRenderer.invoke('settings:set', 'language', lang).catch((error) => {
            if (saveAttempt !== saveAttemptRef.current) return;
            console.error('[LanguageContext] Failed to persist language:', error);
            setLangState(previous);
        });
    };

    const t = (key: TranslationKey): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
