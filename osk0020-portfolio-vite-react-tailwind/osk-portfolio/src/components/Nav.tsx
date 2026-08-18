export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-7">
        <a href="#top" className="flex items-center gap-2.5 font-mono text-[17px] font-bold">
          <span className="h-2.5 w-2.5 bg-green shadow-[0_0_10px_var(--color-green)]" />
          OSK<span className="text-text-faint">_0020</span>
        </a>

        <nav className="hidden gap-8 text-[14.5px] text-text-dim md:flex">
          <a href="#osn" className="transition-colors hover:text-text">
            OSN
          </a>
          <a href="#projects" className="transition-colors hover:text-text">
            Projects
          </a>
          <a href="#services" className="transition-colors hover:text-text">
            Services
          </a>
          <a href="#contact" className="transition-colors hover:text-text">
            Contact
          </a>
        </nav>

        <a
          href="https://osn-e-xtra.vercel.app/"
          target="_blank"
          rel="noopener"
          className="border border-red px-5 py-2.5 font-mono text-[13px] text-red transition-all hover:bg-red hover:text-[#0a0403] hover:shadow-[0_0_24px_rgba(255,75,62,0.45)]"
        >
          OSN EXTRA ↗
        </a>
      </div>
    </header>
  )
}
