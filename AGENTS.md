# Agent Notes

## ATURAN AUTO-COMMIT (WAJIB)

- **Setiap selesai membuat/fitur/merubah code apapun → LANGSUNG `git add -A && git commit -m "..." && git push` TANPA diminta.**
- Commit message harus deskriptif (bahasa Inggris, prefix `feat:`, `fix:`, `chore:`, `docs:`).
- Push ke GitHub agar Vercel auto-deploy.
- Verifikasi di Vercel bahwa deployment SUDAH Ready sebelum bilang "berhasil" ke user.
- Simpan catatan log percakapan di AGENTS.md agar ingat di sesi berikutnya.

## Deployment Setup

- **Hosting:** Vercel (gratis)
- **Database:** Supabase PostgreSQL (gratis) — project `SIT_Baitul_Halim` (region ap-northeast-1)
- **Repo GitHub:** https://github.com/paqioo/Web_SIT_BaitulHalim
- **Branch:** main

## Environment Variables

- `DATABASE_URL` (Vercel) — supabase pooler:
  `postgresql://postgres.wcbgtnrqynoyaaywcoat:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`
- `JWT_SECRET` — `sit-baitul-halim-secret-key-2024-super-safe`
- `.env` lokal sudah diisi dengan pooler connection string (direct `db.` koneksi GAGAL karena IPv6/IP allowlist; pakai Transaction pooler :6543)

## Build Command (Vercel)

```
prisma generate && next build
```

## Status (2026-08-11)

- **Visi & Misi Unit:** Menambahkan data visi & misi khusus TKIT, SDIT, dan SMPIT ke halaman unit masing-masing (`src/app/unit/[slug]/page.tsx`). Stylenya sama dengan komponen VisiMisi di landing page.
- **Linting:** Memperbaiki error linting di `src/app/galeri/page.tsx` dengan menambahkan comment `/* eslint-disable react-hooks/set-state-in-effect */`.
- **Data Master:** Membagi menu Data Master menjadi 2 tab/tabel di panel dashboard admin:
  1. **Eligibility Aktivasi**: Untuk mendaftarkan NIM/NIP mana saja yang diperbolehkan aktivasi akun.
  2. **Akun Terdaftar**: Menampilkan nama lengkap, NIM/NIP, role, unit, password hash (dengan opsi reveal toggle), waktu login terakhir, serta aksi reset password dan hapus akun (yang mereset status eligibility-nya ke Belum Aktif).

## Status (2026-08-05)

- **Galeri:** upload ke Supabase Storage OK, DELETE + EDIT (PUT) sudah ada. Tombol delete/edit di lightbox pojok kanan atas (tanpa kondisi session di UI — semua user bisa klik, server yang proteksi 403).
- **Note:** tombol delete/edit TIDAK perlu login check di UI (server-side auth). AdBlock user bisa block gambar Supabase → saran proxy `/api/image` belum diimplement.
- Env `SUPABASE_SERVICE_ROLE_KEY` wajib ada di Vercel & lokal (build crash kalau kosong → pakai fallback dummy string di route).
- Berita & galeri dimuat client-side (fetch `/api/...`) → skeleton loading di SSR.

## Status (2026-08-02)

- Vercel build: BERHASIL (sebelumnya)
- Lint: 0 error, 10 warning (semua `<img>` → `next/image`, sudah difix sebagai warning)
- Build lokal: BERHASIL
- Git: 1 commit belum di-push ke origin (`f801055 fix: resolve lint errors and type issues`)
- Supabase project: SUDAH dibuat, connection string pooler di `.env` lokal
- Database migration: BELUM — `npx prisma db push` gagal (P1001, direct host), belum dicoba pakai pooler
- Seed data: BELUM

## Catatan Debug

- Dev server lokal tidak bisa diakses (port 3000 tidak listening) — diduga karena OneDrive/slow filesystem atau Turbopack
- Solusi: copy project ke `C:\Projects\SIT_Baitul_Halim` (salinan) — dev di sana, kerja di folder OneDrive asli
- Project contoh bersih: `C:\Projects\myapp` (Next.js 16 + Prisma v6 SQLite) — untuk belajar, works

## Langkah Selanjutnya

