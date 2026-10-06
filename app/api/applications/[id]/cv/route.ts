import {
  getApplicationCvById,
} from "@/features/applications/services/application.service";

export const runtime =
  "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    const application =
      await getApplicationCvById(
        id
      );

    if (
      !application ||
      !application.cvData
    ) {
      return new Response(
        "CV not found.",
        {
          status: 404,
        }
      );
    }

    const filename =
      application.filename ||
      "candidate-cv";

    const mimeType =
      application.cvMimeType ||
      "application/octet-stream";

    const fileData =
      new Uint8Array(
        application.cvData
      );

    return new Response(
      fileData,
      {
        status: 200,

        headers: {
          "Content-Type":
            mimeType,

          "Content-Disposition":
            `inline; filename="${filename.replace(/"/g, "")}"`,

          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "CV retrieval error:",
      error
    );

    return new Response(
      "Could not load CV.",
      {
        status: 500,
      }
    );
  }
}