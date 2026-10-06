import Link from "next/link";

import JobForm from "./job-form";

export default function CreateJobPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Job Setup
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Create New Job
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Configure the job, evaluation criteria and mandatory
            requirements used by the AI screening system.
          </p>
        </div>

        <JobForm />
      </div>
    </main>
  );
}