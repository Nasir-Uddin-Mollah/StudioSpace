"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  Users,
  Clock,
  DollarSign,
  ShieldCheck,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  CalendarCheck,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import { Studio } from "@/types/studio";
import { cn } from "cn";
import BookingModal from "./BookingModal";

interface StudioDetailsClientProps {
  studio: Studio;
  initialIsBooked?: boolean;
}

const defaultReviews = [
  {
    author: "Elena Rostova",
    role: "Commercial Director",
    date: "2 weeks ago",
    rating: 5,
    comment:
      "One of the cleanest and best-equipped stages in the city. The lighting power handled our fixtures effortlessly and the host was very responsive.",
  },
  {
    author: "Marcus Chen",
    role: "Podcast Producer",
    date: "1 month ago",
    rating: 5,
    comment:
      "Acoustic isolation was exceptional. Zero street noise bled into our dialogue tracks. Will definitely book again.",
  },
];

const StudioDetailsClient = ({
  studio,
  initialIsBooked = false,
}: StudioDetailsClientProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isBooked, setIsBooked] = useState(initialIsBooked);
  const [activeIdx, setActiveIdx] = useState(0);

  const galleryImages = (
    studio.images && studio.images.length > 0
      ? studio.images
      : studio.image
        ? [studio.image]
        : []
  ).filter(Boolean);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    toast.add({
      title: isSaved ? "Removed from Wishlist" : "Saved to Wishlist ❤️",
      description: isSaved
        ? `"${studio.title}" removed.`
        : `"${studio.title}" saved to your collection.`,
    });
  };

  const hostInitials = studio.userName
    ? studio.userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SH";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <nav
        className="flex items-center gap-2 text-xs text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link
          href="/studios"
          className="hover:text-foreground transition-colors"
        >
          Studios
        </Link>
        <ChevronRight className="size-3" />
        <Link
          href={`/studios?category=${encodeURIComponent(studio.category)}`}
          className="hover:text-foreground transition-colors font-medium text-foreground"
        >
          {studio.category}
        </Link>
        <ChevronRight className="size-3" />
        <span className="truncate max-w-[200px] sm:max-w-xs">{studio.title}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-2">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="size-3 mr-1" />
              {studio.category}
            </Badge>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
              <Star className="size-3.5 fill-amber-500 text-amber-500" />
              <span>{(studio.rating ?? 4.9).toFixed(1)}</span>
              <span className="text-muted-foreground font-normal">
                ({studio.totalReviews ?? 24} reviews)
              </span>
            </div>

            <Badge
              variant="outline"
              className="text-xs font-medium border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
            >
              Instant Confirmation
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground font-heading">
            {studio.title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>{studio.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveToggle}
            className={`gap-1.5 text-xs font-medium ${
              isSaved ? "text-rose-500 border-rose-500/40" : ""
            }`}
          >
            <Heart
              className={`size-3.5 ${
                isSaved ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-3">
            <div className="relative group rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
              <div className="relative aspect-16/10 sm:aspect-16/9 w-full overflow-hidden bg-muted">
                <div
                  className="flex h-full w-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeIdx * 100}%)` }}
                >
                  {galleryImages.map((src, idx) => (
                    <div key={idx} className="relative h-full w-full shrink-0">
                      <Image
                        src={src}
                        alt={`${studio.title} - View ${idx + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        priority={idx === 0}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-9 rounded-full bg-background/90 hover:bg-background backdrop-blur-md border border-border/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-foreground shadow-md hover:scale-105 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-9 rounded-full bg-background/90 hover:bg-background backdrop-blur-md border border-border/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-foreground shadow-md hover:scale-105 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                <Badge
                  variant="secondary"
                  className="bg-black/60 hover:bg-black/70 text-white backdrop-blur-md border-white/20 text-xs font-medium"
                >
                  <Camera className="size-3 mr-1.5" />
                  <span>{studio.category} Stage</span>
                </Badge>

                {galleryImages.length > 1 && (
                  <Badge
                    variant="secondary"
                    className="bg-black/60 hover:bg-black/70 text-white backdrop-blur-md border-white/20 text-xs font-semibold"
                  >
                    {activeIdx + 1} / {galleryImages.length}
                  </Badge>
                )}
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                {galleryImages.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveIdx(idx);
                    }}
                    className={cn(
                      "relative aspect-16/10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-muted",
                      activeIdx === idx
                        ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                        : "border-border/60 opacity-70 hover:opacity-100 hover:border-border"
                    )}
                  >
                    <Image
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 15vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <DollarSign className="size-3.5 text-primary" />
                <span>Rate</span>
              </div>
              <p className="text-lg font-bold text-foreground font-heading">
                ${studio.hourlyRate}
                <span className="text-xs font-normal text-muted-foreground"> / hr</span>
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>Deposit</span>
              </div>
              <p className="text-lg font-bold text-foreground font-heading">
                ${studio.securityDeposit}
                <span className="text-xs font-normal text-muted-foreground"> ref.</span>
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="size-3.5 text-indigo-500" />
                <span>Capacity</span>
              </div>
              <p className="text-lg font-bold text-foreground font-heading">
                {studio.maxCapacity}
                <span className="text-xs font-normal text-muted-foreground"> creators</span>
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5 text-amber-500" />
                <span>Min Duration</span>
              </div>
              <p className="text-lg font-bold text-foreground font-heading">
                2 Hours
                <span className="text-xs font-normal text-muted-foreground"> min</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground font-heading">
              About this Space
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {studio.description}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground font-heading">
              Included Amenities & Gear
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {studio.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 bg-card text-xs font-medium text-foreground hover:bg-muted/30 transition-colors"
                >
                  <div className="size-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Check className="size-3 stroke-[2.5]" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Host Information
              </h4>
              <Badge
                variant="secondary"
                className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1"
              >
                <ShieldCheck className="size-3" />
                <span>Verified Host</span>
              </Badge>
            </div>

            <div className="flex items-center gap-3.5">
              <Avatar className="size-12 border-2 border-primary/20 shadow-xs">
                <AvatarFallback className="bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 text-foreground font-bold text-sm">
                  {hostInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="text-base font-bold text-foreground font-heading">
                  {studio.userName}
                </p>
                <p className="text-xs text-muted-foreground">{studio.userEmail}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Response Rate</span>
                <span className="font-semibold text-foreground">100%</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Response Time</span>
                <span className="font-semibold text-foreground">Under 1h</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Protection</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">$1M Guarantee</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground font-heading">
                Creator Reviews
              </h3>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="size-3.5 fill-amber-500" />
                <span>{(studio.rating ?? 4.9).toFixed(1)} / 5.0</span>
              </div>
            </div>

            <div className="space-y-3">
              {defaultReviews.map((rev, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground">{rev.author}</span>
                      <span className="text-muted-foreground"> • {rev.role}</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      <Star className="size-3 fill-amber-500" />
                      <span className="font-bold ml-1">{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-lg space-y-6">
            <div className="flex items-baseline justify-between pb-4 border-b border-border/70">
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-foreground font-heading">
                    ${studio.hourlyRate}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    / hour
                  </span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Instant Confirmation
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="size-3.5 fill-amber-500" />
                  <span>{(studio.rating ?? 4.9).toFixed(1)}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {studio.totalReviews ?? 24} reviews
                </span>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border/80 bg-muted/40 p-3.5 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Standard 4-Hour Session</span>
                <span className="font-semibold text-foreground">
                  ${studio.hourlyRate * 4}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Security Deposit</span>
                <span className="font-semibold text-foreground">
                  ${studio.securityDeposit}
                </span>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between font-bold text-foreground">
                <span>Estimated Total</span>
                <span className="text-primary font-heading text-sm">
                  ${studio.hourlyRate * 4 + studio.securityDeposit}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              disabled={isBooked}
              onClick={() => setIsBookingOpen(true)}
              className={cn(
                "w-full gap-2 font-bold text-sm shadow-md",
                isBooked
                  ? "bg-muted text-muted-foreground cursor-not-allowed opacity-90 border border-border"
                  : "cursor-pointer",
              )}
            >
              {isBooked ? (
                <>
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Workspace Booked</span>
                </>
              ) : (
                <>
                  <CalendarCheck className="size-4" />
                  <span>Book Workspace Now</span>
                </>
              )}
            </Button>

            <div className="space-y-2.5 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                <span>$1M Property & Equipment Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Free cancellation up to 48 hours before shoot</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary shrink-0" />
                <span>Direct digital door access upon booking</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 text-center">
              <p className="text-xs text-muted-foreground">
                Questions for the host?{" "}
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="font-semibold text-primary hover:underline cursor-pointer"
                >
                  Message {studio.userName}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        studio={studio}
        onBookingSuccess={() => setIsBooked(true)}
      />
    </div>
  );
};

export default StudioDetailsClient;
