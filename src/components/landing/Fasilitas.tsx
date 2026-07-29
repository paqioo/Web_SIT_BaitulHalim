interface FasilitasItem {
  id: number;
  judul: string;
  deskripsi: string;
}

interface FasilitasProps {
  items?: FasilitasItem[];
}

export default function Fasilitas({ items = [] }: FasilitasProps) {
  const defaultItems = [
    { id: 1, judul: "Ruang Kelas Full AC (Proyektor & Smartboard)", deskripsi: "Suasana belajar interaktif yang nyaman dengan teknologi modern di setiap kelas." },
    { id: 2, judul: "Laboratorium Komputer", deskripsi: "Unit PC modern yang mendukung digital learning dan keterampilan IT." },
    { id: 3, judul: "Perpustakaan Referensi Digital", deskripsi: "Koleksi buku cetak dan e-book yang lengkap untuk referensi pembelajaran." },
    { id: 4, judul: "Lapangan dan Sarana Olahraga", deskripsi: "Fasilitas lengkap untuk futsal, basket, bulutangkis, dan panahan." },
  ];

  const list = items.length > 0 ? items : defaultItems;
  const mid = Math.ceil(list.length / 2);
  const left = list.slice(0, mid);
  const right = list.slice(mid);

  return (
    <section className="py-24 bg-[#fafcfe]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
            Fasilitas
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl">
            Sarana & Prasarana
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[left, right].map((col, colIdx) => (
            <div key={colIdx} className="space-y-6">
              {col.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-6 transition-all duration-300 hover:border-[#068ec5]/20 hover:shadow-md"
                >
                  <h3 className="text-base font-semibold text-[#1a1a2e]">{item.judul}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{item.deskripsi}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
