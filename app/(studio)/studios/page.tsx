import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Sparkles, Building2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Studio } from "@/types/studio";
import { cn } from "cn";

interface PageProps {
  searchParams?: Promise<{ category?: string }>;
}

const StudiosPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedCategory = resolvedSearchParams?.category;

  let studios: Studio[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/studios`, {
      cache: "no-store",
    });
    const data = await res.json();
    const allStudios: Studio[] = Array.isArray(data)
      ? data
      : (data?.data ?? []);

    studios = selectedCategory
      ? allStudios.filter(
          (s) => s.category?.toLowerCase() === selectedCategory.toLowerCase(),
        )
      : allStudios;
  } catch {
    studios = [];
  }

  return (
    <div className="min-h-screen bg-background py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="space-y-4 border-b pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Studio Directory</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-heading">
                Explore Creative Studios
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                Discover and book verified photography stages, cinema sound
                stages, podcast studios, and creative suites.
              </p>
            </div>

            <Badge
              variant="secondary"
              className="self-start sm:self-auto text-xs font-semibold px-3 py-1"
            >
              {studios.length} {studios.length === 1 ? "Space" : "Spaces"}{" "}
              Available
            </Badge>
          </div>

          {selectedCategory && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-muted-foreground">
                Filtered by:
              </span>
              <Badge variant="default" className="text-xs gap-1.5 pr-1">
                <span>{selectedCategory}</span>
                <Link
                  href="/studios"
                  className="rounded-full hover:bg-black/20 p-0.5 transition-colors"
                >
                  <X className="size-3" />
                </Link>
              </Badge>
            </div>
          )}
        </div>

        {studios.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/50 p-16 text-center max-w-md mx-auto space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Building2 className="size-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                No Studios Found
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedCategory
                  ? `No studios found in "${selectedCategory}". Try exploring other categories.`
                  : "No studio listings are currently active. Check back soon or list your own space!"}
              </p>
            </div>
            {selectedCategory ? (
              <Link
                href="/studios"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                )}
              >
                Clear Category Filter
              </Link>
            ) : (
              <Link
                href="/add-studio"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                )}
              >
                List Your Studio
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studios.map((studio) => (
              <Card
                key={studio._id || studio.title}
                className="overflow-hidden p-0 gap-0 flex flex-col justify-between border rounded-2xl hover:shadow-lg transition-shadow duration-300 group"
              >
                <div>
                  <div className="h-56 w-full bg-muted relative overflow-hidden">
                    <Image
                      src={
                        studio.image ||
                        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80"
                      }
                      alt={studio.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-3 left-3 bg-background/90 backdrop-blur-xs font-medium text-xs shadow-xs z-10"
                    >
                      {studio.category}
                    </Badge>
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-bold text-foreground shadow-xs z-10">
                      <Star className="size-3 text-amber-500 fill-amber-500" />
                      <span>
                        {studio.rating ? studio.rating.toFixed(1) : "5.0"}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {studio.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{studio.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-baseline justify-between border-t text-sm">
                      <span className="text-xs text-muted-foreground">
                        Hourly Rate
                      </span>
                      <div>
                        <span className="font-bold text-lg text-foreground">
                          ${studio.hourlyRate}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          / hr
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="p-5 pt-0">
                  <Link
                    href={`/studios/${studio._id}`}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full h-10 text-xs font-semibold rounded-xl",
                    )}
                  >
                    View Details
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudiosPage;
