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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { StudioCategory } from "@/types/studio";
import { cn } from "cn";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

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

const AddStudioPage = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<StudioCategory | string>(
    "Photo Studio",
  );
  const [hourlyRate, setHourlyRate] = useState<number | string>("");
  const [securityDeposit, setSecurityDeposit] = useState<number | string>("");
  const [maxCapacity, setMaxCapacity] = useState<number | string>("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "High-Speed WiFi",
    "Air Conditioning",
  ]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [description, setDescription] = useState("");

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
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remaining = 3 - images.length;
    if (remaining <= 0) {
      toast.add({
        title: "Photo Limit Reached",
        description: "You can upload a maximum of 3 photos for your studio.",
      });
      return;
    }

    const filesToUpload = files.slice(0, remaining);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    try {
      setIsUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        if (!file.type.startsWith("image/")) continue;
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.data?.url) {
          uploadedUrls.push(data.data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls].slice(0, 3));
        toast.add({
          title: "Photos Uploaded! 📸",
          description: `Uploaded ${uploadedUrls.length} ${
            uploadedUrls.length === 1 ? "photo" : "photos"
          } successfully.`,
        });
      } else {
        toast.add({
          title: "Upload Failed",
          description:
            "Could not upload image to ImgBB. You can paste direct image URLs instead.",
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

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (images.length >= 3) {
      toast.add({
        title: "Photo Limit Reached",
        description: "You can upload a maximum of 3 photos for your studio.",
      });
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();
    const trimmedDescription = description.trim();
    const numHourlyRate = Number(hourlyRate);
    const numSecurityDeposit = Number(securityDeposit);
    const numMaxCapacity = Number(maxCapacity);

    if (!trimmedTitle) {
      setFormError("Please enter a studio title.");
      return;
    }

    if (!category) {
      setFormError("Please choose a studio category.");
      return;
    }

    if (!numHourlyRate || numHourlyRate <= 0) {
      setFormError("Please enter a valid hourly rate greater than $0.");
      return;
    }

    if (numSecurityDeposit < 0) {
      setFormError("Security deposit cannot be negative.");
      return;
    }

    if (!numMaxCapacity || numMaxCapacity <= 0) {
      setFormError("Please enter a maximum capacity of at least 1 person.");
      return;
    }

    if (!trimmedLocation) {
      setFormError("Please provide the studio address/location.");
      return;
    }

    if (images.length === 0) {
      setFormError("Please upload at least 1 photo for your studio (maximum 3).");
      return;
    }

    if (selectedAmenities.length === 0) {
      setFormError(
        "Please select at least one amenity available in your studio.",
      );
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
      image: images[0],
      images: images,
      amenities: selectedAmenities,
      description: trimmedDescription,
      userEmail: session?.user?.email,
      userName: session?.user?.name,
    };

    const token = await getTokenFromClient();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/studios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.acknowledged) {
      toast.add({
        title: "Studio Listed Successfully! 🚀",
        description: `"${trimmedTitle}" is now published and active on StudioSpace.`,
      });
      router.push("/my-listings");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/studios"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Studios</span>
          </Link>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Building2 className="size-3.5" />
            <span>Studio Host Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Add New Studio Space
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            List your creative workspace to connect with filmmakers,
            photographers, and audio artists worldwide.
          </p>
        </div>

        {formError && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-xs uppercase tracking-wider">
                Please fix the following:
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
                    Security Deposit ($){" "}
                    <span className="text-rose-500">*</span>
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
                    Max Capacity (Guests){" "}
                    <span className="text-rose-500">*</span>
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
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ImageIcon className="size-4 text-primary" />
                  <span>Studio Photos & Gallery (1 to 3 Photos)</span>
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {images.length} / 3 Uploaded
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Upload up to 3 high-resolution photos for the studio carousel (the first photo serves as the primary cover).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    type="url"
                    value={imageUrlInput}
                    disabled={images.length >= 3}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                    placeholder={
                      images.length >= 3
                        ? "Maximum 3 photos reached"
                        : "Paste image link and click Add Photo"
                    }
                    className="pl-9 h-10 text-sm bg-background/50"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImageUrl}
                  disabled={!imageUrlInput.trim() || images.length >= 3}
                  className="h-10 text-xs shrink-0"
                >
                  Add Photo
                </Button>

                <label
                  className={cn(
                    "inline-flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-lg text-xs font-semibold border border-border/80 transition-colors shadow-xs shrink-0",
                    images.length >= 3
                      ? "opacity-50 pointer-events-none bg-muted text-muted-foreground"
                      : "bg-muted/50 hover:bg-muted text-foreground cursor-pointer"
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <CloudUpload className="size-3.5 text-primary" />
                  )}
                  <span>{isUploading ? "Uploading..." : "Upload Photos"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={isUploading || images.length >= 3}
                    onChange={handleImageFileUpload}
                    className="sr-only"
                  />
                </label>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl border border-border/80 overflow-hidden bg-muted/20 h-44"
                    >
                      <img
                        src={src}
                        alt={`Studio photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        {idx === 0 ? (
                          <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold">
                            Cover Photo
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-black/60 text-white backdrop-blur-xs text-[10px] font-medium"
                          >
                            Photo {idx + 1}
                          </Badge>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 size-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                        aria-label={`Remove photo ${idx + 1}`}
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-border/80 rounded-xl p-8 text-center bg-muted/10 space-y-2">
                  <div className="size-10 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-5" />
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    No photos attached yet
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Upload 1 to 3 high-resolution photos to showcase your space in the gallery carousel.
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
                Describe the stage layout, lighting packages, acoustic
                isolation, and rules.
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
                      value={session?.user?.name ?? ""}
                      placeholder="Login to auto-fill"
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
                      value={session?.user?.email ?? ""}
                      placeholder="Login to auto-fill"
                      className="h-9 text-xs bg-muted/50 cursor-not-allowed text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Link
              href="/studios"
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
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  <span>Publish Studio Listing</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudioPage;
