import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Studio } from "@/types/studio";
import { cn } from "cn";
import StudioCard from "@/components/shared/StudioCard";

const FeaturedStudios = async () => {
  let studios: Studio[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/featured-studios`,
      { cache: "no-store" },
    );
    const data = await res.json();
    studios = Array.isArray(data) ? data : (data?.data ?? []);
  } catch {
    studios = [];
  }

  if (studios.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>Top Rated Spaces</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-heading">
              Featured Creative Studios
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Handpicked production spaces, daylight cyc lofts, and recording
              suites trusted by professional creators.
            </p>
          </div>

          <Link
            href="/studios"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 self-start sm:self-auto h-9 text-xs font-semibold",
            )}
          >
            <span>Explore All Studios</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <StudioCard key={studio._id || studio.title} studio={studio} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStudios;
