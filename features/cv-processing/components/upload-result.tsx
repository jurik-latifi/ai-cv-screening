"use client";

import {
  useState,
} from "react";

import type {
  CandidateProfile,
} from "../schemas/candidate-profile.schema";

import type {
  EvaluationResult,
} from "@/features/evaluations/schemas/evaluation.schema";

import type {
  Criterion,
} from "@/features/jobs/schemas/job.schema";

import AISummary from "@/features/evaluations/components/ai-summary";

import CategoryBadge from "@/features/evaluations/components/category-badge";

import ScoreDisplay from "@/features/evaluations/components/score-display";

export type UploadResultData = {
  success: boolean;

  applicationId: string;

  candidateId: string;

  filename: string;

  jobId: string;

  jobTitle: string;

  candidate:
    CandidateProfile;

  evaluation:
    EvaluationResult;

  message: string;
};

type UploadResultProps = {
  result:
    UploadResultData;

  criteria:
    Criterion[];
};

export default function UploadResult({
  result,
  criteria,
}: UploadResultProps) {
  const [
    showSummary,
    setShowSummary,
  ] = useState(false);

  return (
    <div className="space-y-6">

      <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                ✓
              </span>

              <h3 className="font-semibold text-slate-900">
                Candidate evaluated successfully
              </h3>
            </div>

            <div className="mt-4">

              <p className="font-semibold text-slate-900">
                {result.candidate
                  .name ||
                  "Unknown Candidate"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {
                  result.filename
                }
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                setShowSummary(
                  (current) =>
                    !current
                )
              }
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              {showSummary
                ? "Hide AI Summary"
                : "View AI Summary"}
            </button>

            <a
              href={`/api/applications/${result.applicationId}/cv`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View CV ↗
            </a>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">

          <ScoreDisplay
            score={
              result.evaluation
                .matchScore
            }
          />

          <CategoryBadge
            category={
              result.evaluation
                .fitCategory
            }
          />
        </div>
      </section>

      {showSummary && (
        <AISummary
          candidate={
            result.candidate
          }
          evaluation={
            result.evaluation
          }
          criteria={
            criteria
          }
        />
      )}
    </div>
  );
}