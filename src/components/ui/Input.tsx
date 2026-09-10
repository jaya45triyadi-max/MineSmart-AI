import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      leftIcon,
      rightIcon,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-xl border bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 shadow-xs transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
              leftIcon ? "pl-9" : ""
            } ${rightIcon ? "pr-9" : ""} ${
              error
                ? "border-red-500 focus:ring-red-500/30"
                : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700"
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-slate-400">{rightIcon}</div>
          )}
        </div>
        {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);
TextInput.displayName = "TextInput";

export interface NumberInputProps extends Omit<InputProps, "onChange"> {
  value?: number | string;
  onChange?: (value: number) => void;
  suffix?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  suffix,
  ...props
}) => {
  return (
    <TextInput
      type="number"
      value={value}
      onChange={(e) => onChange && onChange(parseFloat(e.target.value) || 0)}
      rightIcon={suffix ? <span className="text-xs font-bold text-slate-400">{suffix}</span> : undefined}
      {...props}
    />
  );
};

export interface CurrencyInputProps extends Omit<InputProps, "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value = 0,
  onChange,
  label,
  ...props
}) => {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

  return (
    <TextInput
      label={label}
      leftIcon={<span className="text-xs font-bold text-emerald-500">Rp</span>}
      value={value ? value.toLocaleString("id-ID") : ""}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, "");
        if (onChange) onChange(Number(raw));
      }}
      helperText={value > 0 ? `Format: ${formatted}` : props.helperText}
      {...props}
    />
  );
};

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, className = "", id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={`w-full rounded-xl border bg-white p-3 text-xs sm:text-sm text-slate-900 shadow-xs transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
            error
              ? "border-red-500 focus:ring-red-500/30"
              : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export const Switch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, disabled }) => {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
          checked ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
      {label && <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>}
    </label>
  );
};
