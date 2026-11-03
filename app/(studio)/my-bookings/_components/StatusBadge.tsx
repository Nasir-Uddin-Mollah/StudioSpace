import { Clock, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types/booking";
import { cn } from "cn";

interface StatusBadgeProps {
  status: BookingStatus | string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const normalized = status?.toLowerCase() || "pending";

  if (normalized === "pending") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1.5 font-medium text-xs py-1 px-2.5",
          className
        )}
      >
        <Clock className="size-3 shrink-0 text-amber-500" />
        <span>Pending</span>
      </Badge>
    );
  }

  if (normalized === "confirmed") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1.5 font-medium text-xs py-1 px-2.5",
          className
        )}
      >
        <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
        <span>Confirmed</span>
      </Badge>
    );
  }

  if (normalized === "completed") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 gap-1.5 font-medium text-xs py-1 px-2.5",
          className
        )}
      >
        <Sparkles className="size-3 shrink-0 text-blue-500" />
        <span>Completed</span>
      </Badge>
    );
  }

  if (normalized === "cancelled") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 gap-1.5 font-medium text-xs py-1 px-2.5",
          className
        )}
      >
        <XCircle className="size-3 shrink-0 text-rose-500" />
        <span>Cancelled</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn("text-xs py-1 px-2.5", className)}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;

