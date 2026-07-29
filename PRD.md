# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project Name:** Website Portal Sekolah SIT Baitul Halim  
**Document Version:** 1.0  
**Document Type:** Technical & Product Specification  

---

## 1. Project Overview

Website Portal Sekolah SIT Baitul Halim adalah sebuah platform berbasis web terintegrasi yang berfungsi sebagai Company Profile, Portal Informasi Sekolah, dan Content Management System (CMS). Platform ini memfasilitasi akses publik serta akses terautentikasi melalui Portal Login untuk Guru dan Murid, serta Dashboard khusus untuk Admin dalam mengelola operasional data dan konten.

---

## 2. Goals

- Menyediakan pusat informasi publik (Company Profile) yang representatif untuk SIT Baitul Halim dan unit sekolahnya (TKIT, SDIT, SMPIT).
- Mengimplementasikan sistem autentikasi yang aman dan terpusat (berbasis data master) untuk entitas Admin, Guru, dan Murid.
- Menyediakan sistem navigasi dinamis dengan tombol Login di ujung kanan navbar yang berubah menjadi Profil Pengguna setelah berhasil masuk.
- Menyediakan fitur manajemen profil mandiri bagi user terautentikasi untuk melakukan pembaruan (edit) foto profil.
- Menyediakan dua jenis Dashboard: Dashboard Sebelum Login (View-Only untuk Pengunjung) dan Dashboard Setelah Login (Privileged untuk Admin/Guru/Murid).
- Menyediakan sistem manajemen konten (CMS) yang memungkinkan Guru dan Admin mengelola galeri, profil sekolah, dan halaman unit secara mandiri.
- Mengimplementasikan sistem publikasi berita/artikel dengan alur moderasi (approval flow) khusus untuk kontributor berstatus Murid.

---

## 3. User Roles

Terdapat 4 entitas pengguna dalam sistem ini:

| Role | Deskripsi |
|------|-----------|
| **Admin** | Akun dibuat manual. Mengelola data master, akses penuh CMS, moderasi berita, Dashboard Admin. |
| **Guru** | Aktivasi via data master. Mengelola konten web, galeri, publikasi berita (direct publish), Dashboard Guru. |
| **Murid** | Aktivasi via data master. Membaca & membuat berita (pending review), Dashboard Murid. |
| **Pengunjung (Guest)** | Publik tanpa login. Akses view-only ke Landing Page, Halaman Unit, Galeri, Berita. |

---

## 4. Information Architecture

```
Global Layout
├── Header Global (Login Button / Profile Widget di ujung kanan)
└── Footer Global

Halaman Publik (View-Only / Dashboard Sebelum Login)
├── Landing Page (Home)
│   ├── Hero
│   ├── Welcome
│   ├── Visi Misi
│   ├── Unit Sekolah (TKIT, SDIT, SMPIT)
│   ├── Fasilitas
│   ├── Galeri Preview
│   ├── Berita Preview
│   └── Instagram Feed
├── Halaman Unit
│   ├── TKIT
│   ├── SDIT
│   └── SMPIT
├── Halaman Galeri
│   ├── Grid Layout + Lightbox
│   └── Filter (Semua, SIT, TKIT, SDIT, SMPIT)
├── Halaman Berita
│   ├── Daftar Berita + Pagination
│   ├── Detail Berita
│   └── Buat Postingan (hanya jika login)

Dashboard Setelah Login (Privileged)
├── Dashboard Admin
├── Dashboard Guru
└── Dashboard Murid

Profil Management
└── Edit Foto Profil
```

---

## 5. User Flow

### 5.1. Flow Registrasi / Aktivasi Akun (Guru & Murid)

1. Admin menginput data master: Nama Lengkap, NIM/NIP, Role, Unit Sekolah. Status awal: **Belum Aktif**.
2. Guru/Murid membuka halaman Login → klik **"Aktivasi Akun"**.
3. Mengisi: Nama Lengkap, NIM/NIP, Password, Konfirmasi Password.
4. Sistem mencocokkan Nama Lengkap dan NIM/NIP dengan data master.
   - **Cocok & Belum Aktif:** Akun dibuat, password di-hash, status berubah menjadi **Aktif**.
   - **Tidak Cocok:** Tampil pesan *"Data tidak ditemukan."*
   - **Sudah Aktif:** Tampil pesan *"Akun sudah aktif."*

