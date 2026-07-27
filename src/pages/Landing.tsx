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

        <section className="w-full bg-stone-raised py-20 px-6 border-y border-rule">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif font-medium text-3xl mb-8 text-center">Questions about Claude Cowork</h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg mb-2">What is Claude Cowork for small business?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  Claude Cowork is Threndle AI's approach to embedding Claude into a small business's daily operations. Instead of replacing staff or switching software, we connect Claude to the tools you already use — QuickBooks, HubSpot, Slack, Google Workspace, and others — so it can handle repetitive tasks, surface insights, and keep workflows moving.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What does Claude Cowork actually mean?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  It means Claude works alongside your team as a digital assistant with access to your real business data. It can reconcile transactions, draft follow-up emails, update CRM records, summarize meetings, and chase overdue invoices — always under your control and always starting from the bottlenecks you choose.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Is Claude Cowork secure?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  Yes. We do not store your credentials or raw business data on our servers. Claude connects through official APIs and OAuth where available, using read-and-write permissions you approve. You keep ownership of your data, and any automation can be paused or revoked at any time. We also review each integration before it goes live.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What do I need to get started with Claude Cowork?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  You need the cloud tools you already use, a clear bottleneck you want fixed first, and about an hour for a kickoff call. Most businesses start with one workflow — like invoice reconciliation or lead follow-up — and expand from there. We do the technical setup and train your team.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Which tools can Claude Cowork connect to?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  Accounting tools such as QuickBooks, Xero, Wave, Sage, and Zoho Books; payments such as Stripe, PayPal, Square, and QuickBooks Payments; payroll platforms; CRMs such as HubSpot, Salesforce, Zoho Bigin, and Pipedrive; email and file systems such as Google Workspace, Microsoft 365, Dropbox, and OneDrive; team and ops tools such as Slack, Monday.com, Asana, ClickUp, and Notion; plus booking, e-commerce, and advertising platforms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-12 px-6 font-mono text-xs text-ink-soft tracking-wider">
        THRENDLE AI · Fraser Valley, BC · hello@threndle.ai
      </footer>
    </div>
  );
}
