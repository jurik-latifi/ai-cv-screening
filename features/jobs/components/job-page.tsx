import Link from "next/link";

import {
  getJobs,
} from "../services/job.service";

import JobCard from "./job-card";

export default async function JobsPage() {
  const jobs =
    await getJobs();

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-7 inline-flex text-sm font-semibold text-slate-500 hover:text-indigo-600"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Recruitment
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              All Jobs
            </h1>

            <p className="mt-2 text-slate-500">
              Open a position to review candidates and evaluations.
            </p>
          </div>

          <Link
            href="/jobs/new"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Create New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-semibold text-slate-900">
              No jobs created yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}