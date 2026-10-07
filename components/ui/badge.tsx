import type {
  ReactNode,
} from "react";

type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

type BadgeSize =
  | "sm"
  | "md";

type BadgeProps = {
  children: ReactNode;

  variant?: BadgeVariant;

  size?: BadgeSize;

  className?: string;
};

const variantStyles: Record<
  BadgeVariant,
  string
> = {
  primary:
    "bg-indigo-50 text-indigo-700",

  success:
    "bg-emerald-100 text-emerald-700",

  warning:
    "bg-amber-100 text-amber-700",

  danger:
    "bg-red-100 text-red-700",

  neutral:
    "bg-slate-100 text-slate-600",
};

const sizeStyles: Record<
  BadgeSize,
  string
> = {
  sm:
    "px-2.5 py-1 text-xs",

  md:
    "px-3 py-1.5 text-xs",
};

export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        font-semibold
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}