### 5.2. Flow Login & Routing Dashboard

1. Pengguna membuka halaman Login.
2. Memasukkan NIM/NIP dan Password.
3. Sistem memvalidasi kredensial.
4. Sistem membaca `Role` otomatis dari database (tanpa pilihan manual).
5. **Redirect:**
   - Belum login (klik Home) → **Dashboard Sebelum Login (View-Only)**.
   - Sudah login → **Dashboard Setelah Login** sesuai role (Admin/Guru/Murid).

### 5.3. Flow Edit Foto Profil

1. User (Admin/Guru/Murid) yang sudah login mengakses Profile Widget di Header.
2. Memilih opsi **"Edit Profil" / "Ubah Foto Profil"**.
3. Mengunggah file gambar baru.
4. Sistem memvalidasi format dan ukuran file.
5. Jika valid, sistem menyimpan & memperbarui URL foto profil.

### 5.4. Flow Publikasi Berita

1. User (login) masuk ke Halaman Berita → klik **"Buat Postingan"**.
2. Mengisi Headline, memilih Section (SIT/TKIT/SDIT/SMPIT), dan mengisi konten via Rich Text Editor.
3. **Skenario Role:**
   - Admin/Guru → Langsung **Published**.
   - Murid → Status **Pending Review**.
4. **Moderasi:** Admin/Guru melihat daftar Pending Review → Preview → Approve / Reject / Edit sebelum Publish / Delete / Takedown.

---

## 6. Functional Requirements

### 6.1. Global Layout

Semua halaman wajib menggunakan Header dan Footer.

#### Header

| Komponen | Deskripsi |
|----------|-----------|
| Logo | Logo SIT Baitul Halim (kiri) |
| Navigasi | Home, Profil, Unit (dropdown: TKIT/SDIT/SMPIT), Galeri, News, Hubungi Kami (tengah) |
| **Login / Profile Area** | **Ujung kanan navbar** |
| Kondisi Belum Login | Tombol **Login** |
| Kondisi Sudah Login | **Foto Profil (Avatar)** + Nama. Klik → dropdown: Dashboard, Edit Foto Profil, Logout |

**Behaviour Navigasi:**
- **Home** → Dashboard Sebelum Login (jika belum login) / Dashboard Role (jika sudah login).
- **Profil** → Smooth Scroll ke section About School.
- **Unit** → Dropdown. Klik membuka halaman unit masing-masing.
- **Galeri** → Halaman Galeri.
- **News** → Halaman Berita.
- **Hubungi Kami** → Smooth Scroll ke Footer.

#### Footer

| Komponen | Deskripsi |
|----------|-----------|
| Logo | Logo SIT Baitul Halim |
| Copyright | Hak cipta |
| Kontak | Telepon, WhatsApp, Email |
| Alamat | Alamat sekolah |
| Social Media | Link media sosial |
| Quick Links | Navigasi cepat |
| Legal | Privacy Policy, Terms of Service |

### 6.2. Landing Page

Urutan section wajib:

| No | Section | Deskripsi | Editable Oleh |
|----|---------|-----------|---------------|
| 1 | Hero | Banner utama | Admin |
| 2 | Welcome | Teks sambutan | Guru, Admin |
| 3 | Visi Misi | Visi dan misi sekolah | Guru, Admin |
| 4 | Unit Sekolah | Interactive card (TKIT, SDIT, SMPIT). Klik → halaman unit | Static |
| 5 | Fasilitas | Card (Foto, Judul, Deskripsi) | Guru, Admin |
| 6 | Galeri Preview | Preview beberapa foto. Tombol "Lihat Semua" jika lebih banyak | Auto dari Galeri |
| 7 | Berita Preview | Preview berita terbaru. Tombol "Lihat Semua" jika lebih banyak | Auto dari Berita |
| 8 | Instagram Feed | Realtime feed @sit_baitulhalim | Auto (API) |

