"use client";

import { useState, useEffect, useCallback, type ElementType } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Video, Camera, Mic } from "lucide-react";

interface Slide {
  id: number;
  badgeIcon: ElementType;
  badgeText: string;
  headlinePrefix: string;
  headlineGradient: string;
  subtext: string;
  bgImage: string;
  accentColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    badgeIcon: Video,
    badgeText: "Cinema & Film Sound Stages",
    headlinePrefix: "Where Visionary Ideas Meet",
    headlineGradient: "Extraordinary Spaces",
    subtext:
      "Discover and book sound-isolated production stages, infinity cyc walls, and film studios equipped with professional lighting grids.",
    bgImage: "/images/banners/slide-1.jpg",
    accentColor: "from-amber-400 via-rose-500 to-indigo-400",
  },
  {
    id: 2,
    badgeIcon: Camera,
    badgeText: "Curated Photography Lofts",
    headlinePrefix: "Natural Daylight & Professional",
    headlineGradient: "Creative Photo Cyc Walls",
    subtext:
      "Step into curated daylight lofts, strobe-equipped photo bays, and editorial spaces tailored for fashion and commercial shoots.",
    bgImage: "/images/banners/slide-2.jpg",
    accentColor: "from-rose-400 via-pink-400 to-amber-300",
  },
  {
    id: 3,
    badgeIcon: Mic,
    badgeText: "Podcast & Recording Suites",
    headlinePrefix: "Acoustically Tuned Studios for",
    headlineGradient: "Audio & Podcast Creators",
    subtext:
      "Reserve broadcast-grade podcast lounges with multi-cam setups, soundproof vocal booths, and analog mixing gear by the hour.",
    bgImage: "/images/banners/slide-3.jpg",
    accentColor: "from-indigo-400 via-purple-400 to-rose-400",
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay functionality
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="StudioSpace Hero Banner Carousel"
    >
      {/* Slides Container: calibrated height so buttons are always visible on all screens */}
      <div className="relative h-[480px] sm:h-[520px] md:h-[550px] lg:h-[580px] flex items-center justify-center">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const BadgeIcon = slide.badgeIcon;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image stored locally in public folder */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                }}
              />

              {/* Rich cinematic overlays: maintains rich, saturated colors in BOTH light & dark modes */}
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]" />

              {/* Content Grid */}
              <div className="relative h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center py-8">
                {/* Category Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white text-xs font-medium mb-3 sm:mb-4 shadow-lg transition-all duration-700 ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <BadgeIcon className="size-3.5 text-amber-400 shrink-0" />
                  <span>{slide.badgeText}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-amber-300 font-semibold">Verified Spaces</span>
                </div>

                {/* Punchy Headline (compacted line-height and scale to avoid overflowing viewport) */}
                <h1
                  className={`text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight sm:leading-tight transition-all duration-700 delay-100 ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {slide.headlinePrefix}{" "}
                  <span
                    className={`block mt-1 sm:mt-1.5 text-transparent bg-clip-text bg-gradient-to-r ${slide.accentColor}`}
                  >
                    {slide.headlineGradient}
                  </span>
                </h1>

                {/* Subtext */}
                <p
                  className={`mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-200/90 max-w-xl leading-relaxed transition-all duration-700 delay-200 ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {slide.subtext}
                </p>

                {/* Primary CTA Buttons (Linking to /studios as required) */}
                <div
                  className={`mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 transition-all duration-700 delay-300 ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <Link
                    href="/studios"
                    className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Explore Studios</span>
                    <ArrowRight className="size-3.5 sm:size-4" />
                  </Link>

                  <Link
                    href="/studios"
                    className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <Sparkles className="size-3.5 sm:size-4 text-amber-400" />
                    <span>Host Your Space</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-3 right-3 sm:left-6 sm:right-6 z-20 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="pointer-events-auto size-9 sm:size-11 rounded-full border border-white/20 bg-black/45 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer shadow-md"
        >
          <ChevronLeft className="size-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="pointer-events-auto size-9 sm:size-11 rounded-full border border-white/20 bg-black/45 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer shadow-md"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? "w-7 bg-gradient-to-r from-amber-400 to-rose-500"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
