"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  DollarSign,
  Users,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  Check,
  Plus,
  X,
  Loader2,
  CloudUpload,
  ArrowLeft,
  AlertCircle,
  Shield,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { Studio, StudioCategory } from "@/types/studio";

const categoryOptions: StudioCategory[] = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
  "Dance Rehearsal",
  "Art Loft",
];

const standardAmenities: string[] = [
  "Lighting Grid",
  "Cyc Wall",
  "Soundproofing",
  "Air Conditioning",
  "High-Speed WiFi",
  "Dressing Room",
  "Kitchenette",
  "Free Parking",
  "Audio Interface",
  "Paper Backdrops",
  "Natural Daylight",
  "Restrooms",
  "Equipment Rental",
  "Freight Elevator",
];

interface EditStudioFormProps {
  studio: Studio;
  id: string;
}

const EditStudioForm = ({ studio, id }: EditStudioFormProps) => {
  const router = useRouter();

  const [title, setTitle] = useState(studio?.title ?? "");
  const [category, setCategory] = useState<StudioCategory | string>(
    studio?.category ?? "Photo Studio",
  );
  const [hourlyRate, setHourlyRate] = useState<number | string>(
    studio?.hourlyRate ?? "",
  );
  const [securityDeposit, setSecurityDeposit] = useState<number | string>(
    studio?.securityDeposit ?? "",
  );
  const [maxCapacity, setMaxCapacity] = useState<number | string>(
    studio?.maxCapacity ?? "",
  );
  const [location, setLocation] = useState(studio?.location ?? "");
  const [image, setImage] = useState(studio?.image ?? "");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    studio?.amenities ?? ["High-Speed WiFi", "Air Conditioning"],
  );
  const [customAmenity, setCustomAmenity] = useState("");
  const [description, setDescription] = useState(studio?.description ?? "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item],
    );
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (!trimmed) return;
    if (!selectedAmenities.includes(trimmed)) {
      setSelectedAmenities((prev) => [...prev, trimmed]);
    }
    setCustomAmenity("");
  };

  const handleImageFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Invalid File Type",
        description: "Please select a PNG, JPG, WEBP, or GIF image file.",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.add({
        title: "File Too Large",
        description: "Images must be smaller than 10MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.data?.url) {
        setImage(data.data.url);
        toast.add({
          title: "Image Uploaded! 📸",
          description:
            "Your studio photo has been hosted on ImgBB successfully.",
        });
      } else {
        toast.add({
          title: "Upload Failed",
          description:
            data.error?.message ||
            "Could not upload image to ImgBB. You can paste an image URL directly.",
        });
      }
    } catch {
      toast.add({
        title: "Upload Error",
        description:
          "Network error while uploading. You can paste a direct image URL instead.",
      });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();
    const trimmedImage = image.trim();
    const trimmedDescription = description.trim();
    const numHourlyRate = Number(hourlyRate);
    const numSecurityDeposit = Number(securityDeposit);
    const numMaxCapacity = Number(maxCapacity);

    if (!trimmedTitle || trimmedTitle.length < 5) {
      setFormError("Title must be at least 5 characters.");
      return;
    }

    if (!numHourlyRate || numHourlyRate <= 0) {
      setFormError("Hourly rate must be greater than $0.");
      return;
    }

    if (numSecurityDeposit < 0) {
      setFormError("Security deposit cannot be negative.");
      return;
    }

    if (!numMaxCapacity || numMaxCapacity < 1) {
      setFormError("Maximum capacity must be at least 1 guest.");
      return;
    }

    if (!trimmedLocation) {
      setFormError("Please enter a valid studio address.");
      return;
    }

    if (!trimmedImage) {
      setFormError("Please upload or provide a primary studio image URL.");
      return;
    }

    if (!trimmedDescription || trimmedDescription.length < 20) {
      setFormError(
        "Please provide a detailed overview of at least 20 characters.",
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: trimmedTitle,
      category,
      hourlyRate: numHourlyRate,
      securityDeposit: numSecurityDeposit,
      maxCapacity: numMaxCapacity,
      location: trimmedLocation,
      image: trimmedImage,
      amenities: selectedAmenities,
      description: trimmedDescription,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/studio/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();

    if (data.acknowledged || data.modifiedCount > 0) {
      toast.add({
        title: "Studio Updated Successfully! ✨",
        description: `"${trimmedTitle}" details have been updated.`,
      });
      router.push("/my-listings");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to My Listings</span>
        </Link>
      </div>

      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="size-3.5" />
          <span>Listing Editor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
          Update Studio Listing
        </h1>
        <p className="text-sm text-muted-foreground">
          Edit workspace details, adjust rates, update amenities, or refresh
          media.
        </p>
      </div>

      {formError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-wider">
              Submission Error
            </p>
            <p className="text-xs leading-relaxed">{formError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border border-border/80 shadow-md bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span>Workspace Details</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Provide core specifications and categorization for your listing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-xs font-semibold text-foreground"
              >
                Studio Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Daylight Cyclorama Loft with Grid"
                className="h-10 text-sm bg-background/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="category"
                  className="text-xs font-semibold text-foreground"
                >
                  Category <span className="text-rose-500">*</span>
                </Label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="location"
                  className="text-xs font-semibold text-foreground"
                >
                  Location / Street Address{" "}
                  <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. 450 Broadway, Soho, New York, NY"
                    className="pl-9 h-10 text-sm bg-background/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="hourlyRate"
                  className="text-xs font-semibold text-foreground"
                >
                  Hourly Rate ($) <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="75"
                    className="pl-9 h-10 text-sm bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="securityDeposit"
                  className="text-xs font-semibold text-foreground"
                >
                  Security Deposit ($) <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="securityDeposit"
                    name="securityDeposit"
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    placeholder="150"
                    className="pl-9 h-10 text-sm bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="maxCapacity"
                  className="text-xs font-semibold text-foreground"
                >
                  Max Capacity (Guests) <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Users className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="maxCapacity"
                    name="maxCapacity"
                    type="number"
                    min="1"
                    required
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    placeholder="15"
                    className="pl-9 h-10 text-sm bg-background/50"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-md bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ImageIcon className="size-4 text-primary" />
              <span>Studio Media & Showcase Image</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Upload a photo to ImgBB or enter a hosted direct image link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-xs font-semibold text-foreground"
              >
                Primary Studio Image URL{" "}
                <span className="text-rose-500">*</span>
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="image"
                    name="image"
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload below"
                    className="pl-9 h-10 text-sm bg-background/50"
                  />
                </div>

                <label className="inline-flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-lg text-xs font-semibold border border-border/80 bg-muted/50 hover:bg-muted text-foreground cursor-pointer transition-colors shadow-xs shrink-0">
                  {isUploading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <CloudUpload className="size-3.5 text-primary" />
                  )}
                  <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleImageFileUpload}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Select an image from your computer to automatically host it on
                ImgBB, or paste any image URL.
              </p>
            </div>

            {image ? (
              <div className="relative rounded-xl border border-border/80 overflow-hidden bg-muted/20 h-48 sm:h-56">
                <img
                  src={image}
                  alt="Studio preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    toast.add({
                      title: "Image Preview Error",
                      description:
                        "Could not load preview from this URL. Please verify the link.",
                    });
                  }}
                />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                  aria-label="Remove image"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-border/80 rounded-xl p-8 text-center bg-muted/10 space-y-2">
                <div className="size-10 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-5" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  No image attached yet
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Upload a high-resolution wide shot to captivate creators.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-md bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span>Amenities & Features</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Select all equipment, capabilities, and conveniences available
              on-site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {standardAmenities.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                      isChecked
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-muted/40 text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
                    }`}
                  >
                    {isChecked ? (
                      <Check className="size-3.5 shrink-0" />
                    ) : (
                      <Plus className="size-3.5 shrink-0 opacity-60" />
                    )}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <Input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomAmenity();
                  }
                }}
                placeholder="Add custom amenity tag (e.g. Smoke Machine)"
                className="h-9 text-xs bg-background/50 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCustomAmenity}
                className="h-9 text-xs font-medium cursor-pointer"
              >
                <Plus className="size-3.5 mr-1" />
                <span>Add Tag</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/80 shadow-md bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <span>Detailed Overview</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Describe the stage layout, lighting packages, acoustic isolation,
              and rules.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-xs font-semibold text-foreground"
              >
                Studio Description <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive breakdown of the workspace, included grip gear, access rules, ceiling height, noise isolation, and booking requirements..."
                className="text-sm bg-background/50 resize-y min-h-[120px]"
              />
            </div>

            <Separator className="my-2" />

            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-emerald-500" />
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Host Profile (Read-Only)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="userName"
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    Host Name
                  </Label>
                  <Input
                    id="userName"
                    name="userName"
                    type="text"
                    readOnly
                    disabled
                    value={studio?.userName ?? ""}
                    placeholder="Not specified"
                    className="h-9 text-xs bg-muted/50 cursor-not-allowed text-muted-foreground"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="userEmail"
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    Host Email
                  </Label>
                  <Input
                    id="userEmail"
                    name="userEmail"
                    type="email"
                    readOnly
                    disabled
                    value={studio?.userEmail ?? ""}
                    placeholder="Not specified"
                    className="h-9 text-xs bg-muted/50 cursor-not-allowed text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Link
            href="/my-listings"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border/80 text-xs font-semibold text-center hover:bg-muted transition-colors"
          >
            Cancel
          </Link>

          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full sm:w-auto h-11 px-8 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                <span>Updating Studio...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />
                <span>Update Studio Listing</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditStudioForm;
