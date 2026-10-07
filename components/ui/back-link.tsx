import Link from "next/link";

type BackLinkProps = {
  href: string;

  children: string;

  className?: string;
};

export default function BackLink({
  href,
  children,
  className = "",
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-indigo-600 ${className}`}
    >
      ← {children}
    </Link>
  );
}