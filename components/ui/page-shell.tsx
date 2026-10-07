import type {
  ReactNode,
} from "react";

type PageShellProps = {
  children: ReactNode;

  maxWidth?:
    | "5xl"
    | "6xl";

  className?: string;
};

const maxWidthStyles = {
  "5xl":
    "max-w-5xl",

  "6xl":
    "max-w-6xl",
};

export default function PageShell({
  children,
  maxWidth = "6xl",
  className = "",
}: PageShellProps) {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div
        className={`mx-auto ${maxWidthStyles[maxWidth]} ${className}`}
      >
        {children}
      </div>
    </main>
  );
}