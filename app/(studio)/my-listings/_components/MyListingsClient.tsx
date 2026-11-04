"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Loader2,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/toast";
import { Studio } from "@/types/studio";
import { cn } from "cn";
import ListingsTable from "./ListingsTable";
import ListingsCards from "./ListingsCards";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface MyListingsClientProps {
  initialStudios: Studio[];
}

const MyListingsClient = ({ initialStudios = [] }: MyListingsClientProps) => {
  const [studios, setStudios] = useState<Studio[]>(initialStudios ?? []);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!studioToDelete?._id) return;
    setIsDeleting(true);

    const token = await getTokenFromClient();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/studios/${studioToDelete._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();

    if (data.acknowledged || data.deletedCount > 0) {
      setStudios((prev) => prev.filter((s) => s._id !== studioToDelete._id));
      toast.add({
        title: "Studio Deleted",
        description: `"${studioToDelete.title}" has been permanently removed.`,
      });
      setStudioToDelete(null);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
              My Studio Listings
            </h1>
            <Badge variant="secondary" className="text-xs font-semibold">
              {studios.length} {studios.length === 1 ? "Space" : "Spaces"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your listed studios, update details, or remove inactive
            spaces.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center rounded-lg border bg-muted/40 p-1">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-7 px-2.5 text-xs font-medium"
            >
              <TableIcon className="size-3.5 mr-1" />
              Table
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-7 px-2.5 text-xs font-medium"
            >
              <LayoutGrid className="size-3.5 mr-1" />
              Cards
            </Button>
          </div>

          <Link
            href="/add-studio"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "gap-1.5",
            )}
          >
            <Plus className="size-4" />
            Add New Studio
          </Link>
        </div>
      </div>

      {studios.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card/50 p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Building2 className="size-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No Studio Listings Yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            You haven&apos;t published any creative studios yet. Share your
            space and start earning today!
          </p>
          <Link
            href="/add-studio"
            className={cn(buttonVariants({ variant: "default" }), "gap-2")}
          >
            <Plus className="size-4" />
            List Your First Studio
          </Link>
        </div>
      ) : viewMode === "table" ? (
        <ListingsTable studios={studios} onDelete={setStudioToDelete} />
      ) : (
        <ListingsCards studios={studios} onDelete={setStudioToDelete} />
      )}

      <AlertDialog
        open={!!studioToDelete}
        onOpenChange={(open) => {
          if (!open) setStudioToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Studio Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{studioToDelete?.title}
              &rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setStudioToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                  Deleting...
                </>
              ) : (
                "Delete Studio"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyListingsClient;
