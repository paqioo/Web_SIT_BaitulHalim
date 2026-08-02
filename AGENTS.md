# Agent Notes

## Deployment Setup

- **Hosting:** Vercel (gratis)
- **Database:** Supabase PostgreSQL (gratis)
- **Repo GitHub:** https://github.com/paqioo/Web_SIT_BaitulHalim
- **Branch:** main

## Environment Variables (Vercel)

- `DATABASE_URL` — Supabase PostgreSQL connection string (sudah diset di Vercel)
- `JWT_SECRET` — sudah diset di Vercel

## Build Command (Vercel)

```
prisma generate && next build
```

## Status

- Vercel build: BERHASIL
- Environment variables: SUDAH DISET di Vercel
- Database migration: BELUM — perlu `npx prisma db push` setelah .env lokal diganti ke Supabase connection string
- Seed data: BELUM — perlu `npx prisma db seed` setelah migration

## Langkah Selanjutnya

1. Ganti `DATABASE_URL` di `.env` lokal ke connection string Supabase
2. Jalankan `npx prisma db push` (buat tabel di Supabase)
3. Jalankan `npx prisma db seed` (isi data awal)
4. Redeploy di Vercel agar env baru terbaca
5. Ganti logic upload file dari lokal ke Supabase Storage (Vercel filesystem read-only)

## Commands

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — linting
- `npx prisma db push` — push schema ke database
- `npx prisma db seed` — seed data awal
- `npx prisma migrate dev` — create migration
