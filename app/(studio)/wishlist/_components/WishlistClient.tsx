"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  LayoutGrid,
  Table as TableIcon,
  Compass,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistItem } from "@/types/wishlist";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "cn";
import WishlistTable from "./WishlistTable";
import WishlistCards from "./WishlistCards";

interface WishlistClientProps {
  initialWishlist: WishlistItem[];
}

const WishlistClient = ({ initialWishlist = [] }: WishlistClientProps) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const items = wishlist.length > 0 || initialWishlist.length === 0 ? wishlist : initialWishlist;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
              Saved Wishlist
            </h1>
            <Badge variant="secondary" className="text-xs font-semibold">
              {items.length} {items.length === 1 ? "Space" : "Spaces"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Your saved production stages, podcast lounges, and creator suites.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {items.length > 0 && (
            <div className="inline-flex items-center rounded-lg border bg-muted/40 p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-7 px-2.5 text-xs font-medium cursor-pointer"
              >
                <LayoutGrid className="size-3.5 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-7 px-2.5 text-xs font-medium cursor-pointer"
              >
                <TableIcon className="size-3.5 mr-1" />
                Table
              </Button>
            </div>
          )}

          <Link
            href="/studios"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-9 text-xs font-semibold gap-1.5 shadow-xs"
            )}
          >
            <Compass className="size-4" />
            <span>Explore Studios</span>
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-2xl bg-card">
          <div className="size-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 border border-rose-500/20">
            <Heart className="size-8 fill-rose-500/30" />
          </div>
          <h3 className="text-xl font-bold font-heading text-foreground mb-2">
            Your Wishlist is Empty
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Click the heart icon on any studio card to save creative spaces here for quick access when you&apos;re ready to reserve.
          </p>
          <Link
            href="/studios"
            className={cn(buttonVariants(), "gap-2 font-semibold")}
          >
            <Compass className="size-4" />
            <span>Explore Studios</span>
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <WishlistCards items={items} onRemove={removeFromWishlist} />
      ) : (
        <WishlistTable items={items} onRemove={removeFromWishlist} />
      )}
    </>
  );
};

export default WishlistClient;

