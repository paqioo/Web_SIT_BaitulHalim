"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, Upload, ImageSquare, Trash } from "@phosphor-icons/react";
import { useSession } from "@/contexts/SessionContext";

interface GalleryItem {
  id: number;
  judul: string;
  fotoUrl: string;
  caption: string | null;
  tanggal: string;
  section: string;
}

const sections = ["Semua", "SIT", "TKIT", "SDIT", "SMPIT"];

export default function GaleriPage() {
  const session = useSession();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState("Semua");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  const [judul, setJudul] = useState("");
  const [caption, setCaption] = useState("");
  const [section, setSection] = useState("SIT");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    console.log("Session in galeri page:", session);
  }, [session]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/galeri${filter !== "Semua" ? `?section=${filter}` : ""}`
    );
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async () => {
    if (!file || !judul) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("foto", file);
    formData.append("judul", judul);
    formData.append("caption", caption);
    formData.append("section", section);
    formData.append("tanggal", new Date().toISOString());

    const res = await fetch("/api/galeri", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setShowUpload(false);
      setJudul("");
      setCaption("");
      setFile(null);
      load();
    }
    setUploading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus foto ini?")) return;
    setDeleting(true);
    const res = await fetch(`/api/galeri/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setLightbox(null);
      load();
    }
    setDeleting(false);
  };

  const filtered =
    filter === "Semua" ? items : items.filter((i) => i.section === filter);

  return (
    <div className="min-h-[100dvh] pt-24">
      <section className="bg-gradient-to-b from-[#068ec5]/5 to-white py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
              Galeri
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#1a1a2e]">
              Galeri Foto
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[#64748b]">
              Dokumentasi kegiatan dan momen-momen berharga di lingkungan SIT Baitul Halim.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  filter === s
                    ? "bg-[#068ec5] text-white shadow-sm"
                    : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#068ec5]/30 hover:text-[#068ec5]"
                )}
              >
                {s}
              </button>
            ))}
            {session && (
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="flex items-center gap-1.5 rounded-full bg-[#068ec5]/10 px-4 py-2 text-sm font-semibold text-[#068ec5] transition-colors hover:bg-[#068ec5]/20"
              >
                <Upload size={16} weight="bold" />
                Upload
              </button>
            )}
          </div>
        </div>
      </section>

      {showUpload && session && (
        <section className="border-b border-[#e2e8f0] bg-[#fafcfe] py-8">
          <div className="mx-auto max-w-[600px] px-6 lg:px-8">
            <h3 className="text-lg font-semibold text-[#1a1a2e]">Upload Foto Baru</h3>
            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Judul"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm"
              />
              <textarea
                placeholder="Caption (opsional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                className="block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm"
              />
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm"
              >
                {sections.filter((s) => s !== "Semua").map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-[#64748b] file:mr-4 file:rounded-xl file:border-0 file:bg-[#068ec5]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#068ec5]"
              />
              <button
                onClick={handleUpload}
                disabled={uploading || !file || !judul}
                className="w-full rounded-xl bg-[#068ec5] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0577a3] disabled:opacity-50"
              >
                {uploading ? "Mengupload..." : "Upload"}
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-[#e2e8f0]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ImageSquare size={48} className="text-[#94a3b8]" />
              <p className="mt-4 text-sm text-[#64748b]">Belum ada foto di sini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f1f5f9] border border-[#e2e8f0] transition-all hover:shadow-lg"
                >
                  <img
                    src={item.fotoUrl}
                    alt={item.judul}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm font-medium text-white text-left">{item.judul}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} weight="bold" />
          </button>
          {session && (
            <button
              onClick={() => handleDelete(lightbox.id)}
              disabled={deleting}
              className="absolute right-6 top-20 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-400 transition-colors hover:bg-red-500/40 disabled:opacity-50"
              title="Hapus foto"
            >
              <Trash size={20} weight="bold" />
            </button>
          )}
          <div
            className="max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.fotoUrl}
              alt={lightbox.judul}
              className="max-h-[70vh] w-full rounded-xl object-contain"
            />
            <div className="px-4 py-3">
              <h3 className="text-base font-semibold text-[#1a1a2e]">{lightbox.judul}</h3>
              {lightbox.caption && (
                <p className="mt-1 text-sm text-[#64748b]">{lightbox.caption}</p>
              )}
              <p className="mt-1 text-xs text-[#94a3b8]">{lightbox.section}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
