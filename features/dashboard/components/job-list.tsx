import Link from "next/link";

import type {
  getJobs,
} from "@/features/jobs/services/job.service";

import JobCard from "@/features/jobs/components/job-card";

type Jobs =
  Awaited<
    ReturnType<
      typeof getJobs
    >
  >;

type JobListProps = {
  jobs: Jobs;
};

const DASHBOARD_JOB_LIMIT =
  4;

export default function JobList({
  jobs,
}: JobListProps) {
  const visibleJobs =
    jobs.slice(
      0,
      DASHBOARD_JOB_LIMIT
    );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Jobs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Open a position to review ranked candidates and AI evaluations.
          </p>
        </div>

        {jobs.length > 0 && (
          <Link
            href="/jobs"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            View All Jobs →
          </Link>
        )}
      </div>

      {/* EMPTY STATE */}
      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
            +
          </div>

          <h3 className="mt-4 font-semibold text-slate-900">
            No jobs created yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create your first job position and configure the evaluation
            criteria used to screen candidate CVs.
          </p>

          <Link
            href="/jobs/new"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create First Job
          </Link>
        </div>
      ) : (
        <>
          {/* JOB CARDS */}
          <div className="grid gap-4 md:grid-cols-2">

            {visibleJobs.map(
              (job) => (
                <JobCard
                  key={
                    job.id
                  }
                  job={
                    job
                  }
                />
              )
            )}
          </div>

          {/* MOBILE / BOTTOM VIEW ALL */}
          {jobs.length >
            DASHBOARD_JOB_LIMIT && (
            <div className="mt-6 flex justify-center">

              <Link
                href="/jobs"
                className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View All {jobs.length} Jobs →
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}