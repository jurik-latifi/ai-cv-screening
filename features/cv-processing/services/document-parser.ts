import mammoth from "mammoth";

export type PreparedDocument =
  | {
      type: "text";
      filename: string;
      mimeType: string;
      text: string;
    }
  | {
      type: "pdf";
      filename: string;
      mimeType: string;
      buffer: Buffer;
    };

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function prepareDocument(
  file: File
): Promise<PreparedDocument> {
  if (file.size === 0) {
    throw new Error("The selected file is empty.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "The CV must be smaller than 4 MB."
    );
  }

  const filename = file.name;
  const extension = filename
    .split(".")
    .pop()
    ?.toLowerCase();

  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  /*
   * TXT
   */
  if (extension === "txt") {
    const text = buffer
      .toString("utf-8")
      .trim();

    if (!text) {
      throw new Error(
        "No readable text was found in the TXT file."
      );
    }

    return {
      type: "text",
      filename,
      mimeType: "text/plain",
      text,
    };
  }

  /*
   * DOCX
   */
  if (extension === "docx") {
    const signature = buffer
      .subarray(0, 2)
      .toString("ascii");

    if (signature !== "PK") {
      throw new Error(
        "The selected file is not a valid DOCX document."
      );
    }

    const result =
      await mammoth.extractRawText({
        buffer,
      });

    const text = result.value.trim();

    if (!text) {
      throw new Error(
        "No readable text was found in the DOCX file."
      );
    }

    return {
      type: "text",
      filename,
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      text,
    };
  }

  /*
   * PDF
   */
  if (extension === "pdf") {
    const signature = buffer
      .subarray(0, 5)
      .toString("ascii");

    if (signature !== "%PDF-") {
      throw new Error(
        "The selected file is not a valid PDF document."
      );
    }

    return {
      type: "pdf",
      filename,
      mimeType: "application/pdf",
      buffer,
    };
  }

  throw new Error(
    "Unsupported file format. Upload PDF, DOCX or TXT."
  );
}