"use client";

import { SubmitEvent, useState } from "react";
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
  ShieldCheck,
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
import { authClient } from "@/lib/auth-client";
import { handleGoogleSignUp } from "@/services/authService";

export default function RegisterPage() {
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

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setPasswordTouched(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const nameValue = String(data.name || "").trim();
    const emailValue = String(data.email || "").trim().toLowerCase();
    const photoURLValue = String(data.photoURL || "").trim();
    const passwordValue = String(data.password || "");

    const hasMinLen = passwordValue.length >= 6;
    const hasUpper = /[A-Z]/.test(passwordValue);
    const hasLower = /[a-z]/.test(passwordValue);

    if (!hasMinLen || !hasUpper || !hasLower) {
      const errorMsg =
        "Password must be at least 6 characters and contain both uppercase and lowercase letters.";
      setFormError(errorMsg);
      toast.add({
        title: "Invalid Password",
        description: errorMsg,
      });
      return;
    }

    if (!nameValue) {
      setFormError("Please enter your name.");
      return;
    }

    if (!emailValue || !emailValue.includes("@")) {
      setFormError("Please enter a valid email address.");
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
          "Could not complete registration. The email may already be in use.";
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
            Join thousands of filmmakers, photographers, and audio artists finding and hosting
            studios worldwide.
          </p>
        </div>

        <Card className="border border-border/80 shadow-xl bg-card/80 backdrop-blur-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-bold">Sign Up for StudioSpace</CardTitle>
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
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
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
              {/* Field: Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-foreground">
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
                <Label htmlFor="email" className="text-xs font-semibold text-foreground">
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
                  <Label htmlFor="photoURL" className="text-xs font-semibold text-foreground">
                    Profile Photo URL
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Optional</span>
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
                  Provide a direct image URL (e.g. from ImgBB or Unsplash) for your host & creator avatar.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-foreground">
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
                      if (!passwordTouched) setPasswordTouched(true);
                    }}
                    placeholder="Create a secure password"
                    className={`pl-9 pr-10 h-10 text-sm bg-background/50 ${
                      passwordTouched && !isPasswordValid ? "border-destructive focus-visible:ring-destructive/30" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                <div className="pt-1.5 space-y-1 text-xs">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Password criteria:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px]">
                    <div
                      className={`flex items-center gap-1.5 ${
                        hasMinLength ? "text-emerald-500 font-medium" : "text-muted-foreground"
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
                        hasUppercase ? "text-emerald-500 font-medium" : "text-muted-foreground"
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
                        hasLowercase ? "text-emerald-500 font-medium" : "text-muted-foreground"
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
}
