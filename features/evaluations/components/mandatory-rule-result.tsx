type MandatoryRuleResultProps = {
  name: string;
  passed: boolean;
  reasoning: string;
};

export default function MandatoryRuleResult({
  name,
  passed,
  reasoning,
}: MandatoryRuleResultProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        passed
          ? "border-emerald-200 bg-emerald-50"
          : "border-red-200 bg-red-50"
      }`}
    >

      <div className="flex items-center justify-between gap-4">

        <p className="font-semibold text-slate-900">
          {name}
        </p>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            passed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {passed
            ? "Passed"
            : "Failed"}
        </span>
      </div>

      {reasoning && (
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {reasoning}
        </p>
      )}
    </div>
  );
}