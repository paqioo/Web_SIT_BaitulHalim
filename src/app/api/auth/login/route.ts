import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { nimNip, password } = await req.json();

  if (!nimNip || !password) {
    return NextResponse.json(
      { error: "NIM/NIP dan password harus diisi." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { nimNip },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Akun tidak ditemukan. Silakan aktivasi akun terlebih dahulu." },
      { status: 404 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json(
      { error: "Password salah." },
      { status: 401 }
    );
  }

  const masterData = await prisma.masterData.findUnique({
    where: { id: user.masterDataId },
  });

  const token = await createToken({
    userId: user.id,
    nimNip: user.nimNip,
    role: user.role,
    unitSekolah: user.unitSekolah,
    namaLengkap: masterData?.namaLengkap || "",
    fotoProfilUrl: user.fotoProfilUrl,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const response = NextResponse.json({
    success: true,
    userId: user.id,
    nimNip: user.nimNip,
    role: user.role,
    unitSekolah: user.unitSekolah,
    namaLengkap: masterData?.namaLengkap || "",
    fotoProfilUrl: user.fotoProfilUrl,
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
    sameSite: "lax",
  });

  return response;
}
