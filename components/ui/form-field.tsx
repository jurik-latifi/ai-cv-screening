import type {
  ReactNode,
} from "react";

type FormFieldProps = {
  label: string;

  children: ReactNode;

  className?: string;
};

export default function FormField({
  label,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}