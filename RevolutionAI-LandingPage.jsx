import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  PhoneMissed, MessageSquare, PhoneCall, CalendarCheck, Star, Workflow, BarChart3,
  Menu, X, Plus, Minus, Check, RotateCcw, Voicemail, PhoneOff, Send, BellRing, ChevronLeft, Signal, Wifi, BatteryFull,
} from "lucide-react";

const LOGO_SRC = "/RevolutionAi-Logo-3-cropped%20%281%29.png";
const FORM_ID = "2aMmnobuUyI2iG1fB1v9";

const c = {
  bg: "#070C18",
  bgAlt: "#0A1122",
  surface: "#0E172B",
  line: "rgba(255,255,255,0.09)",
  text: "#F4F7FB",
  muted: "#9AA8BD",
  cyan: "#4DD4E7",
  gold: "#F5A623",
};

const NAV = [["What we build", "solutions"], ["How it works", "how"], ["Run your numbers", "calculator"], ["Questions", "faq"]];

/* Example conversation shown in the hero phone. Illustrative, not a real customer. */
const THREAD = [
  { kind: "event", text: "Missed call · 7:42 PM" },
  { kind: "out", text: "Hi, this is Northside Heating & Cooling. Sorry we missed you, we're out on a job. What can we help with?" },
  { kind: "in", text: "Furnace is blowing cold air. Can someone come out tomorrow?" },
  { kind: "out", text: "We can. I have 8–10 AM or 1–3 PM open tomorrow. Which works better?" },
  { kind: "in", text: "8–10 works" },
  { kind: "out", text: "You're booked for tomorrow, 8–10 AM. We'll text a reminder in the morning." },
  { kind: "booked", text: "Added to the calendar · 7:46 PM" },
];

const PROOF = [
  {
    figure: "7×",
    text: "Companies that reached a new web lead within an hour were nearly seven times as likely to qualify it as those that waited one more hour.",
    source: "Harvard Business Review, 2011",
    href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
  },
  {
    figure: "23%",
    text: "of the 2,241 U.S. companies in that same audit never responded to the lead at all.",
    source: "Harvard Business Review, 2011",
    href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
  },
  {
    figure: "78%",
    text: "of U.S. consumers say they have walked away from a business after a call went unanswered.",
    source: "CallRail consumer survey, 2025",
  },
];

const BUILDS = [
  { id: "textback", icon: PhoneMissed, title: "Missed-call text-back", desc: "When you can't pick up, the caller gets a text from your number within seconds, and the conversation keeps going until they're booked." },
  { id: "voice", icon: PhoneCall, title: "AI voice agent", desc: "Answers the phone after hours, asks the questions you'd ask, and hands hot jobs to you." },
  { id: "booking", icon: CalendarCheck, title: "Booking and reminders", desc: "Customers pick a time in a couple of taps. Confirmations and reminders cut down on no-shows." },
  { id: "lead", icon: MessageSquare, title: "Instant lead response", desc: "Web forms, ads and directory leads get a text and an email right away, then steady follow-up." },
  { id: "reviews", icon: Star, title: "Reviews and repeat work", desc: "Finished jobs trigger a review request. Past customers get a nudge when it's time." },
  { id: "pipeline", icon: Workflow, title: "Pipeline that updates itself", desc: "Every lead lands in the right stage with a task, so nothing depends on memory." },
  { id: "report", icon: BarChart3, title: "Plain reporting", desc: "Where leads came from, how fast they were answered, how many booked, how many closed." },
];

/* Illustrative side-by-side. Times are an example, not measured results. */
const WITHOUT = [
  { icon: Voicemail, time: "Sat 7:42 PM", text: "Call rings out and goes to voicemail." },
  { icon: PhoneOff, time: "Sat 7:43 PM", text: "The caller dials the next company on the list." },
  { icon: PhoneCall, time: "Mon 9:10 AM", text: "You call back. Someone else already has the job." },
];
const WITH = [
  { icon: Send, time: "Sat 7:42 PM", text: "A text goes out from your number before they've put the phone down." },
  { icon: CalendarCheck, time: "Sat 7:46 PM", text: "They pick a slot. The job is on your calendar." },
  { icon: BellRing, time: "Sun 7:00 AM", text: "Reminder sent. You show up, do the work." },
  { icon: Star, time: "After the job", text: "A review request goes out on its own." },
];

const STEPS = [
  { title: "Free audit", desc: "A 30-minute call. We map how leads reach you today and where they leak." },
  { title: "We build it", desc: "Your number, your forms, your wording, your calendar, wired into one system." },
  { title: "Go live", desc: "Most businesses are running in 5–7 business days, with a walkthrough for your team." },
  { title: "We keep tuning", desc: "We watch the numbers and adjust the messages and timing based on what books jobs." },
];

