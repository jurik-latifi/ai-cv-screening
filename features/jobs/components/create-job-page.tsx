import BackLink from "@/components/ui/back-link";

import PageHeader from "@/components/ui/page-header";

import PageShell from "@/components/ui/page-shell";

import JobForm from "./job-form";

export default function CreateJobPage() {
  return (
    <PageShell maxWidth="5xl">

      <BackLink
        href="/"
        className="mb-6"
      >
        Back to Dashboard
      </BackLink>

      <PageHeader
        eyebrow="Job Setup"
        title="Create New Job"
        description="Configure the job, evaluation criteria and mandatory requirements used by the AI screening system."
      />

      <JobForm />

    </PageShell>
  );
}