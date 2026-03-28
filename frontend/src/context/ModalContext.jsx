import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null);

  const confirm = useCallback(({ title, message, onConfirm, confirmText = "Confirm", cancelText = "Cancel", isDestructive = true }) => {
    setModalConfig({
      title,
      message,
      confirmText,
      cancelText,
      isDestructive,
      onConfirm: async () => {
        setModalConfig(null);
        if (onConfirm) await onConfirm();
      },
      onCancel: () => setModalConfig(null),
    });
  }, []);

  return (
    <ModalContext.Provider value={{ confirm }}>
      {children}
      {modalConfig && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-12">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={modalConfig.onCancel}></div>
          <div className="bg-white dark:bg-apex-900 p-10 lg:p-16 max-w-lg w-full border border-black/10 dark:border-white/10 relative z-10 animate-reveal shadow-2xl">
            <h3 className="text-3xl apex-text-headline tracking-tighter mb-4 uppercase">{modalConfig.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium leading-relaxed text-sm tracking-wide">{modalConfig.message}</p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={modalConfig.onCancel}
                className="flex-1 py-5 px-8 text-[10px] font-black uppercase tracking-[0.3em] bg-transparent text-slate-400 hover:text-black dark:hover:text-white border border-black/5 dark:border-white/5 transition-all"
              >
                {modalConfig.cancelText}
              </button>
              <button
                onClick={modalConfig.onConfirm}
                className={`flex-1 py-5 px-8 text-[10px] font-black uppercase tracking-[0.4em] transition-all transform hover:-translate-y-1 shadow-2xl ${
                  modalConfig.isDestructive 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "apex-btn-primary"
                }`}
              >
                {modalConfig.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
