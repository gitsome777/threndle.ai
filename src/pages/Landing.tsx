import LogoAnim from "../components/LogoAnim";
import Cards from "../components/Cards";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 flex justify-center py-4 px-6 bg-stone border-b border-rule backdrop-blur-md bg-opacity-90">
        <div className="font-bold text-2xl tracking-tight flex items-baseline" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          <span className="text-[#433A36] -tracking-[0.5px]">threndle</span>
          <span className="text-[#B8562B] text-xl">.ai</span>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center">
        <header className="w-full pt-16 pb-12 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
          <LogoAnim />
          <h1 className="sr-only">Threndle AI — every business runs on loose threads, we tie them off.</h1>
          <p className="mt-8 text-lg leading-relaxed text-ink-soft max-w-2xl mx-auto">
            Cash flow nobody's watching. Leads going cold. A CRM nobody updates. We connect Claude to the tools you already use and put those loose ends on autopilot — starting with the one that's costing you the most.
          </p>
        </header>

        <section className="w-full bg-stone-raised py-20 px-6 border-y border-rule">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif font-medium text-3xl mb-4">The diagnostic comes first — always</h2>
            <p className="text-ink-soft text-base leading-relaxed mb-8 max-w-2xl mx-auto">
              We don't sell a package. We ask what's actually eating your week — money, sales, marketing, customer service, admin, hiring — and we build around what you tell us, not a menu.
            </p>
            <div className="bg-teal-soft border-l-4 border-teal p-6 text-left text-ink rounded-r-sm shadow-sm max-w-2xl mx-auto">
              <b className="text-teal font-semibold">Three minutes, straight answer.</b> Take the diagnostic and you'll get a clear recommendation on where to start — not a pitch, a plan.
            </div>
          </div>
        </section>

        <section className="w-full relative overflow-hidden">
          <div className="max-w-3xl mx-auto pt-24 px-6 text-center">
            <h2 className="font-serif font-medium text-3xl mb-2">The thread, start to finish</h2>
            <p className="text-ink-soft text-sm">Eleven stitches. Five get pulled by us — six get filled in by you.</p>
          </div>
          <Cards />
        </section>
      </main>

      <footer className="text-center py-12 px-6 font-mono text-xs text-ink-soft tracking-wider">
        THRENDLE AI · Fraser Valley, BC · hello@threndle.ai
      </footer>
    </div>
  );
}
