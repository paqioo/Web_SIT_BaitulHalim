import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { nimNip, namaLengkap, password, konfirmasiPassword } =
    await req.json();

  if (!nimNip || !namaLengkap || !password || !konfirmasiPassword) {
    return NextResponse.json(
      { error: "Semua field harus diisi." },
      { status: 400 }
    );
  }

  if (password !== konfirmasiPassword) {
    return NextResponse.json(
      { error: "Password dan konfirmasi password tidak cocok." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password minimal 6 karakter." },
      { status: 400 }
    );
  }

  const masterData = await prisma.masterData.findUnique({
    where: { nimNip },
  });

  if (!masterData) {
    return NextResponse.json(
      { error: "Data tidak ditemukan." },
      { status: 404 }
    );
  }

  if (masterData.status === "Aktif") {
    return NextResponse.json(
      { error: "Akun sudah aktif." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        masterDataId: masterData.id,
        nimNip,
        password: hashedPassword,
        role: masterData.role,
        unitSekolah: masterData.unitSekolah,
      },
    });

    await tx.masterData.update({
      where: { id: masterData.id },
      data: {
        status: "Aktif",
        namaLengkap,
      },
    });
  });

  return NextResponse.json({ success: true, message: "Aktivasi berhasil." });
}
