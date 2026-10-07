"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

type DeleteJobButtonProps = {
  jobId: string;
};

export default function DeleteJobButton({
  jobId,
}: DeleteJobButtonProps) {
  const router =
    useRouter();

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  async function handleDelete() {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const response =
        await fetch(
          `/api/jobs/${jobId}`,
          {
            method:
              "DELETE",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Could not delete job."
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while deleting the job."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={
        handleDelete
      }
      disabled={
        isDeleting
      }
      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting
        ? "Deleting..."
        : "Delete Job"}
    </button>
  );
}