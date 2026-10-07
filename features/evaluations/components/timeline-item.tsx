type TimelineItemProps = {
  title: string;

  subtitle?: string;

  secondaryText?: string;

  startDate?: string;

  endDate?: string;

  description?: string;
};

export default function TimelineItem({
  title,
  subtitle,
  secondaryText,
  startDate,
  endDate,
  description,
}: TimelineItemProps) {
  const hasDates =
    startDate ||
    endDate;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <p className="font-semibold text-slate-900">
        {title}
      </p>

      {subtitle && (
        <p className="mt-1 text-sm font-medium text-slate-600">
          {subtitle}
        </p>
      )}

      {secondaryText && (
        <p className="mt-1 text-sm text-slate-500">
          {secondaryText}
        </p>
      )}

      {hasDates && (
        <p className="mt-2 text-xs text-slate-400">
          {startDate ||
            "Unknown"}
          {" — "}
          {endDate ||
            "Unknown"}
        </p>
      )}

      {description && (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {description}
        </p>
      )}

    </div>
  );
}