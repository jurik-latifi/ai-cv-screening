import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  createJob,
  getJobs,
} from "@/features/jobs/services/job.service";

import {
  jobSchema,
} from "@/features/jobs/schemas/job.schema";

export async function GET() {
  try {
    const jobs = await getJobs();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Could not load jobs",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const validatedData =
      jobSchema.parse(body);

    const job =
      await createJob(validatedData);

    return NextResponse.json(
      job,
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid job data",
          details: error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        error: "Could not create job",
      },
      {
        status: 500,
      }
    );
  }
}