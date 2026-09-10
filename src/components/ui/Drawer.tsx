import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  position?: "left" | "right";
  size?: "sm" | "md" | "lg";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  size = "md",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    sm: "w-full max-w-xs",
    md: "w-full max-w-md",
    lg: "w-full max-w-xl",
  };

  const posClasses =
    position === "right" ? "right-0 top-0 bottom-0" : "left-0 top-0 bottom-0";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div
        className={`fixed ${posClasses} ${sizeClasses[size]} flex flex-col border-l border-slate-200 bg-white p-5 shadow-2xl transition-transform dark:border-slate-800 dark:bg-[#0F172A] z-10`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          {title ? (
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {title}
            </div>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
};
