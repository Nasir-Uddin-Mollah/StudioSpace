import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Ban,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Booking } from "@/types/booking";
import { cn } from "cn";
import StatusBadge from "./StatusBadge";

interface BookingsTableProps {
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

const BookingsTable = ({ bookings, onCancel }: BookingsTableProps) => {
  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-x-auto">
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[300px]">Workspace</TableHead>
            <TableHead>Shoot Date & Time</TableHead>
            <TableHead>Crew</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const isPending =
              !booking.status || booking.status.toLowerCase() === "pending";

            return (
              <TableRow key={booking._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-14 rounded-lg overflow-hidden border bg-muted shrink-0 relative">
                      {booking.studioImage ? (
                        <Image
                          src={booking.studioImage}
                          alt={booking.studioTitle}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs font-semibold">
                          Studio
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="font-semibold text-sm text-foreground hover:text-primary transition-colors truncate block"
                      >
                        {booking.studioTitle}
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3 shrink-0" />
                        <span className="truncate">{booking.studioLocation}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3 text-muted-foreground" />
                      <span>
                        {booking.startTime} ({booking.hours} {booking.hours === 1 ? "hr" : "hrs"})
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3.5" />
                    <span>{booking.crewSize} guests</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm text-foreground font-heading">
                      ${booking.totalAmount}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      ${booking.hourlyRate}/hr + ${booking.securityDeposit} dep
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>

                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "h-8 px-2.5 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ExternalLink className="size-3.5" />
                      <span>View</span>
                    </Link>

                    {isPending && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCancel(booking)}
                        className="h-8 px-2.5 text-xs font-medium gap-1 text-destructive hover:bg-destructive/10 border-destructive/30 cursor-pointer"
                      >
                        <Ban className="size-3.5" />
                        <span>Cancel Booking</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTable;

