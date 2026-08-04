"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { List, X, CaretDown, SignOut, User, Gear } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface UserSession {
  userId: number;
  nimNip: string;
  role: string;
  unitSekolah: string;
  namaLengkap: string;
  fotoProfilUrl: string | null;
}

interface HeaderProps {
  initialSession: UserSession | null;
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Profil", href: "/#about" },
  {
    label: "Unit",
    href: "#",
    children: [
      { label: "TKIT", href: "/unit/tkit" },
      { label: "SDIT", href: "/unit/sdit" },
      { label: "SMPIT", href: "/unit/smpit" },
    ],
  },
  { label: "Galeri", href: "/galeri" },
  { label: "News", href: "/berita" },
  { label: "Hubungi Kami", href: "/#footer" },
];

export default function Header({ initialSession }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session] = useState<UserSession | null>(initialSession);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)] transition-all duration-500",
        scrolled && "shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
      )}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#068ec5] text-white font-bold text-sm">
            SIT
          </div>
          <span className="hidden text-lg font-semibold tracking-tight text-[#1a1a2e] sm:block">
            SIT Baitul Halim
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-[#1a1a2e]/80 transition-colors hover:bg-[#068ec5]/5 hover:text-[#068ec5]">
                  {item.label}
                  <CaretDown
                    size={14}
                    weight="bold"
                    className={cn(
                      "transition-transform duration-300",
                      dropdownOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    dropdownOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  )}
                >
                  <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="flex items-center rounded-xl px-5 py-2.5 text-sm font-medium text-[#1a1a2e]/80 transition-colors hover:bg-[#068ec5]/5 hover:text-[#068ec5]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#1a1a2e]/80 transition-colors hover:bg-[#068ec5]/5 hover:text-[#068ec5]"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center rounded-full p-0.5 transition-all duration-300 hover:bg-[#068ec5]/5"
              >
                {session.fotoProfilUrl ? (
                  <img
                    src={session.fotoProfilUrl}
                    alt={session.namaLengkap}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#068ec5] text-xs font-bold text-white">
                    {getInitials(session.namaLengkap)}
                  </div>
                )}
              </button>
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                    <div className="mb-1 border-b border-[#e2e8f0] px-4 py-3">
                      <p className="text-sm font-semibold text-[#1a1a2e]">
                        {session.namaLengkap}
                      </p>
                      <p className="text-xs text-[#64748b]">
                        {session.role} - {session.unitSekolah}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-[#1a1a2e]/80 transition-colors hover:bg-[#068ec5]/5 hover:text-[#068ec5]"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Gear size={16} />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard?tab=profil"
                      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-[#1a1a2e]/80 transition-colors hover:bg-[#068ec5]/5 hover:text-[#068ec5]"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={16} />
                      Edit Foto Profil
                    </Link>
                    <button
                      onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        window.location.href = "/";
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                    >
                      <SignOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-[#068ec5] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0577a3] active:scale-[0.98]"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#1a1a2e] transition-colors hover:bg-[#068ec5]/5 lg:hidden"
          >
            {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden",
          mobileOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        )}
      >
        <div className="flex h-full flex-col items-center justify-center gap-6 px-8">
          {navItems.map((item, i) =>
            item.children ? (
              <div key={item.label} className="flex flex-col items-center gap-3">
                <span
                  className="text-lg font-semibold text-[#1a1a2e]/40"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {item.label}
                </span>
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-[#1a1a2e]/70 transition-colors hover:text-[#068ec5]"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-semibold text-[#1a1a2e] transition-colors hover:text-[#068ec5]"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
