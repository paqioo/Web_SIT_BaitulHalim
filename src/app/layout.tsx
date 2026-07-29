import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIT Baitul Halim - Sekolah Islam Terpadu",
  description:
    "Website Portal Sekolah Islam Terpadu Baitul Halim. Mendidik generasi berilmu, beriman, dan berakhlak mulia.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let session = null;

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      session = {
        userId: payload.userId,
        nimNip: payload.nimNip,
        role: payload.role,
        unitSekolah: payload.unitSekolah,
        namaLengkap: payload.namaLengkap,
        fotoProfilUrl: payload.fotoProfilUrl,
      };
    }
  }

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-[100dvh] flex-col bg-white text-[#1a1a2e]">
        <Header initialSession={session} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
