import React, { useState, useEffect, createContext, useContext } from 'react';

// Créer le contexte pour le toast
const ToastContext = createContext(undefined);

// Hook personnalisé pour utiliser le toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
};

const Toast = ({ 
  message, 
  type = 'default',
  duration = 3000,
  onClose,
  visible = false
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    if (visible && duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!isVisible) return null;

  const variants = {
    default: 'bg-white border-gray-200',
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div 
        className={`rounded-lg border p-4 shadow-lg ${variants[type]} flex items-center gap-2`}
        role="alert"
      >
        {type === 'success' && (
          <svg 
            className="h-5 w-5 text-green-600" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
        {type === 'error' && (
          <svg 
            className="h-5 w-5 text-red-600" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-auto inline-flex h-4 w-4 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = (message, type = 'default', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  // Alias functions for different toast types
  toast.success = (message, duration) => toast(message, 'success', duration);
  toast.error = (message, duration) => toast(message, 'error', duration);
  toast.warning = (message, duration) => toast(message, 'warning', duration);
  toast.info = (message, duration) => toast(message, 'info', duration);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            visible={true}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Export de la fonction toast
export const toast = {
  success: (message, duration) => {
    const context = useContext(ToastContext);
    if (context) {
      context.toast(message, 'success', duration);
    }
  },
  error: (message, duration) => {
    const context = useContext(ToastContext);
    if (context) {
      context.toast(message, 'error', duration);
    }
  },
  warning: (message, duration) => {
    const context = useContext(ToastContext);
    if (context) {
      context.toast(message, 'warning', duration);
    }
  },
  info: (message, duration) => {
    const context = useContext(ToastContext);
    if (context) {
      context.toast(message, 'info', duration);
    }
  },
  default: (message, duration) => {
    const context = useContext(ToastContext);
    if (context) {
      context.toast(message, 'default', duration);
    }
  }
};

export { Toast, ToastProvider };