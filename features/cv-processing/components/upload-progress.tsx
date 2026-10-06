type UploadProgressProps = {
  progress: number;
};

export default function UploadProgress({
  progress,
}: UploadProgressProps) {
  return (
    <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">

      <div className="mb-2 flex items-center justify-between gap-4">

        <p className="text-sm font-semibold text-slate-700">
          Processing CV...
        </p>

        <p className="text-sm font-bold text-indigo-600">
          {progress}%
        </p>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-indigo-100">

        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Please wait while the CV
        is being processed.
      </p>
    </div>
  );
}