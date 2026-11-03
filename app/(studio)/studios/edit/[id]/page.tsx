import EditStudioForm from "./_components/EditStudioForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

const StudioUpdatePage = async ({ params }: PageProps) => {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/studio/${id}`
  );
  const studio = await res.json();

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <EditStudioForm studio={studio} id={id} />
    </div>
  );
};

export default StudioUpdatePage;
