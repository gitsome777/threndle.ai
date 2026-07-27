import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import Gnome from "../components/Gnome";

/**
 * Zoho Bigin web-to-record.
 *
 * These tokens are regenerated every time the webform is rebuilt in Bigin.
 * If submissions stop creating records, re-copy them from the form's embed code.
 * Field ids (POTENTIALCF*) come from the same embed and must match exactly —
 * Zoho silently discards a value posted under an unknown field name.
 */
const BIGIN = {
  // Verified endpoint, taken from a working submission.
  action: "https://bigin.zohocloud.ca/crm/WebForm",
  formId: "BiginWebToRecordForm50945000000240613",
  frameId: "hidden50945000000240613Frame",
  xnQsjsdp: "673874001928b2cedf425fbbc58c0b2dfb4796ef717d5b250a7b7c0ff2547d5b",
  xmIwtLD: "4a58a6441cea1a8215c2a4aac2618aba5ef5abf11e20c0c2c39100f1f313e627db555c0e5ba949f7be7db9e3f385bfdd",
  script:
    "https://bigin.zohocloud.ca/crm/WebformScriptServlet?rid=4a58a6441cea1a8215c2a4aac2618aba5ef5abf11e20c0c2c39100f1f313e627db555c0e5ba949f7be7db9e3f385bfddgid673874001928b2cedf425fbbc58c0b2dfb4796ef717d5b250a7b7c0ff2547d5b",
};

/** Each group maps to one Bigin multi-select field. Values must match Bigin exactly. */
const CONNECTORS: { cf: string; label: string; options: string[] }[] = [
  { cf: "POTENTIALCF13", label: "Accounting", options: ["QuickBooks", "Xero", "Wave", "Sage", "Zoho Books", "Other"] },
  { cf: "POTENTIALCF14", label: "Payments", options: ["QuickBooks Payments", "Stripe", "PayPal", "Square", "Other"] },
  { cf: "POTENTIALCF15", label: "Payroll", options: ["QuickBooks Payroll", "Wagepoint", "Payworks", "Ceridian Powerpay", "Humi", "ADP Canada", "Other"] },
  { cf: "POTENTIALCF16", label: "CRM", options: ["HubSpot", "Salesforce", "Zoho Bigin", "Pipedrive", "Other"] },
  { cf: "POTENTIALCF17", label: "Email & files", options: ["Google Workspace (Gmail, Calendar, Drive)", "Microsoft 365 / Outlook", "Dropbox", "OneDrive"] },
  { cf: "POTENTIALCF18", label: "Team & ops", options: ["Slack", "Monday.com", "Asana", "ClickUp", "Notion", "Other"] },
  { cf: "POTENTIALCF19", label: "Booking", options: ["Calendly", "Acuity Scheduling", "Square Appointments", "Other"] },
  { cf: "POTENTIALCF20", label: "E-commerce", options: ["Shopify", "WooCommerce", "Squarespace", "Other"] },
  { cf: "POTENTIALCF21", label: "Design & docs", options: ["Canva", "DocuSign", "Other"] },
  { cf: "POTENTIALCF22", label: "Advertising", options: ["Google Ads", "Meta Ads (Facebook / Instagram)", "LinkedIn Ads", "TikTok Ads", "Microsoft Advertising", "Amazon Ads", "Pinterest Ads", "Snapchat Ads", "Reddit Ads", "X (Twitter) Ads", "Apple Search Ads"] },
];

const TEAM_SIZE: Record<string, string> = { solo: "Just me", small: "2-9 employees", mid: "10-25 employees", large: "25+" };
const BOTTLENECK: Record<string, string> = {
  cashflow: "Cash flow & bookkeeping", sales: "Sales & leads", marketing: "Marketing & content",
  service: "Customer service", ops: "Admin & reporting", hiring: "Hiring & payroll",
};
const HOURS: Record<string, string> = { low: "Under 5 hrs/week", mid: "5-15 hrs/week", high: "15+ hrs/week" };
const TIMELINE: Record<string, string> = { asap: "Ready now", month: "Within a month", explore: "Just exploring" };
const BUDGET: Record<string, string> = { low: "Under $3,000", mid: "$3,000-$8,000", high: "$8,000+ or ongoing partner" };

