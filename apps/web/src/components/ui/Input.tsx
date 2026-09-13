import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-label-md text-label-md text-on-surface mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-10 border rounded bg-surface-bright text-on-surface
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              font-body-md text-body-md transition-shadow
              ${icon ? "pl-9 pr-4" : "px-3"}
              ${error ? "border-status-error ring-1 ring-status-error/20" : "border-low"}
              ${props.disabled ? "opacity-50 cursor-not-allowed bg-surface-container" : ""}
              ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-[12px] text-status-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1 text-[12px] text-on-surface-variant">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
