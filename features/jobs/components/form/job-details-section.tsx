type JobDetailsSectionProps = {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

export default function JobDetailsSection({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: JobDetailsSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Job Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the basic information for the position.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Job Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              onTitleChange(event.target.value)
            }
            placeholder="e.g. Full-Stack React Developer"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Job Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(event) =>
              onDescriptionChange(event.target.value)
            }
            placeholder="e.g. Build and maintain modern web applications using React and Next.js."
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>
    </section>
  );
}