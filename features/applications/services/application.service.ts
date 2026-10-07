import { prisma } from "@/lib/db/prisma";

import type {
  CandidateProfile,
} from "@/features/cv-processing/schemas/candidate-profile.schema";

import type {
  EvaluationResult,
} from "@/features/evaluations/schemas/evaluation.schema";

type SaveApplicationInput = {
  jobId: string;

  filename: string;

  cvMimeType: string;

  cvData: Uint8Array<ArrayBuffer>;

  candidate: CandidateProfile;

  evaluation: EvaluationResult;
};

export function mapFitCategory(
  fitCategory:
    EvaluationResult["fitCategory"]
) {
  if (
    fitCategory ===
    "Strong Match"
  ) {
    return "STRONG_MATCH" as const;
  }

  if (
    fitCategory ===
    "Potential Match"
  ) {
    return "POTENTIAL_MATCH" as const;
  }

  return "UNMATCHED" as const;
}

export async function getApplicationsForReevaluation(
  jobId: string
) {
  return prisma.application.findMany({
    where: {
      jobId,
    },

    select: {
      id: true,

      candidate: {
        select: {
          parsedProfile:
            true,
        },
      },
    },
  });
}

export async function saveApplication({
  jobId,
  filename,
  cvMimeType,
  cvData,
  candidate,
  evaluation,
}: SaveApplicationInput) {
  return prisma.application.create({
    data: {
      filename,

      cvMimeType,

      cvData,

      job: {
        connect: {
          id: jobId,
        },
      },

      candidate: {
        create: {
          name:
            candidate.name ||
            "Unknown Candidate",

          email:
            candidate.email ||
            null,

          phone:
            candidate.phone ||
            null,

          linkedin:
            candidate.linkedin ||
            null,

          parsedProfile:
            JSON.parse(
              JSON.stringify(
                candidate
              )
            ),
        },
      },

      evaluation: {
        create: {
          matchScore:
            evaluation.matchScore,

          fitCategory:
            mapFitCategory(
              evaluation.fitCategory
            ),

          evaluationMatrix:
            JSON.parse(
              JSON.stringify(
                evaluation.criteria
              )
            ),

          eliminationRules:
            JSON.parse(
              JSON.stringify(
                evaluation.eliminationRules
              )
            ),

          aiJustification:
            evaluation.justification,

          failedEliminationRule:
            evaluation.failedEliminationRule,
        },
      },
    },

    include: {
      candidate:
        true,

      evaluation:
        true,
    },
  });
}

export async function getRankedApplicationsByJobId(
  jobId: string
) {
  const applications =
    await prisma.application.findMany({
      where: {
        jobId,
      },

      select: {
        id:
          true,

        filename:
          true,

        cvMimeType:
          true,

        createdAt:
          true,

        candidate: {
          select: {
            id:
              true,

            name:
              true,

            email:
              true,

            parsedProfile:
              true,
          },
        },

        evaluation:
          true,
      },
    });

  return applications.sort(
    (
      a: (typeof applications)[number],
      b: (typeof applications)[number]
    ) =>
      (
        b.evaluation
          ?.matchScore ??
        0
      ) -
      (
        a.evaluation
          ?.matchScore ??
        0
      )
  );
}

export async function getApplicationCvById(
  applicationId: string
) {
  return prisma.application.findUnique({
    where: {
      id:
        applicationId,
    },

    select: {
      filename:
        true,

      cvMimeType:
        true,

      cvData:
        true,
    },
  });
}

export async function deleteApplicationById(
  applicationId: string
) {
  return prisma.application.delete({
    where: {
      id:
        applicationId,
    },
  });
}

export type RankedApplication =
  Awaited<
    ReturnType<
      typeof getRankedApplicationsByJobId
    >
  >[number];