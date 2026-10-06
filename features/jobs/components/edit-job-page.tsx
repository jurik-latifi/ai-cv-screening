import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getJobById,
} from "../services/job.service";

import {
  getRankedApplicationsByJobId,
} from "@/features/applications/services/application.service";

import JobForm from "./job-form";

import type {
  Criterion,
  EliminationRule,
} from "../schemas/job.schema";

type EditJobPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditJobPage({
  params,
}: EditJobPageProps) {
  const { id } =
    await params;

  const [job, applications] =
    await Promise.all([
      getJobById(id),

      getRankedApplicationsByJobId(
        id
      ),
    ]);

  if (!job) {
    notFound();
  }

  const criteria =
    job.criteria as Criterion[];

  const eliminationRules =
    job.eliminationRules as EliminationRule[];

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/jobs/${job.id}`}
          className="mb-6 inline-flex text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          ← Back to Job
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Job Setup
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Edit Job
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Update the job details,
            evaluation criteria and
            mandatory requirements.
          </p>
        </div>

        <JobForm
          mode="edit"
          jobId={job.id}
          initialTitle={
            job.title
          }
          initialDescription={
            job.description
          }
          initialCriteria={
            criteria
          }
          initialEliminationRules={
            eliminationRules
          }
          candidateCount={
            applications.length
          }
        />
      </div>
    </main>
  );
}