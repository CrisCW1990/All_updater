import React, { createContext, useContext, useState, useEffect } from 'react';
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

    useEffect(() => {
        const loadLang = async () => {
            const saved = await window.ipcRenderer.invoke('settings:get', 'language');
            if (saved) setLangState(saved);
        };
        loadLang();
    }, []);

    const setLanguage = (lang: Language) => {
        setLangState(lang);
        window.ipcRenderer.invoke('settings:set', 'language', lang);
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
