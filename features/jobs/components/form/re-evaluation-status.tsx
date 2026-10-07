import Alert from "@/components/ui/alert";

import ProgressBar from "@/components/ui/progress-bar";

type ReEvaluationStatusProps = {
  candidateCount: number;

  loading: boolean;

  progress: number;
};

export default function ReEvaluationStatus({
  candidateCount,
  loading,
  progress,
}: ReEvaluationStatusProps) {
  return (
    <>
      {candidateCount >
        0 && (
        <Alert
          variant="warning"
          title="Existing candidates will be re-evaluated"
        >
          This job has{" "}
          {candidateCount}{" "}
          existing{" "}
          {candidateCount ===
          1
            ? "candidate"
            : "candidates"}
          . Saving changes
          will evaluate them
          again using the
          updated job
          configuration.
        </Alert>
      )}

      {loading && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-sm font-semibold text-indigo-900">
                Re-evaluating candidates
              </p>

              <p className="mt-1 text-xs text-indigo-600">
                Updating scores and rankings with the new job criteria.
              </p>
            </div>

            <span className="text-sm font-bold text-indigo-700">
              {progress}%
            </span>

          </div>

          <ProgressBar
            value={
              progress
            }
            className="mt-4"
          />

        </div>
      )}
    </>
  );
}