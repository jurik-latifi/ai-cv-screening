import type {
  Criterion,
  EliminationRule,
} from "../schemas/job.schema";

type JobConfigurationProps = {
  criteria: Criterion[];
  eliminationRules: EliminationRule[];
};

export default function JobConfiguration({
  criteria,
  eliminationRules,
}: JobConfigurationProps) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Job Configuration
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Criteria and mandatory requirements used during AI evaluation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Evaluation Criteria
            </h3>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {criteria.length}
            </span>
          </div>

          <div className="space-y-3">
            {criteria.map((criterion, index) => (
              <div
                key={`${criterion.name}-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {criterion.name}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {criterion.description}
                    </p>
                  </div>

                  <span className="rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-bold text-indigo-700">
                    {criterion.weight}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Mandatory Requirements
            </h3>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {eliminationRules.length}
            </span>
          </div>

          {eliminationRules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No mandatory requirements
            </div>
          ) : (
            <div className="space-y-3">
              {eliminationRules.map((rule, index) => (
                <div
                  key={`${rule.name}-${index}`}
                  className="rounded-xl border border-red-100 bg-red-50/50 p-4"
                >
                  <p className="font-semibold text-slate-800">
                    {rule.name}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}