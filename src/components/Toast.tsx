import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onClose: (id: string) => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);
        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-md-primary" />,
        error: <XCircle className="h-5 w-5 text-md-error" />,
        warning: <AlertCircle className="h-5 w-5 text-md-secondary" />,
        info: <Info className="h-5 w-5 text-md-primary" />,
    };

    const styles = {
        success: "bg-md-primary-container text-md-on-primary-container",
        error: "bg-md-error-container text-md-on-error-container",
        warning: "bg-md-secondary-container text-md-on-secondary-container",
        info: "bg-md-surface-container-highest text-md-on-surface-variant",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={clsx(
                "flex items-center gap-4 rounded-[16px] border px-6 py-4 shadow-xl backdrop-blur-md",
                styles[type]
            )}
        >
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-black tracking-tight">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="ml-4 rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
                <X className="h-4 w-4 opacity-50 hover:opacity-100" />
            </button>
        </motion.div>
    );
};

interface ToastContainerProps {
    toasts: { id: string; message: string; type: ToastType }[];
    onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    return (
        <div className="fixed bottom-8 right-8 z-[300] flex flex-col gap-4 items-end">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} onClose={onClose} />
                ))}
            </AnimatePresence>
        </div>
    );
};
