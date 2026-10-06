type DashboardStatsProps = {
  totalJobs: number;
  totalCandidates: number;
};

export default function DashboardStats({
  totalJobs,
  totalCandidates,
}: DashboardStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">

      {/* TOTAL JOBS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">

          <div>

            <p className="text-sm font-medium text-slate-500">
              Total Jobs
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalJobs}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
            {totalJobs}
          </div>
        </div>
      </div>

      {/* TOTAL CANDIDATES */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">

          <div>

            <p className="text-sm font-medium text-slate-500">
              Total Candidates
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalCandidates}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
            CV
          </div>
        </div>
      </div>

      {/* AI STATUS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between gap-4">

          <div>

            <p className="text-sm font-medium text-slate-500">
              CV Screening
            </p>

            <p className="mt-2 text-lg font-semibold text-emerald-600">
              AI Active
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-lg font-bold text-emerald-600">
            AI
          </div>
        </div>
      </div>
    </section>
  );
}