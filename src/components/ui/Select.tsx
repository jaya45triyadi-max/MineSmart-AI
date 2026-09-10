import React, { useState } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Pilih opsi...",
  error,
  required,
  className = "",
}) => {
  return (
    <div className={`w-full space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-xl border bg-white px-3 py-2 pr-9 text-xs sm:text-sm text-slate-900 shadow-xs transition-all focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
            error
              ? "border-red-500 focus:ring-red-500/30"
              : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700"
          }`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-slate-400" />
      </div>
      {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}
    </div>
  );
};

export const SearchSelect: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Cari opsi...",
  error,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(query.toLowerCase()) ||
      (o.description && o.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="relative w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 text-left shadow-xs transition-all dark:bg-slate-900 dark:text-slate-100 ${
          error ? "border-red-500" : "border-slate-300 dark:border-slate-700"
        }`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik untuk mencari..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredOptions.length === 0 ? (
              <p className="p-2 text-center text-xs text-slate-500">Tidak ada data ditemukan</p>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs ${
                    opt.value === value
                      ? "bg-emerald-500/10 text-emerald-600 font-bold dark:text-emerald-400"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <div>
                    <p>{opt.label}</p>
                    {opt.description && (
                      <p className="text-[10px] text-slate-400">{opt.description}</p>
                    )}
                  </div>
                  {opt.value === value && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}
    </div>
  );
};
