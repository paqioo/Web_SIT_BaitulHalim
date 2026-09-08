"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Users } from "@phosphor-icons/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface WelcomeProps {
  headline?: string;
  text?: string;
  images?: string[];
}

export default function Welcome({ headline, text, images }: WelcomeProps) {
  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % validImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [validImages.length]);

  return (
    <section id="about" className="py-24 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
              Sambutan
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl">
              {headline || "Membentuk Generasi Rabbani"}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#64748b]">
              {text ||
                "Sekolah Islam Terpadu Baitul Halim hadir untuk menanamkan dasar-dasar keimanan yang kokoh, ilmu pengetahuan yang luas, serta budi pekerti luhur bagi putra-putri Anda. Kami mengupayakan perpaduan harmonis antara kurikulum nasional dan nilai-nilai Islami."}
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#068ec5]/10 text-[#068ec5]">
                  <GraduationCap size={20} weight="fill" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1a1a2e]">Pendidikan Unggul</h4>
                  <p className="mt-1 text-xs text-[#64748b]">Kurikulum berkualitas global dengan dasar spiritual Islam.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#068ec5]/10 text-[#068ec5]">
                  <Users size={20} weight="fill" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1a1a2e]">Pengajar Profesional</h4>
                  <p className="mt-1 text-xs text-[#64748b]">Tenaga pendidik berkompeten dan berdedikasi tinggi.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-2xl bg-[#068ec5]/5 border border-[#e2e8f0] overflow-hidden">
              {validImages.length > 0 ? (
                validImages.map((src, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700",
                      i === current ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <Image
                      src={src}
                      alt={`Sambutan ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center text-[#068ec5] text-5xl">
                  <Image
                    src="/images/logo.svg"
                    alt="SIT Baitul Halim"
                    width={120}
                    height={100}
                    className="opacity-40"
                  />
                </div>
              )}
            </div>

            {validImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {validImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      i === current
                        ? "w-6 bg-[#068ec5]"
                        : "w-2 bg-white/70 hover:bg-white"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
