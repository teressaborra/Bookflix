import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface NotificationProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
    type,
    title,
    message,
    onClose,
    autoClose = true,
    duration = 5000
}) => {
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-400" />;
            case 'error':
                return <XCircle className="w-6 h-6 text-red-400" />;
            case 'warning':
                return <AlertCircle className="w-6 h-6 text-yellow-400" />;
            case 'info':
                return <Info className="w-6 h-6 text-blue-400" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500/10 border-green-500/20 text-green-400';
            case 'error':
                return 'bg-red-500/10 border-red-500/20 text-red-400';
            case 'warning':
                return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
            case 'info':
                return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getColors()} border rounded-lg p-4 shadow-lg backdrop-blur-sm animate-in slide-in-from-right duration-300`}>
            <div className="flex items-start gap-3">
                {getIcon()}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white">{title}</h4>
                    {message && (
                        <p className="text-sm opacity-90 mt-1">{message}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Notification;