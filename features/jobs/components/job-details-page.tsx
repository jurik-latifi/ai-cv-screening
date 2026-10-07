import Link from "next/link";

import { notFound } from "next/navigation";

import DeleteJobButton from "./delete-job-button";

import { getJobById } from "../services/job.service";

import { getRankedApplicationsByJobId } from "@/features/applications/services/application.service";

import RankedCandidates from "@/features/applications/components/ranked-candidates";

import CVUploader from "@/features/cv-processing/components/cv-uploader";

import JobConfiguration from "./job-configuration";

import type { Criterion, EliminationRule } from "../schemas/job.schema";

type JobDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;

  const [job, applications] = await Promise.all([
    getJobById(id),
    getRankedApplicationsByJobId(id),
  ]);

  if (!job) {
    notFound();
  }

  const criteria = job.criteria as Criterion[];

  const eliminationRules = job.eliminationRules as EliminationRule[];

  const strongMatches = applications.filter(
    (application) => application.evaluation?.fitCategory === "STRONG_MATCH",
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          ← Back to Dashboard
        </Link>

        {/* JOB HEADER */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="px-7 py-7 md:px-8 md:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                    Job Position
                  </span>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Active
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  {job.title}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                  {job.description}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <Link
                  href={`/jobs/${job.id}/edit`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  Edit Job
                </Link>

                <DeleteJobButton jobId={job.id} />

                <a
                  href="#upload-cv"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  + Upload CV
                </a>
              </div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid border-t border-slate-200 bg-slate-50/50 sm:grid-cols-3 sm:divide-x sm:divide-slate-200">
            <div className="px-7 py-5">
              <p className="text-sm font-medium text-slate-500">Candidates</p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {applications.length}
              </p>
            </div>

            <div className="border-t border-slate-200 px-7 py-5 sm:border-t-0">
              <p className="text-sm font-medium text-slate-500">
                Strong Matches
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {strongMatches}
              </p>
            </div>

            <div className="border-t border-slate-200 px-7 py-5 sm:border-t-0">
              <p className="text-sm font-medium text-slate-500">
                Evaluation Criteria
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {criteria.length}
              </p>
            </div>
          </div>
        </section>

        {/* RANKED CANDIDATES */}
        <RankedCandidates applications={applications} criteria={criteria} />

        {/* JOB CONFIGURATION */}
        <JobConfiguration
          criteria={criteria}
          eliminationRules={eliminationRules}
        />

        {/* CV UPLOAD */}
        <section id="upload-cv" className="scroll-mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Add Candidate
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload a CV to extract the profile and evaluate the candidate.
            </p>
          </div>

          <CVUploader jobId={job.id} criteria={criteria} />
        </section>
      </div>
    </main>
  );
}
