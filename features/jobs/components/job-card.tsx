import ActionLink from "@/components/ui/action-link";

import Badge from "@/components/ui/badge";

import Card from "@/components/ui/card";

import type {
  getJobs,
} from "../services/job.service";

type Jobs =
  Awaited<
    ReturnType<
      typeof getJobs
    >
  >;

type Job =
  Jobs[number];

type JobCardProps = {
  job: Job;
};

export default function JobCard({
  job,
}: JobCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between p-5 transition hover:border-indigo-200">

      <div>

        <div className="flex items-start justify-between gap-4">

          <h3 className="text-lg font-semibold text-slate-900">
            {job.title}
          </h3>

          <Badge
            variant="success"
            size="sm"
          >
            Active
          </Badge>

        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
          {job.description}
        </p>

        <div className="mt-4">

          <Badge
            variant="neutral"
            className="rounded-lg text-sm"
          >
            {
              job._count
                .applications
            }{" "}
            {
              job._count
                .applications ===
              1
                ? "Candidate"
                : "Candidates"
            }
          </Badge>

        </div>

      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">

        <p className="text-xs text-slate-400">
          {
            new Date(
              job.createdAt
            ).toLocaleDateString()
          }
        </p>

        <ActionLink
          href={`/jobs/${job.id}`}
          variant="soft"
          size="sm"
        >
          Open Job →
        </ActionLink>

      </div>

    </Card>
  );
}