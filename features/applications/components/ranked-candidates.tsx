"use client";

import {
  useState,
} from "react";

import Badge from "@/components/ui/badge";

import Card from "@/components/ui/card";

import EmptyState from "@/components/ui/empty-state";

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
    <Card className="p-6">

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Ranked Candidates
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Candidates are ranked by their match score.
          </p>
        </div>

        <Badge variant="neutral">
          {applications.length}{" "}
          {applications.length ===
          1
            ? "candidate"
            : "candidates"}
        </Badge>

      </div>

      {applications.length ===
      0 ? (
        <EmptyState
          title="No candidates yet"
          description="Upload a CV below to evaluate the first candidate."
        />
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

    </Card>
  );
}