interface VisiMisiProps {
  visi?: string;
  misi?: string;
}

export default function VisiMisi({ visi, misi }: VisiMisiProps) {
  const defaultMisi = [
    "Menyelenggarakan pendidikan holistik berbasis nilai-nilai Al-Qur'an dan Sunnah.",
    "Mengembangkan potensi akademik dan non-akademik peserta didik secara optimal.",
    "Membiasakan akhlak mulia dan budaya Islami di lingkungan sekolah.",
    "Menerapkan manajemen sekolah yang profesional, transparan, dan akuntabel.",
  ];

  const misiList = misi ? misi.split("\n") : defaultMisi;

  return (
    <section className="py-24 bg-[#fafcfe] border-y border-[#e2e8f0]">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
              Visi
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl">
              Visi Sekolah
            </h2>
            <div className="mt-6 rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
              <p className="text-lg font-medium leading-relaxed text-[#1a1a2e]">
                &ldquo;{visi || "Menjadi Lembaga Pendidikan Islam Terpadu Unggulan yang Menghasilkan Generasi Rabbani, Cerdas, Berkarakter, dan Berdaya Saing Global."}&rdquo;
              </p>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
              Misi
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl">
              Misi Sekolah
            </h2>
            <ul className="mt-6 space-y-4">
              {misiList.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-4 rounded-xl border border-[#e2e8f0]/80 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#068ec5] text-sm font-bold text-white">
                    {idx + 1}
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-[#64748b]">
                    {item.replace(/^\d+\.\s*/, "")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
