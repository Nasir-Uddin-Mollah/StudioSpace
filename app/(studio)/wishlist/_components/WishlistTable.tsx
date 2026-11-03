import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Trash2, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { WishlistItem } from "@/types/wishlist";
import { cn } from "cn";

interface WishlistTableProps {
  items: WishlistItem[];
  onRemove: (studioId: string) => void;
}

const WishlistTable = ({ items, onRemove }: WishlistTableProps) => {
  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-x-auto">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[320px]">Workspace</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id || item.studioId}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="size-14 rounded-lg overflow-hidden border bg-muted shrink-0 relative">
                    <Image
                      src={item.image || "/categories/photo-studio.jpg"}
                      alt={item.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link
                      href={`/studios/${item.studioId}`}
                      className="font-semibold text-sm text-foreground hover:text-primary transition-colors truncate block"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="secondary" className="text-xs font-normal">
                  {item.category}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="space-y-0.5">
                  <span className="font-bold text-sm text-foreground">
                    ${item.hourlyRate}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    /hr
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="size-3.5 fill-amber-500" />
                  <span>{(item.rating ?? 4.9).toFixed(1)}</span>
                </div>
              </TableCell>

              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/studios/${item.studioId}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-8 px-2.5 text-xs font-medium gap-1"
                    )}
                  >
                    <span>View</span>
                    <ArrowRight className="size-3" />
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(item.studioId)}
                    className="h-8 px-2.5 text-xs font-medium gap-1 text-destructive hover:bg-destructive/10 border-destructive/30 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Remove</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WishlistTable;

