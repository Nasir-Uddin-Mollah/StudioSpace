"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import { handleGoogleSignUp } from "@/services/authService";

const RegisterPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setPasswordTouched(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const nameValue = String(data.name || "").trim();
    const emailValue = String(data.email || "")
      .trim()
      .toLowerCase();
    const photoURLValue = String(data.photoURL || "").trim();
    const passwordValue = String(data.password || "");

    if (!nameValue) {
      setFormError("Please enter your full name.");
      return;
    }

    if (!emailValue || !emailValue.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }

    const validLength = passwordValue.length >= 6;
    const validUpper = /[A-Z]/.test(passwordValue);
    const validLower = /[a-z]/.test(passwordValue);

    if (!validLength || !validUpper || !validLower) {
      const errorMsg =
        "Password must be at least 6 characters and contain both uppercase (A-Z) and lowercase (a-z) letters.";
      setFormError(errorMsg);
      toast.add({
        title: "Invalid Password",
        description: errorMsg,
      });
      return;
    }

    try {
      setIsLoading(true);

      const res = await authClient.signUp.email({
        name: nameValue,
        email: emailValue,
        password: passwordValue,
        image: photoURLValue || undefined,
      });

      if (res?.error) {
        const errorText =
          res.error.message ||
          "Could not complete registration. The email may already be registered.";
        setFormError(errorText);
        toast.add({
          title: "Registration Failed",
          description: errorText,
        });
        return;
      }

      toast.add({
        title: "Account Created Successfully! 🎉",
        description:
          "Welcome to StudioSpace! Please log in with your credentials to access your creative dashboard.",
      });

      router.push("/login");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during registration. Please try again.";
      setFormError(errorMsg);
      toast.add({
        title: "Registration Error",
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    try {
      setIsGoogleLoading(true);
      setFormError(null);
      await handleGoogleSignUp("/");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to authenticate with Google. Please try again.";
      setFormError(errorMsg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-indigo-600/10 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Create Your Creator Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            Join thousands of filmmakers, photographers, and audio artists
            finding and hosting studios worldwide.
          </p>
        </div>

        <Card className="border border-border/80 shadow-xl bg-card/80 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-bold">
              Sign Up for StudioSpace
            </CardTitle>
            <CardDescription className="text-xs">
              Enter your creative profile details below to get started.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleClick}
              className="w-full h-10 font-semibold gap-2.5 border-border/80 hover:bg-muted/70 transition-all cursor-pointer shadow-xs"
            >
              {isGoogleLoading ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : (
                <FcGoogle className="size-5 shrink-0" />
              )}
              <span>Continue with Google</span>
            </Button>

            <div className="relative flex items-center justify-center my-3">
              <Separator />
              <span className="absolute bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Or with Email
              </span>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="leading-tight">{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold text-foreground"
                >
                  Full Name <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Scott"
                    className="pl-9 h-10 text-sm bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-foreground"
                >
                  Email Address <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@studiospace.io"
                    className="pl-9 h-10 text-sm bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="photoURL"
                    className="text-xs font-semibold text-foreground"
                  >
                    Profile Photo URL
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Optional
                  </span>
                </div>
                <div className="relative">
                  <ImageIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="photoURL"
                    name="photoURL"
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="pl-9 h-10 text-sm bg-background/50"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Provide a direct image URL (e.g. from ImgBB or Unsplash) for
                  your host & creator avatar.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-foreground"
                >
                  Password <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordTouched(true);
                    }}
                    placeholder="Create a secure password"
                    className={`pl-9 pr-10 h-10 text-sm bg-background/50 ${
                      passwordTouched && !isPasswordValid
                        ? "border-destructive focus-visible:ring-destructive/30"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                <div className="pt-1.5 space-y-1 text-xs">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Password criteria:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px]">
                    <div
                      className={`flex items-center gap-1.5 ${
                        hasMinLength
                          ? "text-emerald-500 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {hasMinLength ? (
                        <Check className="size-3.5 shrink-0" />
                      ) : (
                        <X className="size-3.5 shrink-0 text-muted-foreground/60" />
                      )}
                      <span>6+ characters</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${
                        hasUppercase
                          ? "text-emerald-500 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {hasUppercase ? (
                        <Check className="size-3.5 shrink-0" />
                      ) : (
                        <X className="size-3.5 shrink-0 text-muted-foreground/60" />
                      )}
                      <span>Uppercase (A-Z)</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${
                        hasLowercase
                          ? "text-emerald-500 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {hasLowercase ? (
                        <Check className="size-3.5 shrink-0" />
                      ) : (
                        <X className="size-3.5 shrink-0 text-muted-foreground/60" />
                      )}
                      <span>Lowercase (a-z)</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full h-11 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    <span>Creating your profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 mr-2" />
                    <span>Register Account</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center pt-2 pb-5 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
