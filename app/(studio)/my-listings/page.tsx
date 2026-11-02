import { Suspense } from "react";
import { headers } from "next/headers";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/auth";
import MyListingsClient from "./_components/MyListingsClient";

const ListingsContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/my-listings?email=${session?.user?.email}`,
  );
  const initialStudios = await res.json();

  return <MyListingsClient initialStudios={initialStudios} />;
};

const MyListingsPage = () => {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="size-8 animate-spin text-primary mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading your studio listings...
              </p>
            </div>
          }
        >
          <ListingsContent />
        </Suspense>
      </div>
    </div>
  );
};

export default MyListingsPage;
