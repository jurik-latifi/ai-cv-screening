import {
  notFound,
} from "next/navigation";

import BackLink from "@/components/ui/back-link";

import PageHeader from "@/components/ui/page-header";

import PageShell from "@/components/ui/page-shell";

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

  const [
    job,
    applications,
  ] =
    await Promise.all([
      getJobById(
        id
      ),

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
    <PageShell maxWidth="5xl">

      <BackLink
        href={`/jobs/${job.id}`}
        className="mb-6"
      >
        Back to Job
      </BackLink>

      <PageHeader
        eyebrow="Job Setup"
        title="Edit Job"
        description="Update the job details, evaluation criteria and mandatory requirements."
      />

      <JobForm
        mode="edit"
        jobId={
          job.id
        }
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

    </PageShell>
  );
}