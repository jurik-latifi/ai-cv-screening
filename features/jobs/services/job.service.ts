import {
  prisma,
} from "@/lib/db/prisma";

import type {
  CreateJobInput,
} from "../schemas/job.schema";

export async function createJob(
  data: CreateJobInput
) {
  return prisma.job.create({
    data: {
      title:
        data.title,

      description:
        data.description,

      criteria:
        data.criteria,

      eliminationRules:
        data.eliminationRules,
    },
  });
}

export async function getJobs() {
  return prisma.job.findMany({
    orderBy: {
      createdAt:
        "desc",
    },

    include: {
      _count: {
        select: {
          applications:
            true,
        },
      },
    },
  });
}

export async function getJobById(
  id: string
) {
  return prisma.job.findUnique({
    where: {
      id,
    },
  });
}