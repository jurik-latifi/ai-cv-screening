import type {
  ReactNode,
} from "react";

type TagVariant =
  | "primary"
  | "neutral";

type TagProps = {
  children: ReactNode;
  variant?: TagVariant;
};

const variantStyles: Record<
  TagVariant,
  string
> = {
  primary:
    "bg-indigo-50 text-indigo-700",

  neutral:
    "bg-slate-100 text-slate-700",
};

export default function Tag({
  children,
  variant = "neutral",
}: TagProps) {
  return (
    <span
      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}