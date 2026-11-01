"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { toast } from "@/components/ui/toast";
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa6";

const popularCategories = [
  {
    name: "Photo Studios & Cyc Walls",
    href: "/studios?category=Photo%20Studio",
  },
  { name: "Cinema & Sound Stages", href: "/studios?category=Film%20Stage" },
  {
    name: "Podcast & Broadcast Lounges",
    href: "/studios?category=Podcast%20Lounge",
  },
  { name: "Music & Audio Suites", href: "/studios?category=Music%20Suite" },
  { name: "Art & Creative Workshops", href: "/studios?category=Workshop" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore All Studios", href: "/studios" },
  { name: "How Booking Works", href: "/#how-it-works" },
  { name: "Host Your Space", href: "/add-studio" },
  { name: "About StudioSpace", href: "/#about-us" },
];

const creatorAssurances = [
  "Verified Studio Hosts",
  "Secure Payment Escrow",
  "Zero Double-Booking Guarantee",
  "24/7 Creator Support",
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.add({
        title: "Invalid Email Address",
        description: "Please enter a valid email address to subscribe.",
      });
      return;
    }

    setIsSubscribed(true);
    toast.add({
      title: "Welcome to the Creative Collective!",
      description:
        "You're now subscribed to weekly studio drops and exclusive creator discounts.",
    });
    setEmail("");
  };

  return (
    <footer className="border-t border-border/50 bg-card/40 text-foreground transition-colors duration-200">
      <div className="border-b border-border/40 bg-muted/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-muted-foreground">
            {creatorAssurances.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 justify-center sm:justify-start"
              >
                <Shield className="size-3.5 text-amber-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4 space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground pr-4">
              StudioSpace is the premier peer-to-peer creative production
              marketplace. We empower filmmakers, photographers, podcasters, and
              musicians to find their perfect stage, connect with verified
              hosts, and produce extraordinary work with transparent pricing.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-3">
                Connect With Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-xl border border-border/60 bg-muted/40 hover:bg-foreground hover:text-background text-muted-foreground flex items-center justify-center transition-all duration-200"
                  aria-label="StudioSpace on X"
                  title="Follow us on X"
                >
                  <FaXTwitter className="size-4" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-xl border border-border/60 bg-muted/40 hover:bg-rose-500 hover:text-white text-muted-foreground flex items-center justify-center transition-all duration-200"
                  aria-label="StudioSpace on Instagram"
                  title="Follow us on Instagram"
                >
                  <FaInstagram className="size-4" />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-xl border border-border/60 bg-muted/40 hover:bg-red-600 hover:text-white text-muted-foreground flex items-center justify-center transition-all duration-200"
                  aria-label="StudioSpace on YouTube"
                  title="Watch our studio tours on YouTube"
                >
                  <FaYoutube className="size-4" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-xl border border-border/60 bg-muted/40 hover:bg-sky-600 hover:text-white text-muted-foreground flex items-center justify-center transition-all duration-200"
                  aria-label="StudioSpace on LinkedIn"
                  title="Connect on LinkedIn"
                >
                  <FaLinkedinIn className="size-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold tracking-wide text-foreground">
              Studio Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {popularCategories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{category.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold tracking-wide text-foreground">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold tracking-wide text-foreground">
              Stay in the Creative Loop
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Get weekly handpicked studio showcases, creator tips, and private
              booking discounts. No spam, ever.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>You're subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your creator email"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border/80 bg-background placeholder:text-muted-foreground/60 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 shadow-xs transition-all duration-200 cursor-pointer"
                >
                  <span>Subscribe to Studio Drops</span>
                  <ArrowRight className="size-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 StudioSpace Platform Inc. All rights reserved.</p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-border">•</span>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Notice
            </Link>
            <span className="text-border">•</span>
            <Link
              href="/cookies"
              className="hover:text-foreground transition-colors"
            >
              Cookie Preferences
            </Link>
            <span className="text-border">•</span>
            <Link
              href="/trust-safety"
              className="hover:text-foreground transition-colors"
            >
              Trust & Safety
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