### 6.3. Halaman Unit (TKIT, SDIT, SMPIT)

Layout identik, hanya berbeda data.

| Section | Deskripsi | Editable Oleh |
|---------|-----------|---------------|
| Hero Unit | Banner unit | Admin |
| Sambutan Kepala Sekolah | Foto lingkaran + teks sambutan | Guru, Admin |
| Akreditasi | Informasi akreditasi | Admin |
| Visi Misi | Visi misi unit | Guru, Admin |
| Tenaga Pendidik | Card (Foto, Nama, Jabatan, Deskripsi). **Horizontal Carousel** | Guru, Admin |
| Murid Berprestasi | Card (Foto, Nama, Prestasi, Deskripsi). Carousel jika >1. **Sembunyi jika kosong** | Guru, Admin |
| Galeri Unit | Preview galeri spesifik unit | Auto |
| Berita Unit | Preview berita spesifik unit | Auto |

### 6.4. Halaman Galeri

- **Display:** Grid Layout. Klik → Lightbox.
- **Filter:** Semua, SIT, TKIT, SDIT, SMPIT.
- **Upload (Admin & Guru only):** Field: Judul, Foto, Caption, Tanggal, Section.
- **Logic Tampilan:**
  - Section **SIT** → Tampil di Dashboard & Halaman Galeri.
  - Section **TKIT/SDIT/SMPIT** → Tampil di Halaman Unit terkait & Halaman Galeri.

### 6.5. Halaman Berita

- **Komponen:** Hero, Search, Filter (Terbaru/Terlama), Buat Postingan, Daftar Berita, Pagination.
- **Search:** Mencari dari Headline & Isi Berita.
- **Buat Postingan (hanya jika login):**
  - Dibuat langsung di halaman Berita, bukan di Dashboard.
  - Field: Headline, Rich Text Editor, Section (SIT/TKIT/SDIT/SMPIT).
  - **Rich Text Editor:** UX seperti MS Word: Bold, Italic, Underline, Heading, Bullet, Number List, Quote, Alignment, Link. Upload Foto & Video **inline** di dalam teks.
  - **Author:** Otomatis dari session login, tidak bisa diubah manual.
- **Detail Berita:** Headline, Author, Tanggal, Isi Artikel (kombinasi Text, Image, Video sesuai penempatan editor).

### 6.6. Dashboard Sebelum Login (View-Only)

- Diakses oleh Pengunjung yang belum login.
- Menampilkan informasi publik: Landing Page, Halaman Unit, Galeri, Berita.
- **Tidak ada tombol aksi** (tambah/edit/hapus).
- Navigasi Header menampilkan tombol **Login** di ujung kanan.

### 6.7. Dashboard Setelah Login (Privileged)

- Diakses setelah login. Tampilan dan fitur berbeda sesuai role.
- Navigasi Header menampilkan **Foto Profil + Nama** di ujung kanan.
- Menu dropdown: Dashboard, Edit Foto Profil, Logout.

#### Dashboard Admin
- Kelola Data Master (CRUD user eligibility).
- Kelola Seluruh Konten (Welcome, Visi Misi, Fasilitas, dll).
- Kelola Galeri (Upload/Hapus).
- Kelola Berita (CRUD + Moderasi Pending Review).
- Lihat Statistik/Informasi sistem.

#### Dashboard Guru
- Kelola Konten (Welcome, Visi Misi, Fasilitas, dll).
- Kelola Galeri (Upload/Hapus).
- Kelola Berita (CRUD + Moderasi Pending Review).

#### Dashboard Murid
- Lihat status berita sendiri.
- Daftar berita yang sudah dibuat (Published / Pending / Rejected).

---

## 7. Non Functional Requirements

| Kategori | Requirement |
|----------|-------------|
| **Responsive** | Mendukung mobile, tablet, desktop |
| **Security** | Password di-hash (bcrypt/argon2). Endpoint API diproteksi. Token-based auth (JWT/Session). |
| **Performance** | Lazy loading untuk galeri. Image optimization saat upload. Caching untuk Instagram Feed. |
| **SEO** | Semantic HTML, meta tags, Open Graph untuk berita. |
| **Accessibility** | Navigasi keyboard-friendly. Alt text pada gambar. |

