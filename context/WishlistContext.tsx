"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/toast";
import { Studio } from "@/types/studio";
import { WishlistItem } from "@/types/wishlist";
import { authClient } from "@/lib/auth-client";

interface WishlistContextType {
  wishlist: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (studioId: string) => boolean;
  toggleWishlist: (studio: Studio) => Promise<boolean>;
  removeFromWishlist: (studioId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  isLoading: false,
  isInWishlist: () => false,
  toggleWishlist: async () => false,
  removeFromWishlist: async () => {},
  refreshWishlist: async () => {},
});

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user?.email) {
      setWishlist([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/wishlist?email=${encodeURIComponent(user.email)}`
      );
      if (res.ok) {
        const data = await res.json();
        setWishlist(Array.isArray(data) ? data : []);
      }
    } catch {
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (studioId: string) => {
      if (!studioId) return false;
      return wishlist.some((item) => item.studioId === studioId);
    },
    [wishlist]
  );

  const toggleWishlist = async (studio: Studio): Promise<boolean> => {
    if (!studio._id) return false;

    if (!user?.email) {
      toast.add({
        title: "Please Sign In",
        description: "Sign in to save creative workspaces to your wishlist.",
      });
      return false;
    }

    const studioId = studio._id;
    const isCurrentlyWishlisted = wishlist.some(
      (item) => item.studioId === studioId
    );

    if (isCurrentlyWishlisted) {
      setWishlist((prev) => prev.filter((item) => item.studioId !== studioId));
      toast.add({
        title: "Removed from Wishlist",
        description: `"${studio.title}" removed from your saved spaces.`,
      });

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/wishlist?email=${encodeURIComponent(user.email)}&studioId=${encodeURIComponent(studioId)}`,
          { method: "DELETE" }
        );
      } catch {
        fetchWishlist();
      }
      return false;
    } else {
      const newItem: WishlistItem = {
        studioId,
        userEmail: user.email,
        title: studio.title,
        category: String(studio.category),
        location: studio.location,
        image: studio.image,
        images: studio.images,
        hourlyRate: studio.hourlyRate,
        securityDeposit: studio.securityDeposit,
        maxCapacity: studio.maxCapacity,
        rating: studio.rating,
        totalReviews: studio.totalReviews,
        description: studio.description,
      };

      setWishlist((prev) => [newItem, ...prev]);
      toast.add({
        title: "Saved to Wishlist ❤️",
        description: `"${studio.title}" added to your saved spaces.`,
      });

      try {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        });
      } catch {
        fetchWishlist();
      }
      return true;
    }
  };

  const removeFromWishlist = async (studioId: string) => {
    if (!user?.email || !studioId) return;

    const target = wishlist.find((i) => i.studioId === studioId);
    setWishlist((prev) => prev.filter((item) => item.studioId !== studioId));

    if (target) {
      toast.add({
        title: "Removed from Wishlist",
        description: `"${target.title}" removed from your saved spaces.`,
      });
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/wishlist?email=${encodeURIComponent(user.email)}&studioId=${encodeURIComponent(studioId)}`,
        { method: "DELETE" }
      );
    } catch {
      fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

