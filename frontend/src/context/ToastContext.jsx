import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { IconCheck, IconAlert } from '../components/icons/Icons';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const dismiss = useCallback((id) => {
        setToasts(t => t.filter(item => item.id !== id));
    }, []);

    const push = useCallback((message, type = 'success') => {
        const id = ++idRef.current;
        setToasts(t => [...t, { id, message, type }]);
        setTimeout(() => dismiss(id), 3500);
    }, [dismiss]);

    const toast = {
        success: (message) => push(message, 'success'),
        error: (message) => push(message, 'error'),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="toast-stack">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast-${t.type}`} onClick={() => dismiss(t.id)}>
                        {t.type === 'success' ? <IconCheck width={16} height={16} /> : <IconAlert width={16} height={16} />}
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};