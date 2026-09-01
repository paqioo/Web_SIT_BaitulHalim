export async function uploadImageToSupabase(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (!ext || !["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
    throw new Error("Format file harus JPG/PNG/WEBP/GIF")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran file maksimal 5MB")
  }

  const formData = new FormData()
  formData.append("foto", file)
  formData.append("judul", `image-${Date.now()}`)
  formData.append("section", "berita")
  formData.append("caption", "")
  formData.append("tanggal", new Date().toISOString())

  const res = await fetch("/api/galeri", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || "Gagal upload gambar")
  }

  const data = await res.json()
  return data.url
}
