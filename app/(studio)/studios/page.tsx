import Link from "next/link";
import { Sparkles, Building2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Studio } from "@/types/studio";
import { cn } from "cn";
import StudioCard from "@/components/shared/StudioCard";

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
              <StudioCard key={studio._id || studio.title} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudiosPage;
