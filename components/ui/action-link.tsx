import Link from "next/link";

type ActionLinkVariant =
  | "primary"
  | "secondary"
  | "soft";

type ActionLinkSize =
  | "sm"
  | "lg";

type ActionLinkProps = {
  href: string;

  children:
    React.ReactNode;

  variant?:
    ActionLinkVariant;

  size?:
    ActionLinkSize;

  className?: string;
};

const variantStyles: Record<
  ActionLinkVariant,
  string
> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-200",

  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:ring-indigo-100",

  soft:
    "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:ring-indigo-100",
};

const sizeStyles: Record<
  ActionLinkSize,
  string
> = {
  sm:
    "rounded-lg px-4 py-2 text-sm",

  lg:
    "rounded-xl px-5 py-3 text-sm",
};

export default function ActionLink({
  href,
  children,
  variant = "primary",
  size = "lg",
  className = "",
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      className={`
        inline-flex
        items-center
        justify-center
        font-semibold
        transition
        focus:outline-none
        focus:ring-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </Link>
  );
}