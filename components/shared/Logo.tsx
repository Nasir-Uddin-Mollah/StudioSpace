import Link from "next/link";
import { Aperture } from "lucide-react";

interface LogoProps {
  className?: string;
  iconSize?: string;
}

export default function Logo({ className = "", iconSize = "size-5" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 font-bold tracking-tight transition-opacity hover:opacity-95 ${className}`}
    >
      <div className="relative flex items-center justify-center size-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white shadow-md shadow-indigo-500/10 group-hover:shadow-indigo-500/25 transition-all duration-300 group-hover:scale-105">
        <Aperture className={`${iconSize} stroke-[2.2] group-hover:rotate-45 transition-transform duration-500`} />
      </div>
      <span className="text-xl font-extrabold tracking-tight text-foreground">
        Studio<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500">Space</span>
      </span>
    </Link>
  );
}

