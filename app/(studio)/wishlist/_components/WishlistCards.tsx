import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Heart, ArrowRight, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistItem } from "@/types/wishlist";
import { cn } from "cn";

interface WishlistCardsProps {
  items: WishlistItem[];
  onRemove: (studioId: string) => void;
}

const WishlistCards = ({ items, onRemove }: WishlistCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item._id || item.studioId}
          className="group relative bg-card border border-border/70 hover:border-primary/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div className="relative h-56 w-full bg-muted overflow-hidden">
            <Image
              src={item.image || "/categories/photo-studio.jpg"}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            <Badge
              variant="secondary"
              className="absolute top-3 left-3 bg-black/60 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/20 shadow-xs z-10"
            >
              {item.category}
            </Badge>

            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
              <div className="bg-black/60 text-white backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-bold border border-white/20 shadow-xs">
                <Star className="size-3 text-amber-400 fill-amber-400" />
                <span>{(item.rating ?? 4.9).toFixed(1)}</span>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.studioId)}
                className="size-7.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-xs"
                aria-label="Remove from wishlist"
              >
                <Heart className="size-3.5 fill-rose-500 text-rose-500" />
              </button>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors font-heading">
                {item.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 shrink-0 text-primary" />
                <span className="truncate">{item.location}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 space-y-3.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  Starting from
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-foreground font-heading">
                    ${item.hourlyRate}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    / hr
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/studios/${item.studioId}`}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "flex-1 h-10 text-xs font-semibold rounded-xl gap-1.5 shadow-xs hover:shadow transition-all group-hover:bg-primary/95"
                  )}
                >
                  <span>View Details</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRemove(item.studioId)}
                  className="size-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border/80 cursor-pointer shrink-0"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishlistCards;

