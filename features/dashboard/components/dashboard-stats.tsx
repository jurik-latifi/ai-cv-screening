import StatCard from "@/components/ui/stat-card";

type DashboardStatsProps = {
  totalJobs: number;

  totalCandidates: number;

  isAiActive: boolean;
};

export default function DashboardStats({
  totalJobs,
  totalCandidates,
  isAiActive,
}: DashboardStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">

      <StatCard
        label="Total Jobs"
        value={
          totalJobs
        }
        icon={
          totalJobs
        }
        tone="primary"
      />

      <StatCard
        label="Total Candidates"
        value={
          totalCandidates
        }
        icon="CV"
      />

      <StatCard
        label="CV Screening"
        value={
          isAiActive
            ? "AI Active"
            : "AI Inactive"
        }
        icon="AI"
        tone={
          isAiActive
            ? "success"
            : "danger"
        }
      />

    </section>
  );
}