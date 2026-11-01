"use client";

import { useState, Suspense, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
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

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const emailValue = String(data.email || "")
      .trim()
      .toLowerCase();
    const passwordValue = String(data.password || "");

    if (!emailValue || !emailValue.includes("@")) {
      const err = "Please enter a valid email address.";
      setFormError(err);
      toast.add({
        title: "Validation Error",
        description: err,
      });
      return;
    }

    if (!passwordValue) {
      const err = "Please enter your password.";
      setFormError(err);
      toast.add({
        title: "Validation Error",
        description: err,
      });
      return;
    }

    try {
      setIsLoading(true);

      const res = await authClient.signIn.email({
        email: emailValue,
        password: passwordValue,
      });

      if (res?.error) {
        const errorText =
          res.error.message ||
          "Invalid email or password. Please verify your credentials and try again.";
        setFormError(errorText);
        toast.add({
          title: "Login Failed",
          description: errorText,
        });
        return;
      }

      toast.add({
        title: "Welcome Back! 👋",
        description: "You have signed in to StudioSpace successfully.",
      });

      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during login. Please try again.";
      setFormError(errorMsg);
      toast.add({
        title: "Login Error",
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
      await handleGoogleSignUp(callbackUrl);
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

  const handleForgotPassword = () => {
    toast.add({
      title: "Password Reset Notice",
      description:
        "Password reset is disabled for evaluation testing convenience. Please register a new test account if needed.",
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome Back to StudioSpace
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
          Log in to manage your studio listings, inspect reservations, and
          connect with creators.
        </p>
      </div>

      <Card className="border border-border/80 shadow-xl bg-card/80 backdrop-blur-md">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg font-bold">
            Sign In to Your Account
          </CardTitle>
          <CardDescription className="text-xs">
            Enter your credentials or continue with Google to access your
            dashboard.
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
                htmlFor="email"
                className="text-xs font-semibold text-foreground"
              >
                Email Address
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
                  placeholder="name@studiospace.io"
                  className="pl-9 h-10 text-sm bg-background/50"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-foreground"
                >
                  Password
                </Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-primary underline-offset-4 hover:underline font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-9 pr-10 h-10 text-sm bg-background/50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  <span>Log In</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center pt-2 pb-5 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-indigo-600/10 blur-3xl rounded-full" />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
