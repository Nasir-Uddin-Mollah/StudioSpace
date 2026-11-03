import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  SlidersHorizontal,
  Headphones,
  Check,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "$1M Liability Protection",
    tag: "Damage Coverage",
    description:
      "Every confirmed studio reservation is protected against accidental property and heavy equipment damages during production hours.",
    features: [
      "Up to $1,000,000 in property coverage",
      "No deductibles for studio hosts",
      "Seamless digital claim resolution",
    ],
  },
  {
    icon: UserCheck,
    title: "100% Vetted Community",
    tag: "Identity Verified",
    description:
      "Both creative producers and studio hosts undergo multi-layer identity verification, physical address checks, and peer reviews.",
    features: [
      "Government-issued ID verification",
      "Verified commercial addresses",
      "Transparent ratings & reviews",
    ],
  },
  {
    icon: SlidersHorizontal,
    title: "Production-Grade Safety",
    tag: "Gear & Facility",
    description:
      "All listed spaces adhere to strict sound isolation, professional electrical load safety, and sanitized set hygiene benchmarks.",
    features: [
      "Calibrated lighting grids & power",
      "Acoustic isolation inspections",
      "Sanitized dressing & staging areas",
    ],
  },
  {
    icon: Headphones,
    title: "24/7 Creator Concierge",
    tag: "Round-The-Clock",
    description:
      "Dedicated real-time production support specialists available 24/7 to resolve stage access, equipment questions, or emergency adjustments.",
    features: [
      "Average response time under 2 minutes",
      "Direct line to on-site studio managers",
      "Emergency reschedule assistance",
    ],
  },
];

const stats = [
  { value: "10,000+", label: "Shoot Hours Hosted" },
  { value: "$1,000,000", label: "Liability Protection" },
  { value: "100%", label: "Verified Stages & Hosts" },
  { value: "4.9 / 5", label: "Average Creator Rating" },
];

const HostGuarantee = () => {
  return (
    <section
      id="about-us"
      className="py-16 sm:py-24 bg-muted/20 border-t scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="secondary"
            className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          >
            <ShieldCheck className="size-3.5 mr-1" />
            Safety & Peace of Mind
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-heading">
            Host Guarantee & Creator Support
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Whether you are booking a high-profile sound stage or listing your
            daylight loft, our end-to-end assurances keep every production
            protected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {guarantees.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-lg hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-6" />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs font-medium border-border/80"
                    >
                      {item.tag}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground font-heading">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {item.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90"
                      >
                        <div className="size-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
              Have an empty production space?
            </h3>
            <p className="text-sm text-muted-foreground">
              Turn your unused studio hours into substantial revenue with
              comprehensive liability protection and zero upfront hosting fees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/add-studio"
              className={cn(
                buttonVariants({ size: "default" }),
                "gap-2 font-semibold",
              )}
            >
              <span>Host Your Space</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostGuarantee;
