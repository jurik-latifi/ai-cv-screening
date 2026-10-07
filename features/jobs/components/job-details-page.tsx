import {
  notFound,
} from "next/navigation";

import ActionLink from "@/components/ui/action-link";

import BackLink from "@/components/ui/back-link";

import Badge from "@/components/ui/badge";

import PageShell from "@/components/ui/page-shell";

import DeleteJobButton from "./delete-job-button";

import {
  getJobById,
} from "../services/job.service";

import {
  getRankedApplicationsByJobId,
} from "@/features/applications/services/application.service";

import RankedCandidates from "@/features/applications/components/ranked-candidates";

import CVUploader from "@/features/cv-processing/components/cv-uploader";

import JobConfiguration from "./job-configuration";

import type {
  Criterion,
  EliminationRule,
} from "../schemas/job.schema";

type JobDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailsPage({
  params,
}: JobDetailsPageProps) {
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

  const strongMatches =
    applications.filter(
      (
        application
      ) =>
        application.evaluation
          ?.fitCategory ===
        "STRONG_MATCH"
    ).length;

  return (
    <PageShell
      maxWidth="6xl"
      className="space-y-8"
    >

      <BackLink href="/">
        Back to Dashboard
      </BackLink>

      {/* JOB HEADER */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="px-7 py-7 md:px-8 md:py-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="max-w-3xl">

              <div className="mb-4 flex flex-wrap items-center gap-2">

                <Badge
                  variant="primary"
                  className="uppercase tracking-wide"
                >
                  Job Position
                </Badge>

                <Badge variant="success">
                  Active
                </Badge>

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {job.title}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                {job.description}
              </p>

            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">

              <ActionLink
                href={`/jobs/${job.id}/edit`}
                variant="secondary"
              >
                Edit Job
              </ActionLink>

              <DeleteJobButton
                jobId={
                  job.id
                }
              />

              <ActionLink
                href="#upload-cv"
              >
                + Upload CV
              </ActionLink>

            </div>

          </div>

        </div>

        {/* QUICK STATS */}
        <div className="grid border-t border-slate-200 bg-slate-50/50 sm:grid-cols-3 sm:divide-x sm:divide-slate-200">

          <div className="px-7 py-5">

            <p className="text-sm font-medium text-slate-500">
              Candidates
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {
                applications.length
              }
            </p>

          </div>

          <div className="border-t border-slate-200 px-7 py-5 sm:border-t-0">

            <p className="text-sm font-medium text-slate-500">
              Strong Matches
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {
                strongMatches
              }
            </p>

          </div>

          <div className="border-t border-slate-200 px-7 py-5 sm:border-t-0">

            <p className="text-sm font-medium text-slate-500">
              Evaluation Criteria
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {
                criteria.length
              }
            </p>

          </div>

        </div>

      </section>

      <RankedCandidates
        applications={
          applications
        }
        criteria={
          criteria
        }
      />

      <JobConfiguration
        criteria={
          criteria
        }
        eliminationRules={
          eliminationRules
        }
      />

      <section
        id="upload-cv"
        className="scroll-mt-8"
      >

        <div className="mb-5">

          <h2 className="text-xl font-semibold text-slate-900">
            Add Candidate
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload a CV to extract the profile and evaluate the candidate.
          </p>

        </div>

        <CVUploader
          jobId={
            job.id
          }
          criteria={
            criteria
          }
        />

      </section>

    </PageShell>
  );
}