export default function Diagnostic() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    website: "",
    bizName: "",
    employees: "",
    industry: "",
    email: "",
    usesTools: "",
    connectors: {} as Record<string, string[]>,
    otherTools: "",
    bottlenecks: [] as string[],
    hours: "",
    urgency: "",
    budget: "",
    lookingFor: "",
  });

  const [result, setResult] = useState<null | { tier: string, price: string, why: string, includes: string[] }>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const biginForm = useRef<HTMLFormElement>(null);
  const biginFrame = useRef<HTMLIFrameElement>(null);
  // Honeypot. Hidden from people, filled in by most bots. The Bigin endpoint is a
  // public URL, so this is the only thing standing between it and scripted spam.
  const honeypot = useRef<HTMLInputElement>(null);

  // Bigin's script sets the hidden form's action. Without it the POST goes nowhere.
  useEffect(() => {
    if (document.getElementById("wf_script")) return;
    const s = document.createElement("script");
    s.id = "wf_script";
    s.src = BIGIN.script;
    document.body.appendChild(s);
  }, []);

  const handleConnectorToggle = (cf: string, value: string) => {
    setFormData(prev => {
      const current = prev.connectors[cf] ?? [];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, connectors: { ...prev.connectors, [cf]: next } };
    });
  };

  const handleBottleneckToggle = (b: string) => {
    setFormData(prev => ({
      ...prev,
      bottlenecks: prev.bottlenecks.includes(b)
        ? prev.bottlenecks.filter(t => t !== b)
        : [...prev.bottlenecks, b]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Bot filled the hidden field. Show the normal confirmation and send nothing,
    // so a scraper gets no signal that it was caught.
    if (honeypot.current?.value) {
      setSubmitted(true);
      return;
    }

    if (!formData.hours || !formData.urgency || !formData.budget || !formData.usesTools || !formData.lookingFor || formData.bottlenecks.length === 0) {
      alert("Please answer every question, including what you're looking for and at least one bottleneck, before submitting.");
      return;
    }

    const connectorCount = Object.values(formData.connectors).reduce((n, list) => n + list.length, 0);

    let score = 0;
    score += formData.bottlenecks.length * 2;
    score += formData.hours === 'high' ? 4 : formData.hours === 'mid' ? 2 : 0;
    score += formData.budget === 'high' ? 4 : formData.budget === 'mid' ? 2 : 0;
    score += formData.urgency === 'asap' ? 2 : formData.urgency === 'month' ? 1 : 0;
    if (formData.usesTools === 'no') score -= 2;
    if (connectorCount >= 2) score += 2;

    const topBottleneck = formData.bottlenecks[0];
    const heavyTop = ['marketing'].includes(topBottleneck);

    let tier, price, why, includes;

    if (score >= 11 || (formData.budget === 'high' && formData.bottlenecks.length >= 3)) {
      tier = 'Tier 3 — Partner';
      price = '$750–$1,500/month retainer';
      why = `${formData.bizName || 'This business'} is juggling several bottlenecks at once with real budget and urgency behind fixing them. A one-time setup won't hold — this needs ongoing tuning as the business keeps changing.`;
      includes = [
        'Full-stack setup across finance, sales, and marketing tools',
        'Monthly monitoring and tuning of every deployed workflow',
        'Quarterly business review, delivered as a presentation-ready narrative',
        'Priority troubleshooting, same-week response'
      ];
    } else if (score >= 6 || heavyTop) {
      tier = 'Tier 2 — Growth';
      price = '$6,000–$9,000 fixed fee · 4–6 weeks';
      why = heavyTop
        ? `${formData.bizName || 'This business'}'s top priority is marketing — that needs a brand and content audit before anything useful can run, which doesn't fit inside a 2-week Foundation build regardless of score.`
        : `${formData.bizName || 'This business'} has more than one real bottleneck and enough manual time bleeding out weekly to justify a fuller build than a single fix.`;
      includes = [
        'Full tool stack connected (accounting, payments, CRM, calendar)',
        '3–5 recurring workflows across the flagged bottleneck areas',
        'Weekly reporting cadence installed',
        '60-day tuning window as real usage surfaces gaps'
      ];
    } else {
      tier = 'Tier 1 — Foundation';
      price = '$3,000–$3,500 fixed fee · 2 weeks';
      why = `${formData.bizName || 'This business'} has a clear top bottleneck worth solving first, without committing to a full build before seeing it work.`;
      includes = [
        'Kickoff interview to lock in the single highest-impact fix',
        'Two core tools connected',
        'One recurring workflow deployed and trained on',
        '30-day check-in to confirm it is actually being used'
      ];
    }

    // --- Post to Zoho Bigin -------------------------------------------------
    // Bigin holds the record until the lead clicks the confirmation link in the
    // email it sends, so nothing reaches the pipeline without their permission.
    const f = biginForm.current;
    if (f) {
      const set = (name: string, value: string) => {
        const el = f.elements.namedItem(name) as HTMLInputElement | null;
        if (el) el.value = value;
      };
      const closing = new Date();
      closing.setDate(closing.getDate() + 30);

      set("Contacts.First Name", formData.firstName.trim());
      set("Contacts.Last Name", formData.lastName.trim());
      set("Contacts.Email", formData.email.trim());
      set("Contacts.Phone", formData.phone.trim());
      set("Potential Name", formData.bizName.trim());
      set("Accounts.Account Name", formData.bizName.trim());
      set("Accounts.Website", formData.website.trim());
      set("Closing Date", closing.toLocaleDateString("en-CA"));

      set("POTENTIALCF1", formData.industry.trim() || "Not given");
      set("POTENTIALCF2", TEAM_SIZE[formData.employees] ?? "");
      set("POTENTIALCF3", formData.usesTools === "no" ? "No - mostly spreadsheets and memory" : "Yes");
      set("POTENTIALCF4", formData.otherTools.trim() || "None given");
      set("POTENTIALCF5", formData.bottlenecks.map(b => BOTTLENECK[b]).filter(Boolean).join(";"));
      set("POTENTIALCF6", HOURS[formData.hours] ?? "");
      set("POTENTIALCF7", TIMELINE[formData.urgency] ?? "");
      set("POTENTIALCF8", BUDGET[formData.budget] ?? "");
      set("POTENTIALCF51", String(score));
      set("POTENTIALCF9", (tier.match(/Tier \d/) ?? ["Tier 1"])[0]);

      // New fields from the updated Bigin webform:
      set("POTENTIALCF23", formData.lookingFor);
      set("Lead Source", "AI Suggestion");
      set("Type", "New Business");
      set("Probability", "10");
      set("Next Step", "Send diagnostic follow-up email");
      set("Amount", "");

      // Internal context fields.
      set("POTENTIALCF10", formData.usesTools === "no"
        ? "Mostly spreadsheets and memory — no current apps."
        : `Uses apps: ${connectorCount > 0 ? "see connector fields" : "no specific tools selected"}. Other tools: ${formData.otherTools.trim() || "none given"}.`
      );
      set("POTENTIALCF11", why);
      set("Description", [
        `Bottlenecks: ${formData.bottlenecks.map(b => BOTTLENECK[b]).join("; ")}`,
        `Time lost: ${HOURS[formData.hours] ?? ""}`,
        `Timeline: ${TIMELINE[formData.urgency] ?? ""}`,
        `Budget: ${BUDGET[formData.budget] ?? ""}`,
        `Recommended tier: ${tier}`,
      ].join(" | "));
      set("POTENTIALCF12", formData.email.trim());

      CONNECTORS.forEach(({ cf }) => set(cf, (formData.connectors[cf] ?? []).join(";")));

      // Guard against the form posting anywhere other than Zoho. This is the check
      // that matters: when the action was missing, the browser posted back to this
      // page, the request "succeeded", and the visitor was told it worked while
      // nothing was recorded. A silent success is worse than a visible failure.
      if (!f.action.startsWith("https://bigin.zohocloud.ca/")) {
        console.error("Bigin endpoint missing or wrong:", f.action);
        setSendFailed(true);
        setResult({ tier, price, why, includes });
        setSubmitted(true);
        return;
      }

      // Confirm the POST actually reached Zoho before telling the visitor it worked.
      // The response lands in the hidden iframe; we can't read it (cross-origin) but
      // its load event proves the request completed. If nothing loads, we say so
      // rather than showing a false success — the earlier version reported "Got it"
      // even when the form was posting into a void.
      let landed = false;
      const frame = biginFrame.current;
      const onLoad = () => { landed = true; };
      frame?.addEventListener("load", onLoad, { once: true });
      window.setTimeout(() => {
        frame?.removeEventListener("load", onLoad);
        if (!landed) setSendFailed(true);
      }, 12000);

      f.submit();
    }

    setResult({ tier, price, why, includes });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone">
      <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-stone border-b border-rule backdrop-blur-md bg-opacity-90">
        <Link to="/" className="font-bold text-2xl tracking-tight flex items-baseline" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          <span className="text-[#433A36] -tracking-[0.5px]">threndle</span>
          <span className="text-[#B8562B] text-xl">.ai</span>
        </Link>
        <Link to="/" className="font-mono text-xs tracking-widest uppercase text-ink-soft hover:text-ink transition-colors">Back</Link>
      </nav>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="font-serif font-medium text-4xl mb-4">Stitches 06–11</h1>
          <p className="text-ink-soft text-lg">Same thread, your turn. Fill these in and the recommendation's on the other side.</p>
        </div>

        {!submitted && (
        <form onSubmit={handleSubmit} className="space-y-24 mt-20">
          <input
            ref={honeypot}
            type="text"
            name="company_website_url"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />
          {/* Section 06 */}
          <section className="relative p-6 md:p-8 bg-stone-raised border border-rule rounded-sm hover:border-teal transition-colors shadow-sm group">
            <Gnome className="absolute -top-16 right-4 md:-right-6" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-5 h-5 rounded-full bg-brass shrink-0" />
              <div className="font-mono text-sm tracking-widest text-brass-dim uppercase">06</div>
              <h2 className="font-serif text-2xl font-semibold">The basics</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name"
                required
                className="w-full p-4 bg-stone border-2 border-rule rounded-sm focus:outline-none focus:border-teal transition-colors"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
              />
              <input
                type="text"
                placeholder="Last name"
                required
                className="w-full p-4 bg-stone border-2 border-rule rounded-sm focus:outline-none focus:border-teal transition-colors"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
              />
              <input
                type="text"
                placeholder="Business name"
                required
                className="w-full p-4 bg-stone border-2 border-rule rounded-sm focus:outline-none focus:border-teal transition-colors"
                value={formData.bizName}
                onChange={e => setFormData({...formData, bizName: e.target.value})}
              />
              <select 
                required
                className="w-full p-4 bg-stone border-2 border-rule rounded-sm focus:outline-none focus:border-teal transition-colors appearance-none"
                value={formData.employees}
                onChange={e => setFormData({...formData, employees: e.target.value})}
              >
                <option value="" disabled>Team size</option>
                <option value="solo">Just me</option>
                <option value="small">2–9 employees</option>
                <option value="mid">10–25 employees</option>
                <option value="large">25+ employees</option>
              </select>
              <input 
                type="text" 
                placeholder="Industry" 
                className="w-full p-4 bg-stone border-2 border-rule rounded-sm focus:outline-none focus:border-teal transition-colors"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-4 bg-stone border-2 border-rule rounded-sm focus:outline-none focus:border-teal transition-colors"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                className="w-full p-4 bg-stone border-2 border-rule rounded-sm focus:outline-none focus:border-teal transition-colors"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <input
                type="text"
                placeholder="Website (optional)"
                className="w-full p-4 bg-stone border-2 border-rule rounded-sm focus:outline-none focus:border-teal transition-colors"
                value={formData.website}
                onChange={e => setFormData({...formData, website: e.target.value})}
              />
            </div>

            <div className="mt-10">
              <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3">What are you looking for?</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'Information', label: 'Information' },
                  { id: 'Team Learning Session', label: 'Team Learning Session' },
                  { id: 'Integration', label: 'Integration' },
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-colors text-center justify-center",
                      formData.lookingFor === opt.id ? "border-teal bg-teal-soft" : "border-rule bg-stone hover:border-teal"
                    )}
                  >
                    <input
                      type="radio"
                      name="lookingFor"
                      className="hidden"
                      checked={formData.lookingFor === opt.id}
                      onChange={() => setFormData({ ...formData, lookingFor: opt.id })}
                    />
                    <span className="font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <p className="text-ink-soft text-xs mt-4">
              We'll only use these to get back to you about your diagnostic.
            </p>
          </section>

          {/* Section 07 */}
          <section className="relative p-6 md:p-8 bg-stone-raised border border-rule rounded-sm hover:border-teal transition-colors shadow-sm group">
            <Gnome className="absolute -top-16 right-4 md:-right-6" />
            <div className="flex items-center gap-4 mb-2">
              <div className="w-5 h-5 rounded-full bg-brass shrink-0" />
              <div className="font-mono text-sm tracking-widest text-brass-dim uppercase">07</div>
              <h2 className="font-serif text-2xl font-semibold">What's already in use</h2>
            </div>
            <p className="text-ink-soft text-sm mb-6">If it's mostly spreadsheets and memory, say so — that's a real answer, not a wrong one.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'yes', label: 'We use apps' },
                { id: 'no', label: 'Mostly spreadsheets and memory' },
              ].map(opt => (
                <label
                  key={opt.id}
                  className={cn(
                    "flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-colors text-center justify-center",
                    formData.usesTools === opt.id ? "border-teal bg-teal-soft" : "border-rule bg-stone hover:border-teal"
                  )}
                >
                  <input
                    type="radio"
                    name="usesTools"
                    className="hidden"
                    checked={formData.usesTools === opt.id}
                    onChange={() => setFormData({ ...formData, usesTools: opt.id, connectors: {}, otherTools: "" })}
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>

            {formData.usesTools === 'yes' && (
              <div className="mt-10 space-y-8">
                <p className="text-ink-soft text-sm">Tick what you actually use. Skip anything you pay for but never open.</p>

                {CONNECTORS.map(group => (
                  <div key={group.cf}>
                    <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3">{group.label}</div>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map(option => {
                        const picked = (formData.connectors[group.cf] ?? []).includes(option);
                        return (
                          <label
                            key={option}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 border-2 rounded-sm cursor-pointer transition-colors text-sm",
                              picked ? "border-teal bg-teal-soft" : "border-rule bg-stone hover:border-teal"
                            )}
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-teal shrink-0"
                              checked={picked}
                              onChange={() => handleConnectorToggle(group.cf, option)}
                            />
                            <span>{option === 'Other' ? 'Something else' : option}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div>
                  <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3">Anything else</div>
                  <input
                    type="text"
                    placeholder="Anything else running the business?"
                    className="w-full p-4 bg-stone border-2 border-rule rounded-sm focus:outline-none focus:border-teal transition-colors"
                    value={formData.otherTools}
                    onChange={e => setFormData({ ...formData, otherTools: e.target.value })}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Section 08 */}
          <section className="relative p-6 md:p-8 bg-stone-raised border border-rule rounded-sm hover:border-teal transition-colors shadow-sm group">
            <Gnome className="absolute -top-16 right-4 md:-right-6" />
            <div className="flex items-center gap-4 mb-2">
              <div className="w-5 h-5 rounded-full bg-brass shrink-0" />
              <div className="font-mono text-sm tracking-widest text-brass-dim uppercase">08</div>
              <h2 className="font-serif text-2xl font-semibold">Where the week actually goes</h2>
            </div>
            <p className="text-ink-soft text-sm mb-6">Check every area that eats real time or causes real stress.</p>

            <div className="flex flex-col gap-3">
              {[
                { id: 'cashflow', label: 'Cash flow & bookkeeping', desc: 'reconciling, chasing invoices, not knowing the runway' },
                { id: 'sales', label: 'Sales & leads', desc: 'leads going cold, no follow-up system' },
                { id: 'marketing', label: 'Marketing & content', desc: 'inconsistent posting, no plan for what to promote' },
                { id: 'service', label: 'Customer service', desc: 'slow replies, repetitive questions, reviews' },
                { id: 'ops', label: 'Admin & reporting', desc: 'no clear weekly picture of the business' },
                { id: 'hiring', label: 'Hiring & payroll', desc: 'slow to post roles, payroll timing stress' },
              ].map(opt => (
                <label 
                  key={opt.id} 
                  className={cn(
                    "flex items-start gap-4 p-4 border-2 rounded-sm cursor-pointer transition-colors",
                    formData.bottlenecks.includes(opt.id) ? "border-teal bg-teal-soft" : "border-rule bg-stone hover:border-teal"
                  )}
                >
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 accent-teal shrink-0" 
                    checked={formData.bottlenecks.includes(opt.id)}
                    onChange={() => handleBottleneckToggle(opt.id)}
                  />
                  <div>
                    <span className="font-semibold">{opt.label}</span> {opt.desc && <span>— {opt.desc}</span>}
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Section 09 */}
          <section className="relative p-6 md:p-8 bg-stone-raised border border-rule rounded-sm hover:border-teal transition-colors shadow-sm group">
            <Gnome className="absolute -top-16 right-4 md:-right-6" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-5 h-5 rounded-full bg-brass shrink-0" />
              <div className="font-mono text-sm tracking-widest text-brass-dim uppercase">09</div>
              <h2 className="font-serif text-2xl font-semibold">Time lost to manual admin</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'low', label: 'Under 5 hrs/week' },
                { id: 'mid', label: '5–15 hrs/week' },
                { id: 'high', label: '15+ hrs/week' },
              ].map(opt => (
                <label 
                  key={opt.id} 
                  className={cn(
                    "flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-colors text-center justify-center",
                    formData.hours === opt.id ? "border-teal bg-teal-soft" : "border-rule bg-stone hover:border-teal"
                  )}
                >
                  <input 
                    type="radio" 
                    name="hours"
                    className="hidden" 
                    checked={formData.hours === opt.id}
                    onChange={() => setFormData({...formData, hours: opt.id})}
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Section 10 */}
          <section className="relative p-6 md:p-8 bg-stone-raised border border-rule rounded-sm hover:border-teal transition-colors shadow-sm group">
            <Gnome className="absolute -top-16 right-4 md:-right-6" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-5 h-5 rounded-full bg-brass shrink-0" />
              <div className="font-mono text-sm tracking-widest text-brass-dim uppercase">10</div>
              <h2 className="font-serif text-2xl font-semibold">Timeline</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'asap', label: 'Ready now' },
                { id: 'month', label: 'Within a month' },
                { id: 'explore', label: 'Just exploring' },
              ].map(opt => (
                <label 
                  key={opt.id} 
                  className={cn(
                    "flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-colors text-center justify-center",
                    formData.urgency === opt.id ? "border-teal bg-teal-soft" : "border-rule bg-stone hover:border-teal"
                  )}
                >
                  <input 
                    type="radio" 
                    name="urgency"
                    className="hidden" 
                    checked={formData.urgency === opt.id}
                    onChange={() => setFormData({...formData, urgency: opt.id})}
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Section 11 */}
          <section className="relative p-6 md:p-8 bg-stone-raised border border-rule rounded-sm hover:border-teal transition-colors shadow-sm group">
            <Gnome className="absolute -top-16 right-4 md:-right-6" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-5 h-5 rounded-full bg-brass shrink-0" />
              <div className="font-mono text-sm tracking-widest text-brass-dim uppercase">11</div>
              <h2 className="font-serif text-2xl font-semibold">Comfortable budget range</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'low', label: 'Under $3,000' },
                { id: 'mid', label: '$3,000–$8,000' },
                { id: 'high', label: '$8,000+ / partner' },
              ].map(opt => (
                <label 
                  key={opt.id} 
                  className={cn(
                    "flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-colors text-center justify-center",
                    formData.budget === opt.id ? "border-teal bg-teal-soft" : "border-rule bg-stone hover:border-teal"
                  )}
                >
                  <input 
                    type="radio" 
                    name="budget"
                    className="hidden" 
                    checked={formData.budget === opt.id}
                    onChange={() => setFormData({...formData, budget: opt.id})}
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-6 font-mono text-xs tracking-widest uppercase text-brass-dim">
              <div className="w-2 h-2 rotate-45 bg-brass" />
              Last stitch — tie it off
              <div className="w-2 h-2 rotate-45 bg-brass" />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-ink text-stone py-5 rounded-sm font-mono text-sm tracking-widest uppercase hover:bg-teal transition-colors font-semibold"
            >
              Get my recommendation
            </button>
          </div>
        </form>
        )}

        {submitted && sendFailed && (
          <div className="mt-16 p-8 border-2 border-[#B8562B] bg-stone-raised relative">
            <div className="absolute -top-3 left-6 px-3 bg-stone font-mono text-xs tracking-widest text-[#B8562B]">DIDN'T SEND</div>
            <h3 className="font-serif text-2xl font-semibold mb-3">That didn't go through</h3>
            <p className="text-base leading-relaxed mb-2">
              Your answers didn't reach us — so nothing was recorded and no one will follow up. That's on our end,
              not yours.
            </p>
            <p className="text-ink-soft text-sm">
              Email{" "}
              <a href={`mailto:hello@threndle.ai?subject=${encodeURIComponent("Diagnostic - " + (formData.bizName || "my business"))}`} className="underline hover:text-teal">hello@threndle.ai</a>{" "}
              and we'll pick it up from there, or try again in a moment.
            </p>
          </div>
        )}

        {submitted && !sendFailed && (
          <div className="mt-16 p-8 border-2 border-teal bg-teal-soft relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="absolute -top-3 left-6 px-3 bg-stone font-mono text-xs tracking-widest text-brass-dim">TIED OFF</div>
            <h3 className="font-serif text-2xl font-semibold mb-3">Got it — thank you</h3>
            <p className="text-base leading-relaxed mb-2">
              Your answers are with us, and we'll be in touch at{" "}
              <span className="font-semibold">{formData.email}</span> to walk through what we found.
            </p>
            <p className="text-ink-soft text-sm">
              Anything to add in the meantime?{" "}
              <a href="mailto:hello@threndle.ai" className="underline hover:text-teal">hello@threndle.ai</a>.
            </p>
          </div>
        )}

        {result && (
          <div className="mt-16 p-8 border-2 border-ink bg-stone-raised relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="absolute -top-3 left-6 px-3 bg-stone font-mono text-xs tracking-widest text-brass-dim">DIAGNOSIS</div>
            <h3 className="font-serif text-3xl font-semibold text-teal mb-6">{result.tier}</h3>
            {/* Price deliberately not shown. Pricing is set at the Proposal stage,
                after the discovery call - an early figure on a public form becomes
                an anchor we then have to argue against. result.price is still
                computed and posted to Bigin for internal use. */}

            <p className="text-base leading-relaxed mb-6">
              {result.why}
            </p>
            
            <ul className="list-disc pl-5 space-y-2 mb-8 text-sm text-ink-soft">
              {result.includes.map((inc, i) => (
                <li key={i}>{inc}</li>
              ))}
            </ul>

            <a 
              href={`mailto:hello@threndle.ai?subject=Diagnostic%20follow-up%20-%20${encodeURIComponent(formData.bizName || 'This business')}`}
              className="inline-block bg-brass text-white px-6 py-3 rounded-sm font-semibold text-sm hover:bg-brass-dim transition-colors"
            >
              Book a follow-up call
            </a>
          </div>
        )}

        {/* Zoho Bigin web-to-record bridge. Hidden by design — the form above is the
            only thing a visitor sees. Values are copied in on submit and posted to
            Bigin, which emails the lead a confirmation link before the record is
            released into the pipeline. */}
        <iframe ref={biginFrame} id={BIGIN.frameId} name={BIGIN.frameId} style={{ display: "none" }} title="Bigin submission target" />
        <form
          ref={biginForm}
          id={BIGIN.formId}
          name={BIGIN.formId}
          action={BIGIN.action}
          method="POST"
          encType="multipart/form-data"
          target={BIGIN.frameId}
          acceptCharset="UTF-8"
          style={{ display: "none" }}
        >
          <input type="text" name="xnQsjsdp" defaultValue={BIGIN.xnQsjsdp} />
          <input type="hidden" name="zc_gad" id="zc_gad" defaultValue="" />
          <input type="text" name="xmIwtLD" defaultValue={BIGIN.xmIwtLD} />
          <input type="text" name="actionType" defaultValue="UG90ZW50aWFscw==" />
          <input type="hidden" name="rmsg" id="rmsg" defaultValue="true" />
          <input type="text" name="returnURL" defaultValue="" />

          {[
            "Contacts.First Name", "Contacts.Last Name", "Contacts.Email", "Contacts.Phone",
            "Potential Name", "Accounts.Account Name", "Accounts.Website", "Closing Date",
            "POTENTIALCF1", "POTENTIALCF2", "POTENTIALCF3", "POTENTIALCF4", "POTENTIALCF5",
            "POTENTIALCF6", "POTENTIALCF7", "POTENTIALCF8", "POTENTIALCF51", "POTENTIALCF9",
            "POTENTIALCF10", "POTENTIALCF11", "POTENTIALCF12", "POTENTIALCF23",
            "Lead Source", "Type", "Probability", "Next Step", "Amount", "Description",
            ...CONNECTORS.map(c => c.cf),
          ].map(name => (
            <input key={name} type="text" name={name} defaultValue="" />
          ))}

          <input type="text" name="Pipeline" defaultValue="Sales Pipeline Standard" />
          <input type="text" name="Stage" defaultValue="Introduction" />
        </form>
      </main>

      <footer className="text-center py-12 px-6 font-mono text-xs text-ink-soft tracking-wider">
        THRENDLE AI · Fraser Valley, BC · hello@threndle.ai
      </footer>
    </div>
  );
}
