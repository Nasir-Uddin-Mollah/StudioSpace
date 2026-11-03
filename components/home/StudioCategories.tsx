import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    name: "Photo Studio",
    label: "Photo Studios",
    description: "Cyclorama walls, daylight lofts, strobe lighting grids & backdrops.",
    image: "/categories/photo-studio.jpg",
    href: "/studios?category=Photo%20Studio",
  },
  {
    name: "Film Stage",
    label: "Sound Stages",
    description: "Acoustically treated stages, green screens, and vehicle drive-in ramps.",
    image: "/categories/film-stage.jpg",
    href: "/studios?category=Film%20Stage",
  },
  {
    name: "Podcast Lounge",
    label: "Podcast Rooms",
    description: "Multi-mic vocal setups, broadcast lighting, and 4K camera switchers.",
    image: "/categories/podcast-lounge.jpg",
    href: "/studios?category=Podcast%20Lounge",
  },
  {
    name: "Music Suite",
    label: "Music Suites",
    description: "Tuned control rooms, analog outboard gear, vocal booths, and monitors.",
    image: "/categories/music-suite.jpg",
    href: "/studios?category=Music%20Suite",
  },
  {
    name: "Workshop",
    label: "Art & Workshops",
    description: "Open floor plans, ceramic wheels, natural skylights, and heavy workbenches.",
    image: "/categories/workshop.jpg",
    href: "/studios?category=Workshop",
  },
  {
    name: "Dance Rehearsal",
    label: "Dance Rehearsals",
    description: "Sprung hardwood flooring, full-length wall mirrors, and sound systems.",
    image: "/categories/dance-rehearsal.jpg",
    href: "/studios?category=Dance%20Rehearsal",
  },
];

const StudioCategories = () => {
  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Compass className="size-3.5" />
              <span>Browse Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-heading">
              Browse by Studio Category
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              Find the perfect creative space tailored to your medium — photography, film, audio, or visual art.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-border/70 bg-card shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-6"
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 group-hover:from-black/95 group-hover:via-black/60 transition-colors duration-300" />

              <div className="relative z-10 space-y-2">
                <Badge
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-white/20 text-xs font-medium w-fit"
                >
                  <Sparkles className="size-3 mr-1 text-amber-300" />
                  <span>{cat.name}</span>
                </Badge>

                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight group-hover:text-amber-300 transition-colors">
                  {cat.label}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                  <span>Explore Spaces</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudioCategories;

