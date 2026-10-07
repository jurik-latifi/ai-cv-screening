import Card from "@/components/ui/card";

import FormField from "@/components/ui/form-field";

import Input from "@/components/ui/input";

import Textarea from "@/components/ui/text-area";

type JobDetailsSectionProps = {
  title: string;

  description: string;

  onTitleChange:
    (value: string) => void;

  onDescriptionChange:
    (value: string) => void;
};

export default function JobDetailsSection({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: JobDetailsSectionProps) {
  return (
    <Card className="p-6">

      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Job Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the basic information for the position.
        </p>
      </div>

      <div className="mt-6 space-y-5">

        <FormField
          label="Job Title"
        >
          <Input
            type="text"
            value={
              title
            }
            onChange={(
              event
            ) =>
              onTitleChange(
                event.target
                  .value
              )
            }
            placeholder="e.g. Full-Stack React Developer"
          />
        </FormField>

        <FormField
          label="Job Description"
        >
          <Textarea
            rows={5}
            value={
              description
            }
            onChange={(
              event
            ) =>
              onDescriptionChange(
                event.target
                  .value
              )
            }
            placeholder="e.g. Build and maintain modern web applications using React and Next.js."
          />
        </FormField>

      </div>

    </Card>
  );
}