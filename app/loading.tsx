import { Aperture } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-background space-y-10">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="relative flex items-center justify-center size-20">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 blur-xl opacity-40 animate-pulse" />
          <div className="relative size-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-rose-500/20">
            <Aperture className="size-8 stroke-[2.2] animate-spin [animation-duration:2.5s]" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold tracking-tight text-foreground">
            Calibrating StudioSpace
          </h3>
          <p className="text-xs text-muted-foreground animate-pulse">
            Loading workspaces, availability & gear...
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl space-y-6 px-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border/60 bg-card p-4 space-y-4 overflow-hidden"
            >
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <Skeleton className="h-5 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-3/5 rounded-md" />
              </div>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;

