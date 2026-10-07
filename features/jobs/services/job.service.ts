import { prisma } from "@/lib/db/prisma";

import type { CreateJobInput } from "../schemas/job.schema";

export async function createJob(data: CreateJobInput) {
  return prisma.job.create({
    data: {
      title: data.title,

      description: data.description,

      criteria: data.criteria,

      eliminationRules: data.eliminationRules,
    },
  });
}

export async function getJobs() {
  return prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({
    where: {
      id,
    },
  });
}

export async function deleteJob(id: string) {
  const applications = await prisma.application.findMany({
    where: {
      jobId: id,
    },
    select: {
      candidateId: true,
    },
  });

  const candidateIds = applications.map(
    (application) => application.candidateId,
  );

  await prisma.$transaction(async (tx) => {
    await tx.job.delete({
      where: {
        id,
      },
    });

    if (candidateIds.length > 0) {
      await tx.candidate.deleteMany({
        where: {
          id: {
            in: candidateIds,
          },
        },
      });
    }
  });
}
