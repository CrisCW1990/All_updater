import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wrench, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TroubleshootingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface TroubleshootingItem {
    title: string;
    steps: string[];
}

export const TroubleshootingModal: React.FC<TroubleshootingModalProps> = ({ isOpen, onClose }) => {
    const { language, t } = useLanguage();
    const closeRef = useRef<HTMLButtonElement>(null);

    const items: TroubleshootingItem[] = language === 'es'
        ? [
            {
                title: 'Winget no aparece o falla',
                steps: [
                    'Instala/actualiza App Installer desde Microsoft Store.',
                    'Ejecuta la app como Administrador.',
                    'Si hay error de sources, ejecuta: winget source reset --force y winget source update.'
                ]
            },
            {
                title: 'No se crea punto de restauración',
                steps: [
                    'Abre "Crear un punto de restauración" y habilita protección en C:.',
                    'Verifica servicios VSS y Programador de tareas en estado Running.',
                    'Revisa restore_debug.txt en la carpeta data.'
                ]
            },
            {
                title: 'Aplicación en uso al actualizar',
                steps: [
                    'Cierra la app objetivo y revisa bandeja del sistema.',
                    'Si sigue en uso, finaliza procesos relacionados desde Administrador de tareas.',
                    'Reintenta desde el modal de conflicto.'
                ]
            },
            {
                title: 'Versión actual desconocida',
                steps: [
                    'Puede ser un comportamiento normal de algunos manifiestos de winget.',
                    'Si ya se instaló esa versión con éxito, no debería reaparecer en checks siguientes.',
                    'Si reaparece, revisa historial y ejecuta diagnóstico.'
                ]
            },
            {
                title: 'Error de hash (seguridad)',
                steps: [
                    'No instales ese paquete en ese momento.',
                    'Espera a que el proveedor sincronice manifest/instalador.',
                    'Vuelve a intentar más tarde.'
                ]
            },
            {
                title: 'No se puede verificar versión de la app',
                steps: [
                    'Comprueba conexión a internet.',
                    'Verifica que el repositorio/release sea público.',
                    'La app sigue funcionando sin este check.'
                ]
            }
        ]
        : [
            {
                title: 'Winget is missing or failing',
                steps: [
                    'Install/update App Installer from Microsoft Store.',
                    'Run the app as Administrator.',
                    'If sources fail, run: winget source reset --force and winget source update.'
                ]
            },
            {
                title: 'Restore point is not created',
                steps: [
                    'Open "Create a restore point" and enable protection on C:.',
                    'Verify VSS and Task Scheduler services are Running.',
                    'Check restore_debug.txt in the data folder.'
                ]
            },
            {
                title: 'Application in use while updating',
                steps: [
                    'Close the target app and check system tray.',
                    'If still in use, end related processes in Task Manager.',
                    'Retry from the conflict modal.'
                ]
            },
            {
                title: 'Current version appears as unknown',
                steps: [
                    'This can be normal for some winget manifests.',
                    'If that target version was already installed successfully, it should not reappear.',
                    'If it reappears, review history and export diagnostics.'
                ]
            },
            {
                title: 'Hash mismatch (security)',
                steps: [
                    'Do not install that package at this moment.',
                    'Wait for vendor manifest/installer synchronization.',
                    'Retry later.'
                ]
            },
            {
                title: 'Could not verify app version',
                steps: [
                    'Check internet connection.',
                    'Ensure repository/release is public.',
                    'App remains functional without this check.'
                ]
            }
        ];

    useEffect(() => {
        if (!isOpen) return;
        closeRef.current?.focus();
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl overflow-hidden rounded-[28px] bg-md-surface-container-high shadow-2xl"
                >
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-md-secondary-container text-md-on-secondary-container">
                                    <Wrench className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-md-on-surface">
                                        {t('troubleshootingTitle')}
                                    </h2>
                                    <p className="text-xs font-bold text-md-primary opacity-70 uppercase tracking-widest">
                                        Clinical Diagnostics
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-md-on-surface/5 text-md-on-surface-variant transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl bg-md-surface-container-highest p-5 group transition-all hover:bg-md-surface-variant/40 hover:shadow-sm"
                                >
                                    <h3 className="text-sm font-black text-md-on-surface-variant mb-3 flex items-center gap-2">
                                        <div className="h-1 w-1 rounded-full bg-md-primary" />
                                        {item.title}
                                    </h3>
                                    <ul className="space-y-2">
                                        {item.steps.map((step) => (
                                            <li key={step} className="flex gap-3 text-xs font-medium text-md-on-surface-variant opacity-80 leading-relaxed">
                                                <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-md-primary opacity-50" />
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={onClose}
                                ref={closeRef}
                                className="w-full md:w-auto px-8 py-3 rounded-full bg-md-primary text-md-on-primary font-black text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                            >
                                {t('troubleshootingClose')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
