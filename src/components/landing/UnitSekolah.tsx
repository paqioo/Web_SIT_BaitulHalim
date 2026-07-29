import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const units = [
  {
    name: "TKIT",
    fullName: "Taman Kanak-Kanak Islam Terpadu",
    desc: "Membina keceriaan dan pondasi keimanan anak usia dini.",
    href: "/unit/tkit",
    color: "from-amber-500/10 to-amber-600/5 hover:border-amber-500/30",
    badgeColor: "bg-amber-500/10 text-amber-600",
  },
  {
    name: "SDIT",
    fullName: "Sekolah Dasar Islam Terpadu",
    desc: "Membangun kecerdasan spiritual dan intelektual dasar.",
    href: "/unit/sdit",
    color: "from-[#068ec5]/10 to-[#068ec5]/5 hover:border-[#068ec5]/30",
    badgeColor: "bg-[#068ec5]/10 text-[#068ec5]",
  },
  {
    name: "SMPIT",
    fullName: "Sekolah Menengah Pertama Islam Terpadu",
    desc: "Membentuk kemandirian dan kepemimpinan akhlak mulia.",
    href: "/unit/smpit",
    color: "from-emerald-500/10 to-emerald-600/5 hover:border-emerald-500/30",
    badgeColor: "bg-emerald-500/10 text-emerald-600",
  },
];

export default function UnitSekolah() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
            Unit Pendidikan
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl">
            Jenjang Sekolah SIT Baitul Halim
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#64748b]">
            Kami menawarkan jenjang pendidikan lengkap mulai dari usia dini hingga sekolah menengah pertama.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {units.map((unit) => (
            <Link
              key={unit.name}
              href={unit.href}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[#e2e8f0] bg-gradient-to-br ${unit.color} p-8 transition-all duration-300 hover:shadow-lg`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className={`rounded-xl px-3 py-1 text-xs font-bold ${unit.badgeColor}`}>
                    {unit.name}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#e2e8f0] opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight size={18} className="text-[#1a1a2e]" />
                  </div>
                </div>
                <h3 className="mt-8 text-2xl font-bold text-[#1a1a2e]">
                  {unit.fullName}
                </h3>
                <p className="mt-3 text-sm text-[#64748b]">
                  {unit.desc}
                </p>
              </div>
              <span className="mt-8 text-xs font-semibold text-[#068ec5] flex items-center gap-1 group-hover:underline">
                Kunjungi Halaman Unit &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
