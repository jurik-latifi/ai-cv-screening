type ScoreDisplayProps = {
  score: number;
  size?: "small" | "large";
};

export default function ScoreDisplay({
  score,
  size = "small",
}: ScoreDisplayProps) {
  const textSize =
    size === "large"
      ? "text-4xl"
      : "text-2xl";

  return (
    <p
      className={`${textSize} font-bold text-slate-900`}
    >
      {score}%
    </p>
  );
}