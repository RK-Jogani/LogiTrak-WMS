import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      loading = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-label-md text-label-md rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm",
      secondary:
        "bg-secondary-container text-on-secondary-container hover:bg-surface-container-highest",
      outline:
        "border border-outline-variant text-on-surface hover:bg-surface-variant hover:text-on-surface-variant",
      ghost:
        "text-on-surface-variant hover:bg-surface-variant hover:text-primary",
      danger:
        "bg-transparent border border-status-error text-status-error hover:bg-status-error hover:text-white",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-[11px] h-8",
      md: "px-4 py-2 h-10",
      lg: "px-6 py-2.5 h-12",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="material-symbols-outlined animate-spin mr-2 text-[18px]">
            progress_activity
          </span>
        )}
        {icon && iconPosition === "left" && !loading && (
          <span className="material-symbols-outlined mr-2 text-[18px]">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="material-symbols-outlined ml-2 text-[18px]">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
