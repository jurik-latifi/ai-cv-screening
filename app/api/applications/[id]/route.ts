import {
  NextResponse,
} from "next/server";

import {
  deleteApplicationById,
} from "@/features/applications/services/application.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    await deleteApplicationById(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Candidate deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete application error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not delete candidate.",
      },
      {
        status: 500,
      }
    );
  }
}