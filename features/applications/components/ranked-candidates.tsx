"use client";

import {
  useState,
} from "react";

import type {
  RankedApplication,
} from "../services/application.service";

import type {
  Criterion,
} from "@/features/jobs/schemas/job.schema";

import CandidateRow from "./candidate-row";

type RankedCandidatesProps = {
  applications:
    RankedApplication[];

  criteria:
    Criterion[];
};

export default function RankedCandidates({
  applications,
  criteria,
}: RankedCandidatesProps) {
  const [
    openApplicationId,
    setOpenApplicationId,
  ] = useState<
    string | null
  >(null);

  function toggleSummary(
    applicationId: string
  ) {
    setOpenApplicationId(
      (current) =>
        current ===
        applicationId
          ? null
          : applicationId
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            Ranked Candidates
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Candidates are ranked by
            their match score.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
          {applications.length}{" "}
          {applications.length ===
          1
            ? "candidate"
            : "candidates"}
        </span>
      </div>

      {applications.length ===
      0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

          <p className="font-medium text-slate-700">
            No candidates yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Upload a CV below to
            evaluate the first
            candidate.
          </p>
        </div>
      ) : (
        <div className="space-y-3">

          {applications.map(
            (
              application,
              index
            ) => (
              <CandidateRow
                key={
                  application.id
                }
                application={
                  application
                }
                rank={
                  index + 1
                }
                criteria={
                  criteria
                }
                isOpen={
                  openApplicationId ===
                  application.id
                }
                onToggle={() =>
                  toggleSummary(
                    application.id
                  )
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}