type ProgressBarProps = {
  value: number;

  className?: string;
};

export default function ProgressBar({
  value,
  className = "",
}: ProgressBarProps) {
  const safeValue =
    Math.min(
      Math.max(
        value,
        0
      ),
      100
    );

  return (
    <div
      className={`h-2.5 overflow-hidden rounded-full bg-indigo-100 ${className}`}
    >
      <div
        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
        style={{
          width: `${safeValue}%`,
        }}
      />
    </div>
  );
}