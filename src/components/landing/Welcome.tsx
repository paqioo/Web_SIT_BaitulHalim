import { BookOpen, GraduationCap, Users } from "@phosphor-icons/react/dist/ssr";

interface WelcomeProps {
  headline?: string;
  text?: string;
}

export default function Welcome({ headline, text }: WelcomeProps) {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#068ec5]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#068ec5]">
              Sambutan
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1a1a2e] sm:text-4xl">
              {headline || "Membentuk Generasi Rabbani"}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#64748b]">
              {text ||
                "Sekolah Islam Terpadu Baitul Halim hadir untuk menanamkan dasar-dasar keimanan yang kokoh, ilmu pengetahuan yang luas, serta budi pekerti luhur bagi putra-putri Anda. Kami mengupayakan perpaduan harmonis antara kurikulum nasional dan nilai-nilai Islami."}
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#068ec5]/10 text-[#068ec5]">
                  <GraduationCap size={20} weight="fill" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1a1a2e]">Pendidikan Unggul</h4>
                  <p className="mt-1 text-xs text-[#64748b]">Kurikulum berkualitas global dengan dasar spiritual Islam.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#068ec5]/10 text-[#068ec5]">
                  <Users size={20} weight="fill" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1a1a2e]">Pengajar Profesional</h4>
                  <p className="mt-1 text-xs text-[#64748b]">Tenaga pendidik berkompeten dan berdedikasi tinggi.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-2xl bg-[#068ec5]/5 border border-[#e2e8f0] overflow-hidden flex items-center justify-center text-[#068ec5] text-5xl">
              <BookOpen size={64} weight="light" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
