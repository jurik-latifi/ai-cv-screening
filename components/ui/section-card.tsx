import type {
  ReactNode,
} from "react";

import Card from "./card";

type SectionCardProps = {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  className?: string;
};

export default function SectionCard({
  children,
  title,
  eyebrow,
  className = "",
}: SectionCardProps) {
  return (
    <Card className={`p-6 ${className}`}>
      {(eyebrow || title) && (
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {eyebrow}
            </p>
          )}

          {title && (
            <h3
              className={
                eyebrow
                  ? "mt-1 text-lg font-semibold text-slate-900"
                  : "text-lg font-semibold text-slate-900"
              }
            >
              {title}
            </h3>
          )}
        </div>
      )}

      {children}
    </Card>
  );
}