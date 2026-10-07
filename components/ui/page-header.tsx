type PageHeaderProps = {
  eyebrow?: string;

  title: string;

  description?: string;

  className?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>

      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          {eyebrow}
        </p>
      )}

      <h1
        className={`text-3xl font-bold text-slate-900 ${
          eyebrow
            ? "mt-2"
            : ""
        }`}
      >
        {title}
      </h1>

      {description && (
        <p className="mt-2 max-w-2xl text-slate-500">
          {description}
        </p>
      )}

    </div>
  );
}