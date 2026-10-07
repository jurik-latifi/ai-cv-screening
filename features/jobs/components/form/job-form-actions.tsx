import Button from "@/components/ui/button";

import Card from "@/components/ui/card";

type JobFormActionsProps = {
  loading: boolean;

  isEdit: boolean;

  progress: number;

  totalWeight: number;
};

export default function JobFormActions({
  loading,
  isEdit,
  progress,
  totalWeight,
}: JobFormActionsProps) {
  const buttonText =
    loading
      ? isEdit
        ? `Re-evaluating... ${progress}%`
        : "Creating Job..."
      : isEdit
        ? "Save Changes & Re-evaluate"
        : "Create Job";

  return (
    <Card className="flex flex-wrap items-center justify-between gap-4 p-5">

      <p className="text-sm text-slate-500">
        Criteria weights must total 100%.
      </p>

      <Button
        type="submit"
        size="lg"
        disabled={
          loading ||
          totalWeight !==
            100
        }
        className="px-6 disabled:bg-slate-300"
      >
        {buttonText}
      </Button>

    </Card>
  );
}