---

## 8. Database Entities (Logical Mapping)

### 8.1. Entity Overview

| No | Entitas | Deskripsi |
|----|---------|-----------|
| 1 | `users` | User terautentikasi (Admin, Guru, Murid) |
| 2 | `master_data` | Data eligibility untuk aktivasi akun |
| 3 | `posts_berita` | Berita/artikel |
| 4 | `gallery` | Foto galeri |
| 5 | `web_content` | Konten dinamis website (key-value) |
| 6 | `tenaga_pendidik` | Data tenaga pendidik per unit |
| 7 | `murid_berprestasi` | Data murid berprestasi per unit |
| 8 | `fasilitas` | Data fasilitas sekolah |

### 8.2. Entity Detail

#### `master_data`
| Field | Type | Keterangan |
|-------|------|------------|
| id | INT PK AI | |
| nama_lengkap | VARCHAR(255) | |
| nim_nip | VARCHAR(100) UNIQUE | |
| role | ENUM('admin','guru','murid') | |
| unit_sekolah | ENUM('SIT','TKIT','SDIT','SMPIT') | |
| status | ENUM('Belum Aktif','Aktif') | Default: 'Belum Aktif' |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### `users`
| Field | Type | Keterangan |
|-------|------|------------|
| id | INT PK AI | |
| master_data_id | INT FK → master_data.id | |
| nim_nip | VARCHAR(100) UNIQUE | |
| password | VARCHAR(255) | Hashed |
| foto_profil_url | VARCHAR(500) | Nullable |
| role | ENUM('admin','guru','murid') | |
| unit_sekolah | ENUM('SIT','TKIT','SDIT','SMPIT') | |
| last_login | TIMESTAMP | Nullable |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### `posts_berita`
| Field | Type | Keterangan |
|-------|------|------------|
| id | INT PK AI | |
| headline | VARCHAR(255) | |
| content | LONGTEXT | HTML dari Rich Text Editor |
| author_id | INT FK → users.id | |
| section | ENUM('SIT','TKIT','SDIT','SMPIT') | |
| status | ENUM('Published','Pending Review','Rejected') | |
| featured_image | VARCHAR(500) | Opsional |
| created_at | TIMESTAMP | |
| published_at | TIMESTAMP | Nullable |
| updated_at | TIMESTAMP | |

#### `gallery`
| Field | Type | Keterangan |
|-------|------|------------|
| id | INT PK AI | |
| judul | VARCHAR(255) | |
| foto_url | VARCHAR(500) | |
| caption | TEXT | Nullable |
| tanggal | DATE | |
| section | ENUM('SIT','TKIT','SDIT','SMPIT') | |
| uploader_id | INT FK → users.id | |
| created_at | TIMESTAMP | |

#### `web_content`
| Field | Type | Keterangan |
|-------|------|------------|
| id | INT PK AI | |
| key | VARCHAR(100) UNIQUE | Identifier (e.g., 'welcome_text', 'visi_misi', 'sambutan_tkit') |
| value | LONGTEXT | Content (HTML atau JSON) |
| updated_by | INT FK → users.id | |
| updated_at | TIMESTAMP | |

#### `tenaga_pendidik`
| Field | Type | Keterangan |
|-------|------|------------|
| id | INT PK AI | |
| foto_url | VARCHAR(500) | |
| nama | VARCHAR(255) | |
| jabatan | VARCHAR(255) | |
| deskripsi | TEXT | Nullable |
| unit_id | ENUM('TKIT','SDIT','SMPIT') | |
| sort_order | INT | Default 0 |
| created_at | TIMESTAMP | |

#### `murid_berprestasi`
| Field | Type | Keterangan |
|-------|------|------------|
| id | INT PK AI | |
| foto_url | VARCHAR(500) | |
| nama | VARCHAR(255) | |
| prestasi | VARCHAR(255) | |
| deskripsi | TEXT | Nullable |
| unit_id | ENUM('TKIT','SDIT','SMPIT') | |
| sort_order | INT | Default 0 |
| created_at | TIMESTAMP | |

