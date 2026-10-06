import Link from "next/link";

import type {
  getJobs,
} from "../services/job.service";

type Jobs =
  Awaited<ReturnType<typeof getJobs>>;

type Job =
  Jobs[number];

type JobCardProps = {
  job: Job;
};

export default function JobCard({
  job,
}: JobCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {job.title}
          </h3>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Active
          </span>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
          {job.description}
        </p>

        <div className="mt-4">
          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
            {job._count.applications}{" "}
            {job._count.applications === 1
              ? "Candidate"
              : "Candidates"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
        <p className="text-xs text-slate-400">
          {new Date(job.createdAt).toLocaleDateString()}
        </p>

        <Link
          href={`/jobs/${job.id}`}
          className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
        >
          Open Job →
        </Link>
      </div>
    </article>
  );
}