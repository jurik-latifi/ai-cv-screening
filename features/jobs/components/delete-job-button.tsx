"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Button from "@/components/ui/button";

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
      console.error(
        error
      );

      alert(
        "Something went wrong while deleting the job."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="danger"
      size="lg"
      onClick={
        handleDelete
      }
      disabled={
        isDeleting
      }
      className="shadow-sm"
    >
      {isDeleting
        ? "Deleting..."
        : "Delete Job"}
    </Button>
  );
}