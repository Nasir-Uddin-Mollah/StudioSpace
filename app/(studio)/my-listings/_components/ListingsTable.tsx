import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, MapPin, Users } from "lucide-react";

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
import { Studio } from "@/types/studio";
import { cn } from "cn";

interface ListingsTableProps {
  studios: Studio[];
  onDelete: (studio: Studio) => void;
}

const ListingsTable = ({ studios, onDelete }: ListingsTableProps) => {
  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[320px]">Studio Space</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Deposit</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studios.map((studio) => (
            <TableRow key={studio._id || studio.title}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="size-14 rounded-lg overflow-hidden border bg-muted shrink-0 relative">
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {studio.title}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />
                      <span className="truncate">{studio.location}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs font-normal">
                  {studio.category}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-sm text-foreground">
                  ${studio.hourlyRate}
                </span>
                <span className="text-xs text-muted-foreground">/hr</span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  ${studio.securityDeposit}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3.5" />
                  <span>{studio.maxCapacity} guests</span>
                </div>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/studios/edit/${studio._id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-8 px-2.5 text-xs font-medium gap-1"
                    )}
                  >
                    <Pencil className="size-3.5" />
                    Update
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 px-2.5 text-xs font-medium gap-1"
                    onClick={() => onDelete(studio)}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
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

export default ListingsTable;