const INDUSTRIES = [
  { id: "hvac", name: "HVAC", avgTicket: 3500, multiplier: 1.2 },
  { id: "plumbing", name: "Plumbing", avgTicket: 2800, multiplier: 1.15 },
  { id: "electrical", name: "Electrical", avgTicket: 3200, multiplier: 1.18 },
  { id: "roofing", name: "Roofing", avgTicket: 12000, multiplier: 1.3 },
  { id: "remodeling", name: "Home remodeling", avgTicket: 25000, multiplier: 1.28 },
  { id: "landscaping", name: "Landscaping", avgTicket: 4500, multiplier: 1.15 },
  { id: "painting", name: "Painting", avgTicket: 4000, multiplier: 1.12 },
  { id: "cleaning", name: "Cleaning", avgTicket: 350, multiplier: 1.3 },
  { id: "pest", name: "Pest control", avgTicket: 400, multiplier: 1.25 },
  { id: "auto", name: "Auto services", avgTicket: 1200, multiplier: 1.1 },
  { id: "realestate", name: "Real estate", avgTicket: 15000, multiplier: 1.25 },
  { id: "dental", name: "Dental", avgTicket: 2200, multiplier: 1.2 },
  { id: "medspa", name: "Med spa", avgTicket: 1800, multiplier: 1.35 },
  { id: "chiropractic", name: "Chiropractic", avgTicket: 1500, multiplier: 1.18 },
  { id: "legal", name: "Legal", avgTicket: 5000, multiplier: 1.22 },
  { id: "veterinary", name: "Veterinary", avgTicket: 800, multiplier: 1.18 },
  { id: "salon", name: "Salon and barber", avgTicket: 150, multiplier: 1.4 },
  { id: "fitness", name: "Fitness", avgTicket: 200, multiplier: 1.35 },
  { id: "photography", name: "Photography", avgTicket: 2500, multiplier: 1.2 },
  { id: "catering", name: "Catering and events", avgTicket: 5000, multiplier: 1.25 },
];

const SLIDERS = [
  { key: "monthlyLeads", label: "Leads per month", min: 10, max: 500, step: 10 },
  { key: "closeRate", label: "Close rate", min: 5, max: 80, step: 5, suffix: "%" },
  { key: "avgTicket", label: "Average job value", min: 100, max: 50000, step: 100, prefix: "$" },
  { key: "missedCallPercent", label: "Calls you miss", min: 5, max: 60, step: 5, suffix: "%" },
  { key: "hoursOnFollowUp", label: "Hours a week on follow-up", min: 2, max: 40, step: 1, suffix: " hrs" },
  { key: "responseTime", label: "Typical time to reply", min: 1, max: 48, step: 1, suffix: " hrs" },
];

const FAQS = [
  { q: "How long does setup take?", a: "Most businesses are fully running within 5–7 business days. We do the heavy lifting. You give us access and answer a few questions about how you work." },
  { q: "Do I need to be technical?", a: "No. If you can use a smartphone, you can use this. We build everything for you, and the mobile app keeps your leads and conversations in one place." },
  { q: "What if I already have a CRM?", a: "We can connect to most existing tools or help you move your data over. We look at your setup during the free audit and recommend the simplest route." },
  { q: "Is there a contract?", a: "No long-term contracts. We earn your business every month by delivering results, and you can cancel anytime." },
  { q: "How is pricing set?", a: "Every business is different, so we quote based on your lead volume, the pieces you need and your goals. You get a clear number after the audit." },
  { q: "What happens on the free audit?", a: "A 30-minute call where we review your current lead flow, point out the gaps, show how the automation would work for your business, and give you a custom ROI projection. No pressure." },
];

function estimate(v, multiplier) {
  const { monthlyLeads, closeRate, avgTicket, hoursOnFollowUp, missedCallPercent, responseTime } = v;
  const currentDeals = Math.round(monthlyLeads * (closeRate / 100));
  const currentRevenue = currentDeals * avgTicket;
  const missedCalls = Math.round(monthlyLeads * (missedCallPercent / 100));
  const lostFromMissed = Math.round(missedCalls * (closeRate / 100) * 0.6);
  const improvedRate = Math.min(closeRate * multiplier, 85);
  const recoveredLeads = Math.round(lostFromMissed * 0.75);
  const projectedRevenue = (Math.round(monthlyLeads * (improvedRate / 100)) + recoveredLeads) * avgTicket;
  const hoursSaved = Math.round(hoursOnFollowUp * 0.85);
  return {
    hoursSaved,
    monthlyHoursSaved: hoursSaved * 4,
    fasterReply: responseTime > 1 ? Math.round(((responseTime - 0.5) / responseTime) * 100) : 50,
    recoveredLeads,
    currentRevenue,
    projectedRevenue,
    additionalRevenue: projectedRevenue - currentRevenue,
    annualImpact: (projectedRevenue - currentRevenue) * 12,
  };
}

const money = (n) => "$" + Math.round(n).toLocaleString("en-US");

