"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  Criterion,
  EliminationRule,
} from "../schemas/job.schema";

import JobDetailsSection from "./form/job-details-section";
import CriteriaSection from "./form/criteria-section";
import MandatoryRulesSection from "./form/mandatory-rules-section";

type JobFormProps = {
  mode?: "create" | "edit";
  jobId?: string;

  initialTitle?: string;
  initialDescription?: string;

  initialCriteria?: Criterion[];

  initialEliminationRules?: EliminationRule[];

  candidateCount?: number;
};

const EMPTY_CRITERION: Criterion = {
  name: "",
  description: "",
  weight: 0,
};

export default function JobForm({
  mode = "create",
  jobId,
  initialTitle = "",
  initialDescription = "",
  initialCriteria,
  initialEliminationRules = [],
  candidateCount = 0,
}: JobFormProps) {
  const router =
    useRouter();

  const isEdit =
    mode === "edit";

  const [
    title,
    setTitle,
  ] =
    useState(
      initialTitle
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      initialDescription
    );

  const [
    criteria,
    setCriteria,
  ] =
    useState<Criterion[]>(
      initialCriteria?.length
        ? initialCriteria
        : [
            {
              ...EMPTY_CRITERION,
            },
          ]
    );

  const [
    eliminationRules,
    setEliminationRules,
  ] =
    useState<
      EliminationRule[]
    >(
      initialEliminationRules
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    progress,
    setProgress,
  ] =
    useState(0);

  const [
    error,
    setError,
  ] =
    useState("");

  const totalWeight =
    criteria.reduce(
      (
        total,
        criterion
      ) =>
        total +
        Number(
          criterion.weight
        ),
      0
    );

  function addCriterion() {
    setCriteria(
      (current) => [
        ...current,

        {
          ...EMPTY_CRITERION,
        },
      ]
    );
  }

  function updateCriterion(
    index: number,
    field:
      keyof Criterion,
    value:
      string | number
  ) {
    setCriteria(
      (current) =>
        current.map(
          (
            criterion,
            criterionIndex
          ) =>
            criterionIndex ===
            index
              ? {
                  ...criterion,
                  [field]:
                    value,
                }
              : criterion
        )
    );
  }

  function removeCriterion(
    index: number
  ) {
    setCriteria(
      (current) =>
        current.filter(
          (
            _,
            criterionIndex
          ) =>
            criterionIndex !==
            index
        )
    );
  }

  function addEliminationRule() {
    setEliminationRules(
      (current) => [
        ...current,

        {
          name: "",
          description: "",
        },
      ]
    );
  }

  function updateEliminationRule(
    index: number,
    field:
      keyof EliminationRule,
    value: string
  ) {
    setEliminationRules(
      (current) =>
        current.map(
          (
            rule,
            ruleIndex
          ) =>
            ruleIndex ===
            index
              ? {
                  ...rule,
                  [field]:
                    value,
                }
              : rule
        )
    );
  }

  function removeEliminationRule(
    index: number
  ) {
    setEliminationRules(
      (current) =>
        current.filter(
          (
            _,
            ruleIndex
          ) =>
            ruleIndex !==
            index
        )
    );
  }

  function validateForm() {
    if (
      !title.trim()
    ) {
      return "Job title is required.";
    }

    if (
      !description.trim()
    ) {
      return "Job description is required.";
    }

    if (
      criteria.length ===
      0
    ) {
      return "At least one criterion is required.";
    }

    const incompleteCriterion =
      criteria.some(
        (
          criterion
        ) =>
          !criterion.name.trim() ||
          !criterion.description.trim()
      );

    if (
      incompleteCriterion
    ) {
      return "Every criterion must have a name and description.";
    }

    if (
      totalWeight !==
      100
    ) {
      return "Criteria weights must total exactly 100%.";
    }

    const incompleteRule =
      eliminationRules.some(
        (
          rule
        ) =>
          !rule.name.trim() ||
          !rule.description.trim()
      );

    if (
      incompleteRule
    ) {
      return "Every mandatory requirement must have a name and description.";
    }

    return null;
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (
      validationError
    ) {
      setError(
        validationError
      );

      return;
    }

    if (
      isEdit &&
      !jobId
    ) {
      setError(
        "Job ID is missing."
      );

      return;
    }

    let progressInterval:
      ReturnType<
        typeof setInterval
      >
      | undefined;

    try {
      setLoading(true);

      /*
       * Show progress mainly for
       * re-evaluation because it can
       * take longer than job creation.
       */
      if (isEdit) {
        setProgress(5);

        progressInterval =
          setInterval(
            () => {
              setProgress(
                (current) => {
                  if (
                    current <
                    50
                  ) {
                    return Math.min(
                      current +
                        7,
                      50
                    );
                  }

                  if (
                    current <
                    80
                  ) {
                    return Math.min(
                      current +
                        4,
                      80
                    );
                  }

                  if (
                    current <
                    95
                  ) {
                    return Math.min(
                      current +
                        1,
                      95
                    );
                  }

                  return current;
                }
              );
            },
            700
          );
      }

      const endpoint =
        isEdit
          ? `/api/jobs/${jobId}`
          : "/api/jobs";

      const response =
        await fetch(
          endpoint,
          {
            method:
              isEdit
                ? "PATCH"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                title:
                  title.trim(),

                description:
                  description.trim(),

                criteria,

                eliminationRules,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Could not save job."
        );
      }

      if (
        progressInterval
      ) {
        clearInterval(
          progressInterval
        );
      }

      if (isEdit) {
        setProgress(100);

        /*
         * Small delay so the user can
         * visually see 100% before
         * redirecting.
         */
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500
            )
        );
      }

      router.push(
        `/jobs/${data.id}`
      );

      router.refresh();
    } catch (
      error
    ) {
      if (
        progressInterval
      ) {
        clearInterval(
          progressInterval
        );
      }

      setProgress(0);

      setError(
        error instanceof
          Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-8"
    >
      <JobDetailsSection
        title={title}
        description={
          description
        }
        onTitleChange={
          setTitle
        }
        onDescriptionChange={
          setDescription
        }
      />

      <CriteriaSection
        criteria={
          criteria
        }
        totalWeight={
          totalWeight
        }
        onAdd={
          addCriterion
        }
        onChange={
          updateCriterion
        }
        onRemove={
          removeCriterion
        }
      />

      <MandatoryRulesSection
        rules={
          eliminationRules
        }
        onAdd={
          addEliminationRule
        }
        onChange={
          updateEliminationRule
        }
        onRemove={
          removeEliminationRule
        }
      />

      {isEdit &&
        candidateCount >
          0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="font-semibold text-amber-800">
              Existing candidates will be re-evaluated
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-700">
              This job has{" "}
              {
                candidateCount
              }{" "}
              existing{" "}
              {candidateCount ===
              1
                ? "candidate"
                : "candidates"}
              . Saving changes
              will evaluate them
              again using the
              updated job
              configuration.
            </p>
          </div>
        )}

      {/* RE-EVALUATION PROGRESS */}
      {isEdit &&
        loading && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-indigo-900">
                  Re-evaluating candidates
                </p>

                <p className="mt-1 text-xs text-indigo-600">
                  Updating scores and rankings with the new job criteria.
                </p>
              </div>

              <span className="text-sm font-bold text-indigo-700">
                {progress}%
              </span>
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-indigo-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">
          Criteria weights must
          total 100%.
        </p>

        <button
          type="submit"
          disabled={
            loading ||
            totalWeight !==
              100
          }
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading
            ? isEdit
              ? `Re-evaluating... ${progress}%`
              : "Creating Job..."
            : isEdit
              ? "Save Changes & Re-evaluate"
              : "Create Job"}
        </button>
      </div>
    </form>
  );
}