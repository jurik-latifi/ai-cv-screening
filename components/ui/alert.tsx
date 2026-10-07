import type {
  ReactNode,
} from "react";

type AlertVariant =
  | "info"
  | "warning"
  | "danger"
  | "success";

type AlertProps = {
  children: ReactNode;
  title?: string;
  variant?: AlertVariant;
  className?: string;
};

const variantStyles: Record<
  AlertVariant,
  string
> = {
  info:
    "border-indigo-100 bg-indigo-50 text-indigo-700",

  warning:
    "border-amber-200 bg-amber-50 text-amber-700",

  danger:
    "border-red-200 bg-red-50 text-red-700",

  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const titleStyles: Record<
  AlertVariant,
  string
> = {
  info:
    "text-indigo-900",

  warning:
    "text-amber-800",

  danger:
    "text-red-800",

  success:
    "text-emerald-800",
};

export default function Alert({
  children,
  title,
  variant = "info",
  className = "",
}: AlertProps) {
  return (
    <div
      className={`
        rounded-xl
        border
        px-5
        py-4
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {title && (
        <p
          className={`font-semibold ${titleStyles[variant]}`}
        >
          {title}
        </p>
      )}

      <div
        className={
          title
            ? "mt-1 text-sm leading-6"
            : "text-sm font-medium"
        }
      >
        {children}
      </div>
    </div>
  );
}