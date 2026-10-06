import { prisma } from "@/lib/db/prisma";

import {
  candidateProfileSchema,
} from "@/features/cv-processing/schemas/candidate-profile.schema";

import {
  getApplicationsForReevaluation,
  mapFitCategory,
} from "@/features/applications/services/application.service";

import type {
  CreateJobInput,
} from "@/features/jobs/schemas/job.schema";

import type {
  EvaluationResult,
} from "../schemas/evaluation.schema";

import {
  evaluateCandidate,
} from "./evaluation.service";

type UpdateJobAndReevaluateInput = {
  jobId: string;
  job: CreateJobInput;
};

type PreparedEvaluation = {
  applicationId: string;
  evaluation: EvaluationResult;
};

const EVALUATION_TIMEOUT_MS =
  120_000;

async function withTimeout<T>(
  promise: Promise<T>,
  milliseconds: number,
  message: string
): Promise<T> {
  let timeoutId:
    ReturnType<typeof setTimeout>
    | undefined;

  const timeoutPromise =
    new Promise<never>(
      (_, reject) => {
        timeoutId =
          setTimeout(
            () => {
              reject(
                new Error(
                  message
                )
              );
            },
            milliseconds
          );
      }
    );

  try {
    return await Promise.race([
      promise,
      timeoutPromise,
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(
        timeoutId
      );
    }
  }
}

export async function updateJobAndReevaluateCandidates({
  jobId,
  job,
}: UpdateJobAndReevaluateInput) {
  const applications =
    await getApplicationsForReevaluation(
      jobId
    );

  /*
   * No candidates?
   *
   * We can update the job immediately.
   */
  if (
    applications.length ===
    0
  ) {
    const updatedJob =
      await prisma.job.update({
        where: {
          id: jobId,
        },

        data: {
          title:
            job.title,

          description:
            job.description,

          criteria:
            job.criteria,

          eliminationRules:
            job.eliminationRules,
        },
      });

    return {
      job: updatedJob,
      reevaluated: 0,
    };
  }

  /*
   * STEP 1
   *
   * Evaluate all candidates in parallel.
   *
   * Nothing is written to the database yet.
   */
  const preparedEvaluations =
    await Promise.all(
      applications.map(
        async (
          application
        ): Promise<PreparedEvaluation> => {
          const parsedCandidate =
            candidateProfileSchema.safeParse(
              application
                .candidate
                .parsedProfile
            );

          if (
            !parsedCandidate.success
          ) {
            console.error(
              "Stored candidate profile validation error:",
              parsedCandidate.error.flatten()
            );

            throw new Error(
              "A stored candidate profile is invalid."
            );
          }

          const candidateName =
            parsedCandidate.data
              .name ||
            "Unknown Candidate";

          const evaluation =
            await withTimeout(
              evaluateCandidate({
                candidate:
                  parsedCandidate.data,

                jobTitle:
                  job.title,

                jobDescription:
                  job.description,

                criteria:
                  job.criteria,

                eliminationRules:
                  job.eliminationRules,
              }),

              EVALUATION_TIMEOUT_MS,

              `Re-evaluation timed out for ${candidateName}.`
            );

          return {
            applicationId:
              application.id,

            evaluation,
          };
        }
      )
    );

  /*
   * STEP 2
   *
   * All AI evaluations succeeded.
   *
   * Now update job + evaluations
   * together inside one transaction.
   */
  const updatedJob =
    await prisma.$transaction(
      async (tx) => {
        const jobRecord =
          await tx.job.update({
            where: {
              id:
                jobId,
            },

            data: {
              title:
                job.title,

              description:
                job.description,

              criteria:
                job.criteria,

              eliminationRules:
                job.eliminationRules,
            },
          });

        for (
          const item of
            preparedEvaluations
        ) {
          const {
            evaluation,
          } = item;

          await tx.evaluation.upsert({
            where: {
              applicationId:
                item.applicationId,
            },

            create: {
              applicationId:
                item.applicationId,

              matchScore:
                evaluation.matchScore,

              fitCategory:
                mapFitCategory(
                  evaluation.fitCategory
                ),

              evaluationMatrix:
                evaluation.criteria,

              eliminationRules:
                evaluation.eliminationRules,

              aiJustification:
                evaluation.justification,

              failedEliminationRule:
                evaluation.failedEliminationRule,
            },

            update: {
              matchScore:
                evaluation.matchScore,

              fitCategory:
                mapFitCategory(
                  evaluation.fitCategory
                ),

              evaluationMatrix:
                evaluation.criteria,

              eliminationRules:
                evaluation.eliminationRules,

              aiJustification:
                evaluation.justification,

              failedEliminationRule:
                evaluation.failedEliminationRule,
            },
          });
        }

        return jobRecord;
      }
    );

  return {
    job:
      updatedJob,

    reevaluated:
      preparedEvaluations.length,
  };
}