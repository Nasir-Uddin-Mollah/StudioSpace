import Link from "next/link";
import {
  Search,
  CalendarClock,
  CreditCard,
  Film,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const steps = [
  {
    step: "01",
    title: "Discover Spaces",
    subtitle: "Explore & Filter",
    description:
      "Browse verified studios by medium, acoustic isolation, strobe lighting packages, or hourly budget.",
    icon: Search,
  },
  {
    step: "02",
    title: "Select Shoot Hours",
    subtitle: "Customize Session",
    description:
      "Pick your shoot date, select exact production hours needed, and request optional gear or crew add-ons.",
    icon: CalendarClock,
  },
  {
    step: "03",
    title: "Book Instantly",
    subtitle: "Secure Reservation",
    description:
      "Lock in your stage reservation with transparent pricing, instant confirmation, and fraud protection.",
    icon: CreditCard,
  },
  {
    step: "04",
    title: "Create & Produce",
    subtitle: "Produce Your Vision",
    description:
      "Receive instant check-in access codes, walk into a primed studio stage, and bring your vision to life.",
    icon: Film,
  },
];

const HowBookingWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 bg-background border-t scroll-mt-16 md:scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge
            variant="secondary"
            className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border-primary/20"
          >
            <Sparkles className="size-3.5 mr-1" />
            Simple 4-Step Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-heading">
            How Booking Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            From creative concept to set production in minutes. No lengthy email
            exchanges or opaque rental fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-6" />
                    </div>
                    <span className="text-3xl sm:text-4xl font-black text-muted-foreground/30 font-heading group-hover:text-primary/40 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {item.subtitle}
                    </span>
                    <h3 className="text-lg font-bold text-foreground font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border/60 flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <span>Step {index + 1} of 4</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-muted/30 border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-foreground font-heading">
              Have a shoot in mind?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Explore hundreds of verified photo studios, sound stages, and
              podcast rooms available today.
            </p>
          </div>

          <Link
            href="/studios"
            className={cn(
              buttonVariants({ size: "default" }),
              "shrink-0 gap-2 font-semibold",
            )}
          >
            <span>Explore Studios</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowBookingWorks;
