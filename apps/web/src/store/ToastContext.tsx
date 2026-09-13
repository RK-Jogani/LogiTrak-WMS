"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastCard = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  const [isClosing, setIsClosing] = useState(false);

  // Fallback cleanup if the parent setTimeout somehow fails
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 3200); // start fade out a bit earlier
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // wait for animation
  };

  const typeConfig = {
    success: { border: "border-l-green-500", icon: "check_circle", color: "text-green-500", bg: "bg-white" },
    error: { border: "border-l-red-500", icon: "error", color: "text-red-500", bg: "bg-white" },
    warning: { border: "border-l-orange-500", icon: "warning", color: "text-orange-500", bg: "bg-white" },
    info: { border: "border-l-blue-500", icon: "info", color: "text-blue-500", bg: "bg-white" },
  };

  const config = typeConfig[toast.type];

  return (
    <div 
      className={`pointer-events-auto flex items-center justify-between w-[320px] p-4 rounded-xl shadow-lg border border-gray-100 border-l-4 ${config.border} ${config.bg} transition-all duration-300 transform ${isClosing ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0 animate-in slide-in-from-right-10"}`}
    >
      <div className="flex items-center gap-3">
        <span className={`material-symbols-outlined ${config.color}`}>{config.icon}</span>
        <p className="text-[14px] font-semibold text-gray-800">{toast.message}</p>
      </div>
      <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};
