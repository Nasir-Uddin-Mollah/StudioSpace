"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PlusCircle,
  Building2,
  CalendarDays,
  Heart,
  LogOut,
  Menu,
  ChevronDown,
  Sparkles,
} from "lucide-react";

import Logo from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about-us" },
];

const userMenuLinks = [
  { name: "Add New Studio", href: "/add-studio", icon: PlusCircle },
  { name: "My Studio Listings", href: "/my-listings", icon: Building2 },
  { name: "My Bookings", href: "/my-bookings", icon: CalendarDays },
  { name: "Saved Wishlist", href: "/wishlist", icon: Heart },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await authClient.signOut();
    setSheetOpen(false);
    router.push("/login");
  };

  const isLinkActive = (href: string) => {
    if (href.startsWith("/#") || href.startsWith("#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 gap-4">
          <div className="flex items-center gap-6 lg:gap-8 min-w-0">
            <Logo />

            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      active
                        ? "text-foreground font-semibold bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
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

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/add-studio"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-full text-xs font-semibold gap-1.5 hidden md:inline-flex",
                  )}
                >
                  <PlusCircle className="size-3.5 text-rose-500" />
                  <span>Host Space</span>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        className="group flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-border/60 hover:border-border bg-card/60 hover:bg-card transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                        aria-label="User menu"
                      />
                    }
                  >
                    <Avatar className="size-8 border border-border">
                      {user.image ? (
                        <AvatarImage
                          src={user.image}
                          alt={user.name || "User"}
                        />
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
                    <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-foreground transition-transform" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56 p-1.5 rounded-xl border border-border/60 bg-popover/95 backdrop-blur-md shadow-xl"
                  >
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
                      {userMenuLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem
                            key={item.href}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer hover:bg-muted focus:bg-muted"
                            onClick={() => router.push(item.href)}
                          >
                            <Icon className="size-4 text-muted-foreground" />
                            <span>{item.name}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem
                      variant="destructive"
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="size-4" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-sm font-medium",
                  )}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 shadow-xs",
                  )}
                >
                  <Sparkles className="size-3.5 mr-1" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            <div className="flex md:hidden">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 rounded-lg"
                      aria-label="Open menu"
                    />
                  }
                >
                  <Menu className="size-5" />
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[340px] p-0 flex flex-col justify-between"
                >
                  <div className="flex flex-col flex-1 overflow-y-auto">
                    <SheetHeader className="p-4 border-b border-border/50 text-left">
                      <SheetTitle className="text-left">
                        <Logo />
                      </SheetTitle>
                    </SheetHeader>

                    {user && (
                      <div className="p-4 bg-muted/40 border-b border-border/50 flex items-center gap-3">
                        <Avatar className="size-10 border border-border">
                          {user.image ? (
                            <AvatarImage
                              src={user.image}
                              alt={user.name || "User"}
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                              {user.name
                                ? user.name.slice(0, 2).toUpperCase()
                                : "SS"}
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
                    )}

                    <div className="p-4 space-y-1">
                      <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Navigation
                      </p>
                      {navLinks.map((link) => {
                        const active = isLinkActive(link.href);
                        return (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setSheetOpen(false)}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              active
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            {link.name}
                          </Link>
                        );
                      })}
                    </div>

                    {user ? (
                      <div className="p-4 pt-0 space-y-1">
                        <Separator className="my-2" />
                        <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Workspace & Bookings
                        </p>
                        {userMenuLinks.map((item) => {
                          const Icon = item.icon;
                          const active = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setSheetOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                active
                                  ? "bg-primary/10 text-primary font-semibold"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              }`}
                            >
                              <Icon className="size-4 shrink-0 text-muted-foreground" />
                              <span>{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-4 border-t border-border/50 bg-background/50">
                    {user ? (
                      <Button
                        variant="destructive"
                        className="w-full justify-center gap-2 text-xs h-9 cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="size-3.5" />
                        <span>Log Out</span>
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/login"
                          onClick={() => setSheetOpen(false)}
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-full justify-center text-sm",
                          )}
                        >
                          Log In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setSheetOpen(false)}
                          className={cn(
                            buttonVariants(),
                            "w-full justify-center text-sm text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600",
                          )}
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
