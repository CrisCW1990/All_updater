import React from 'react';
import { clsx } from 'clsx';
import { LayoutDashboard, History, Moon, Sun, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';
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
        <div className={clsx("flex h-screen w-full overflow-hidden transition-colors duration-300 font-sans selection:bg-blue-500/30", darkMode ? "dark bg-slate-950 text-white" : "bg-slate-50 text-slate-950")}>

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-900/20" />
                <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-900/20" />
            </div>

            {/* Sidebar */}
            <aside className="relative z-20 flex w-64 flex-col border-r border-slate-300 bg-white/90 backdrop-blur-xl dark:border-white/5 dark:bg-black/20">
                <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200 dark:border-white/5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 overflow-hidden">
                        <img src={logo} alt="Logo" className="h-full w-full object-cover" />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-black dark:text-gray-100 transition-colors">All Updater</h1>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                    <button
                        onClick={() => onTabChange('dashboard')}
                        className={clsx(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
                            activeTab === 'dashboard'
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:shadow-none"
                                : "text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-white/5"
                        )}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        {t('dashboard')}
                    </button>

                    <button
                        onClick={() => onTabChange('history')}
                        className={clsx(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
                            activeTab === 'history'
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:shadow-none"
                                : "text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-white/5"
                        )}
                    >
                        <History className="h-4 w-4" />
                        {t('history')}
                    </button>

                    <div className="px-3 py-2">
                        <div className="h-px w-full bg-slate-300 dark:bg-white/5" />
                    </div>

                </nav>

                {/* Data Transparency Message */}
                <div className="px-4 pb-4">
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs shadow-sm dark:border-blue-500/10 dark:bg-blue-900/10">
                        <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">
                            {t('dataTransparencyTitle')}
                        </p>
                        <p className="mb-2 font-medium leading-relaxed text-slate-800 dark:text-slate-400">
                            {t('dataTransparency')}
                        </p>
                        <code className="block w-full break-all rounded border border-blue-200 bg-white px-2 py-1.5 font-mono text-[10px] text-slate-800 transition-colors dark:border-transparent dark:bg-black/20 dark:text-slate-400">
                            {userDataPath || '...'}
                        </code>
                        <button
                            onClick={() => {
                                void window.ipcRenderer.invoke('system:open-logs').catch((error) => {
                                    console.error('Failed to open logs:', error);
                                });
                            }}
                            className="mt-2 w-full rounded border border-blue-200 bg-white px-2 py-1.5 text-[11px] font-bold text-blue-700 transition-colors hover:bg-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-blue-300 dark:hover:bg-white/10"
                        >
                            {t('openLogs')}
                        </button>
                        <button
                            onClick={() => setShowTroubleshooting(true)}
                            className="mt-2 w-full rounded border border-slate-300 bg-slate-100 px-2 py-1.5 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                        >
                            {t('troubleshooting')}
                        </button>
                    </div>
                </div>

                <div className="space-y-2 border-t border-slate-200 p-4 dark:border-white/5">
                    {/* Idioma Selector */}
                    <div className="flex items-center justify-between rounded-lg p-2 text-sm font-bold text-black dark:text-slate-400">
                        <span className="flex items-center gap-2">
                            <Languages className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            {t('language')}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setLanguage('en')}
                                className={clsx("px-1.5 py-0.5 rounded text-[10px] uppercase font-bold transition-all shadow-sm", language === 'en' ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700")}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('es')}
                                className={clsx("px-1.5 py-0.5 rounded text-[10px] uppercase font-bold transition-all shadow-sm", language === 'es' ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700")}
                            >
                                ES
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={toggleDarkMode}
                        className="flex w-full items-center justify-between rounded-lg p-2 text-sm font-bold text-black hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-white/5 transition-all duration-200"
                    >
                        <span className="flex items-center gap-2">
                            {darkMode ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                            {darkMode ? t('darkMode') : t('lightMode')}
                        </span>
                        <div className={clsx(
                            "h-5 w-10 p-0.5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center transition-all duration-500",
                            darkMode ? "justify-end bg-indigo-500/20" : "justify-start"
                        )}>
                            <div className="h-4 w-4 rounded-full bg-white shadow-md border border-slate-200 dark:border-transparent" />
                        </div>
                    </button>
                </div>

            </aside>

            {/* Main Content */}
            <main className="relative z-10 flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="w-full h-full flex flex-col px-4">
                        {children}
                    </div>
                </div>
            </main>

            <TroubleshootingModal
                isOpen={showTroubleshooting}
                onClose={() => setShowTroubleshooting(false)}
            />
        </div>
    );
};
