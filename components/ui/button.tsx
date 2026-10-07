import type {
  ButtonHTMLAttributes,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "soft"
  | "danger";

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  };

const variantStyles: Record<
  ButtonVariant,
  string
> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-200",

  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:ring-indigo-100",

  soft:
    "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:ring-indigo-100",

  danger:
    "border border-red-200 bg-white text-red-600 hover:bg-red-50 focus:ring-red-100",
};

const sizeStyles: Record<
  ButtonSize,
  string
> = {
  sm:
    "rounded-lg px-3 py-2 text-sm",

  md:
    "rounded-xl px-4 py-2.5 text-sm",

  lg:
    "rounded-xl px-5 py-3 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-semibold
        transition
        focus:outline-none
        focus:ring-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}