import Link from "next/link";
import { ArrowLeft, Compass, Film, Clapperboard, Sparkles, Camera } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const NotFound = () => {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        <div className="relative mx-auto size-44 sm:size-52 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-border/80 animate-spin [animation-duration:35s]" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-indigo-600/10 backdrop-blur-md border border-border/60 shadow-2xl flex items-center justify-center" />
          
          <div className="relative flex flex-col items-center justify-center space-y-2">
            <div className="relative">
              <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
                <Clapperboard className="size-8 sm:size-10 stroke-[2]" />
              </div>
              <span className="absolute -top-2 -right-2 size-7 rounded-full bg-background border border-border text-foreground flex items-center justify-center shadow-xs">
                <Camera className="size-3.5 text-primary" />
              </span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/80 border border-border text-[11px] font-semibold text-muted-foreground shadow-xs">
              <Film className="size-3 text-rose-500" />
              <span>SCENE 404 • TAKE 01</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Workspace Not Found</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading">
            Lost on Set?
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            The studio space, sound stage, or creative suite you are looking for doesn&apos;t exist, was relocated, or the shoot has already wrapped up.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full sm:w-auto h-11 px-6 font-semibold shadow-md",
            )}
          >
            <ArrowLeft className="size-4 mr-2" />
            Return to Home
          </Link>

          <Link
            href="/studios"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto h-11 px-6 font-semibold",
            )}
          >
            <Compass className="size-4 mr-2" />
            Explore Studios
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
