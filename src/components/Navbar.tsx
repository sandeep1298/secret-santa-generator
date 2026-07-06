export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/50 bg-white/70 backdrop-blur-xl">
      <nav className="section-shell flex h-16 items-center justify-between">
        <a href="#top" className="text-base font-black tracking-tight text-cranberry-700">
          Secret Santa Generator
        </a>
        <a
          href="#generator"
          className="rounded-lg bg-evergreen-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-evergreen-800"
        >
          Start Assignment
        </a>
      </nav>
    </header>
  );
}
