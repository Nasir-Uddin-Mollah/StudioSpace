import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Ban,
  ShieldCheck,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Booking } from "@/types/booking";
import { cn } from "cn";
import StatusBadge from "./StatusBadge";

interface BookingsCardsProps {
  bookings: Booking[];
  onCancel: (booking: Booking) => void;
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const BookingsCards = ({ bookings, onCancel }: BookingsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => {
        const isPending =
          !booking.status || booking.status.toLowerCase() === "pending";

        return (
          <Card
            key={booking._id}
            className="overflow-hidden border border-border bg-card shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {booking.studioImage ? (
                  <Image
                    src={booking.studioImage}
                    alt={booking.studioTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm font-semibold">
                    Workspace
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 z-10">
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold backdrop-blur-md bg-black/50 text-white border-white/10"
                  >
                    {booking.studioCategory}
                  </Badge>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <StatusBadge status={booking.status} />
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <p className="text-white font-bold text-base line-clamp-1 font-heading">
                    {booking.studioTitle}
                  </p>
                  <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{booking.studioLocation}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3 text-muted-foreground" />
                      Shoot Date
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatDate(booking.date)}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3 text-muted-foreground" />
                      Time & Length
                    </span>
                    <span className="font-semibold text-foreground">
                      {booking.startTime} ({booking.hours}h)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-b border-border/60">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="size-3.5" />
                    <span>Crew Size:</span>
                    <span className="font-medium text-foreground">
                      {booking.crewSize} people
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                    <span>Deposit: ${booking.securityDeposit}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-muted-foreground">Total Reserved</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-foreground font-heading">
                      ${booking.totalAmount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-4 pt-0 border-t border-border/60 mt-2 flex items-center gap-2">
              <Link
                href={`/studios/${booking.studioId}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "flex-1 h-9 text-xs font-semibold gap-1.5"
                )}
              >
                <ExternalLink className="size-3.5" />
                <span>View Studio</span>
              </Link>

              {isPending && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(booking)}
                  className="flex-1 h-9 text-xs font-semibold gap-1.5 text-destructive hover:bg-destructive/10 border-destructive/30 cursor-pointer"
                >
                  <Ban className="size-3.5" />
                  <span>Cancel Booking</span>
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default BookingsCards;

