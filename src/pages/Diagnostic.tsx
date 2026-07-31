import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

/**
 * Zoho Bigin web-to-record.
 *
 * These tokens are regenerated every time the webform is rebuilt in Bigin.
 * If submissions stop creating records, re-copy them from the form's embed code.
 * Field ids (POTENTIALCF*) come from the same embed and must match exactly.
 * Zoho silently discards a value posted under an unknown field name.
 */
const BIGIN = {
  // Verified endpoint, taken from a working submission.
  action: "https://bigin.zohocloud.ca/crm/WebForm",
  formId: "BiginWebToRecordForm50945000000240613",
  frameId: "hidden50945000000240613Frame",
  xnQsjsdp: "ec7ef01ac81d4355b56ca422518478ad20f7e4c37348d5e632bbdcb2b89fb99f",
  xmIwtLD: "aeeacade077a67fcfa00600236599d20575565a6b1e5ecfb419e1d80b68e9c0ea1375452713c98038947043dc9224830",
  script:
    "https://bigin.zohocloud.ca/crm/WebformScriptServlet?rid=aeeacade077a67fcfa00600236599d20575565a6b1e5ecfb419e1d80b68e9c0ea1375452713c98038947043dc9224830gidec7ef01ac81d4355b56ca422518478ad20f7e4c37348d5e632bbdcb2b89fb99f",
};

/** Each group maps to one Bigin multi-select field. Values must match Bigin exactly. */
const CONNECTORS: { cf: string; label: string; options: string[] }[] = [
  { cf: "POTENTIALCF16", label: "CRM", options: ["HubSpot", "Salesforce", "Zoho Bigin", "Pipedrive", "Other"] },
  { cf: "POTENTIALCF13", label: "Accounting", options: ["QuickBooks", "Xero", "Wave", "Sage", "Zoho Books", "Other"] },
  { cf: "POTENTIALCF14", label: "Payments", options: ["QuickBooks Payments", "Stripe", "PayPal", "Square", "Other"] },
  { cf: "POTENTIALCF22", label: "Advertising", options: ["Google Ads", "Meta Ads (Facebook / Instagram)", "LinkedIn Ads", "TikTok Ads", "Microsoft Advertising", "Amazon Ads", "Pinterest Ads", "Snapchat Ads", "Reddit Ads", "X (Twitter) Ads", "Apple Search Ads"] },
  { cf: "POTENTIALCF15", label: "Payroll", options: ["QuickBooks Payroll", "Wagepoint", "Payworks", "Ceridian Powerpay", "Humi", "ADP Canada", "Other"] },
  { cf: "POTENTIALCF20", label: "E-commerce", options: ["Shopify", "WooCommerce", "Squarespace", "Other"] },
  { cf: "POTENTIALCF17", label: "Email & Files", options: ["Google Workspace (Gmail, Calendar, Drive)", "Microsoft 365 / Outlook", "Dropbox", "OneDrive"] },
  { cf: "POTENTIALCF18", label: "Team & Ops", options: ["Slack", "Monday.com", "Asana", "ClickUp", "Notion", "Other"] },
  { cf: "POTENTIALCF19", label: "Booking", options: ["Calendly", "Acuity Scheduling", "Square Appointments", "Other"] },
  { cf: "POTENTIALCF21", label: "Design & Docs", options: ["Canva", "DocuSign", "Other"] },
  { cf: "POTENTIALCF24", label: "Automations", options: ["Zapier", "Make", "n8n"] },
];

const TEAM_SIZE: Record<string, string> = { solo: "Just me", small: "2-9 employees", mid: "10-25 employees", large: "25+" };
const BOTTLENECK: Record<string, string> = {
  admin: "Admin & reporting",
  cashflow: "Cash flow & bookkeeping",
  service: "Customer service",
  hiring: "Hiring & payroll",
  marketing: "Marketing & content",
  sales: "Sales & leads",
};
const HOURS: Record<string, string> = { low: "Under 5 hrs/week", mid: "5-15 hrs/week", high: "15+ hrs/week" };
const TIMELINE: Record<string, string> = { asap: "Ready now", month: "Within a month", explore: "Just exploring" };
const BUDGET: Record<string, string> = { low: "Under $3,000", mid: "$3,000-$8,000", high: "$8,000+ or ongoing partner" };
const LOOKING_FOR: Record<string, string> = { information: "Information", learning: "Team Learning Session", integration: "Integration" };