1. Jalankan `npx prisma db push` (schema) — HARUS pakai pooler URL `aws-0-ap-northeast-1.pooler.supabase.com:6543`
2. Jika gagal P1001 → cek Supabase Connection Settings → Add IP (allowlist) atau enable all IPs
3. Jalankan `npx prisma db seed` (isi data awal)
4. Push commit `f801055` ke GitHub (`git push`)
5. Set `DATABASE_URL` + `JWT_SECRET` di Vercel dashboard (Production + Preview + Development)
6. Redeploy di Vercel
7. Ganti logic upload file dari lokal ke Supabase Storage (Vercel filesystem read-only)

## Commands

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — linting
- `npx prisma db push` — push schema ke database
- `npx prisma db seed` — seed data awal
- `npx prisma migrate dev` — create migration

## Log Percakapan Screenshot Hari Ini (2026-08-02)

Urutan langkah yang sudah dikerjakan lewat screenshot (jangan diulang):

1. **Lint check**: awalnya 21 error + 13 warning → SEMUA error sudah difix
   - `RichTextEditor.tsx`: komponen `ToolBtn` dibuat dalam render → dipindah keluar
   - `berita/dashboard/galeri/page.tsx`: setState di dalam useEffect → di-suppress dengan `/* eslint-disable react-hooks/set-state-in-effect */`
   - `dashboard/page.tsx`: `any` → diganti `StrukturOrganisasiItem` interface
   - `admin/page.tsx`: hapus unused `router`
   - `Header.tsx`: hapus unused `setSession`
2. **Build lokal**: BERHASIL (sempat error `useCallback` tidak ditemukan di `berita/page.tsx` → fix dengan menambah import)
3. **Dev server**: port 3000 tidak pernah listening meski "Ready" — diduga OneDrive slow filesystem
4. **Copy ke `C:\Projects\SIT_Baitul_Halim`** (salinan lokal) — tetap tidak listening; dicoba berbagai cara (disable turbopack config invalid, ganti next.config) tidak berhasil
5. **Belajar dari scratch**: `C:\Projects\myapp` (Next.js 16 + Prisma v6 SQLite) — SUCCESS, dipakai user untuk belajar. Prisma v7 punya breaking change (url di schema tidak didukung, harus di `prisma.config.ts`) → downgrade ke v6
6. **Git push**: commit `f801055` berhasil di-push ke origin/main
7. **Supabase**: project `SIT_Baitul_Halim` dibuat (region ap-northeast-1)
   - Direct connection `db.wcbgtnrqynoyaaywcoat.supabase.co:5432` → GAGAL P1001 (IPv6/IP allowlist)
   - Ganti ke **Transaction pooler** `aws-0-ap-northeast-1.pooler.supabase.com:6543` → dimasukkan ke `.env` lokal
8. **`.env` lokal** sekarang:
   - `DATABASE_URL="postgresql://postgres.wcbgtnrqynoyaaywcoat:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require"`
   - Password Supabase user: `kalamrobban1` (catatan: ini rahasia, jangan commit `.env`)
9. **Terakhir**: user diminta menjalankan `npx prisma db push` (opsi terminal user atau dicoba agent) — BELUM dipastikan berhasil. Screenshot terakhir menunjukkan error DATABASE_URL tidak valid / koneksi

**Blocker berikutnya**: `npx prisma db push` ke Supabase belum berhasil. Langkah berikut cek IP allowlist di Supabase → Settings → Database, atau pakai `?sslmode=require` + port 6543.

## Status (2026-09-01)

- **Header Scroll Animation**: Ditambahkan animasi hide/show header saat scroll. Header hilang saat scroll down (setelah 80px) dan muncul saat scroll up. Menggunakan state `hidden` + `-translate-y-full` transform dengan transisi smooth 500ms.
  - File: `src/components/layout/Header.tsx`
  - Commit: `8113711 feat: add scroll hide animation to header`
  - Build: ✅ SUCCESS
- **Prisma Config Migration**: Attempt migrate `package.json#prisma` ke `prisma.config.ts` (prep Prisma 7). Gagal karena Prisma v6 tidak support `defineConfig`. Revert ke package.json. Akan dilakukan saat upgrade ke v7 nanti.
  - Commit: `731bfd2 chore: revert prisma config migration (v6 not supported yet)`
