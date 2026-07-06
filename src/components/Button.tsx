import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-cranberry-600 text-white shadow-lg shadow-cranberry-600/25 hover:bg-cranberry-700 focus-visible:outline-cranberry-600",
  secondary:
    "bg-evergreen-600 text-white shadow-lg shadow-evergreen-600/20 hover:bg-evergreen-800 focus-visible:outline-evergreen-600",
  ghost:
    "border border-slate-300 bg-white/60 text-slate-800 hover:border-cranberry-200 hover:bg-white focus-visible:outline-cranberry-600"
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
