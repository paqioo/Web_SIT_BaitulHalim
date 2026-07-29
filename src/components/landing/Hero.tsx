"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

interface HeroProps {
  headline?: string;
  subtext?: string;
}

export default function Hero({ headline, subtext }: HeroProps) {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#068ec5]">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute left-[20%] top-[20%] h-[400px] w-[400px] rounded-full bg-[#0577a3] blur-3xl mix-blend-multiply opacity-50" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center px-6 text-center lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
          Selamat Datang di
        </div>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-7xl lg:leading-[1.1]">
          {headline || "SIT Baitul Halim"}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
          {subtext ||
            "Mendidik generasi berilmu, beriman, dan berakhlak mulia melalui pendidikan Islam terpadu yang berkualitas."}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/unit/tkit"
            className="group flex h-14 items-center justify-center gap-3 rounded-full bg-white px-8 text-base font-semibold text-[#068ec5] transition-all hover:bg-white/90 active:scale-[0.98]"
          >
            Mulai Jelajahi
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#068ec5]/10 transition-transform group-hover:translate-x-1">
              <ArrowRight weight="bold" />
            </div>
          </Link>
          <Link
            href="/#about"
            className="flex h-14 items-center justify-center rounded-full border border-white/30 px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Profil Sekolah
          </Link>
        </div>
      </div>
    </section>
  );
}
