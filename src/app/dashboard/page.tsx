"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SignOut,
  PencilSimple,
  TrashSimple,
  Plus,
  Eye,
  Check,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";

interface Session {
  userId: number;
  nimNip: string;
  role: string;
  unitSekolah: string;
  namaLengkap: string;
  fotoProfilUrl: string | null;
}

interface MasterDataItem {
  id: number;
  namaLengkap: string;
  nimNip: string;
  role: string;
  unitSekolah: string;
  status: string;
  hasAccount: boolean;
  lastLogin: string | null;
  createdAt: string;
}

interface BeritaItem {
  id: number;
  headline: string;
  content: string;
  status: string;
  author: { namaLengkap: string } | null;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const tabParam = searchParams.get("tab");
  const [tab, setTab] = useState(tabParam || "dashboard");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) router.push("/login");
        else setSession(data);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#068ec5] border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  const adminTabs = [
    { key: "dashboard", label: "Dashboard", roles: ["admin", "guru", "murid"] },
    { key: "data-master", label: "Data Master", roles: ["admin"] },
    { key: "struktur", label: "Struktur Organisasi", roles: ["admin", "guru"] },
    { key: "web-content", label: "Konten Web", roles: ["admin", "guru"] },
    { key: "berita", label: "Berita", roles: ["admin", "guru", "murid"] },
    { key: "moderasi", label: "Moderasi", roles: ["admin", "guru"] },
    { key: "profil", label: "Edit Foto Profil", roles: ["admin", "guru", "murid"] },
  ];

  const visibleTabs = adminTabs.filter((t) => t.roles.includes(session.role));

  return (
    <div className="min-h-[100dvh] bg-[#fafcfe] pt-24">
      <div className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center shadow-sm">
              {session.fotoProfilUrl ? (
                <img
                  src={session.fotoProfilUrl}
                  alt={session.namaLengkap}
                  className="mx-auto h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#068ec5] text-2xl font-bold text-white">
                  {getInitials(session.namaLengkap)}
                </div>
              )}
              <h2 className="mt-4 text-base font-semibold text-[#1a1a2e]">
                {session.namaLengkap}
              </h2>
              <p className="text-xs font-medium uppercase tracking-wider text-[#068ec5]">
                {session.role} &mdash; {session.unitSekolah}
              </p>
            </div>

            <nav className="rounded-2xl border border-[#e2e8f0] bg-white p-2 shadow-sm">
              {visibleTabs.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={cn(
                    "flex w-full items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                    tab === item.key
                      ? "bg-[#068ec5] text-white"
                      : "text-[#64748b] hover:bg-[#068ec5]/5 hover:text-[#068ec5]"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/";
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <SignOut size={16} />
              Logout
            </button>
          </aside>

          <div className="space-y-6">
            {tab === "dashboard" && <DashboardOverview session={session} />}
            {tab === "data-master" && session.role === "admin" && <DataMasterPanel />}
            {tab === "struktur" && (session.role === "admin" || session.role === "guru") && <StrukturOrganisasiPanel />}
            {tab === "web-content" && (session.role === "admin" || session.role === "guru") && <WebContentPanel />}
            {tab === "berita" && <BeritaPanel session={session} />}
            {tab === "moderasi" && (session.role === "admin" || session.role === "guru") && <ModerasiPanel />}
            {tab === "profil" && <ProfilPanel session={session} file={file} setFile={setFile} uploading={uploading} setUploading={setUploading} uploadMsg={uploadMsg} setUploadMsg={setUploadMsg} setSession={setSession} getInitials={getInitials} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardOverview({ session }: { session: Session }) {
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight text-[#1a1a2e]">
        Selamat Datang, {session.namaLengkap.split(" ")[0]}!
      </h1>
      <p className="mt-2 text-sm text-[#64748b]">
        Anda masuk sebagai{" "}
        <span className="font-semibold text-[#068ec5]">{session.role}</span>{" "}
        di unit <span className="font-semibold">{session.unitSekolah}</span>.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#e2e8f0] bg-[#fafcfe] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Role</p>
          <p className="mt-1 text-lg font-bold text-[#1a1a2e] capitalize">{session.role}</p>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-[#fafcfe] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">Unit</p>
          <p className="mt-1 text-lg font-bold text-[#1a1a2e]">{session.unitSekolah}</p>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-[#fafcfe] p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748b]">NIM/NIP</p>
          <p className="mt-1 text-lg font-bold text-[#1a1a2e]">{session.nimNip}</p>
        </div>
      </div>

      {session.role === "murid" && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Setiap berita yang Anda buat akan masuk ke moderasi dan perlu disetujui oleh Guru atau Admin sebelum dipublikasikan.
          </p>
        </div>
      )}

      {session.role === "guru" && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-800">
            Anda dapat membuat berita (langsung terbit), mengelola konten web, dan memoderasi berita dari murid.
          </p>
        </div>
      )}

      {session.role === "admin" && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            Anda memiliki akses penuh. Kelola data master untuk aktivasi guru/murid, konten web, galeri, berita, dan moderasi.
          </p>
        </div>
      )}
    </div>
  );
}

function DataMasterPanel() {
  const [items, setItems] = useState<MasterDataItem[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ nimNip: "", role: "guru", unitSekolah: "TKIT" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/master-data");
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!form.nimNip) {
      setError("NIM/NIP harus diisi.");
      return;
    }

    const url = editId ? `/api/master-data/${editId}` : "/api/master-data";
    const method = editId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menyimpan.");
      return;
    }

    setSuccess(editId ? "Data berhasil diperbarui." : "Data berhasil ditambahkan.");
    setShowForm(false);
    setEditId(null);
    setForm({ nimNip: "", role: "guru", unitSekolah: "TKIT" });
    load();
  };

  const handleEdit = (item: MasterDataItem) => {
    setForm({ nimNip: item.nimNip, role: item.role, unitSekolah: item.unitSekolah });
    setEditId(item.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data ini?")) return;
    const res = await fetch(`/api/master-data/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSuccess("Data berhasil dihapus.");
      load();
    }
  };

  const openAdd = () => {
    setForm({ nimNip: "", role: "guru", unitSekolah: "TKIT" });
    setEditId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1a1a2e]">Data Master</h2>
          <p className="mt-1 text-sm text-[#64748b]">
            Kelola data eligibility untuk aktivasi akun Guru & Murid.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-xl bg-[#068ec5] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0577a3]"
        >
          <Plus size={16} weight="bold" />
          Tambah Data
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      {success && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">{success}</div>
      )}

      {showForm && (
        <div className="mt-6 rounded-xl border border-[#e2e8f0] bg-[#fafcfe] p-6">
          <h3 className="text-base font-semibold text-[#1a1a2e]">
            {editId ? "Edit Data" : "Tambah Data Baru"}
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">NIM/NIP</label>
              <input
                type="text"
                value={form.nimNip}
                onChange={(e) => setForm({ ...form, nimNip: e.target.value })}
                placeholder="NIM atau NIP"
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
              >
                <option value="guru">Guru</option>
                <option value="murid">Murid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">Unit</label>
              <select
                value={form.unitSekolah}
                onChange={(e) => setForm({ ...form, unitSekolah: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
              >
                {["TKIT", "SDIT", "SMPIT"].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="rounded-xl bg-[#068ec5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0577a3]"
            >
              {editId ? "Simpan" : "Tambah"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); }}
              className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-sm font-medium text-[#64748b] hover:bg-[#f1f5f9]"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto">
        {items === null ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-[#f1f5f9]" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#64748b]">
            Belum ada data master. Tambahkan data untuk Guru atau Murid.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] text-left text-xs font-medium uppercase tracking-wider text-[#64748b]">
                <th className="pb-3 pr-4">NIM/NIP</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Unit</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[#e2e8f0] text-[#1a1a2e]">
                  <td className="py-3 pr-4 font-medium">{item.nimNip}</td>
                  <td className="py-3 pr-4 capitalize">{item.role}</td>
                  <td className="py-3 pr-4">{item.unitSekolah}</td>
                  <td className="py-3 pr-4">
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                      item.status === "Aktif"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {item.hasAccount ? (
                      <span className="text-emerald-600 text-xs">Aktif</span>
                    ) : (
                      <span className="text-[#94a3b8] text-xs">-</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-lg p-1.5 text-[#64748b] transition-colors hover:bg-[#068ec5]/5 hover:text-[#068ec5]"
                      >
                        <PencilSimple size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg p-1.5 text-[#64748b] transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <TrashSimple size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function WebContentPanel() {
  const [contents, setContents] = useState<Record<string, string>>({});
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const contentMeta: Record<string, string> = {
    welcome_headline: "Headline Hero",
    welcome_text: "Teks Sambutan",
    visi: "Visi Sekolah",
    misi: "Misi Sekolah",
    tkit_sambutan: "Sambutan TKIT",
    sdit_sambutan: "Sambutan SDIT",
    smpit_sambutan: "Sambutan SMPIT",
  };

  useEffect(() => {
    fetch("/api/web-content")
      .then((r) => r.json())
      .then((data) => setContents(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key: string) => {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/web-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: editValue }),
    });
    if (res.ok) {
      setContents((prev) => ({ ...prev, [key]: editValue }));
      setEditKey(null);
      setMsg("Konten berhasil diperbarui.");
    } else {
      setMsg("Gagal menyimpan.");
    }
    setSaving(false);
  };

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-[#1a1a2e]">Konten Web</h2>
      <p className="mt-1 text-sm text-[#64748b]">Kelola teks konten halaman website.</p>

      {msg && (
        <div className={cn(
          "mt-4 rounded-xl border px-4 py-3 text-sm",
          msg.includes("berhasil") ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-red-200 bg-red-50 text-red-600"
        )}>{msg}</div>
      )}

      {loading ? (
        <div className="mt-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-[#f1f5f9]" />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {Object.entries(contentMeta).map(([key, label]) => (
            <div key={key} className="rounded-xl border border-[#e2e8f0] bg-[#fafcfe] p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">{label}</p>
                  {editKey === key ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={4}
                        className="block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave(key)}
                          disabled={saving}
                          className="rounded-xl bg-[#068ec5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0577a3] disabled:opacity-50"
                        >
                          {saving ? "..." : "Simpan"}
                        </button>
                        <button
                          onClick={() => setEditKey(null)}
                          className="rounded-xl border border-[#e2e8f0] px-4 py-2 text-xs font-medium text-[#64748b]"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-[#1a1a2e]">
                      {contents[key] || <span className="italic text-[#94a3b8]">Kosong</span>}
                    </p>
                  )}
                </div>
                {editKey !== key && (
                  <button
                    onClick={() => { setEditKey(key); setEditValue(contents[key] || ""); setMsg(""); }}
                    className="ml-4 rounded-lg p-1.5 text-[#64748b] transition-colors hover:bg-[#068ec5]/5 hover:text-[#068ec5]"
                  >
                    <PencilSimple size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BeritaPanel({ session }: { session: Session }) {
  const [items, setItems] = useState<BeritaItem[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const url = session.role === "murid"
      ? `/api/berita?page=${page}&limit=${perPage}&author=${session.userId}`
      : `/api/berita?page=${page}&limit=${perPage}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
      });
  }, [page, session]);

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1a1a2e]">Berita</h2>
          <p className="mt-1 text-sm text-[#64748b]">
            {session.role === "murid"
              ? "Berita yang telah Anda buat."
              : "Daftar berita yang telah dipublikasikan."}
          </p>
        </div>
        <Link
          href="/berita/buat"
          className="flex items-center gap-1.5 rounded-xl bg-[#068ec5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0577a3]"
        >
          <Plus size={16} weight="bold" />
          Buat Postingan
        </Link>
      </div>

      {items === null ? (
        <div className="mt-6 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-[#f1f5f9]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-sm text-[#64748b]">
          Belum ada berita.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#fafcfe] p-4">
              <div className="min-w-0 flex-1">
                <Link href={`/berita/${item.id}`} className="text-sm font-semibold text-[#1a1a2e] hover:text-[#068ec5] truncate block">
                  {item.headline}
                </Link>
                <p className="mt-0.5 text-xs text-[#94a3b8]">
                  {item.author?.namaLengkap || "Tanpa author"}
                </p>
              </div>
              <span className={cn(
                "ml-4 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                item.status === "Published"
                  ? "bg-emerald-100 text-emerald-700"
                  : item.status === "Pending Review"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              )}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                p === page
                  ? "bg-[#068ec5] text-white"
                  : "border border-[#e2e8f0] text-[#64748b] hover:border-[#068ec5]/30 hover:text-[#068ec5]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ModerasiPanel() {
  const [items, setItems] = useState<BeritaItem[] | null>(null);
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/berita/moderasi");
    if (res.ok) setItems(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (id: number, status: string) => {
    const res = await fetch(`/api/berita/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setMsg(`Berita ${status === "Published" ? "disetujui" : "ditolak"}.`);
      load();
    }
  };

  const handlePreview = async (id: number) => {
    const res = await fetch(`/api/berita/${id}`);
    if (res.ok) {
      const data = await res.json();
      setPreviewId(id);
      setPreviewContent(data.content);
    }
  };

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-[#1a1a2e]">Moderasi Berita</h2>
      <p className="mt-1 text-sm text-[#64748b]">
        Tinjau berita dari murid yang menunggu persetujuan.
      </p>

      {msg && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">{msg}</div>
      )}

      {items === null ? (
        <div className="mt-6 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-[#f1f5f9]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-sm text-[#64748b]">
          Tidak ada berita yang perlu dimoderasi.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#e2e8f0] bg-[#fafcfe] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">{item.headline}</p>
                  <p className="mt-0.5 text-xs text-[#94a3b8]">
                    Oleh: {item.author?.namaLengkap}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePreview(item.id)}
                    className="rounded-lg p-1.5 text-[#64748b] transition-colors hover:bg-[#068ec5]/5 hover:text-[#068ec5]"
                    title="Preview"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleAction(item.id, "Published")}
                    className="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50"
                    title="Setujui"
                  >
                    <Check size={15} weight="bold" />
                  </button>
                  <button
                    onClick={() => handleAction(item.id, "Rejected")}
                    className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                    title="Tolak"
                  >
                    <X size={15} weight="bold" />
                  </button>
                </div>
              </div>
              {previewId === item.id && (
                <div className="mt-3 rounded-xl border border-[#e2e8f0] bg-white p-4">
                  <div
                    className="prose prose-sm max-w-none text-[#64748b]"
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StrukturOrganisasiPanel() {
  const [items, setItems] = useState<any[] | null>(null);
  const [filterUnit, setFilterUnit] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ nama: "", jabatan: "", deskripsi: "", unitId: "TKIT" });
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    const url = filterUnit ? `/api/tenaga-pendidik?unit=${filterUnit}` : "/api/tenaga-pendidik";
    const res = await fetch(url);
    if (res.ok) setItems(await res.json());
  }, [filterUnit]);

  useEffect(() => { load(); }, [load]);

  const handleFotoUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("foto", file);
    const res = await fetch("/api/upload/tenaga-pendidik", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal upload");
    return data.url;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!form.nama || !form.jabatan || !form.unitId) {
      setError("Nama, jabatan, dan unit harus diisi.");
      return;
    }

    let uploadUrl = fotoUrl;
    if (fotoFile) {
      try { uploadUrl = await handleFotoUpload(fotoFile); }
      catch (e: any) { setError(e.message); return; }
    }

    const url = editId ? `/api/tenaga-pendidik/${editId}` : "/api/tenaga-pendidik";
    const method = editId ? "PATCH" : "POST";
    const body = { ...form, fotoUrl: uploadUrl };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menyimpan.");
      return;
    }

    setSuccess(editId ? "Data berhasil diperbarui." : "Data berhasil ditambahkan.");
    resetForm();
    load();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ nama: "", jabatan: "", deskripsi: "", unitId: "TKIT" });
    setFotoFile(null);
    setFotoUrl("");
  };

  const handleEdit = (item: any) => {
    setForm({ nama: item.nama, jabatan: item.jabatan, deskripsi: item.deskripsi || "", unitId: item.unitId });
    setFotoUrl(item.fotoUrl || "");
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data ini?")) return;
    const res = await fetch(`/api/tenaga-pendidik/${id}`, { method: "DELETE" });
    if (res.ok) { setSuccess("Data berhasil dihapus."); load(); }
  };

  const units = ["TKIT", "SDIT", "SMPIT"];

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1a1a2e]">Struktur Organisasi</h2>
          <p className="mt-1 text-sm text-[#64748b]">Kelola tenaga pendidik dan struktur organisasi semua unit.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1.5 rounded-xl bg-[#068ec5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0577a3]"
        >
          <Plus size={16} weight="bold" />
          Tambah
        </button>
      </div>

      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      {success && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">{success}</div>}

      {/* Filter Unit */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs font-medium text-[#64748b]">Filter:</span>
        {[{ label: "Semua", value: "" }, ...units.map((u) => ({ label: u, value: u }))].map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setFilterUnit(opt.value); setItems(null); }}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              filterUnit === opt.value
                ? "bg-[#068ec5] text-white"
                : "border border-[#e2e8f0] text-[#64748b] hover:border-[#068ec5]/30 hover:text-[#068ec5]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="mt-6 rounded-xl border border-[#e2e8f0] bg-[#fafcfe] p-6">
          <h3 className="text-base font-semibold text-[#1a1a2e]">{editId ? "Edit" : "Tambah"} Tenaga Pendidik</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">Nama</label>
              <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">Jabatan</label>
              <input type="text" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e]">Unit</label>
              <select value={form.unitId} onChange={(e) => setForm({ ...form, unitId: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20">
                {units.map((u) => (<option key={u} value={u}>{u}</option>))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1a1a2e]">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              className="mt-1.5 block w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm focus:border-[#068ec5] focus:outline-none focus:ring-2 focus:ring-[#068ec5]/20" rows={2} />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1a1a2e]">Foto</label>
            <div className="mt-1.5 flex items-center gap-4">
              {(fotoUrl || fotoFile) && (
                <img src={fotoFile ? URL.createObjectURL(fotoFile) : fotoUrl} alt="Preview"
                  className="h-16 w-16 rounded-full object-cover border border-[#e2e8f0]" />
              )}
              <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-[#64748b] file:mr-4 file:rounded-xl file:border-0 file:bg-[#068ec5]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#068ec5]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={handleSubmit} className="rounded-xl bg-[#068ec5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0577a3]">Simpan</button>
            <button onClick={resetForm} className="rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-sm font-medium text-[#64748b]">Batal</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        {items === null ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => (<div key={i} className="h-12 animate-pulse rounded-xl bg-[#f1f5f9]" />))}</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#64748b]">Belum ada data tenaga pendidik.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] text-left text-xs font-medium uppercase tracking-wider text-[#64748b]">
                <th className="pb-3 pr-4">Foto</th>
                <th className="pb-3 pr-4">Nama</th>
                <th className="pb-3 pr-4">Jabatan</th>
                <th className="pb-3 pr-4">Unit</th>
                <th className="pb-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id} className="border-b border-[#e2e8f0] text-[#1a1a2e]">
                  <td className="py-3 pr-4">
                    {item.fotoUrl ? (
                      <img src={item.fotoUrl} alt={item.nama} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#068ec5]/10 text-xs font-bold text-[#068ec5]">{item.nama.charAt(0)}</div>
                    )}
                  </td>
                  <td className="py-3 pr-4 font-medium">{item.nama}</td>
                  <td className="py-3 pr-4 text-[#64748b]">{item.jabatan}</td>
                  <td className="py-3 pr-4">{item.unitId}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(item)} className="rounded-lg p-1.5 text-[#64748b] hover:bg-[#068ec5]/5 hover:text-[#068ec5]"><PencilSimple size={15} /></button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-lg p-1.5 text-[#64748b] hover:bg-red-50 hover:text-red-500"><TrashSimple size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function ProfilPanel({
  session, file, setFile, uploading, setUploading, uploadMsg, setUploadMsg, setSession, getInitials
}: {
  session: Session;
  file: File | null;
  setFile: (f: File | null) => void;
  uploading: boolean;
  setUploading: (b: boolean) => void;
  uploadMsg: string;
  setUploadMsg: (s: string) => void;
  setSession: (s: Session | ((prev: Session | null) => Session | null)) => void;
  getInitials: (name: string) => string;
}) {
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadMsg("");

    const formData = new FormData();
    formData.append("foto", file);

    try {
      const res = await fetch("/api/upload/foto-profil", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadMsg("Foto profil berhasil diperbarui!");
        setSession((prev) =>
          prev ? { ...prev, fotoProfilUrl: data.url } : prev
        );
      } else {
        setUploadMsg(data.error || "Gagal upload.");
      }
    } catch {
      setUploadMsg("Terjadi kesalahan.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-[#1a1a2e]">Edit Foto Profil</h2>
      <p className="mt-1 text-sm text-[#64748b]">Unggah foto profil baru (Format: JPG/PNG, Maks: 2MB).</p>

      <div className="mt-6 flex items-center gap-6">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#e2e8f0]">
          {session.fotoProfilUrl ? (
            <img
              src={session.fotoProfilUrl}
              alt="Foto Profil"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#068ec5] text-2xl font-bold text-white">
              {getInitials(session.namaLengkap)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-[#64748b] file:mr-4 file:rounded-xl file:border-0 file:bg-[#068ec5]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#068ec5] hover:file:bg-[#068ec5]/20"
          />
          {uploadMsg && (
            <p className={cn("mt-2 text-xs", uploadMsg.includes("berhasil") ? "text-emerald-600" : "text-red-500")}>
              {uploadMsg}
            </p>
          )}
        </div>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="shrink-0 rounded-xl bg-[#068ec5] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0577a3] active:scale-[0.98] disabled:opacity-50"
        >
          {uploading ? "..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
