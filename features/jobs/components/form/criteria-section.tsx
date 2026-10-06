import type {
  Criterion,
} from "../../schemas/job.schema";

type CriteriaSectionProps = {
  criteria: Criterion[];
  totalWeight: number;

  onAdd: () => void;

  onChange: (
    index: number,
    field:
      keyof Criterion,
    value:
      string | number
  ) => void;

  onRemove: (
    index: number
  ) => void;
};

type CriterionRowProps = {
  criterion:
    Criterion;

  index:
    number;

  canRemove:
    boolean;

  onChange: (
    index: number,
    field:
      keyof Criterion,
    value:
      string | number
  ) => void;

  onRemove: (
    index: number
  ) => void;
};

function CriterionRow({
  criterion,
  index,
  canRemove,
  onChange,
  onRemove,
}: CriterionRowProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-semibold text-slate-900">
          Criterion{" "}
          {index + 1}
        </p>

        {canRemove && (
          <button
            type="button"
            onClick={() =>
              onRemove(
                index
              )
            }
            className="text-sm font-semibold text-red-600 transition hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_120px]">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Name
          </label>

          <input
            type="text"
            value={
              criterion.name
            }
            onChange={(
              event
            ) =>
              onChange(
                index,
                "name",
                event.target
                  .value
              )
            }
            placeholder="e.g. Technical Skills"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Weight %
          </label>

          <input
            type="number"
            min={1}
            max={100}
            step={1}
            value={
              criterion.weight ===
              0
                ? ""
                : criterion.weight
            }
            onChange={(
              event
            ) =>
              onChange(
                index,
                "weight",

                event.target
                  .value ===
                  ""
                  ? 0
                  : Number(
                      event
                        .target
                        .value
                    )
              )
            }
            placeholder="e.g. 50"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          rows={3}
          value={
            criterion.description
          }
          onChange={(
            event
          ) =>
            onChange(
              index,
              "description",
              event.target
                .value
            )
          }
          placeholder="e.g. Relevant technical skills required for the role."
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>
    </div>
  );
}

export default function CriteriaSection({
  criteria,
  totalWeight,
  onAdd,
  onChange,
  onRemove,
}: CriteriaSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Evaluation Criteria
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure the
          weighted requirements
          used for scoring.
        </p>
      </div>

      <div className="my-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">
        <div>
          <span className="text-sm font-medium text-slate-600">
            Total Weight
          </span>

          <p className="mt-1 text-xs text-slate-500">
            Every criterion
            must have a weight
            greater than 0%.
          </p>
        </div>

        <span
          className={`text-lg font-bold ${
            totalWeight ===
            100
              ? "text-emerald-600"
              : totalWeight >
                  100
                ? "text-red-600"
                : "text-amber-600"
          }`}
        >
          {totalWeight}%
        </span>
      </div>

      <div className="space-y-4">
        {criteria.map(
          (
            criterion,
            index
          ) => (
            <CriterionRow
              key={
                index
              }
              criterion={
                criterion
              }
              index={
                index
              }
              canRemove={
                criteria.length >
                1
              }
              onChange={
                onChange
              }
              onRemove={
                onRemove
              }
            />
          )
        )}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={
            onAdd
          }
          className="inline-flex w-full items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
        >
          + Add Criterion
        </button>
      </div>
    </section>
  );
}