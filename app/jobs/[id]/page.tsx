import JobDetailsPage from "@/features/jobs/components/job-details-page";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function JobPage({
  params,
}: PageProps) {
  return (
    <JobDetailsPage
      params={params}
    />
  );
}