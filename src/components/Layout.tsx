import React from 'react';
import { clsx } from 'clsx';
import { LayoutDashboard, History, Moon, Sun, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.png';

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
        <div className={clsx("flex h-screen w-full overflow-hidden transition-colors duration-300 font-sans selection:bg-blue-500/30", darkMode ? "dark bg-slate-950 text-white" : "bg-slate-50 text-slate-900")}>

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-900/20" />
                <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-900/20" />
            </div>

            {/* Sidebar */}
            <aside className="relative z-20 flex w-64 flex-col border-r border-gray-300 bg-white/50 backdrop-blur-xl dark:border-white/5 dark:bg-black/20">
                <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-200/50 dark:border-white/5">
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
                                : "text-gray-900 hover:bg-gray-200/50 dark:text-slate-400 dark:hover:bg-white/5"
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
                                : "text-gray-900 hover:bg-gray-200/50 dark:text-slate-400 dark:hover:bg-white/5"
                        )}
                    >
                        <History className="h-4 w-4" />
                        {t('history')}
                    </button>

                    <div className="px-3 py-2">
                        <div className="h-px w-full bg-gray-300 dark:bg-white/5" />
                    </div>

                </nav>

                {/* Data Transparency Message */}
                <div className="px-4 pb-4">
                    <div className="rounded-xl bg-blue-100/50 p-3 text-xs dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/10 shadow-sm">
                        <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">
                            {t('dataTransparencyTitle')}
                        </p>
                        <p className="text-black dark:text-slate-400 leading-relaxed mb-2 font-medium">
                            {t('dataTransparency')}
                        </p>
                        <code className="block w-full break-all rounded bg-white px-2 py-1.5 font-mono text-[10px] text-gray-900 dark:bg-black/20 dark:text-slate-400 border border-blue-200/30 dark:border-transparent transition-colors">
                            {userDataPath || '...'}
                        </code>
                    </div>
                </div>

                <div className="p-4 space-y-2 border-t border-gray-200/50 dark:border-white/5">
                    {/* Idioma Selector */}
                    <div className="flex items-center justify-between rounded-lg p-2 text-sm font-bold text-black dark:text-slate-400">
                        <span className="flex items-center gap-2">
                            <Languages className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            {t('language')}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setLanguage('en')}
                                className={clsx("px-1.5 py-0.5 rounded text-[10px] uppercase font-bold transition-all shadow-sm", language === 'en' ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 hover:bg-slate-300")}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLanguage('es')}
                                className={clsx("px-1.5 py-0.5 rounded text-[10px] uppercase font-bold transition-all shadow-sm", language === 'es' ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 hover:bg-slate-300")}
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
        </div>
    );
};
