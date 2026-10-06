type EvaluationCriterionCardProps = {
  name: string;
  score: number;
  weight: number;
  weightedScore?: number;
  reasoning: string;
};

export default function EvaluationCriterionCard({
  name,
  score,
  weight,
  weightedScore,
  reasoning,
}: EvaluationCriterionCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="font-semibold text-slate-900">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Weight: {weight}%
          </p>
        </div>

        <div className="text-right">

          <p className="font-bold text-slate-900">
            {score}/10
          </p>

          {typeof weightedScore ===
            "number" && (
            <p className="mt-1 text-xs text-slate-500">
              {weightedScore} points
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{
            width: `${Math.max(
              0,
              Math.min(
                score * 10,
                100
              )
            )}%`,
          }}
        />
      </div>

      {reasoning && (
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {reasoning}
        </p>
      )}
    </div>
  );
}