import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-12 right-12 z-[150] flex flex-col space-y-4 pointer-events-none items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-reveal flex items-center space-x-6 px-8 py-5 shadow-2xl transition-all duration-700
              ${t.type === 'error' ? 'bg-red-500 text-white' : 
                t.type === 'success' ? 'bg-black dark:bg-white text-white dark:text-black font-black' : 
                'bg-slate-100 text-black'}`}
          >
            <div className="flex flex-col">
              <p className="text-[8px] font-mono uppercase tracking-[0.4em] opacity-50 mb-1">System_Message</p>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t.message}</span>
            </div>
            {t.type === 'success' && (
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
            {t.type === 'error' && (
              <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
