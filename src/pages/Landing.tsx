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
          <h1 className="sr-only">threndle.ai. Every business runs on loose threads, we tie them off.</h1>
          <p className="mt-8 text-lg leading-relaxed text-ink-soft max-w-2xl mx-auto">
            Cash flow nobody's watching. Leads going cold. A CRM nobody updates. We connect Claude to the tools you already use and put those loose ends on autopilot, starting with the one that's costing you the most.
          </p>
        </header>

        <section className="w-full bg-stone-raised py-20 px-6 border-y border-rule">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif font-medium text-3xl mb-4">The diagnostic comes first, always</h2>
            <p className="text-ink-soft text-base leading-relaxed mb-8 max-w-2xl mx-auto">
              We don't sell a package. We ask what's actually eating your week: money, sales, marketing, customer service, admin, hiring. Then we build around what you tell us, not a menu.
            </p>
            <div className="bg-teal-soft border-l-4 border-teal p-6 text-left text-ink rounded-r-sm shadow-sm max-w-2xl mx-auto">
              <b className="text-teal font-semibold">Three minutes, straight answer.</b> Take the diagnostic and you'll get a clear recommendation on where to start. Not a pitch, a plan.
            </div>
          </div>
        </section>

        <section className="w-full relative overflow-hidden">
          <div className="max-w-3xl mx-auto pt-24 px-6 text-center">
            <h2 className="font-serif font-medium text-3xl mb-2">The thread, start to finish</h2>
            <p className="text-ink-soft text-sm">Eleven stitches. Five get pulled by us. Six get filled in by you.</p>
          </div>
          <Cards />
        </section>

        <section className="w-full bg-stone-raised py-20 px-6 border-y border-rule">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif font-medium text-3xl mb-4 text-center">AI implementation for small businesses in Fraser Valley</h2>
            <p className="text-ink-soft text-base leading-relaxed mb-8 text-center max-w-2xl mx-auto">
              You do not need to replace your software or hire a technical team. We connect Claude, an AI assistant made by Anthropic, to the tools you already pay for. Then we build small, reliable workflows around the bottlenecks that are actually eating your week.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-rule rounded-sm bg-stone">
                <h3 className="font-semibold text-lg mb-2">Claude AI automation for bookkeeping and cash flow</h3>
                <p className="text-ink-soft text-sm leading-relaxed">
                  Reconcile Stripe payouts to QuickBooks. Chase overdue invoices. Flag transactions that do not match. Get a clear view of cash flow without opening five different apps.
                </p>
              </div>
              <div className="p-6 border border-rule rounded-sm bg-stone">
                <h3 className="font-semibold text-lg mb-2">CRM automation that keeps leads warm</h3>
                <p className="text-ink-soft text-sm leading-relaxed">
                  Update lead records in HubSpot, Pipedrive, or Zoho Bigin. Draft follow-up emails based on where a prospect got stuck. Remind your team when a lead has gone quiet for too long.
                </p>
              </div>
              <div className="p-6 border border-rule rounded-sm bg-stone">
                <h3 className="font-semibold text-lg mb-2">AI workflow automation for admin and reporting</h3>
                <p className="text-ink-soft text-sm leading-relaxed">
                  Summarize meetings from your calendar. Build weekly reports from scattered spreadsheets. Keep Slack or Monday.com updated without manual copy and paste.
                </p>
              </div>
              <div className="p-6 border border-rule rounded-sm bg-stone">
                <h3 className="font-semibold text-lg mb-2">AI implementation without replacing your tools</h3>
                <p className="text-ink-soft text-sm leading-relaxed">
                  We do not move your data or make you switch platforms. Claude works inside your existing stack: QuickBooks, HubSpot, Slack, Google Workspace, Stripe, and dozens more.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif font-medium text-3xl mb-8 text-center">Claude Cowork in plain English</h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg mb-2">What are AI agents and what can they do?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  An AI agent is software that can take actions on its own. Instead of just answering a question, it can log into your tools, look up information, update records, send emails, and follow a process you define. It does not replace you. It handles the repetitive parts so you can focus on decisions and relationships.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What is MCP?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  MCP stands for Model Context Protocol. It is a standard way for AI like Claude to connect securely to your business tools. Think of it as a universal adapter that lets Claude read from and write to the software you already use, without needing custom code for every integration.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What is an API?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  An API is how two pieces of software talk to each other. When Claude connects to your QuickBooks or HubSpot, it uses the API provided by that tool. You control what the API is allowed to access, and you can turn it off at any time.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What is a connector?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  A connector is the bridge between Claude and one of your tools. We build connectors so Claude can pull the right data, update the right fields, and trigger the right actions in each app. You do not need to learn how it works. We set it up and maintain it.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What is a skill?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  A skill is a specific job an agent knows how to do. One skill might be reconcile yesterday's Stripe payouts against QuickBooks. Another might be draft a follow-up email to leads who have not been contacted in seven days. Each skill uses your tools and follows your rules.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What does Claude Cowork mean for my business and my time?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  It means the work that eats your week can start happening automatically. Not in a flashy way. In a practical way. Invoices get matched. Leads get followed up. CRM records stay current. You still make the decisions, but the repetitive motion is handled. Most clients start with one workflow and expand once they see the time come back.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-stone-raised py-20 px-6 border-y border-rule">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif font-medium text-3xl mb-8 text-center">Claude Cowork FAQ</h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg mb-2">What is Claude Cowork for small business?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  Claude Cowork is threndle.ai's approach to embedding Claude into a small business's daily operations. Instead of replacing staff or switching software, we connect Claude to the tools the business already uses, including QuickBooks, HubSpot, Slack, Google Workspace, and others, so it can handle repetitive tasks, surface insights, and keep workflows moving.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What does Claude Cowork actually mean?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  It means Claude works alongside your team as a digital assistant with access to your real business data. It can reconcile transactions, draft follow-up emails, update CRM records, summarize meetings, and chase overdue invoices, always under your control and always starting from the bottlenecks you choose.
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
                  You need the cloud tools you already use, a clear bottleneck you want fixed first, and about an hour for a kickoff call. Most businesses start with one workflow, like invoice reconciliation or lead follow-up, and expand from there. We do the technical setup and train your team.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Which tools can Claude Cowork connect to?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  Accounting tools such as QuickBooks, Xero, Wave, Sage, and Zoho Books. Payments such as Stripe, PayPal, Square, and QuickBooks Payments. Payroll platforms. CRMs such as HubSpot, Salesforce, Zoho Bigin, and Pipedrive. Email and file systems such as Google Workspace, Microsoft 365, Dropbox, and OneDrive. Team and ops tools such as Slack, Monday.com, Asana, ClickUp, and Notion. Plus booking, e-commerce, and advertising platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif font-medium text-3xl mb-8 text-center">Frequently asked questions</h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg mb-2">What does threndle.ai do?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  threndle.ai is an independent AI implementation consultancy for small businesses. We connect Claude to the tools you already use, including accounting, CRM, payments, email, files, and team ops, and put your biggest operational bottleneck on autopilot.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Who is threndle.ai for?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  Small business owners and operators in the Fraser Valley and surrounding areas who are losing hours to manual follow-up, stale data, or software that does not talk to each other. We work with businesses that already use tools like QuickBooks, HubSpot, Slack, Google Workspace, Stripe, and Monday.com.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What happens during the threndle.ai diagnostic?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  We ask what is actually eating your week across money, sales, marketing, customer service, admin, and hiring. In about three minutes you get a straight recommendation on which bottleneck to fix first, not a packaged sales pitch.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Which tools can threndle.ai connect to Claude?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  We connect accounting tools such as QuickBooks, Xero, Wave, Sage, and Zoho Books. CRMs such as HubSpot, Salesforce, Zoho Bigin, and Pipedrive. Payments such as Stripe, PayPal, Square, and QuickBooks Payments. Payroll platforms. Email and file systems such as Google Workspace, Microsoft 365, Dropbox, and OneDrive. And team tools such as Slack, Monday.com, Asana, ClickUp, and Notion.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">How much does an AI implementation project cost?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  Most engagements start with Foundation, a fixed-price scope for one bottleneck, typically between $3,000 and $3,500. Multi-workflow builds range from $6,000 to $9,000. Ongoing Partner retainers run from $750 to $1,500 per month.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Where is threndle.ai based?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  threndle.ai is based in the Fraser Valley, British Columbia, Canada. We work with local small businesses and can also support remote engagements across Canada.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">How do I get started with threndle.ai?</h3>
                <p className="text-ink-soft text-base leading-relaxed">
                  Start with the diagnostic questionnaire on our website, or email <a href="mailto:hello@threndle.ai" className="underline hover:text-teal">hello@threndle.ai</a>. We confirm the scope on a short call before anything is signed, then connect your tools and deliver the first workflow against real data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-12 px-6 font-mono text-xs text-ink-soft tracking-wider">
        threndle.ai · Fraser Valley, BC · hello@threndle.ai ·{" "}
        <a href="https://www.linkedin.com/company/threndle-ai/" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal">LinkedIn</a>
      </footer>
    </div>
  );
}