#### `fasilitas`
| Field | Type | Keterangan |
|-------|------|------------|
| id | INT PK AI | |
| foto_url | VARCHAR(500) | |
| judul | VARCHAR(255) | |
| deskripsi | TEXT | |
| sort_order | INT | Default 0 |
| created_at | TIMESTAMP | |

---

## 9. Permission Matrix

| Fitur / Action | Admin | Guru | Murid | Pengunjung |
|:---|---:|:---:|:---:|:---:|
| Akses Landing, Unit, Berita (View) | ✅ | ✅ | ✅ | ✅ |
| Akses Dashboard Sebelum Login (View-Only) | ✅ | ✅ | ✅ | ✅ |
| Akses Dashboard Setelah Login (Privileged) | ✅ | ✅ | ✅ | ❌ |
| Edit Foto Profil Sendiri | ✅ | ✅ | ✅ | ❌ |
| Input / Kelola Data Master | ✅ | ❌ | ❌ | ❌ |
| Edit Welcome, Visi Misi, Fasilitas | ✅ | ✅ | ❌ | ❌ |
| Edit Sambutan, Tenaga Pendidik, Murid Berprestasi | ✅ | ✅ | ❌ | ❌ |
| Upload / Kelola Galeri | ✅ | ✅ | ❌ | ❌ |
| Buat Berita | ✅ (Direct Publish) | ✅ (Direct Publish) | ✅ (Pending Review) | ❌ |
| Preview, Approve, Reject Berita | ✅ | ✅ | ❌ | ❌ |
| Edit Berita Sebelum Publish (Moderasi) | ✅ | ✅ | ❌ | ❌ |
| Delete & Takedown Berita | ✅ | ✅ | ❌ | ❌ |

---

## 10. UI Components

| Komponen | Deskripsi | Lokasi |
|----------|-----------|--------|
| **Navbar Profile Widget** | Ujung kanan header. Tombol Login (jika belum login) / Avatar + Nama + Dropdown (jika sudah login) | Global Header |
| **Card Interactive** | Card dengan efek hover untuk Unit Sekolah | Landing Page |
| **Card Standard** | Card (Foto, Judul, Deskripsi) | Fasilitas, Tenaga Pendidik, Murid Berprestasi |
| **Horizontal Carousel** | Scroll horizontal. Untuk Tenaga Pendidik & Murid Berprestasi (jika >1) | Halaman Unit |
| **Grid Layout** | Grid foto untuk galeri | Halaman Galeri |
| **Lightbox** | Modal overlay untuk preview foto ukuran penuh | Halaman Galeri |
| **Rich Text Editor** | WYSIWYG editor (MS Word-like) dengan inline upload media | Buat Postingan |
| **Dropdown Navigasi** | Dropdown menu Unit di header | Global Header |
| **Pagination** | Navigasi halaman untuk daftar berita | Halaman Berita |
| **Search Bar** | Input pencarian berita | Halaman Berita |
| **Filter Button** | Filter urutan (Terbaru/Terlama) | Halaman Berita |

---

## 11. Validation Rules

| Fitur | Aturan Validasi |
|-------|-----------------|
| **Aktivasi Akun** | Nama Lengkap & NIM/NIP harus exact match dengan data master |
| **Aktivasi State** | Jika status master_data = 'Aktif', block request (tampilkan "Akun sudah aktif.") |
| **Login** | NIM/NIP & Password wajib diisi. Password harus sesuai dengan hash di database |
| **Edit Foto Profil** | Format: .jpg, .jpeg, .png. Maksimal 2MB. Dimensi min 100x100px |
| **Upload Galeri** | Format: .jpg, .jpeg, .png, .webp. Maksimal 5MB |
| **Buat Berita** | Headline wajib (max 255 chars). Content wajib (min 10 chars). Section wajib dipilih |
| **Rich Text Editor** | Sanitasi HTML. Validasi ekstensi file upload (gambar/video aman) |
| **Data Master** | NIM/NIP harus unique |

