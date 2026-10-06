import Link from "next/link";

export default function DashboardHeader() {
  return (
    <section className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-sm">
      <div className="px-8 py-9 md:px-10 md:py-10">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              TalentAI
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Recruitment Dashboard
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
              Create job roles, upload candidate CVs and review AI-powered
              candidate rankings from one place.
            </p>
          </div>

          <Link
            href="/jobs/new"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            + Create New Job
          </Link>
        </div>
      </div>
    </section>
  );
}