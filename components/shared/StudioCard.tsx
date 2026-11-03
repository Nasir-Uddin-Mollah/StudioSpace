"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Heart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Studio } from "@/types/studio";
import { cn } from "cn";

interface StudioCardProps {
  studio: Studio;
}

const StudioCard = ({ studio }: StudioCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
    toast.add({
      title: isWishlisted ? "Removed from Wishlist" : "Saved to Wishlist ❤️",
      description: isWishlisted
        ? `"${studio.title}" removed from your saved spaces.`
        : `"${studio.title}" added to your saved spaces.`,
    });
  };

  return (
    <div className="group relative bg-card border border-border/70 hover:border-primary/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div className="relative h-56 w-full bg-muted overflow-hidden">
        <Image
          src={
            studio.image ||
            "/categories/photo-studio.jpg"
          }
          alt={studio.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-black/60 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/20 shadow-xs z-10"
        >
          {studio.category}
        </Badge>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <div className="bg-black/60 text-white backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-bold border border-white/20 shadow-xs">
            <Star className="size-3 text-amber-400 fill-amber-400" />
            <span>{studio.rating ? studio.rating.toFixed(1) : "4.9"}</span>
          </div>

          <button
            type="button"
            onClick={handleToggleWishlist}
            className="size-7.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xs"
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Save to wishlist"
            }
          >
            <Heart
              className={cn(
                "size-3.5 transition-colors",
                isWishlisted
                  ? "fill-rose-500 text-rose-500"
                  : "text-white hover:text-rose-400",
              )}
            />
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors font-heading">
            {studio.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{studio.location}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border/60 space-y-3.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Starting from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-foreground font-heading">
                ${studio.hourlyRate}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                / hr
              </span>
            </div>
          </div>

          <Link
            href={`/studios/${studio._id}`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full h-10 text-xs font-semibold rounded-xl gap-1.5 shadow-xs hover:shadow transition-all group-hover:bg-primary/95",
            )}
          >
            <span>View Details</span>
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudioCard;

