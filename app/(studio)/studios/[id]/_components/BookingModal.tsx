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
import { Calendar, Clock, Users, ShieldCheck, CreditCard } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  studio: Studio;
}

const BookingModal = ({ isOpen, onOpenChange, studio }: BookingModalProps) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [hours, setHours] = useState(4);
  const [crewSize, setCrewSize] = useState(Math.min(4, studio.maxCapacity));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = studio.hourlyRate * hours;
  const total = subtotal + studio.securityDeposit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.add({
        title: "Please select a date",
        description: "Choose a valid shoot date to proceed.",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      toast.add({
        title: "Booking Requested! 🎬",
        description: `Your reservation for "${studio.title}" on ${date} (${hours} hrs) has been sent to ${studio.userName}.`,
      });
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 font-semibold"
            >
              <CreditCard className="size-4" />
              <span>{isSubmitting ? "Submitting..." : "Confirm Booking"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
