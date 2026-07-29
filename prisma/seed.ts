import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();


async function main() {
  console.log("Seeding started...");

  // 1. Create Default Admin Master Data
  const masterAdmin = await prisma.masterData.upsert({
    where: { nimNip: "19800101200001" },
    update: {},
    create: {
      namaLengkap: "Ahmad Jaelani, S.Pd.",
      nimNip: "19800101200001",
      role: "admin",
      unitSekolah: "SIT",
      status: "Aktif",
    },
  });

  // 2. Create Default Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { nimNip: "19800101200001" },
    update: {},
    create: {
      masterDataId: masterAdmin.id,
      nimNip: "19800101200001",
      password: hashedPassword,
      role: "admin",
      unitSekolah: "SIT",
      fotoProfilUrl: null,
    },
  });

  // 3. Default Web Contents
  const contents = [
    { key: "welcome_headline", value: "Membentuk Generasi Robbani, Cerdas, dan Mandiri" },
    {
      key: "welcome_text",
      value:
        "Selamat Datang di SIT Baitul Halim. Kami berkomitmen untuk menyelenggarakan pendidikan berkualitas tinggi yang mengintegrasikan nilai-nilai Islam ke dalam kurikulum pembelajaran, guna mencetak generasi masa depan yang tangguh, berakhlak mulia, dan berprestasi.",
    },
    {
      key: "visi",
      value:
        "Menjadi Lembaga Pendidikan Islam Terpadu Unggulan yang Menghasilkan Generasi Rabbani, Cerdas, Berkarakter, dan Berdaya Saing Global.",
    },
    {
      key: "misi",
      value:
        "1. Menyelenggarakan pendidikan holistik berbasis nilai-nilai Al-Qur'an dan Sunnah.\n2. Mengembangkan potensi akademik dan non-akademik peserta didik secara optimal.\n3. Membiasakan akhlak mulia dan budaya Islami di lingkungan sekolah.\n4. Menerapkan manajemen sekolah yang profesional dan transparan.",
    },
    {
      key: "tkit_sambutan",
      value: "Pendidikan anak usia dini adalah masa keemasan untuk merajut dasar keimanan, kemandirian, dan keceriaan buah hati Anda.",
    },
    {
      key: "sdit_sambutan",
      value: "Menyediakan lingkungan belajar yang interaktif, menantang, dan Islami untuk membangun pondasi karakter anak.",
    },
    {
      key: "smpit_sambutan",
      value: "Mempersiapkan remaja unggul yang kritis, kreatif, religius, dan berjiwa kepemimpinan untuk masa depan mereka.",
    },
  ];

  for (const item of contents) {
    await prisma.webContent.upsert({
      where: { key: item.key },
      update: {},
      create: {
        key: item.key,
        value: item.value,
      },
    });
  }

  // 6. Default Fasilitas
  const fasilitas = [
    { judul: "Ruang Kelas Full AC", deskripsi: "Dilengkapi dengan proyektor, smartboard, dan suasana belajar yang interaktif." },
    { judul: "Laboratorium Komputer", deskripsi: "Mendukung literasi digital murid dengan unit PC modern berkecepatan tinggi." },
    { judul: "Perpustakaan Digital", deskripsi: "Menyediakan ribuan referensi buku cetak maupun digital terlengkap." },
    { judul: "Lapangan Olahraga", deskripsi: "Fasilitas olahraga luas untuk futsal, basket, bulu tangkis, dan panahan." },
  ];

  for (const item of fasilitas) {
    const exist = await prisma.fasilitas.findFirst({ where: { judul: item.judul } });
    if (!exist) {
      await prisma.fasilitas.create({ data: item });
    }
  }

  // 7. Default Tenaga Pendidik
  const pendidik = [
    { nama: "H. Abdullah Syukur, Lc.", jabatan: "Kepala Sekolah SMPIT", unitId: "SMPIT", deskripsi: "Lulusan Universitas Al-Azhar Kairo dengan pengalaman mengajar 15 tahun." },
    { nama: "Dra. Hj. Nurhaliza", jabatan: "Kepala Sekolah SDIT", unitId: "SDIT", deskripsi: "Fokus pada pengembangan karakter anak usia dasar dan metode active learning." },
    { nama: "Zahra Aulia, S.Psi.", jabatan: "Kepala Sekolah TKIT", unitId: "TKIT", deskripsi: "Pakar psikologi perkembangan anak usia dini dengan pendekatan penuh kasih." },
  ];

  for (const item of pendidik) {
    const exist = await prisma.tenagaPendidik.findFirst({ where: { nama: item.nama } });
    if (!exist) {
      await prisma.tenagaPendidik.create({ data: item });
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
