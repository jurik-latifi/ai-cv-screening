import {
  NextResponse,
} from "next/server";

import {
  getJobById,
} from "@/features/jobs/services/job.service";

import {
  prepareDocument,
} from "@/features/cv-processing/services/document-parser";

import {
  extractCandidateFromPdf,
  extractCandidateFromText,
} from "@/features/cv-processing/services/cv-extractor";

import {
  evaluateCandidate,
} from "@/features/evaluations/services/evaluation.service";

import {
  saveApplication,
} from "@/features/applications/services/application.service";

export const runtime =
  "nodejs";

type JobCriterion = {
  name: string;
  description: string;
  weight: number;
};

type EliminationRule = {
  name: string;
  description: string;
};

function getMimeType(
  file: File
) {
  if (file.type) {
    return file.type;
  }

  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  if (extension === "pdf") {
    return "application/pdf";
  }

  if (extension === "docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  if (extension === "txt") {
    return "text/plain";
  }

  return "application/octet-stream";
}

export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const jobId =
      formData.get("jobId");

    if (
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            "CV file is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof jobId !==
        "string" ||
      !jobId
    ) {
      return NextResponse.json(
        {
          error:
            "Job ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const job =
      await getJobById(jobId);

    if (!job) {
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

    /*
     * ORIGINAL CV DATA
     *
     * File.arrayBuffer() gives us a real ArrayBuffer.
     * Prisma Bytes accepts Uint8Array.
     */
    const originalArrayBuffer =
      await file.arrayBuffer();

    const originalCvData =
      new Uint8Array(
        originalArrayBuffer
      );

    const cvMimeType =
      getMimeType(file);

    /*
     * Prepare document.
     */
    const document =
      await prepareDocument(
        file
      );

    /*
     * Extract candidate.
     */
    let candidateProfile;

    if (
      document.type ===
      "text"
    ) {
      candidateProfile =
        await extractCandidateFromText(
          document.text
        );
    } else {
      candidateProfile =
        await extractCandidateFromPdf(
          document.filename,
          document.buffer
        );
    }

    const criteria =
      job.criteria as JobCriterion[];

    const eliminationRules =
      job.eliminationRules as EliminationRule[];

    /*
     * Evaluate candidate.
     */
    const evaluation =
      await evaluateCandidate({
        candidate:
          candidateProfile,

        jobTitle:
          job.title,

        jobDescription:
          job.description,

        criteria,

        eliminationRules,
      });

    /*
     * Save everything.
     */
    const application =
      await saveApplication({
        jobId:
          job.id,

        filename:
          file.name,

        cvMimeType,

        cvData:
          originalCvData,

        candidate:
          candidateProfile,

        evaluation,
      });

    return NextResponse.json(
      {
        success: true,

        applicationId:
          application.id,

        candidateId:
          application.candidate.id,

        filename:
          file.name,

        jobId:
          job.id,

        jobTitle:
          job.title,

        candidate:
          candidateProfile,

        evaluation,

        message:
          "CV extracted, evaluated and saved successfully.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CV processing error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not process CV.",
      },
      {
        status: 400,
      }
    );
  }
}