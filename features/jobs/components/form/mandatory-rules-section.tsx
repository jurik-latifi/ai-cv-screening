import Card from "@/components/ui/card";

import FormField from "@/components/ui/form-field";

import Input from "@/components/ui/input";

import Textarea from "@/components/ui/text-area";

import type {
  EliminationRule,
} from "../../schemas/job.schema";

type MandatoryRulesSectionProps = {
  rules:
    EliminationRule[];

  onAdd:
    () => void;

  onChange: (
    index: number,
    field:
      keyof EliminationRule,
    value: string
  ) => void;

  onRemove: (
    index: number
  ) => void;
};

type EliminationRuleRowProps = {
  rule:
    EliminationRule;

  index:
    number;

  onChange: (
    index: number,
    field:
      keyof EliminationRule,
    value: string
  ) => void;

  onRemove: (
    index: number
  ) => void;
};

function EliminationRuleRow({
  rule,
  index,
  onChange,
  onRemove,
}: EliminationRuleRowProps) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50/40 p-5">

      <div className="mb-4 flex items-center justify-between gap-4">

        <p className="font-semibold text-slate-900">
          Mandatory Requirement{" "}
          {index + 1}
        </p>

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

      </div>

      <div className="space-y-4">

        <FormField
          label="Requirement Name"
        >
          <Input
            type="text"
            tone="danger"
            value={
              rule.name
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
            placeholder="e.g. Work Authorization"
          />
        </FormField>

        <FormField
          label="Description"
        >
          <Textarea
            rows={3}
            tone="danger"
            value={
              rule.description
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
            placeholder="e.g. Candidate must be legally authorized to work in the required location."
          />
        </FormField>

      </div>

    </div>
  );
}

export default function MandatoryRulesSection({
  rules,
  onAdd,
  onChange,
  onRemove,
}: MandatoryRulesSectionProps) {
  return (
    <Card className="p-6">

      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Mandatory Requirements
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Hard rules that can eliminate a candidate.
        </p>
      </div>

      <div className="mt-6">

        {rules.length ===
        0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">

            <p className="font-medium text-slate-700">
              No mandatory requirements
            </p>

            <p className="mt-1 text-sm text-slate-500">
              This job can be created without elimination rules.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {rules.map(
              (
                rule,
                index
              ) => (
                <EliminationRuleRow
                  key={
                    index
                  }
                  rule={
                    rule
                  }
                  index={
                    index
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
        )}

      </div>

      <div className="mt-6">

        <button
          type="button"
          onClick={
            onAdd
          }
          className="inline-flex w-full items-center justify-center rounded-xl border-2 border-dashed border-red-200 bg-red-50/60 px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
        >
          + Add Requirement
        </button>

      </div>

    </Card>
  );
}