---

## 12. Edge Cases

| No | Edge Case | Penanganan |
|----|-----------|------------|
| 1 | **Murid Berprestasi kosong** | Section disembunyikan sepenuhnya (tidak ada jarak kosong) |
| 2 | **Galeri terlalu banyak foto** | Pagination atau infinite scroll |
| 3 | **Akses halaman internal tanpa login** | Redirect ke Dashboard Sebelum Login (View-Only) |
| 4 | **Foto profil belum diupload** | Tampilkan avatar inisial (contoh: "AH" untuk Ahmad Halim) |
| 5 | **Berita tanpa foto** | Tampilkan placeholder/default image |
| 6 | **Akun master dihapus Admin** | Cascade: nonaktifkan user terkait |
| 7 | **User berganti nama di data master** | History berita tetap menggunakan nama original saat pembuatan |
| 8 | **Upload gagal (size/format)** | Tampilkan pesan error spesifik, jangan reset form |
| 9 | **Concurrent login** | Satu sesi aktif per user (invalidasi sesi lama) |
| 10 | **Instagram feed offline** | Tampilkan cached data atau placeholder statis |

---

## 13. Future Scalability

| Area | Rekomendasi |
|------|-------------|
| **Media Storage** | Pisahkan ke bucket terpisah (AWS S3 / Cloud Storage) untuk skala besar |
| **CMS Extensibility** | Gunakan key-value table untuk `web_content` agar penambahan section baru tidak perlu migrasi database |
| **Multi Language** | Siapkan struktur i18n di frontend dan backend |
| **Notification** | Notifikasi email/WhatsApp untuk aktivasi akun & status berita |
| **Logging & Audit Trail** | Catat semua aktivitas CRUD untuk keperluan audit |
| **API Rate Limiting** | Proteksi endpoint login dan aktivasi dari brute force |
| **SSO / OAuth** | Integrasi dengan Google/Microsoft Account di masa depan |

---

## 14. Development Recommendation

| Aspek | Rekomendasi |
|-------|-------------|
| **Frontend Framework** | React / Next.js (SSR untuk SEO) atau Vue.js / Nuxt.js |
| **Backend Framework** | Node.js (Express/NestJS) atau Laravel (PHP) |
| **Database** | PostgreSQL atau MySQL/MariaDB |
| **Rich Text Editor** | Quill.js, CKEditor 5, atau TipTap (ProseMirror-based) |
| **Image Optimization** | Sharp.js (server-side) atau Next.js Image Optimization |
| **Carousel** | Swiper.js atau Framer Motion untuk animasi smooth |
| **Instagram Feed** | Meta Graph API dengan caching backend (cron job tiap 6 jam) |
| **Authentication** | JWT (access + refresh token) atau Laravel Sanctum |
| **File Upload** | Multer (Node.js) atau Laravel Upload dengan validasi |
| **UI Styling** | Tailwind CSS + Headless UI / shadcn/ui |

---

## 15. Glossary

| Istilah | Definisi |
|---------|----------|
| **Data Master** | Data eligibility yang diinput Admin untuk aktivasi akun Guru/Murid |
| **Dashboard Sebelum Login** | Tampilan website publik (view-only) untuk pengunjung yang belum login |
| **Dashboard Setelah Login** | Dashboard internal dengan hak akses sesuai role (Admin/Guru/Murid) |
| **View-Only** | Mode hanya bisa melihat, tidak ada tombol aksi (tambah/edit/hapus) |
| **Privileged** | Mode dengan hak istimewa untuk mengelola data/konten |
| **Rich Text Editor** | Editor WYSIWYG seperti Microsoft Word untuk menulis artikel |
| **Pending Review** | Status berita yang menunggu persetujuan Admin/Guru |
| **Lightbox** | Modal overlay untuk menampilkan foto ukuran penuh |
| **Section** | Kategori konten: SIT, TKIT, SDIT, SMPIT |

---

*Document prepared by Senior PM, Senior UX Designer, and Senior Software Architect.*