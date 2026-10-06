import {
  getJobs,
} from "@/features/jobs/services/job.service";

import DashboardHeader from "./dashboard-header";

import DashboardStats from "./dashboard-stats";

import JobList from "./job-list";

export default async function DashboardPage() {
  const jobs =
    await getJobs();

  const totalCandidates =
    jobs.reduce(
      (
        total,
        job
      ) =>
        total +
        job._count
          .applications,
      0
    );

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">

        <DashboardHeader />

        <DashboardStats
          totalJobs={
            jobs.length
          }
          totalCandidates={
            totalCandidates
          }
        />

        <JobList
          jobs={
            jobs
          }
        />
      </div>
    </main>
  );
}