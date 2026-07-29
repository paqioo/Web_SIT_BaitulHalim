export default async function Page() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <h1 className="text-lg font-semibold text-[#1a1a2e]">Instagram Feed</h1>
          <p className="mt-2 text-sm text-[#64748b]">
            Ikuti kami di{" "}
            <a
              href="https://instagram.com/sit_baitulhalim"
              target="_blank"
              className="font-semibold text-[#068ec5]"
            >
              @sit_baitulhalim
            </a>
          </p>
          <p className="mt-4 text-xs text-[#94a3b8]">
            (Feed Instagram akan terintegrasi dengan API Meta Graph)
          </p>
        </div>
      </div>
    </div>
  );
}
