import React from 'react';
import { clsx } from 'clsx';
import { LayoutDashboard, History, Moon, Sun, Languages, Info, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import logo from '/icon.ico';
import { TroubleshootingModal } from './TroubleshootingModal';

interface LayoutProps {
    children: React.ReactNode;
    darkMode: boolean;
    toggleDarkMode: () => void;
    activeTab: 'dashboard' | 'history';
    onTabChange: (tab: 'dashboard' | 'history') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleDarkMode, activeTab, onTabChange }) => {
    const { language, setLanguage, t } = useLanguage();
    const [userDataPath, setUserDataPath] = React.useState<string | null>(null);
    const [showTroubleshooting, setShowTroubleshooting] = React.useState(false);

    React.useEffect(() => {
        const fetchPath = async () => {
            try {
                const path = await window.ipcRenderer.invoke('system:get-userdata-path');
                setUserDataPath(path);
            } catch (error) {
                console.error('Failed to get user data path:', error);
            }
        };
        fetchPath();
    }, []);

    return (
        <div className={clsx(
            "flex h-screen w-full overflow-hidden transition-colors duration-500 font-sans selection:bg-md-primary/30",
            darkMode ? "dark bg-[#1a1c1e] text-[#e2e2e6]" : "bg-[#fdfcff] text-[#1a1c1e]"
        )}>

            {/* Ambient Background - Subtle M3 Surfaces */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-md-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-md-secondary/5 blur-[120px]" />
            </div>

            {/* Sidebar - M3 Standard Navigation Drawer (Surface Container Low) */}
            <aside className="relative z-20 flex w-80 flex-col bg-md-surface-container-low px-4 py-6 transition-colors duration-300">
                <div className="flex items-center gap-4 px-4 mb-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-md-primary text-md-on-primary shadow-lg overflow-hidden shrink-0">
                        <img src={logo} alt="Logo" className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-md-on-surface">All Updater</h1>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-md-primary opacity-90">Digital Overlord</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => onTabChange('dashboard')}
                        className={clsx(
                            "flex w-full items-center gap-4 rounded-full px-6 py-4 text-sm font-bold transition-all duration-300",
                            activeTab === 'dashboard'
                                ? "bg-md-secondary-container text-md-on-secondary-container shadow-sm"
                                : "text-md-on-surface-variant hover:bg-md-surface-container-highest hover:text-md-on-surface"
                        )}>
                        <LayoutDashboard className="h-5 w-5" />
                        {t('dashboard')}
                    </button>

                    <button
                        onClick={() => onTabChange('history')}
                        className={clsx(
                            "flex w-full items-center gap-4 rounded-full px-6 py-4 text-sm font-bold transition-all duration-300",
                            activeTab === 'history'
                                ? "bg-md-secondary-container text-md-on-secondary-container shadow-sm"
                                : "text-md-on-surface-variant hover:bg-md-surface-container-highest hover:text-md-on-surface"
                        )}>
                        <History className="h-5 w-5" />
                        {t('history')}
                    </button>

                    <div className="my-6 px-4">
                        <div className="h-px w-full bg-md-outline-variant/20" />
                    </div>

                    <button
                        onClick={() => setShowTroubleshooting(true)}
                        className="flex w-full items-center gap-4 rounded-full px-6 py-4 text-sm font-bold text-md-on-surface-variant hover:bg-md-surface-container-highest hover:text-md-on-surface transition-all duration-300"
                    >
                        <Info className="h-5 w-5" />
                        {t('troubleshooting')}
                    </button>
                </nav>

                {/* Data Transparency - Surface Container High */}
                <div className="mt-auto px-1">
                    <div className="rounded-[24px] bg-md-surface-container-highest p-5 text-xs text-md-on-surface-variant/90">
                        <p className="font-black uppercase tracking-tight mb-2 flex items-center gap-2 text-md-primary">
                            {t('dataTransparencyTitle')}
                        </p>
                        <p className="mb-3 font-medium leading-relaxed opacity-80">
                            {t('dataTransparency')}
                        </p>
                        <div className="relative group">
                            <code className="block w-full break-all rounded-xl bg-md-surface-container-low px-3 py-2 font-mono text-[9px] text-md-on-surface-variant/80 transition-colors">
                                {userDataPath || '...'}
                            </code>
                            <button
                                onClick={() => {
                                    void window.ipcRenderer.invoke('system:open-logs').catch((error) => {
                                        console.error('Failed to open logs:', error);
                                    });
                                }}
                                className="absolute right-1 top-1 p-1.5 rounded-lg bg-md-surface-container-high hover:bg-md-primary/10 text-md-primary transition-colors"
                                title={t('openLogs')}>
                                <ExternalLink className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-3 pt-4">
                    {/* Language Selector */}
                    <div className="flex items-center justify-between px-4 py-2 rounded-full bg-md-surface-container-high">
                        <div className="flex items-center gap-3 text-sm font-bold text-md-on-surface-variant">
                            <Languages className="h-4 w-4" />
                            {t('language')}
                        </div>
                        <div className="flex bg-md-surface-container-low rounded-full p-1 relative">
                            <motion.button
                                onClick={() => setLanguage('en')}
                                className={clsx(
                                    "relative z-10 px-3 py-1.5 rounded-full text-[10px] font-black transition-colors",
                                    language === 'en' ? "text-md-on-primary" : "text-md-on-surface-variant hover:text-md-on-surface"
                                )}>
                                {language === 'en' && (
                                    <motion.div
                                        layoutId="activeLang"
                                        className="absolute inset-0 bg-md-primary rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                EN
                            </motion.button>
                            <motion.button
                                onClick={() => setLanguage('es')}
                                className={clsx(
                                    "relative z-10 px-3 py-1.5 rounded-full text-[10px] font-black transition-colors",
                                    language === 'es' ? "text-md-on-primary" : "text-md-on-surface-variant hover:text-md-on-surface"
                                )}>
                                {language === 'es' && (
                                    <motion.div
                                        layoutId="activeLang"
                                        className="absolute inset-0 bg-md-primary rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                ES
                            </motion.button>
                        </div>
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="flex w-full items-center justify-between rounded-full bg-md-surface-container-high px-4 py-3 text-sm font-bold text-md-on-surface-variant hover:bg-md-surface-container-highest transition-all duration-300">
                        <span className="flex items-center gap-3">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={darkMode ? 'moon' : 'sun'}
                                    initial={{ y: 5, opacity: 0, rotate: -45 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    exit={{ y: -5, opacity: 0, rotate: 45 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {darkMode ? <Moon className="h-4 w-4 text-md-primary" /> : <Sun className="h-4 w-4 text-md-primary" />}
                                </motion.div>
                            </AnimatePresence>
                            {darkMode ? t('darkMode') : t('lightMode')}
                        </span>
                        <div className={clsx(
                            "h-6 w-12 p-1 rounded-full flex items-center transition-all duration-500",
                            darkMode ? "bg-md-primary" : "bg-md-surface-variant"
                        )}>
                            <motion.div
                                layout
                                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                className={clsx("h-4 w-4 rounded-full shadow-sm", darkMode ? "bg-md-on-primary ml-auto" : "bg-md-outline mr-auto")}
                            />
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content - Surface (Background) */}
            <main className="relative flex flex-1 flex-col overflow-hidden bg-md-surface transition-colors duration-300">
                <div className="flex-1 overflow-y-auto relative">
                    {/* Render modals/global children separately to prevent duplication during transitions */}
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child) && typeof child.type !== 'string' && (child.type as any).name?.toLowerCase().includes('modal')) {
                            return child;
                        }
                        return null;
                    })}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + language + darkMode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-7xl mx-auto p-4 lg:p-8"
                        >
                            {React.Children.map(children, child => {
                                if (React.isValidElement(child) && typeof child.type !== 'string' && (child.type as any).name?.toLowerCase().includes('modal')) {
                                    return null;
                                }
                                return child;
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <TroubleshootingModal
                isOpen={showTroubleshooting}
                onClose={() => setShowTroubleshooting(false)}
            />
        </div>
    );
};
