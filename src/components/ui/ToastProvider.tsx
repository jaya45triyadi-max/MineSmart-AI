import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Render Area */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-xl transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
                : toast.type === "error"
                ? "bg-red-950/90 border-red-500/40 text-red-200"
                : toast.type === "warning"
                ? "bg-amber-950/90 border-amber-500/40 text-amber-200"
                : "bg-slate-900/90 border-slate-700 text-slate-200"
            }`}
          >
            <div className="mt-0.5">
              {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
              {toast.type === "error" && <XCircle className="h-5 w-5 text-red-400" />}
              {toast.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-400" />}
              {toast.type === "info" && <Info className="h-5 w-5 text-sky-400" />}
            </div>

            <div className="flex-1">
              <h5 className="text-xs font-bold">{toast.title}</h5>
              {toast.message && <p className="mt-0.5 text-[11px] opacity-85">{toast.message}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="rounded p-0.5 hover:bg-white/10 opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
