import { Suspense } from "react";
import { headers } from "next/headers";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/auth";
import MyBookingsClient from "./_components/MyBookingsClient";
import { Booking } from "@/types/booking";

const BookingsContent = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let initialBookings: Booking[] = [];

  try {
    if (session?.user?.email) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings?email=${encodeURIComponent(session.user.email)}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        initialBookings = await res.json();
      }
    }
  } catch {
    initialBookings = [];
  }

  return <MyBookingsClient initialBookings={initialBookings} />;
};

const MyBookingsPage = () => {
  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="size-8 animate-spin text-primary mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading your studio bookings...
              </p>
            </div>
          }
        >
          <BookingsContent />
        </Suspense>
      </div>
    </div>
  );
};

export default MyBookingsPage;
