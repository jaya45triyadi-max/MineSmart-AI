import React from "react";
import { FolderOpen, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

export const Skeleton: React.FC<{
  className?: string;
  width?: string;
  height?: string;
}> = ({ className = "", width, height }) => {
  return (
    <div
      style={{ width, height }}
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`}
    />
  );
};

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({
  title = "Belum Ada Data",
  description = "Belum ada entri data yang tercatat dalam sistem untuk kategori ini.",
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/20 my-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
        {icon || <FolderOpen className="h-6 w-6" />}
      </div>
      <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
        {title}
      </h4>
      <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
}> = ({
  title = "Gagal Memuat Data",
  description = "Terjadi kendala koneksi atau server saat mengambil informasi. Silakan coba kembali.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 p-8 text-center my-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-500 mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h4 className="text-sm sm:text-base font-bold text-red-700 dark:text-red-400">
        {title}
      </h4>
      <p className="mt-1 max-w-sm text-xs text-red-600/80 dark:text-red-300/80">
        {description}
      </p>
      {onRetry && (
        <Button
          variant="danger"
          size="sm"
          className="mt-4"
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          onClick={onRetry}
        >
          Coba Lagi
        </Button>
      )}
    </div>
  );
};