function Vignette({ id }) {
  if (id === "textback") return (
    <div className="vg vg-thread" aria-hidden="true">
      <span className="msg msg-event"><PhoneMissed size={12} />Missed call</span>
      <span className="msg msg-out">Sorry we missed you. How can we help?</span>
      <span className="msg msg-in">Need a quote on a new water heater</span>
      <span className="msg msg-out">Happy to. What's the address?</span>
    </div>
  );
  if (id === "voice") return (
    <div className="vg vg-wave" aria-hidden="true">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * 0.12}s`, height: `${28 + ((i * 37) % 60)}%` }} />)}</div>
  );
  if (id === "booking") return (
    <div className="vg vg-slots" aria-hidden="true">{["8–10 AM", "10–12", "1–3 PM", "3–5 PM"].map((t, i) => <span key={t} className={i === 0 ? "on" : ""}>{t}</span>)}</div>
  );
  if (id === "lead") return (
    <div className="vg vg-sent" aria-hidden="true"><span><Check size={14} />Text sent</span><span><Check size={14} />Email sent</span></div>
  );
  if (id === "reviews") return (
    <div className="vg vg-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={20} fill="currentColor" />)}</div>
  );
  if (id === "pipeline") return (
    <div className="vg vg-pipe" aria-hidden="true">{[["New", 3], ["Quoted", 2], ["Booked", 4]].map(([l, n]) => <div key={l}><b>{l}</b>{Array.from({ length: n }).map((_, i) => <i key={i} />)}</div>)}</div>
  );
  if (id === "report") return (
    <div className="vg vg-bars" aria-hidden="true">{[34, 52, 41, 66, 58, 79, 88].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
  );
  return null;
}

const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

function PhoneDemo() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? THREAD.length : 1);
  const scroller = useRef(null);
  const done = shown >= THREAD.length;

  useEffect(() => {
    if (reduce || done) return;
    const next = THREAD[shown];
    const delay = next.kind === "in" ? 1900 : next.kind === "out" ? 1500 : 900;
    const t = setTimeout(() => setShown((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [shown, reduce, done]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown]);

  const next = THREAD[shown];
  const typing = !done && next && (next.kind === "in" || next.kind === "out");

  return (
    <div className="phone-wrap">
      <div className="phone" role="img" aria-label="Example text conversation: a missed call is answered by text and booked into the calendar four minutes later.">
        <div className="phone-status">
          <span>7:46</span>
          <span className="flex items-center gap-1.5"><Signal size={13} /><Wifi size={13} /><BatteryFull size={16} /></span>
        </div>
        <div className="phone-head">
          <ChevronLeft size={18} style={{ color: c.cyan }} />
          <div className="phone-avatar">MR</div>
          <div>
            <div className="text-[13px] font-semibold leading-tight">Maria R.</div>
            <div className="text-[11px]" style={{ color: c.muted }}>New caller</div>
          </div>
        </div>
        <div className="phone-thread" ref={scroller}>
          {THREAD.slice(0, shown).map((m, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className={`msg msg-${m.kind}`}
            >
              {m.kind === "event" && <PhoneMissed size={13} />}
              {m.kind === "booked" && <CalendarCheck size={13} />}
              <span>{m.text}</span>
            </motion.div>
          ))}
          {typing && (
            <div className={`msg msg-${next.kind} typing`} aria-hidden="true"><i /><i /><i /></div>
          )}
        </div>
      </div>
      <div className="phone-caption">
        <span>Example conversation. Yours uses your business name and your wording.</span>
        <button type="button" onClick={() => setShown(1)} className="replay" disabled={!done && !reduce}>
          <RotateCcw size={13} /> Replay
        </button>
      </div>
    </div>
  );
}

export default function RevolutionAILanding() {
  const [navOpen, setNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [industryId, setIndustryId] = useState("");
  const [vals, setVals] = useState({ monthlyLeads: 50, closeRate: 25, avgTicket: 2500, hoursOnFollowUp: 15, missedCallPercent: 30, responseTime: 24 });
  const [iframeHeight, setIframeHeight] = useState(1028);
  const [stickyCta, setStickyCta] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => {
      const contact = document.getElementById("contact");
      const nearForm = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      setStickyCta(window.scrollY > 640 && !nearForm);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setIframeHeight(w < 768 ? 1800 : w < 1024 ? 1400 : 1028);
    };
    calc();
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(calc, 150); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(t); };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const pickIndustry = (id) => {
    setIndustryId(id);
    const ind = INDUSTRIES.find((i) => i.id === id);
    if (ind) setVals((p) => ({ ...p, avgTicket: ind.avgTicket }));
  };

  const industry = INDUSTRIES.find((i) => i.id === industryId);
  const roi = estimate(vals, industry?.multiplier || 1.2);

  return (
    <div className="site min-h-screen">
      <style>{`
        .site { background: ${c.bg}; color: ${c.text}; font-family: 'DM Sans', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        .site h1, .site h2, .site h3, .display { font-family: 'Syne', 'DM Sans', sans-serif; letter-spacing: -0.02em; }
        .site :focus-visible { outline: 2px solid ${c.cyan}; outline-offset: 3px; border-radius: 6px; }
        .wrap { max-width: 1160px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        .band { padding-top: 88px; padding-bottom: 88px; }
        @media (max-width: 640px) { .band { padding-top: 60px; padding-bottom: 60px; } }
        .band-alt { background: ${c.bgAlt}; border-top: 1px solid ${c.line}; border-bottom: 1px solid ${c.line}; }
        .lede { color: ${c.muted}; font-size: 1.0625rem; line-height: 1.65; max-width: 34rem; }
        .h2 { font-size: clamp(1.9rem, 4vw, 2.9rem); font-weight: 700; line-height: 1.08; }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; border-radius: 12px; padding: 15px 26px; transition: transform .15s ease, box-shadow .15s ease, background .15s ease; }
        .btn-main { background: ${c.cyan}; color: #04121A; }
        .btn-main:hover { transform: translateY(-1px); box-shadow: 0 12px 34px -10px rgba(77,212,231,.55); }
        .btn-ghost { border: 1px solid rgba(255,255,255,.18); color: ${c.text}; }
        .btn-ghost:hover { background: rgba(255,255,255,.06); }
        .hero { position: relative; overflow: hidden; }
        .hero::before { content: ""; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(720px 520px at 82% 38%, rgba(77,212,231,.16), transparent 62%), radial-gradient(520px 380px at 96% 92%, rgba(245,166,35,.10), transparent 60%); }
        .hero h1 { font-size: clamp(2.15rem, 4.6vw, 3.7rem); font-weight: 700; line-height: 1.04; max-width: 13em; }
        .hero h1 em { font-style: normal; color: ${c.gold}; }
        .facts { display: flex; flex-wrap: wrap; gap: 10px 26px; color: ${c.muted}; font-size: .9rem; }
        .facts li { display: flex; align-items: center; gap: 8px; }
        .phone-wrap { width: 100%; max-width: 348px; margin: 0 auto; }
        .phone { background: #050A14; border: 1px solid rgba(255,255,255,.14); border-radius: 44px; padding: 14px 12px 16px; box-shadow: 0 40px 90px -30px rgba(0,0,0,.9), 0 0 0 7px #0C1424, 0 0 0 8px rgba(255,255,255,.08), 0 30px 120px -40px rgba(77,212,231,.5); }
        .phone-status { display: flex; justify-content: space-between; align-items: center; padding: 2px 16px 10px; font-size: 12px; font-weight: 600; }
        .phone-head { display: flex; align-items: center; gap: 10px; padding: 8px 8px 12px; border-bottom: 1px solid ${c.line}; }
        .phone-avatar { width: 34px; height: 34px; border-radius: 999px; background: #1B2740; display: grid; place-items: center; font-size: 12px; font-weight: 700; color: ${c.muted}; }
        .phone-thread { height: 408px; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; padding: 10px 6px 4px; }
        .msg { max-width: 84%; font-size: 13.5px; line-height: 1.4; padding: 9px 13px; border-radius: 18px; }
        .msg-out { align-self: flex-end; background: ${c.cyan}; color: #04121A; border-bottom-right-radius: 6px; }
        .msg-in { align-self: flex-start; background: #1A2438; color: ${c.text}; border-bottom-left-radius: 6px; }
        .msg-event, .msg-booked { align-self: center; max-width: 100%; display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; padding: 5px 11px; border-radius: 999px; }
        .msg-event { color: #FF9A8B; background: rgba(255,120,100,.12); }
        .msg-booked { color: ${c.gold}; background: rgba(245,166,35,.14); }
        .typing { display: inline-flex; gap: 4px; padding: 13px 14px; }
        .typing i { width: 6px; height: 6px; border-radius: 999px; background: currentColor; opacity: .45; animation: blink 1s infinite; }
        .typing i:nth-child(2) { animation-delay: .15s; } .typing i:nth-child(3) { animation-delay: .3s; }
        @keyframes blink { 0%, 100% { opacity: .25; } 50% { opacity: .9; } }
        .phone-caption { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-top: 18px; font-size: 12px; color: ${c.muted}; line-height: 1.45; }
        .replay { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; color: ${c.cyan}; font-weight: 600; }
        .replay:disabled { opacity: .35; }
        .proof { display: grid; gap: 0; }
        @media (min-width: 860px) { .proof { grid-template-columns: repeat(3, 1fr); } }
        .proof > div { padding: 30px 0; border-top: 1px solid ${c.line}; }
        @media (min-width: 860px) { .proof > div { padding: 6px 34px; border-top: 0; border-left: 1px solid ${c.line}; } .proof > div:first-child { padding-left: 0; border-left: 0; } }
        .proof .fig { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 3.2rem; line-height: 1; color: ${c.gold}; }
        .hero-photo { position: absolute; inset: 0; background: url(/img/hero-dusk.jpg) center / cover no-repeat; opacity: .85; -webkit-mask-image: linear-gradient(180deg, #000 55%, transparent 100%); mask-image: linear-gradient(180deg, #000 55%, transparent 100%); }
        .hero-photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(7,12,24,.96) 0%, rgba(7,12,24,.86) 34%, rgba(7,12,24,.5) 62%, rgba(7,12,24,.62) 100%); }
        @media (max-width: 1023px) { .hero-photo::after { background: linear-gradient(180deg, rgba(7,12,24,.9) 0%, rgba(7,12,24,.84) 60%, rgba(7,12,24,.7) 100%); } }
        .shot { position: relative; border-radius: 22px; overflow: hidden; border: 1px solid ${c.line}; }
        @media (min-width: 1024px) { .shot { min-height: 320px; } }
        .shot img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 62% 50%; }
        @media (max-width: 1023px) { .shot { aspect-ratio: 4 / 3; } }
        .shot figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 60px 22px 20px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.15rem; line-height: 1.25; background: linear-gradient(180deg, transparent, rgba(4,8,16,.92)); }
        .lane { border-radius: 18px; padding: 22px 20px; border: 1px solid ${c.line}; background: ${c.surface}; }
        .lane h3 { font-size: 1rem; font-weight: 700; margin-bottom: 14px; }
        .lane ol { display: grid; gap: 14px; }
        .lane li { display: grid; grid-template-columns: 20px 1fr; gap: 12px; font-size: .93rem; line-height: 1.45; }
        .lane li svg { margin-top: 2px; }
        .lane time { display: block; font-size: .78rem; font-weight: 600; font-variant-numeric: tabular-nums; }
        .lane-off { color: ${c.muted}; } .lane-off h3 { color: #FF9A8B; } .lane-off svg { color: #FF9A8B; } .lane-off time { color: #C8D0DC; }
        .lane-on { border-color: rgba(77,212,231,.45); background: linear-gradient(180deg, rgba(77,212,231,.09), ${c.surface} 60%); }
        .lane-on h3, .lane-on svg { color: ${c.cyan}; } .lane-on time { color: ${c.gold}; }
        .bento { display: grid; gap: 16px; grid-template-columns: 1fr; }
        @media (min-width: 700px) { .bento { grid-template-columns: repeat(2, 1fr); } .tile-textback, .tile-report { grid-column: span 2; } }
        @media (min-width: 1040px) { .bento { grid-template-columns: repeat(6, 1fr); }
          .tile-textback { grid-column: span 3; grid-row: span 2; } .tile-voice, .tile-booking { grid-column: span 3; }
          .tile-lead, .tile-reviews, .tile-pipeline { grid-column: span 2; } .tile-report { grid-column: span 6; } }
        .tile { position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; gap: 22px; padding: 26px; border-radius: 22px; background: ${c.surface}; border: 1px solid ${c.line}; }
        .tile::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .25s; background: radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(77,212,231,.14), transparent 65%); }
        .tile:hover::before { opacity: 1; }
        .tile > * { position: relative; }
        .tile .ico { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; background: rgba(77,212,231,.1); color: ${c.cyan}; }
        @media (min-width: 1040px) { .tile-voice, .tile-booking, .tile-report { flex-direction: row; align-items: center; } .tile-voice .tile-copy, .tile-booking .tile-copy, .tile-report .tile-copy { flex: 1 1 52%; } .tile-voice .vg, .tile-booking .vg, .tile-report .vg { flex: 1 1 48%; } }
        .vg-thread { display: flex; flex-direction: column; gap: 8px; padding: 18px 16px; border-radius: 18px; background: #070D1A; border: 1px solid ${c.line}; }
        .vg-wave { display: flex; align-items: center; gap: 4px; height: 84px; }
        .vg-wave i { flex: 1; border-radius: 99px; background: linear-gradient(180deg, ${c.cyan}, rgba(77,212,231,.25)); transform-origin: center; animation: wave 1.5s ease-in-out infinite; }
        @keyframes wave { 0%, 100% { transform: scaleY(.45); } 50% { transform: scaleY(1); } }
        .vg-slots { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .vg-slots span { text-align: center; padding: 11px 6px; border-radius: 12px; font-size: .86rem; font-weight: 600; border: 1px solid rgba(255,255,255,.14); color: ${c.muted}; }
        .vg-slots .on { background: ${c.cyan}; border-color: ${c.cyan}; color: #04121A; }
        .vg-sent { display: flex; flex-wrap: wrap; gap: 8px; }
        .vg-sent span { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 999px; font-size: .82rem; font-weight: 600; color: ${c.cyan}; background: rgba(77,212,231,.1); }
        .vg-stars { display: flex; gap: 6px; color: ${c.gold}; }
        .vg-pipe { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .vg-pipe div { display: grid; gap: 5px; align-content: start; }
        .vg-pipe b { font-size: .72rem; font-weight: 600; color: ${c.muted}; }
        .vg-pipe i { height: 9px; border-radius: 4px; background: rgba(255,255,255,.12); }
        .vg-pipe div:last-child i { background: ${c.cyan}; }
        .vg-bars { display: flex; align-items: flex-end; gap: 8px; height: 84px; }
        .vg-bars i { flex: 1; border-radius: 6px 6px 0 0; background: rgba(77,212,231,.28); }
        .vg-bars i:last-child { background: ${c.gold}; }
        .sticky-cta { position: fixed; left: 12px; right: 92px; bottom: 16px; z-index: 40; filter: drop-shadow(0 12px 24px rgba(0,0,0,.6)); }
        .steps { display: grid; gap: 34px; counter-reset: step; }
        @media (min-width: 860px) { .steps { grid-template-columns: repeat(4, 1fr); gap: 0; } }
        .steps li { position: relative; counter-increment: step; padding-top: 62px; }
        @media (min-width: 860px) { .steps li { padding-right: 30px; } .steps li::after { content: ""; position: absolute; top: 22px; left: 58px; right: 12px; height: 1px; background: linear-gradient(90deg, rgba(77,212,231,.6), rgba(77,212,231,.08)); } .steps li:last-child::after { display: none; } }
        .steps li::before { content: counter(step); position: absolute; top: 0; left: 0; width: 44px; height: 44px; border-radius: 999px; display: grid; place-items: center; font-family: 'Syne', sans-serif; font-weight: 800; color: #04121A; background: ${c.cyan}; }
        .panel { background: ${c.surface}; border: 1px solid ${c.line}; border-radius: 22px; }
        .field-label { display: flex; justify-content: space-between; align-items: baseline; font-size: .9rem; font-weight: 500; margin-bottom: 8px; }
        .field-label output { color: ${c.cyan}; font-weight: 700; font-variant-numeric: tabular-nums; }
        .site select { width: 100%; background: #0A1223; border: 1px solid rgba(255,255,255,.14); color: ${c.text}; border-radius: 12px; padding: 13px 14px; font-size: .95rem; }
        .site input[type="range"] { width: 100%; -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; height: 22px; }
        .site input[type="range"]::-webkit-slider-runnable-track { height: 6px; background: rgba(255,255,255,.12); border-radius: 3px; }
        .site input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; background: ${c.cyan}; border: 3px solid #04121A; box-shadow: 0 0 0 1px ${c.cyan}; border-radius: 50%; margin-top: -8px; }
        .site input[type="range"]::-moz-range-track { height: 6px; background: rgba(255,255,255,.12); border-radius: 3px; }
        .site input[type="range"]::-moz-range-thumb { width: 18px; height: 18px; background: ${c.cyan}; border: 3px solid #04121A; border-radius: 50%; }
        .result-row { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding: 14px 0; border-bottom: 1px solid ${c.line}; font-variant-numeric: tabular-nums; }
        .chips { display: flex; flex-wrap: wrap; gap: 10px; }
        .chip { border: 1px solid rgba(255,255,255,.14); border-radius: 999px; padding: 9px 16px; font-size: .92rem; color: ${c.text}; transition: background .15s, border-color .15s, color .15s; }
        .chip:hover { border-color: ${c.cyan}; color: ${c.cyan}; }
        .chip[aria-pressed="true"] { background: ${c.cyan}; border-color: ${c.cyan}; color: #04121A; font-weight: 600; }
        .footer-plate { background: linear-gradient(180deg, #E9F0F5 0%, #CBD8E2 55%, #AEBFCD 100%); border-top: 1px solid #7F96AA; box-shadow: inset 0 1px 0 #fff, inset 0 -18px 30px -18px rgba(40,70,100,.35); }
        .footer-plate img { border-radius: 26px; box-shadow: 0 0 0 1px #8FA6B8, 0 0 0 6px #EEF3F7, 0 0 0 7px #9DB1C2, 0 18px 40px -18px rgba(20,45,70,.7); }
        @media (prefers-reduced-motion: reduce) { .site * { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(7,12,24,.86)", borderBottom: `1px solid ${c.line}` }}>
        <div className="wrap flex items-center justify-between h-16">
          <a href="#top" className="flex items-center gap-3" aria-label="RevolutionAI home">
            <span className="w-11 h-11 shrink-0">
              <img src="/apple-touch-icon.png" alt="" width="44" height="44" className="w-full h-full object-contain" />
            </span>
            <span className="display font-bold text-lg">Revolution<span style={{ color: c.cyan }}>AI</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {NAV.map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="px-3.5 py-2 text-sm font-medium rounded-lg hover:bg-white/5" style={{ color: c.muted }}>{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block"><button onClick={() => scrollTo("contact")} className="btn btn-main" style={{ padding: "10px 18px", fontSize: ".9rem" }}>Book a free audit</button></span>
            <button className="md:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen} aria-label="Menu">
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <motion.div aria-hidden="true" style={{ scaleX: progress, transformOrigin: "0 50%", height: 2, background: `linear-gradient(90deg, ${c.cyan}, ${c.gold})`, position: "absolute", left: 0, right: 0, bottom: -1 }} />
        <AnimatePresence>
          {navOpen && (
            <motion.nav initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="md:hidden overflow-hidden" style={{ background: c.bgAlt, borderTop: `1px solid ${c.line}` }} aria-label="Mobile">
              <div className="wrap py-3">
                {[...NAV, ["Book a free audit", "contact"]].map(([label, id]) => (
                  <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left px-2 py-3.5 text-base font-medium" style={{ borderBottom: `1px solid ${c.line}` }}>{label}</button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <div className="hero-photo" aria-hidden="true" />
          <div className="wrap relative grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-14 items-center" style={{ paddingTop: 64, paddingBottom: 80 }}>
            <div>
              <p className="text-sm font-semibold mb-5" style={{ color: c.cyan }}>Done-for-you AI follow-up for home service businesses</p>
              <h1>The missed call that <em>booked itself.</em></h1>
              <p className="lede mt-7">
                You're on a roof, under a sink or in an attic. RevolutionAI answers anyway: it texts back every missed call in seconds, qualifies the lead, puts the job on your calendar and asks for the review afterward. We build it and run it for you.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button onClick={() => scrollTo("contact")} className="btn btn-main">Book a free audit</button>
                <button onClick={() => scrollTo("calculator")} className="btn btn-ghost">Run your numbers</button>
              </div>
              <ul className="facts mt-9">
                {["No long-term contract", "Live in 5–7 business days", "Built and managed for you"].map((f) => (
                  <li key={f}><Check size={16} style={{ color: c.cyan }} />{f}</li>
                ))}
              </ul>
            </div>
            <PhoneDemo />
          </div>
        </section>

        {/* Proof */}
        <section className="band-alt" aria-labelledby="proof-h">
          <div className="wrap" style={{ paddingTop: 56, paddingBottom: 56 }}>
            <h2 id="proof-h" className="text-xl font-bold mb-8">Why the first few minutes decide who gets the job</h2>
            <div className="proof">
              {PROOF.map((p) => (
                <div key={p.figure}>
                  <div className="fig">{p.figure}</div>
                  <p className="mt-3 text-[.95rem] leading-relaxed">{p.text}</p>
                  <p className="mt-2 text-xs" style={{ color: c.muted }}>
                    {p.href ? <a className="underline" href={p.href} target="_blank" rel="noopener noreferrer">{p.source}</a> : p.source}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Same call, two outcomes */}
        <section className="band" aria-labelledby="two-h">
          <div className="wrap grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr] gap-10 lg:gap-14 items-stretch">
            <figure className="shot">
              <img src="/img/roofer-at-work.jpg" alt="A roofer nailing shingles at sunset while his phone lights up beside him on the roof." width="1200" height="800" loading="lazy" />
              <figcaption>You can't answer from up here. You shouldn't have to.</figcaption>
            </figure>
            <div>
              <h2 id="two-h" className="h2">Same Saturday call. Two different Mondays.</h2>
              <div className="grid sm:grid-cols-2 gap-5 mt-9">
                <div className="lane lane-off">
                  <h3>Without a system</h3>
                  <ol>{WITHOUT.map((r) => <li key={r.time}><r.icon size={17} /><div><time>{r.time}</time><p>{r.text}</p></div></li>)}</ol>
                </div>
                <div className="lane lane-on">
                  <h3>With RevolutionAI</h3>
                  <ol>{WITH.map((r) => <li key={r.time}><r.icon size={17} /><div><time>{r.time}</time><p>{r.text}</p></div></li>)}</ol>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <button onClick={() => scrollTo("contact")} className="btn btn-main">Find my missed jobs</button>
                <span className="text-sm" style={{ color: c.muted }}>Illustrative example. Your audit uses your real call and lead data.</span>
              </div>
            </div>
          </div>
        </section>

        {/* What we build */}
        <section id="solutions" className="band band-alt">
          <div className="wrap">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-end mb-10">
              <h2 className="h2">Everything between "new lead" and "paid job," handled.</h2>
              <p className="lede">If it's repetitive, easy to forget, or happens while you're on a job, it belongs in the system. We build it, write it, connect it and keep improving it. Your team gets one inbox and one calendar.</p>
            </div>
            <ul className="bento">
              {BUILDS.map((b) => (
                <li key={b.id} className={`tile tile-${b.id}`} onMouseMove={spotlight}>
                  <div className="tile-copy">
                    <span className="ico"><b.icon size={20} /></span>
                    <h3 className="font-bold text-[1.15rem] mt-4">{b.title}</h3>
                    <p className="mt-1.5 text-[.95rem] leading-relaxed" style={{ color: c.muted }}>{b.desc}</p>
                  </div>
                  <Vignette id={b.id} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="band">
          <div className="wrap">
            <h2 className="h2 max-w-2xl">A clean install in about a week. No chaos.</h2>
            <ol className="steps mt-14">
              {STEPS.map((s) => (
                <li key={s.title}>
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="mt-2 text-[.95rem] leading-relaxed" style={{ color: c.muted }}>{s.desc}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button onClick={() => scrollTo("contact")} className="btn btn-main">Start with the free audit</button>
              <span className="text-sm" style={{ color: c.muted }}>Step one costs nothing and takes 30 minutes.</span>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="band band-alt">
          <div className="wrap">
            <div className="grid lg:grid-cols-2 gap-10 items-end mb-10">
              <h2 className="h2">Run your own numbers.</h2>
              <p className="lede">Pick your trade, slide in what a normal month looks like, and see what faster follow-up could be worth. No email needed.</p>
            </div>
            <div className="mb-8">
              <div className="chips" role="group" aria-label="Choose your industry">
                {INDUSTRIES.map((i) => (
                  <button key={i.id} type="button" className="chip" aria-pressed={industryId === i.id} onClick={() => pickIndustry(i.id)}>{i.name}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_.9fr] gap-6">
              <div className="panel p-6 sm:p-8 min-w-0">
                <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-7">
                  {SLIDERS.map((s) => (
                    <div key={s.key}>
                      <label className="field-label" htmlFor={`f-${s.key}`}>
                        <span>{s.label}</span>
                        <output>{s.prefix || ""}{vals[s.key].toLocaleString("en-US")}{s.suffix || ""}</output>
                      </label>
                      <input id={`f-${s.key}`} type="range" min={s.min} max={s.max} step={s.step} value={vals[s.key]}
                        onChange={(e) => setVals((p) => ({ ...p, [s.key]: Number(e.target.value) }))} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel p-6 sm:p-8 min-w-0" aria-live="polite" style={{ borderColor: "rgba(245,166,35,.35)" }}>
                <p className="text-sm font-medium" style={{ color: c.muted }}>Estimated added revenue per year{industry ? `, ${industry.name.toLowerCase()}` : ""}</p>
                <p className="display font-extrabold mt-1" style={{ color: c.gold, fontSize: "clamp(1.9rem, 5.4vw, 3.6rem)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>+{money(roi.annualImpact)}</p>
                <div className="mt-6">
                  <div className="result-row"><span style={{ color: c.muted }}>Revenue now, per month</span><span className="font-semibold">{money(roi.currentRevenue)}</span></div>
                  <div className="result-row"><span style={{ color: c.muted }}>Projected, per month</span><span className="font-semibold" style={{ color: c.cyan }}>{money(roi.projectedRevenue)}</span></div>
                  <div className="result-row"><span style={{ color: c.muted }}>Leads recovered from missed calls</span><span className="font-semibold">{roi.recoveredLeads} a month</span></div>
                  <div className="result-row"><span style={{ color: c.muted }}>Follow-up time handed off</span><span className="font-semibold">{roi.hoursSaved} hrs a week</span></div>
                  <div className="result-row" style={{ borderBottom: 0 }}><span style={{ color: c.muted }}>Faster first reply</span><span className="font-semibold">{roi.fasterReply}%</span></div>
                </div>
                <button onClick={() => scrollTo("contact")} className="btn btn-main w-full mt-5">Get a quote for these numbers</button>
                <p className="mt-4 text-xs leading-relaxed" style={{ color: c.muted }}>An estimate from the figures you entered, not a guarantee. Your audit replaces these assumptions with your real data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="band">
          <div className="wrap grid grid-cols-1 lg:grid-cols-[.8fr_1.2fr] gap-12">
            <div>
              <h2 className="h2">Questions owners ask us first.</h2>
              <p className="lede mt-5">Something else on your mind? Ask it on the audit call, or email <a className="underline" style={{ color: c.cyan }} href="mailto:support@revolutionai.pro">support@revolutionai.pro</a>.</p>
            </div>
            <div style={{ borderTop: `1px solid ${c.line}` }}>
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} style={{ borderBottom: `1px solid ${c.line}` }}>
                    <h3 style={{ fontFamily: "inherit", letterSpacing: 0 }}>
                      <button onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open} aria-controls={`faq-${i}`} className="w-full py-5 flex items-center justify-between gap-6 text-left text-[1.05rem] font-semibold">
                        {f.q}
                        {open ? <Minus size={20} className="shrink-0" style={{ color: c.cyan }} /> : <Plus size={20} className="shrink-0" style={{ color: c.muted }} />}
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                          <p className="pb-6 pr-10 leading-relaxed" style={{ color: c.muted }}>{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="band band-alt">
          <div className="wrap grid grid-cols-1 lg:grid-cols-[.85fr_1.15fr] gap-12 items-start">
            <div className="lg:sticky lg:top-28">
              <h2 className="h2">Book your free automation audit.</h2>
              <p className="lede mt-5">Thirty minutes, your real lead flow, and a straight answer on whether this is worth it for your business.</p>
              <ul className="mt-8 space-y-5">
                {[
                  ["We map how leads reach you", "Calls, forms, ads, referrals, and what happens next."],
                  ["We show you the gaps", "Where leads wait, get missed or never hear back."],
                  ["You get an ROI projection", "Built on your numbers, yours to keep."],
                  ["No obligation", "If it's not a fit, we'll say so."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3.5">
                    <Check size={20} className="shrink-0 mt-0.5" style={{ color: c.cyan }} />
                    <div><div className="font-semibold">{t}</div><div className="text-[.95rem]" style={{ color: c.muted }}>{d}</div></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel p-4 sm:p-7" style={{ boxShadow: "0 30px 100px -50px rgba(77,212,231,.5)" }}>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: c.muted }}>
                By submitting, you agree to our{" "}
                <Link to="/privacy" className="underline" style={{ color: c.cyan }}>Privacy Policy</Link>{" "}and{" "}
                <Link to="/terms" className="underline" style={{ color: c.cyan }}>Terms of Service</Link>. Message and data rates may apply for SMS.
              </p>
              <div className="w-full overflow-hidden" style={{ minHeight: `${iframeHeight}px` }}>
                <iframe
                  src={`https://api.leadconnectorhq.com/widget/form/${FORM_ID}`}
                  style={{ width: "100%", height: `${iframeHeight}px`, border: "none", borderRadius: "12px" }}
                  id={`inline-${FORM_ID}`}
                  data-layout="{'id':'INLINE'}"
                  data-trigger-type="alwaysShow"
                  data-trigger-value=""
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="Form 0"
                  data-height={iframeHeight}
                  data-layout-iframe-id={`inline-${FORM_ID}`}
                  data-form-id={FORM_ID}
                  title="Free automation audit request form"
                  className="w-full"
                  allow="clipboard-read; clipboard-write"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {stickyCta && (
          <motion.div className="sticky-cta md:hidden" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ duration: 0.25 }}>
            <button onClick={() => scrollTo("contact")} className="btn btn-main w-full">Book a free audit</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer>
        <div className="wrap py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-sm" style={{ color: c.muted, borderTop: `1px solid ${c.line}` }}>
          <nav className="flex flex-wrap gap-x-7 gap-y-3" aria-label="Footer">
            {NAV.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)} className="hover:text-white">{label}</button>)}
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </nav>
          <a href="mailto:support@revolutionai.pro" className="hover:text-white">support@revolutionai.pro</a>
        </div>
        <div className="footer-plate">
          <div className="wrap py-9 flex flex-col items-center text-center">
            <img src={LOGO_SRC} alt="RevolutionAI. Automate. Optimize. Thrive." width="190" height="190" loading="lazy" style={{ width: 190, height: 190 }} />
            <p className="mt-5 text-xs" style={{ color: "#3B5166" }}>© {new Date().getFullYear()} RevolutionAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
