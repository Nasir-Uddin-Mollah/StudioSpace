import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export const handleGoogleSignUp = async (callbackURL: string = "/") => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : "Failed to authenticate with Google. Please try again.";

    toast.add({
      title: "Google Sign-In Error",
      description: errorMsg,
    });

    throw err;
  }
};
