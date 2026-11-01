"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  Heart,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Plus,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about-us" },
];

interface AuthUser {
  name: string;
  email: string;
  image?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Ready for BetterAuth: swap this line with `const { data: session } = authClient.useSession(); const user = session?.user;`
  const [user] = React.useState<AuthUser | null>(null);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    // await authClient.signOut();
    router.push("/login");
  };

  const isLinkActive = (href: string) => {
    if (href.startsWith("/#") || href.startsWith("#")) {
      return false;
    }
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Logo />

            {/* Desktop Navigation Links with Active Indicators */}
            <nav
              className="hidden md:flex items-center gap-1.5"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      active
                        ? "text-primary font-semibold bg-primary/10 shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Theme Toggle + Auth Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Authenticated State */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Host a Space Quick Action */}
                <Link
                  href="/add-studio"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-all duration-200 border border-border/60 hover:border-border"
                >
                  <Plus className="size-3.5 text-rose-500" />
                  <span>Host Space</span>
                </Link>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        className="group flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-border/60 hover:border-border bg-card/60 hover:bg-card transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                        aria-label="User profile menu"
                      />
                    }
                  >
                    <Avatar className="size-8 border border-border shadow-xs">
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 text-foreground text-xs font-bold">
                          {user.name
                            ? user.name.slice(0, 2).toUpperCase()
                            : "SS"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="hidden lg:inline text-xs font-semibold text-foreground max-w-[110px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56 p-1.5 rounded-xl border border-border/60 bg-popover/95 backdrop-blur-md shadow-xl"
                  >
                    {/* User Profile Header */}
                    <div className="px-2.5 py-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>

                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
                        onClick={() => router.push("/add-studio")}
                      >
                        <PlusCircle className="size-4 text-amber-500" />
                        <span className="font-medium text-foreground">
                          Add New Studio
                        </span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
                        onClick={() => router.push("/my-listings")}
                      >
                        <Building2 className="size-4 text-muted-foreground" />
                        <span>My Studio Listings</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
                        onClick={() => router.push("/my-bookings")}
                      >
                        <CalendarDays className="size-4 text-muted-foreground" />
                        <span>My Bookings</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer hover:bg-muted focus:bg-muted transition-colors"
                        onClick={() => router.push("/wishlist")}
                      >
                        <Heart className="size-4 text-rose-500" />
                        <span>Saved Wishlist</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem
                      variant="destructive"
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              /* Unauthenticated State: Login & Register action buttons */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-all duration-200"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="relative group inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 shadow-xs shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200"
                >
                  <Sparkles className="size-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="size-9 rounded-lg"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-lg px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="flex flex-col space-y-1 pb-3">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-border/60 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-muted/40 rounded-xl">
                  <Avatar className="size-9 border border-border">
                    {user.image ? (
                      <AvatarImage src={user.image} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <LayoutDashboard className="size-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/add-studio"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-500/10"
                  >
                    <PlusCircle className="size-3.5" />
                    <span>Add Studio</span>
                  </Link>
                  <Link
                    href="/my-listings"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Building2 className="size-3.5" />
                    <span>My Listings</span>
                  </Link>
                  <Link
                    href="/my-bookings"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <CalendarDays className="size-3.5" />
                    <span>My Bookings</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Heart className="size-3.5 text-rose-500" />
                    <span>Wishlist</span>
                  </Link>
                </div>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full mt-2 justify-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 text-xs h-9"
                >
                  <LogOut className="size-3.5" />
                  <span>Log Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  className="w-full text-center py-2 px-4 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2 px-4 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 shadow-xs"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
