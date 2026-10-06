import EditJobPage from "@/features/jobs/components/edit-job-page";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function Page({
  params,
}: PageProps) {
  return (
    <EditJobPage
      params={params}
    />
  );
}