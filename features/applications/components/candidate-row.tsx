"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  RankedApplication,
} from "../services/application.service";

import type {
  CandidateProfile,
} from "@/features/cv-processing/schemas/candidate-profile.schema";

import type {
  Criterion,
} from "@/features/jobs/schemas/job.schema";

import type {
  CriterionResult,
  EliminationResult,
  EvaluationResult,
} from "@/features/evaluations/schemas/evaluation.schema";

import CategoryBadge from "@/features/evaluations/components/category-badge";

import ScoreDisplay from "@/features/evaluations/components/score-display";

import AISummary from "@/features/evaluations/components/ai-summary";

type CandidateRowProps = {
  application:
    RankedApplication;

  rank: number;

  isOpen: boolean;

  onToggle:
    () => void;

  criteria:
    Criterion[];
};

function mapCategory(
  category:
    | "STRONG_MATCH"
    | "POTENTIAL_MATCH"
    | "UNMATCHED"
): EvaluationResult["fitCategory"] {
  if (
    category ===
    "STRONG_MATCH"
  ) {
    return "Strong Match";
  }

  if (
    category ===
    "POTENTIAL_MATCH"
  ) {
    return "Potential Match";
  }

  return "Unmatched";
}

export default function CandidateRow({
  application,
  rank,
  isOpen,
  onToggle,
  criteria,
}: CandidateRowProps) {
  const router =
    useRouter();

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const evaluation =
    application.evaluation;

  if (!evaluation) {
    return null;
  }

  const candidate =
    application.candidate
      .parsedProfile as unknown as CandidateProfile;

  const evaluationCriteria =
    Array.isArray(
      evaluation.evaluationMatrix
    )
      ? (evaluation.evaluationMatrix as unknown as CriterionResult[])
      : [];

  const eliminationRules =
    Array.isArray(
      evaluation.eliminationRules
    )
      ? (evaluation.eliminationRules as unknown as EliminationResult[])
      : [];

  const normalizedEvaluation:
    EvaluationResult = {
      matchScore:
        evaluation.matchScore,

      fitCategory:
        mapCategory(
          evaluation.fitCategory
        ),

      criteria:
        evaluationCriteria,

      eliminationRules,

      justification:
        evaluation.aiJustification,

      failedEliminationRule:
        evaluation.failedEliminationRule,
    };

  async function handleDelete() {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${application.candidate.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const response =
        await fetch(
          `/api/applications/${application.id}`,
          {
            method:
              "DELETE",
          }
        );

      if (!response.ok) {
        let message =
          "Could not delete candidate.";

        try {
          const data =
            await response.json();

          if (
            data &&
            typeof data.error ===
              "string"
          ) {
            message =
              data.error;
          }
        } catch {
          // Response was not JSON.
        }

        throw new Error(
          message
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Delete candidate error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting the candidate."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">

      {/* ROW */}
      <div className="grid gap-4 p-5 md:grid-cols-[60px_1fr_110px_160px_auto] md:items-center">

        {/* RANK */}
        <div>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
            #{rank}
          </span>
        </div>

        {/* CANDIDATE */}
        <div>
          <p className="font-semibold text-slate-900">
            {
              application.candidate
                .name
            }
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {
              application.candidate
                .email ||
              "No email"
            }
          </p>

          {application.filename && (
            <p className="mt-1 text-xs text-slate-400">
              {
                application.filename
              }
            </p>
          )}
        </div>

        {/* SCORE */}
        <ScoreDisplay
          score={
            evaluation.matchScore
          }
        />

        {/* CATEGORY */}
        <div>
          <CategoryBadge
            category={
              normalizedEvaluation.fitCategory
            }
          />

          {evaluation.failedEliminationRule && (
            <p className="mt-2 text-xs font-medium text-red-600">
              Mandatory rule failed
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-2 md:justify-end">

          <button
            type="button"
            onClick={
              onToggle
            }
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            {isOpen
              ? "Hide AI Summary"
              : "View AI Summary"}
          </button>

          {application.cvMimeType ? (
            <a
              href={`/api/applications/${application.id}/cv`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View CV ↗
            </a>
          ) : (
            <span className="inline-flex items-center px-2 text-xs text-slate-400">
              CV unavailable
            </span>
          )}

          <button
            type="button"
            onClick={
              handleDelete
            }
            disabled={
              isDeleting
            }
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>

      {/* AI SUMMARY */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-slate-50 p-5">
          <AISummary
            candidate={
              candidate
            }
            evaluation={
              normalizedEvaluation
            }
            criteria={
              criteria
            }
          />
        </div>
      )}
    </article>
  );
}