"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Studio } from "@/types/studio";
import { authClient } from "@/lib/auth-client";
import {
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  CreditCard,
  Loader2,
} from "lucide-react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface BookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  studio: Studio;
  onBookingSuccess?: () => void;
}

const BookingModal = ({
  isOpen,
  onOpenChange,
  studio,
  onBookingSuccess,
}: BookingModalProps) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [hours, setHours] = useState(4);
  const [crewSize, setCrewSize] = useState(Math.min(4, studio.maxCapacity));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = studio.hourlyRate * hours;
  const total = subtotal + studio.securityDeposit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.add({
        title: "Please select a date",
        description: "Choose a valid shoot date to proceed.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const bookingData = {
        studioId: studio._id,
        studioTitle: studio.title,
        studioImage: studio.image,
        studioCategory: studio.category,
        studioLocation: studio.location,
        hostEmail: studio.userEmail,
        hostName: studio.userName,
        userEmail: user?.email || "",
        userName: user?.name || "Creator",
        date,
        startTime,
        hours: Number(hours),
        crewSize: Number(crewSize),
        hourlyRate: studio.hourlyRate,
        securityDeposit: studio.securityDeposit,
        totalAmount: total,
        status: "Pending",
      };

      const token = await getTokenFromClient();

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();

      if (result.acknowledged || result.insertedId) {
        toast.add({
          title: "Booking Confirmed! 🎬",
          description: `Your reservation for "${studio.title}" on ${date} (${hours} hrs) has been submitted!`,
        });
        onOpenChange(false);
        onBookingSuccess?.();
      }
    } catch {
      toast.add({
        title: "Connection Error",
        description:
          "Unable to connect to the booking server. Please check your backend.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-6">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-xl font-bold font-heading">
            Book Workspace
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {studio.title} • ${studio.hourlyRate}/hr
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs font-semibold">
              Shoot Date
            </Label>
            <div className="relative">
              <Calendar className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="date"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="time" className="text-xs font-semibold">
                Start Time
              </Label>
              <div className="relative">
                <Clock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-9 h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hours" className="text-xs font-semibold">
                Duration (Hours)
              </Label>
              <Input
                id="hours"
                type="number"
                min={1}
                max={24}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="crew" className="text-xs font-semibold">
              Crew Size (Max {studio.maxCapacity})
            </Label>
            <div className="relative">
              <Users className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="crew"
                type="number"
                min={1}
                max={studio.maxCapacity}
                value={crewSize}
                onChange={(e) => setCrewSize(Number(e.target.value))}
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>
                ${studio.hourlyRate} × {hours} hours
              </span>
              <span className="font-semibold text-foreground">${subtotal}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Security Deposit (refundable)</span>
              <span className="font-semibold text-foreground">
                ${studio.securityDeposit}
              </span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between font-bold text-sm text-foreground">
              <span>Total Price</span>
              <span className="text-primary font-heading">${total}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
            <span>Includes $1M Host & Creator Protection Guarantee.</span>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CreditCard className="size-4" />
                  <span>Confirm Booking</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
