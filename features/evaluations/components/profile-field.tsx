type ProfileFieldProps = {
  label: string;

  value?:
    | string
    | null;

  className?: string;
};

export default function ProfileField({
  label,
  value,
  className = "",
}: ProfileFieldProps) {
  return (
    <div className={className}>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-slate-700">
        {value ||
          "Not provided"}
      </p>

    </div>
  );
}