type FormData = {
  usesTools: string;
  connectors: Record<string, string[]>;
  otherTools: string;
  bottlenecks: string[];
  hours: string;
  employees: string;
  industry: string;
  urgency: string;
  budget: string;
  lookingFor: string;
  firstName: string;
  lastName: string;
  bizName: string;
  website: string;
  phone: string;
  email: string;
};

const initialFormData: FormData = {
  usesTools: "",
  connectors: {},
  otherTools: "",
  bottlenecks: [],
  hours: "",
  employees: "",
  industry: "",
  urgency: "",
  budget: "",
  lookingFor: "",
  firstName: "",
  lastName: "",
  bizName: "",
  website: "",
  phone: "",
  email: "",
};

const steps = [
  { num: 1, label: "What's in use" },
  { num: 2, label: "Where work goes" },
  { num: 3, label: "Timeline & budget" },
  { num: 4, label: "Basics" },
  { num: 5, label: "Done" },
];

type WizardPageProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors?: Record<string, boolean>;
  key?: React.Key;
};

function FallingGnome({ side, delay = 0 }: { side: "left" | "right"; delay?: number }) {
  return (
    <motion.div
      initial={{ y: -120, opacity: 0, x: side === "left" ? -20 : 20 }}
      animate={{ y: 0, opacity: 1, x: 0 }}
      transition={{ type: "spring", bounce: 0.5, duration: 0.9, delay }}
      className={cn(
        "absolute -top-16 z-30 pointer-events-none w-14 h-20 drop-shadow-lg",
        side === "left" ? "left-4 md:-left-6" : "right-4 md:-right-6"
      )}
    >
      {/* Decorative: a CSS background, not an <img>, so it stays out of the
          accessibility tree entirely and needs no alt attribute. */}
      <div
        aria-hidden="true"
        style={{ backgroundImage: "url(/threndle-ai-gnome.svg)" }}
        className={cn("absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat", side === "left" ? "-scale-x-100" : "")}
      />
    </motion.div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="relative mb-12">
      <div className="flex justify-between items-center relative z-10">
        {steps.map((s) => {
          const active = s.num === current;
          const done = s.num < current;
          return (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border-2 transition-colors",
                  active ? "bg-ink text-stone border-ink" : done ? "bg-teal text-white border-teal" : "bg-stone text-ink-soft border-rule"
                )}
              >
                {s.num}
              </div>
              <span className={cn("hidden md:block text-[10px] font-mono uppercase tracking-widest", active ? "text-ink" : "text-ink-soft")}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-rule -z-0">
        <motion.div
          className="h-full bg-brass"
          initial={{ width: "0%" }}
          animate={{ width: `${((current - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}

function PageShell({
  step,
  title,
  subtitle,
  children,
  gnomeSide,
}: {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  gnomeSide: "left" | "right";
}) {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative p-6 md:p-10 bg-stone-raised border border-rule rounded-sm shadow-sm min-h-[420px]"
    >
      <FallingGnome side={gnomeSide} />
      <div className="flex items-center gap-4 mb-2">
        <div className="w-5 h-5 rounded-full bg-brass shrink-0" />
        <div className="font-mono text-sm tracking-widest text-brass-dim uppercase">{String(step + 5).padStart(2, "0")}</div>
        <h2 className="font-serif text-2xl font-semibold">{title}</h2>
      </div>
      <p className="text-ink-soft text-sm mb-8">{subtitle}</p>
      {children}
    </motion.div>
  );
}

function Page1({ formData, setFormData, errors }: WizardPageProps) {
  const handleConnectorToggle = (cf: string, value: string) => {
    setFormData((prev) => {
      const current = prev.connectors[cf] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, connectors: { ...prev.connectors, [cf]: next } };
    });
  };

  return (
    <PageShell step={1} title="What's already in use" subtitle="Do you use apps to run the business, or mostly spreadsheets and memory?" gnomeSide="left">
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 p-1 rounded-sm", errors?.usesTools ? "border-2 border-[#B8562B] bg-[#B8562B]/5" : "")}>
        {[
          { id: "yes", label: "We use apps" },
          { id: "no", label: "Mostly spreadsheets and memory" },
        ].map((opt) => (
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
              onChange={() => setFormData((prev) => ({ ...prev, usesTools: opt.id, connectors: {}, otherTools: "" }))}
            />
            <span className="font-medium">{opt.label}</span>
          </label>
        ))}
      </div>

      {formData.usesTools === "yes" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-6">
          <p className="text-ink-soft text-sm">Tick what you actually use. Skip anything you pay for but never open.</p>
          {CONNECTORS.map((group) => (
            <div key={group.cf} className="p-4 border border-rule rounded-sm bg-stone">
              <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3">{group.label}</div>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const picked = (formData.connectors[group.cf] ?? []).includes(option);
                  return (
                    <label
                      key={option}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 border-2 rounded-sm cursor-pointer transition-colors text-sm",
                        picked ? "border-teal bg-teal-soft" : "border-rule bg-stone-raised hover:border-teal"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-teal shrink-0"
                        checked={picked}
                        onChange={() => handleConnectorToggle(group.cf, option)}
                      />
                      <span>{option === "Other" ? "Something else" : option}</span>
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
              placeholder="Other tools running the business?"
              className="w-full p-4 bg-stone border-2 border-rule rounded-sm focus:outline-none focus:border-teal transition-colors"
              value={formData.otherTools}
              onChange={(e) => setFormData((prev) => ({ ...prev, otherTools: e.target.value }))}
            />
          </div>
        </motion.div>
      )}
    </PageShell>
  );
}

function Page2({ formData, setFormData, errors }: WizardPageProps) {
  const handleBottleneckToggle = (b: string) => {
    setFormData((prev) => ({
      ...prev,
      bottlenecks: prev.bottlenecks.includes(b) ? prev.bottlenecks.filter((t) => t !== b) : [...prev.bottlenecks, b],
    }));
  };

  return (
    <PageShell step={2} title="Where the work actually goes" subtitle="Check every area that eats real time or causes real stress." gnomeSide="right">
      <div className="space-y-8">
        <div className={cn("p-1 rounded-sm", errors?.bottlenecks ? "border-2 border-[#B8562B] bg-[#B8562B]/5" : "")}>
          <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3">Bottlenecks</div>
          <div className="flex flex-col gap-3">
            {[
              { id: "cashflow", label: "Cash flow & bookkeeping", desc: "reconciling, chasing invoices, not knowing the runway" },
              { id: "sales", label: "Sales & leads", desc: "leads going cold, no follow-up system" },
              { id: "marketing", label: "Marketing & content", desc: "inconsistent posting, no plan for what to promote" },
              { id: "service", label: "Customer service", desc: "slow replies, repetitive questions, reviews" },
              { id: "admin", label: "Admin & reporting", desc: "no clear weekly picture of the business" },
              { id: "hiring", label: "Hiring & payroll", desc: "slow to post roles, payroll timing stress" },
            ].map((opt) => (
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
                  <span className="font-semibold">{opt.label}</span>
                  <span className="text-ink-soft"> : {opt.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cn("p-1 rounded-sm", errors?.hours ? "border-2 border-[#B8562B] bg-[#B8562B]/5" : "")}>
            <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3">Hours lost per week</div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: "low", label: "Under 5 hrs/week" },
                { id: "mid", label: "5–15 hrs/week" },
                { id: "high", label: "15+ hrs/week" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    "flex items-center gap-3 p-4 border-2 rounded-sm cursor-pointer transition-colors",
                    formData.hours === opt.id ? "border-teal bg-teal-soft" : "border-rule bg-stone hover:border-teal"
                  )}
                >
                  <input
                    type="radio"
                    name="hours"
                    className="hidden"
                    checked={formData.hours === opt.id}
                    onChange={() => setFormData((prev) => ({ ...prev, hours: opt.id }))}
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3">Team size</div>
            <select
              className={cn(
                "w-full p-4 bg-stone border-2 rounded-sm focus:outline-none focus:border-teal transition-colors appearance-none",
                errors?.employees ? "border-[#B8562B]" : "border-rule"
              )}
              value={formData.employees}
              onChange={(e) => setFormData((prev) => ({ ...prev, employees: e.target.value }))}
            >
              <option value="" disabled>
                Select team size
              </option>
              <option value="solo">Just me</option>
              <option value="small">2–9 employees</option>
              <option value="mid">10–25 employees</option>
              <option value="large">25+ employees</option>
            </select>

            <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3 mt-6">Industry</div>
            <input
              type="text"
              placeholder="Industry"
              className={cn(
                "w-full p-4 bg-stone border-2 rounded-sm focus:outline-none focus:border-teal transition-colors",
                errors?.industry ? "border-[#B8562B]" : "border-rule"
              )}
              value={formData.industry}
              onChange={(e) => setFormData((prev) => ({ ...prev, industry: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Page3({ formData, setFormData, errors }: WizardPageProps) {
  return (
    <PageShell step={3} title="Timeline and budget" subtitle="No pitch. Just what fits right now." gnomeSide="left">
      <div className="space-y-8">
        <div className={cn("p-1 rounded-sm", errors?.urgency ? "border-2 border-[#B8562B] bg-[#B8562B]/5" : "")}>
          <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3">Timeline</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: "asap", label: "Ready now" },
              { id: "month", label: "Within a month" },
              { id: "explore", label: "Just exploring" },
            ].map((opt) => (
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
                  onChange={() => setFormData((prev) => ({ ...prev, urgency: opt.id }))}
                />
                <span className="font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={cn("p-1 rounded-sm", errors?.budget ? "border-2 border-[#B8562B] bg-[#B8562B]/5" : "")}>
          <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3">Budget range</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: "low", label: "Under $3,000" },
              { id: "mid", label: "$3,000–$8,000" },
              { id: "high", label: "$8,000+ / partner" },
            ].map((opt) => (
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
                  onChange={() => setFormData((prev) => ({ ...prev, budget: opt.id }))}
                />
                <span className="font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={cn("p-1 rounded-sm", errors?.lookingFor ? "border-2 border-[#B8562B] bg-[#B8562B]/5" : "")}>
          <div className="font-mono text-xs tracking-widest uppercase text-brass-dim mb-3">What are you looking for?</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: "information", label: "Information" },
              { id: "learning", label: "Team Learning Session" },
              { id: "integration", label: "Integration" },
            ].map((opt) => (
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
                  onChange={() => setFormData((prev) => ({ ...prev, lookingFor: opt.id }))}
                />
                <span className="font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Page4({ formData, setFormData, errors }: WizardPageProps) {
  const inputClass = (hasError?: boolean) =>
    cn(
      "w-full p-4 bg-stone border-2 rounded-sm focus:outline-none focus:border-teal transition-colors",
      hasError ? "border-[#B8562B]" : "border-rule"
    );

  return (
    <PageShell step={4} title="Basics" subtitle="We'll only use these to get back to you about your diagnostic." gnomeSide="right">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First name"
          required
          className={inputClass(errors?.firstName)}
          value={formData.firstName}
          onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Last name"
          required
          className={inputClass(errors?.lastName)}
          value={formData.lastName}
          onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Company name"
          required
          className={inputClass(errors?.bizName)}
          value={formData.bizName}
          onChange={(e) => setFormData((prev) => ({ ...prev, bizName: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Website (optional)"
          className={inputClass(false)}
          value={formData.website}
          onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
        />
        <input
          type="tel"
          placeholder="Phone"
          required
          className={inputClass(errors?.phone)}
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className={inputClass(errors?.email)}
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        />
      </div>
    </PageShell>
  );
}

function Page5({
  formData,
  result,
  sendFailed,
}: {
  formData: FormData;
  result: { tier: string; price: string; why: string; includes: string[] } | null;
  sendFailed: boolean;
  key?: React.Key;
}) {
  return (
    <div className="relative pt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative p-6 md:p-8 bg-stone-raised border-2 border-teal rounded-sm shadow-lg text-center"
      >
        {/* Falling gnome, same spring drop as the homepage card series */}
        <motion.div
          initial={{ y: -150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: 0.6 }}
          className="absolute -top-16 right-4 md:-right-6 z-30 pointer-events-none w-14 h-20 drop-shadow-lg"
        >
          {/* Decorative: a CSS background, not an <img>, so it stays out of the
              accessibility tree entirely and needs no alt attribute. */}
          <div
            aria-hidden="true"
            style={{ backgroundImage: "url(/threndle-ai-gnome.svg)" }}
            className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat"
          />
        </motion.div>

        <div className="absolute -top-3 left-6 px-3 bg-stone font-mono text-xs tracking-widest text-brass-dim">TIED OFF</div>
        <h2 className="font-serif text-2xl font-semibold mb-3">Got it. Thank you</h2>
        <p className="text-base leading-relaxed mb-3">
          Your answers are on their way. Check <span className="font-semibold">{formData.email}</span>, for a confirmation email (check your junk email just in case). You'll need to confirm before we can send your Custom Implementation Plan.
        </p>
        <p className="text-ink-soft text-sm mb-5">
          Anything to add?{" "}
          <a href="mailto:hello@threndle.ai" className="underline hover:text-teal">
            hello@threndle.ai
          </a>
        </p>

        {sendFailed && (
          <div className="mb-5 p-4 border border-[#B8562B] bg-stone text-left">
            <p className="text-[#B8562B] font-medium mb-1">That didn't go through to our system.</p>
            <p className="text-sm text-ink-soft">
              Please email{" "}
              <a
                href={`mailto:hello@threndle.ai?subject=${encodeURIComponent("Diagnostic - " + (formData.bizName || "my business"))}`}
                className="underline hover:text-teal"
              >
                hello@threndle.ai
              </a>{" "}
              and we'll pick it up.
            </p>
          </div>
        )}

        {result && (
          <div className="mt-5 p-5 border border-ink bg-stone text-left">
            <div className="font-mono text-xs tracking-widest text-brass-dim mb-2 uppercase">Diagnosis</div>
            <h3 className="font-serif text-xl font-semibold text-teal mb-3">{result.tier}</h3>
            <p className="text-base leading-relaxed mb-3">{result.why}</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-ink-soft">
              {result.includes.map((inc, i) => (
                <li key={i}>{inc}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function Diagnostic() {
  // Dev shortcut: /diagnostic?preview=thanks jumps straight to the thank-you
  // page with sample data, skipping the form and the Bigin POST.
  const previewThanks =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("preview") === "thanks";

  const [step, setStep] = useState(previewThanks ? 5 : 1);
  const [formData, setFormData] = useState<FormData>(
    previewThanks
      ? {
          ...initialFormData,
          firstName: "Preview",
          lastName: "User",
          bizName: "Preview Co",
          email: "you@example.com",
        }
      : initialFormData
  );
  const [submitted, setSubmitted] = useState(previewThanks);
  const [sendFailed, setSendFailed] = useState(false);
  const [result, setResult] = useState<{ tier: string; price: string; why: string; includes: string[] } | null>(
    previewThanks
      ? {
          tier: "Tier 2: Growth",
          price: "$6,000 to $9,000 fixed fee · 4 to 6 weeks",
          why: "Preview Co has more than one real bottleneck and enough manual time bleeding out weekly to justify a fuller build than a single fix.",
          includes: [
            "Full tool stack connected (accounting, payments, CRM, calendar)",
            "3 to 5 recurring workflows across the flagged bottleneck areas",
            "Weekly reporting cadence installed",
            "60-day tuning window as real usage surfaces gaps",
          ],
        }
      : null
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});
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

  // Clear validation errors as soon as the user changes any answer.
  useEffect(() => {
    setErrors({});
  }, [formData]);

  const validateStep = (s: number) => {
    const nextErrors: Record<string, boolean> = {};
    switch (s) {
      case 1:
        if (formData.usesTools === "") nextErrors.usesTools = true;
        break;
      case 2:
        if (formData.bottlenecks.length === 0) nextErrors.bottlenecks = true;
        if (formData.hours === "") nextErrors.hours = true;
        if (formData.employees === "") nextErrors.employees = true;
        break;
      case 3:
        if (formData.urgency === "") nextErrors.urgency = true;
        if (formData.budget === "") nextErrors.budget = true;
        if (formData.lookingFor === "") nextErrors.lookingFor = true;
        break;
      case 4:
        if (!formData.firstName.trim()) nextErrors.firstName = true;
        if (!formData.lastName.trim()) nextErrors.lastName = true;
        if (!formData.bizName.trim()) nextErrors.bizName = true;
        if (!formData.phone.trim()) nextErrors.phone = true;
        if (!formData.email.trim()) nextErrors.email = true;
        break;
    }
    return nextErrors;
  };

  const next = () => {
    const nextErrors = validateStep(step);
    if (Object.keys(nextErrors).length === 0) {
      setErrors({});
      setStep((v) => v + 1);
    } else {
      setErrors(nextErrors);
    }
  };

  const prev = () => setStep((v) => v - 1);

  const computeResult = () => {
    const connectorCount = Object.values(formData.connectors).reduce<number>(
      (n, list) => n + (list as string[]).length,
      0
    );
    let score = 0;
    score += formData.bottlenecks.length * 2;
    score += formData.hours === "high" ? 4 : formData.hours === "mid" ? 2 : 0;
    score += formData.budget === "high" ? 4 : formData.budget === "mid" ? 2 : 0;
    score += formData.urgency === "asap" ? 2 : formData.urgency === "month" ? 1 : 0;
    if (formData.usesTools === "no") score -= 2;
    if (connectorCount >= 2) score += 2;

    const topBottleneck = formData.bottlenecks[0];
    const heavyTop = ["marketing"].includes(topBottleneck);

    let tier: string;
    let price: string;
    let why: string;
    let includes: string[];

    if (score >= 11 || (formData.budget === "high" && formData.bottlenecks.length >= 3)) {
      tier = "Tier 3: Partner";
      price = "$750 to $1,500/month retainer";
      why = `${formData.bizName || "This business"} is juggling several bottlenecks at once with real budget and urgency behind fixing them. A one-time setup won't hold. This needs ongoing tuning as the business keeps changing.`;
      includes = [
        "Full-stack setup across finance, sales, and marketing tools",
        "Monthly monitoring and tuning of every deployed workflow",
        "Quarterly business review, delivered as a presentation-ready narrative",
        "Priority troubleshooting, same-week response",
      ];
    } else if (score >= 6 || heavyTop) {
      tier = "Tier 2: Growth";
      price = "$6,000 to $9,000 fixed fee · 4 to 6 weeks";
      why = heavyTop
        ? `${formData.bizName || "This business"}'s top priority is marketing. That needs a brand and content audit before anything useful can run, which doesn't fit inside a 2-week Foundation build regardless of score.`
        : `${formData.bizName || "This business"} has more than one real bottleneck and enough manual time bleeding out weekly to justify a fuller build than a single fix.`;
      includes = [
        "Full tool stack connected (accounting, payments, CRM, calendar)",
        "3 to 5 recurring workflows across the flagged bottleneck areas",
        "Weekly reporting cadence installed",
        "60-day tuning window as real usage surfaces gaps",
      ];
    } else {
      tier = "Tier 1: Foundation";
      price = "$3,000 to $3,500 fixed fee · 2 weeks";
      why = `${formData.bizName || "This business"} has a clear top bottleneck worth solving first, without committing to a full build before seeing it work.`;
      includes = [
        "Kickoff interview to lock in the single highest-impact fix",
        "Two core tools connected",
        "One recurring workflow deployed and trained on",
        "30-day check-in to confirm it is actually being used",
      ];
    }
    return { score, tier, price, why, includes };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Bot filled the hidden field. Show the normal confirmation and send nothing,
    // so a scraper gets no signal that it was caught.
    if (honeypot.current?.value) {
      setSubmitted(true);
      return;
    }

    const submitErrors = validateStep(4);
    if (Object.keys(submitErrors).length > 0) {
      setErrors(submitErrors);
      return;
    }

    const { score, tier, price, why, includes } = computeResult();
    setResult({ tier, price, why, includes });

    // --- Post to Zoho Bigin -------------------------------------------------
    // Bigin holds the record until the lead clicks the confirmation link in the
    // email it sends, so nothing reaches the pipeline without their permission.
    const f = biginForm.current;
    if (f) {
      const set = (name: string, value: string) => {
        const el = f.elements.namedItem(name) as HTMLInputElement | null;
        if (el) el.value = value;
      };
      const connectorCount = Object.values(formData.connectors).reduce<number>(
        (n, list) => n + (list as string[]).length,
        0
      );
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
      set("POTENTIALCF5", formData.bottlenecks.map((b) => BOTTLENECK[b]).filter(Boolean).join(";"));
      set("POTENTIALCF6", HOURS[formData.hours] ?? "");
      set("POTENTIALCF7", TIMELINE[formData.urgency] ?? "");
      set("POTENTIALCF8", BUDGET[formData.budget] ?? "");
      set("POTENTIALCF51", String(score));
      set("POTENTIALCF9", (tier.match(/Tier \d/) ?? ["Tier 1"])[0]);

      set("POTENTIALCF23", LOOKING_FOR[formData.lookingFor] ?? "");
      set("Lead Source", "AI Suggestion");
      set("Type", "New Business");
      set("Probability", "10");
      set("Next Step", "Send diagnostic follow-up email");
      set("Amount", "");

      // Internal context fields.
      set(
        "POTENTIALCF10",
        formData.usesTools === "no"
          ? "Mostly spreadsheets and memory. No current apps."
          : `Uses apps: ${connectorCount > 0 ? "see connector fields" : "no specific tools selected"}. Other tools: ${formData.otherTools.trim() || "none given"}.`
      );
      set("POTENTIALCF11", why);
      set(
        "Description",
        [
          `Bottlenecks: ${formData.bottlenecks.map((b) => BOTTLENECK[b]).join("; ")}`,
          `Time lost: ${HOURS[formData.hours] ?? ""}`,
          `Timeline: ${TIMELINE[formData.urgency] ?? ""}`,
          `Budget: ${BUDGET[formData.budget] ?? ""}`,
          `Recommended tier: ${tier}`,
        ].join(" | ")
      );
      set("POTENTIALCF12", formData.email.trim());

      CONNECTORS.forEach(({ cf }) => set(cf, (formData.connectors[cf] ?? []).join(";")));

      // Guard against the form posting anywhere other than Zoho. This is the check
      // that matters: when the action was missing, the browser posted back to this
      // page, the request "succeeded", and the visitor was told it worked while
      // nothing was recorded. A silent success is worse than a visible failure.
      if (!f.action.startsWith("https://bigin.zohocloud.ca/")) {
        console.error("Bigin endpoint missing or wrong:", f.action);
        setSendFailed(true);
        setSubmitted(true);
        return;
      }

      // Confirm the POST actually reached Zoho before telling the visitor it worked.
      // The response lands in the hidden iframe; we can't read it (cross-origin) but
      // its load event proves the request completed. If nothing loads, we say so
      // rather than showing a false success.
      let landed = false;
      const frame = biginFrame.current;
      const onLoad = () => {
        landed = true;
      };
      frame?.addEventListener("load", onLoad, { once: true });
      window.setTimeout(() => {
        frame?.removeEventListener("load", onLoad);
        if (!landed) setSendFailed(true);
      }, 12000);

      f.submit();
    }

    setSubmitted(true);
    setStep(5);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone">
      <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-stone border-b border-rule backdrop-blur-md bg-opacity-90">
        <Link
          to="/"
          className="font-bold text-2xl tracking-tight flex items-baseline"
          style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
          <span className="text-[#433A36] -tracking-[0.5px]">threndle</span>
          <span className="text-[#B8562B] text-xl">.ai</span>
        </Link>
        <Link to="/" className="font-mono text-xs tracking-widest uppercase text-ink-soft hover:text-ink transition-colors">
          Back
        </Link>
      </nav>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif font-medium text-4xl mb-4">Stitches 06–10</h1>
          <p className="text-ink-soft text-lg">Same thread, your turn. Five stitches, then we tie it off.</p>
        </div>

        {!submitted && <StepIndicator current={step} />}

        {/* Honeypot: hidden from real users, visible to most bots. */}
        <input
          ref={honeypot}
          type="text"
          name="company_website_url"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />

        <AnimatePresence mode="wait">
          {!submitted && step === 1 && <Page1 key="p1" formData={formData} setFormData={setFormData} errors={errors} />}
          {!submitted && step === 2 && <Page2 key="p2" formData={formData} setFormData={setFormData} errors={errors} />}
          {!submitted && step === 3 && <Page3 key="p3" formData={formData} setFormData={setFormData} errors={errors} />}
          {!submitted && step === 4 && <Page4 key="p4" formData={formData} setFormData={setFormData} errors={errors} />}
          {submitted && step === 5 && <Page5 key="p5" formData={formData} result={result} sendFailed={sendFailed} />}
        </AnimatePresence>

        {!submitted && (
          <div className="flex items-center justify-between mt-10">
            {step > 1 ? (
              <button
                type="button"
                onClick={prev}
                className="font-mono text-xs tracking-widest uppercase text-ink-soft hover:text-ink transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 bg-ink text-stone px-6 py-3 rounded-sm font-mono text-xs tracking-widest uppercase hover:bg-teal transition-colors"
              >
                Follow the gnome
                <span>→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 bg-ink text-stone px-6 py-3 rounded-sm font-mono text-xs tracking-widest uppercase hover:bg-teal transition-colors"
              >
                Save your results
                <span>→</span>
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-12 px-6 font-mono text-xs text-ink-soft tracking-wider">
        THRENDLE AI · Fraser Valley, BC · hello@threndle.ai
      </footer>

      {/* Zoho Bigin web-to-record bridge. Hidden by design — the wizard above is the
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
          "Contacts.First Name",
          "Contacts.Last Name",
          "Contacts.Email",
          "Contacts.Phone",
          "Potential Name",
          "Accounts.Account Name",
          "Accounts.Website",
          "Closing Date",
          "POTENTIALCF1",
          "POTENTIALCF2",
          "POTENTIALCF3",
          "POTENTIALCF4",
          "POTENTIALCF5",
          "POTENTIALCF6",
          "POTENTIALCF7",
          "POTENTIALCF8",
          "POTENTIALCF51",
          "POTENTIALCF9",
          "POTENTIALCF10",
          "POTENTIALCF11",
          "POTENTIALCF12",
          "POTENTIALCF23",
          "Lead Source",
          "Type",
          "Probability",
          "Next Step",
          "Amount",
          "Description",
          ...CONNECTORS.map((c) => c.cf),
        ].map((name) => (
          <input key={name} type="text" name={name} defaultValue="" />
        ))}

        <input type="text" name="Pipeline" defaultValue="Sales Pipeline Standard" />
        <input type="text" name="Stage" defaultValue="Introduction" />
      </form>
    </div>
  );
}
