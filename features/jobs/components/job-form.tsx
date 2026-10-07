"use client";

import type {
  FormEvent,
} from "react";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Alert from "@/components/ui/alert";

import type {
  Criterion,
  EliminationRule,
} from "../schemas/job.schema";

import {
  validateJobForm,
} from "../utils/validate-job-form";

import JobDetailsSection from "./form/job-details-section";

import CriteriaSection from "./form/criteria-section";

import MandatoryRulesSection from "./form/mandatory-rules-section";

import ReEvaluationStatus from "./form/re-evaluation-status";

import JobFormActions from "./form/job-form-actions";

type JobFormProps = {
  mode?: "create" | "edit";

  jobId?: string;

  initialTitle?: string;

  initialDescription?: string;

  initialCriteria?:
    Criterion[];

  initialEliminationRules?:
    EliminationRule[];

  candidateCount?: number;
};

const EMPTY_CRITERION:
  Criterion = {
    name:
      "",

    description:
      "",

    weight:
      0,
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
    useState<
      Criterion[]
    >(
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
          name:
            "",

          description:
            "",
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

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const validationError =
      validateJobForm({
        title,
        description,
        criteria,
        eliminationRules,
        totalWeight,
      });

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

      if (
        isEdit
      ) {
        setProgress(
          5
        );

        progressInterval =
          setInterval(
            () => {
              setProgress(
                (
                  current
                ) => {
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

      if (
        isEdit
      ) {
        setProgress(
          100
        );

        await new Promise(
          (
            resolve
          ) =>
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

      setProgress(
        0
      );

      setError(
        error instanceof
          Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(
        false
      );
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
        title={
          title
        }
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

      {isEdit && (
        <ReEvaluationStatus
          candidateCount={
            candidateCount
          }
          loading={
            loading
          }
          progress={
            progress
          }
        />
      )}

      {error && (
        <Alert
          variant="danger"
        >
          {error}
        </Alert>
      )}

      <JobFormActions
        loading={
          loading
        }
        isEdit={
          isEdit
        }
        progress={
          progress
        }
        totalWeight={
          totalWeight
        }
      />

    </form>
  );
}