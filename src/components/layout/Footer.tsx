import Link from "next/link";
import {
  Phone,
  WhatsappLogo,
  EnvelopeSimple,
  MapPin,
  InstagramLogo,
  FacebookLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "TKIT", href: "/unit/tkit" },
  { label: "SDIT", href: "/unit/sdit" },
  { label: "SMPIT", href: "/unit/smpit" },
  { label: "Galeri", href: "/galeri" },
  { label: "Berita", href: "/berita" },
];

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-[#e2e8f0] bg-[#fafcfe]">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#068ec5] text-white font-bold text-sm">
                SIT
              </div>
              <span className="text-lg font-semibold tracking-tight text-[#1a1a2e]">
                SIT Baitul Halim
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#64748b]">
              Sekolah Islam Terpadu Baitul Halim mendidik generasi berilmu, beriman, dan berakhlak mulia.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#068ec5]/5 text-[#068ec5] transition-colors hover:bg-[#068ec5] hover:text-white"
              >
                <InstagramLogo size={18} weight="fill" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#068ec5]/5 text-[#068ec5] transition-colors hover:bg-[#068ec5] hover:text-white"
              >
                <FacebookLogo size={18} weight="fill" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#068ec5]/5 text-[#068ec5] transition-colors hover:bg-[#068ec5] hover:text-white"
              >
                <YoutubeLogo size={18} weight="fill" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight text-[#1a1a2e]">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#64748b] transition-colors hover:text-[#068ec5]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight text-[#1a1a2e]">
              Kontak
            </h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-[#068ec5]" />
                <span className="text-sm text-[#64748b]">(021) 123-4567</span>
              </li>
              <li className="flex items-start gap-2.5">
                <WhatsappLogo size={16} className="mt-0.5 shrink-0 text-[#068ec5]" />
                <span className="text-sm text-[#64748b]">+62 812-3456-7890</span>
              </li>
              <li className="flex items-start gap-2.5">
                <EnvelopeSimple size={16} className="mt-0.5 shrink-0 text-[#068ec5]" />
                <span className="text-sm text-[#64748b]">info@sitbaitulhalim.sch.id</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#068ec5]" />
                <span className="text-sm text-[#64748b]">
                  Jl. Pendidikan No. 1, Jakarta
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-tight text-[#1a1a2e]">
              Alamat
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-[#64748b]">
              Jl. Pendidikan No. 1,
              <br />
              Kelurahan Cakung,
              <br />
              Jakarta Timur, 13910
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/privacy-policy"
                className="text-sm text-[#64748b] transition-colors hover:text-[#068ec5]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-sm text-[#64748b] transition-colors hover:text-[#068ec5]"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e2e8f0]">
        <div className="mx-auto max-w-[1400px] px-6 py-5 lg:px-8">
          <p className="text-center text-xs text-[#94a3b8]">
            &copy; {new Date().getFullYear()} SIT Baitul Halim. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
