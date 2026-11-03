import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Studio } from "@/types/studio";
import { auth } from "@/lib/auth";
import StudioDetailsClient from "./_components/StudioDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

const StudioDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  let studio: Studio | null = null;
  let initialIsBooked = false;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/studio/${id}`,
      { cache: "no-store" },
    );
    if (res.ok) {
      studio = await res.json();
    }
  } catch {
    studio = null;
  }

  if (studio) {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (session?.user?.email) {
        const bookingsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings?email=${encodeURIComponent(session.user.email)}`,
          { cache: "no-store" },
        );
        if (bookingsRes.ok) {
          const bookings = await bookingsRes.json();
          initialIsBooked = bookings.some(
            (b: { studioId: string }) => b.studioId === id,
          );
        }
      }
    } catch {
      initialIsBooked = false;
    }
  }

  if (!studio) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-4">
        <div className="size-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
          <Building2 className="size-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-foreground">
          Studio Not Found
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          The creative workspace you are looking for may have been unlisted,
          removed, or is temporarily unavailable.
        </p>
        <Link href="/studios" className={cn(buttonVariants(), "gap-2")}>
          <ArrowLeft className="size-4" />
          <span>Back to All Studios</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudioDetailsClient
        studio={studio}
        initialIsBooked={initialIsBooked}
      />
    </div>
  );
};

export default StudioDetailsPage;
