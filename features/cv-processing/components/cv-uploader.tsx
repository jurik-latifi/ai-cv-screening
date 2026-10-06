"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import type {
  Criterion,
} from "@/features/jobs/schemas/job.schema";

import UploadProgress from "./upload-progress";

import UploadResult, {
  type UploadResultData,
} from "./upload-result";

type CVUploaderProps = {
  jobId: string;
  criteria: Criterion[];
};

const MAX_FILE_SIZE =
  4 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "pdf",
  "docx",
  "txt",
];

export default function CVUploader({
  jobId,
  criteria,
}: CVUploaderProps) {
  const router =
    useRouter();

  const [
    file,
    setFile,
  ] = useState<File | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    progress,
    setProgress,
  ] = useState(0);

  const [
    error,
    setError,
  ] = useState("");

  const [
    result,
    setResult,
  ] =
    useState<UploadResultData | null>(
      null
    );

  /*
   * While the CV is being processed,
   * gradually move the progress bar.
   *
   * The request itself does not provide
   * real server-side progress, so this is
   * visual progress until the request
   * finishes.
   */
  useEffect(() => {
    if (!loading) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setProgress(
          (current) => {
            if (
              current >= 95
            ) {
              return 95;
            }

            if (
              current < 30
            ) {
              return (
                current + 5
              );
            }

            if (
              current < 60
            ) {
              return (
                current + 3
              );
            }

            if (
              current < 80
            ) {
              return (
                current + 2
              );
            }

            return current + 1;
          }
        );
      }, 700);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [loading]);

  function handleFileChange(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    setError("");
    setResult(null);
    setProgress(0);

    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);

      return;
    }

    const extension =
      selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !extension ||
      !ALLOWED_EXTENSIONS.includes(
        extension
      )
    ) {
      setFile(null);

      setError(
        "Only PDF, DOCX and TXT files are supported."
      );

      event.target.value =
        "";

      return;
    }

    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {
      setFile(null);

      setError(
        "The CV must be smaller than 4 MB."
      );

      event.target.value =
        "";

      return;
    }

    if (
      selectedFile.size === 0
    ) {
      setFile(null);

      setError(
        "The selected file is empty."
      );

      event.target.value =
        "";

      return;
    }

    setFile(
      selectedFile
    );
  }

  async function handleUpload() {
    if (!file) {
      setError(
        "Please select a CV first."
      );

      return;
    }

    try {
      setError("");
      setResult(null);

      /*
       * Start progress here instead of
       * setting state directly inside
       * useEffect.
       */
      setProgress(5);

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "jobId",
        jobId
      );

      const response =
        await fetch(
          "/api/applications",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          "CV processing error:",
          data
        );

        throw new Error(
          data.error ||
            "CV processing failed."
        );
      }

      setProgress(100);

      setResult(
        data as UploadResultData
      );

      router.refresh();

      /*
       * Give the UI a moment to show
       * 100% before loading ends.
       */
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            500
          )
      );
    } catch (error) {
      setProgress(0);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* UPLOAD */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Upload Candidate CV
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Upload a PDF, DOCX or TXT
            file. Maximum size is
            4 MB.
          </p>
        </div>

        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={
              handleFileChange
            }
            disabled={
              loading
            }
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 disabled:cursor-not-allowed"
          />

          {file && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </p>
            </div>
          )}
        </div>

        {loading && (
          <UploadProgress
            progress={
              progress
            }
          />
        )}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={
              handleUpload
            }
            disabled={
              !file ||
              loading
            }
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading
              ? `Processing... ${progress}%`
              : "Upload & Evaluate CV"}
          </button>
        </div>
      </section>

      {/* RESULT */}
      {result && (
        <UploadResult
          result={
            result
          }
          criteria={
            criteria
          }
        />
      )}
    </div>
  );
}