"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  LayoutGrid,
  Table as TableIcon,
  Loader2,
  CalendarCheck,
  RotateCcw,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import { Booking } from "@/types/booking";
import { cn } from "cn";
import BookingsTable from "./BookingsTable";
import BookingsCards from "./BookingsCards";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface MyBookingsClientProps {
  initialBookings: Booking[];
}

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
] as const;

const MyBookingsClient = ({ initialBookings = [] }: MyBookingsClientProps) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings ?? []);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const pendingCount = bookings.filter(
    (b) => !b.status || b.status?.toLowerCase() === "pending",
  ).length;
  const confirmedCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "confirmed",
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "completed",
  ).length;
  const cancelledCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "cancelled",
  ).length;

  const getCountForFilter = (val: string) => {
    switch (val) {
      case "all":
        return bookings.length;
      case "pending":
        return pendingCount;
      case "confirmed":
        return confirmedCount;
      case "completed":
        return completedCount;
      case "cancelled":
        return cancelledCount;
      default:
        return 0;
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "all") return true;
    const currentStatus = b.status?.toLowerCase() || "pending";
    return currentStatus === statusFilter.toLowerCase();
  });

  const handleCancelConfirm = async () => {
    if (!bookingToCancel?._id) return;
    setIsCancelling(true);

    const token = await getTokenFromClient();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${bookingToCancel._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Cancelled" }),
        },
      );

      const data = await res.json();

      if (data.acknowledged || data.modifiedCount > 0) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingToCancel._id ? { ...b, status: "Cancelled" } : b,
          ),
        );
        toast.add({
          title: "Booking Cancelled",
          description: `Your reservation for "${bookingToCancel.studioTitle}" has been cancelled.`,
        });
        setBookingToCancel(null);
      }
    } catch {
      toast.add({
        title: "Cancellation Failed",
        description: "Unable to update booking status. Please try again.",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
              My Bookings
            </h1>
            <Badge variant="secondary" className="text-xs font-semibold">
              {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            View your upcoming sessions, reservation status, and manage active
            booking requests.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center rounded-lg border bg-muted/40 p-1">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-7 px-2.5 text-xs font-medium"
            >
              <TableIcon className="size-3.5 mr-1" />
              Table
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-7 px-2.5 text-xs font-medium"
            >
              <LayoutGrid className="size-3.5 mr-1" />
              Cards
            </Button>
          </div>

          <Link
            href="/studios"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 text-xs font-semibold gap-1.5 shadow-xs",
            )}
          >
            <CalendarCheck className="size-4" />
            <span>Book Space</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        {filterOptions.map((opt) => {
          const count = getCountForFilter(opt.value);
          const isActive = statusFilter === opt.value;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border-border",
              )}
            >
              <span>{opt.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-2xl bg-card">
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <CalendarDays className="size-8" />
          </div>
          <h3 className="text-xl font-bold font-heading text-foreground mb-2">
            No Reservations Found
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            You haven&apos;t reserved any creative workspaces yet. Browse
            verified studios and book your next shoot or production.
          </p>
          <Link
            href="/studios"
            className={cn(buttonVariants(), "gap-2 font-semibold")}
          >
            <CalendarCheck className="size-4" />
            <span>Explore Studios</span>
          </Link>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-2xl bg-card space-y-3">
          <p className="text-base font-semibold text-foreground">
            No {statusFilter} bookings
          </p>
          <p className="text-xs text-muted-foreground max-w-sm">
            There are currently no reservations matching the &quot;
            {statusFilter}&quot; status filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="gap-1.5 text-xs font-medium"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset Filter</span>
          </Button>
        </div>
      ) : viewMode === "table" ? (
        <BookingsTable
          bookings={filteredBookings}
          onCancel={(booking) => setBookingToCancel(booking)}
        />
      ) : (
        <BookingsCards
          bookings={filteredBookings}
          onCancel={(booking) => setBookingToCancel(booking)}
        />
      )}

      <AlertDialog
        open={!!bookingToCancel}
        onOpenChange={(open) => {
          if (!open) setBookingToCancel(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this reservation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your reservation for{" "}
              <strong className="text-foreground">
                &quot;{bookingToCancel?.studioTitle}&quot;
              </strong>{" "}
              on {bookingToCancel?.date} ({bookingToCancel?.hours} hrs)? Your
              slot will be released and the booking will be marked as Cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Keep Reservation
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancelConfirm();
              }}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Yes, Cancel Booking</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyBookingsClient;
