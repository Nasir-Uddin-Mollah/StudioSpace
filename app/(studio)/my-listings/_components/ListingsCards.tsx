import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, MapPin } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Studio } from "@/types/studio";
import { cn } from "cn";

interface ListingsCardsProps {
  studios: Studio[];
  onDelete: (studio: Studio) => void;
}

const ListingsCards = ({ studios, onDelete }: ListingsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {studios.map((studio) => (
        <Card
          key={studio._id || studio.title}
          className="overflow-hidden p-0 gap-0 flex flex-col justify-between border rounded-xl"
        >
          <div>
            <div className="h-48 w-full bg-muted relative overflow-hidden">
              <Image
                src={studio.image}
                alt={studio.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <Badge
                variant="secondary"
                className="absolute top-3 left-3 bg-background/90 backdrop-blur-xs font-medium text-xs shadow-xs z-10"
              >
                {studio.category}
              </Badge>
            </div>

            <CardContent className="p-4 space-y-3.5">
              <div>
                <h3 className="font-semibold text-base text-foreground line-clamp-1">
                  {studio.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="truncate">{studio.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2.5 px-2 rounded-lg bg-muted/40 border text-center text-xs">
                <div>
                  <p className="text-muted-foreground text-[11px]">Hourly</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    ${studio.hourlyRate}/hr
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Deposit</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    ${studio.securityDeposit}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Capacity</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {studio.maxCapacity} ppl
                  </p>
                </div>
              </div>
            </CardContent>
          </div>

          <CardFooter className="p-4 pt-1 pb-4 flex items-center gap-2 border-t-0 bg-transparent">
            <Link
              href={`/studios/edit/${studio._id}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "flex-1 h-9 text-xs font-medium gap-1.5"
              )}
            >
              <Pencil className="size-3.5" />
              Update
            </Link>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 h-9 text-xs font-medium gap-1.5"
              onClick={() => onDelete(studio)}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ListingsCards;
