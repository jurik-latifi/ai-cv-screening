import {
  NextResponse,
} from "next/server";

import {
  jobSchema,
} from "@/features/jobs/schemas/job.schema";

import {
  getJobById,
} from "@/features/jobs/services/job.service";

import {
  updateJobAndReevaluateCandidates,
} from "@/features/evaluations/services/job-reevaluation.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    const existingJob =
      await getJobById(
        id
      );

    if (!existingJob) {
      return NextResponse.json(
        {
          error:
            "Job not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body =
      await request.json();

    const parsed =
      jobSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error
              .issues[0]
              ?.message ||
            "Invalid job data.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await updateJobAndReevaluateCandidates(
        {
          jobId:
            id,

          job:
            parsed.data,
        }
      );

    return NextResponse.json({
      id:
        result.job.id,

      reevaluated:
        result.reevaluated,
    });
  } catch (error) {
    console.error(
      "Update job and re-evaluation error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Could not update job and re-evaluate candidates.";

    return NextResponse.json(
      {
        error:
          message,
      },
      {
        status: 500,
      }
    );
  }
}