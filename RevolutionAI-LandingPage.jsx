import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion, AnimatePresence, useReducedMotion, useScroll, useSpring, useTransform,
  useMotionValue, useMotionValueEvent, useInView, animate,
} from "framer-motion";
import {
  ArrowRight, ArrowDown, Pause,
  PhoneMissed, MessageSquare, PhoneCall, CalendarCheck, Star, Workflow, BarChart3,
  Menu, X, Plus, Check, RotateCcw, Voicemail, PhoneOff, Send, BellRing,
  ChevronLeft, Signal, Wifi, BatteryFull, Flame, Droplets, CloudRain, Play, Square,
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

/* Example conversations for the hero phone. Illustrative, not real customers. */
const SCENARIOS = [
  {
    id: "heat", chip: "Booked without you", label: "No heat", icon: Flame, who: "Maria R.", initials: "MR", clock: "7:46",
    thread: [
      { kind: "event", text: "Missed call · 7:42 PM" },
      { kind: "out", text: "Hi, thanks for calling. Sorry we missed you, we're out on a job. What can we help with?" },
      { kind: "in", text: "Furnace is blowing cold air. Can someone come out tomorrow?" },
      { kind: "out", text: "We can. I have 8–10 AM or 1–3 PM open tomorrow. Which works better?" },
      { kind: "in", text: "8–10 works" },
      { kind: "out", text: "You're booked for tomorrow, 8–10 AM. We'll text a reminder in the morning." },
      { kind: "booked", text: "Added to the calendar · 7:46 PM" },
    ],
  },
  {
    id: "roof", chip: "Flagged to you as urgent", label: "Roof leak", icon: CloudRain, who: "Dan K.", initials: "DK", clock: "6:19",
    thread: [
      { kind: "event", text: "Missed call · 6:15 AM" },
      { kind: "out", text: "Hi, thanks for calling. We're on a roof right now. What's going on at your place?" },
      { kind: "in", text: "Water coming through the ceiling after last night's storm" },
      { kind: "out", text: "Sorry to hear that. Is it an active leak right now, and what's the address?" },
      { kind: "in", text: "Yes, still dripping. 214 Maple Ct" },
      { kind: "out", text: "Got it. Marked urgent. A crew lead will call you within the hour, and you're on today's inspection list." },
      { kind: "booked", text: "Urgent job sent to the owner · 6:19 AM" },
    ],
  },
  {
    id: "drain", chip: "Booked without you", label: "Clogged drain", icon: Droplets, who: "Priya S.", initials: "PS", clock: "12:34",
    thread: [
      { kind: "event", text: "Missed call · 12:31 PM" },
      { kind: "out", text: "Hi, thanks for calling. We're with another customer. How can we help?" },
      { kind: "in", text: "Kitchen sink is backed up. How soon can you get here?" },
      { kind: "out", text: "We have an opening today between 3 and 5 PM. Want it?" },
      { kind: "in", text: "Yes please" },
      { kind: "out", text: "Done. You're set for today, 3–5 PM. We'll text when the tech is on the way." },
      { kind: "booked", text: "Added to the calendar · 12:34 PM" },
    ],
  },
];

/* Two different studies are reported in the same 2011 HBR article; they are labeled separately here. */
const PROOF = [
  {
    to: 7, prefix: "nearly", suffix: "×",
    text: "Firms that tried to contact a new web lead within an hour were nearly seven times as likely to qualify it as firms that waited even an hour longer.",
    source: "Harvard Business Review, 2011 (study of 1.25 million web leads at 42 B2B and B2C companies)",
    href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
  },
  {
    to: 23, suffix: "%",
    text: "of 2,241 U.S. companies sent a test web lead never responded to it at all.",
    source: "Harvard Business Review, 2011 (separate audit, same article)",
    href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
  },
  {
    to: 78, suffix: "%",
    text: "of 1,000 U.S. consumers surveyed say they have abandoned a business after an unanswered call.",
    source: "CallRail consumer survey, published 2025",
    href: "https://www.callrail.com/blog/missed-calls-cost-businesses-more-than-ever",
  },
];

/* Trade-specific pains. Picking a trade also sets the calculator and, where one exists, the hero call. */
const TRADES = [
  { id: "hvac", name: "HVAC", scn: "heat", scene: "No-heat and no-cool calls come in at night and on weekends, when nobody is at the phone", quote: "Replacement quotes", after: "Tune-up customers drift off between seasons", afterFix: "Seasonal tune-up reminders and review requests go out on their own." },
  { id: "plumbing", name: "Plumbing", scn: "drain", scene: "Emergency calls come in while you're under a sink with wet hands", quote: "Water heater and repipe quotes", after: "One-time customers rarely hear from you again", afterFix: "Past customers get a check-in and a review request without anyone remembering to send it." },
  { id: "roofing", name: "Roofing", scn: "roof", scene: "After a storm, the phone rings faster than anyone can answer", quote: "Inspection requests and estimates", after: "Finished roofs rarely turn into reviews or referrals", afterFix: "Finished jobs trigger a review request, so good work shows up where the next customer is looking." },
  { id: "electrical", name: "Electrical", scene: "Calls come in while you're in a panel or a crawl space", quote: "Panel upgrade and EV charger quotes", after: "Small jobs rarely become repeat customers", afterFix: "Past customers hear from you when it's time for the next project." },
  { id: "remodeling", name: "Remodeling", scene: "Big-ticket inquiries land while you're on a job site", quote: "Kitchen and bath estimates", after: "Long sales cycles stall after the first meeting", afterFix: "Follow-up keeps running for weeks, so the estimate stays alive.", afterTool: "Pipeline and follow-up" },
  { id: "landscaping", name: "Landscaping", scene: "Spring calls stack up faster than you can return them", quote: "Design and install quotes", after: "Seasonal customers forget to rebook", afterFix: "Renewal reminders go out before each season starts." },
  { id: "painting", name: "Painting", scene: "Estimate requests come in while you're on a ladder", quote: "Interior and exterior quotes", after: "Finished jobs rarely turn into reviews or referrals", afterFix: "Finished jobs trigger a review request, so good work shows up where the next customer is looking." },
  { id: "cleaning", name: "Cleaning", scene: "New inquiries arrive while every crew is in a home", quote: "Quote requests", after: "First-time customers don't become recurring ones", afterFix: "A rebooking offer and a review request follow a first clean." },
  { id: "pest", name: "Pest control", scene: "Urgent calls come in after hours", quote: "Inspection requests", after: "Service plans lapse without a reminder", afterFix: "Renewal reminders and review requests run automatically." },
  { id: "", name: "Another trade", scene: "Calls come in while you're with a customer", quote: "Quote requests", after: "Finished jobs don't turn into reviews or repeat work", afterFix: "Review requests and check-ins go out on their own after every job." },
];

const pains = (t) => [
  { pain: `${t.scene}.`, fix: "The caller gets a text from your number in seconds, so they can book with you before they try the next company.", tool: "Missed-call text-back and AI voice agent" },
  { pain: `${t.quote} sit unanswered until you're back at a desk.`, fix: "Form, ad and directory leads get a reply right away, then steady follow-up instead of silence.", tool: "Instant lead response" },
  { pain: `${t.after}.`, fix: t.afterFix, tool: t.afterTool || "Reviews and repeat work" },
];

/* General comparison of typical options, not a claim about any specific vendor. */
const OPTIONS = ["Do it yourself with software", "Hire front-office help", "RevolutionAI"];
const COMPARE = [
  ["Who sets it up", "You do", "You train them", "We do, start to finish"],
  ["Answers nights and weekends", "If you set it up", "During their shift", "Yes: text-back, plus the voice agent after hours"],
  ["Keeps following up with leads", "If you write every sequence", "When there's time", "Yes, automatically"],
  ["Asks customers for reviews", "If you set it up", "When someone remembers", "Yes, automatically"],
  ["Your time each week", "Hours of upkeep", "Managing a person", "A glance at the app"],
  ["What you pay for", "Software fees, plus your time", "Wages", "A fee quoted after the audit, no long-term contract"],
];

const BUILDS = [
  { id: "textback", solves: "For calls you can't answer on the job", icon: PhoneMissed, title: "Missed-call text-back", desc: "When you can't pick up, the caller gets a text from your number within seconds, and the conversation carries on by text from there." },
  { id: "voice", solves: "For after-hours and overflow calls", icon: PhoneCall, title: "AI voice agent", desc: "Answers the phone after hours, asks the questions you'd ask, and hands hot jobs to you." },
  { id: "booking", solves: "For phone tag and no-shows", icon: CalendarCheck, title: "Booking and reminders", desc: "Customers pick a time in a couple of taps. Confirmations and reminders cut down on no-shows." },
  { id: "lead", solves: "For web leads that go cold", icon: MessageSquare, title: "Instant lead response", desc: "Web forms, ads and directory leads get a text and an email right away, then steady follow-up." },
  { id: "reviews", solves: "For happy customers who never post", icon: Star, title: "Reviews and repeat work", desc: "Finished jobs trigger a review request. Past customers get a nudge when it's time." },
  { id: "pipeline", solves: "For estimates that slip through the cracks", icon: Workflow, title: "Pipeline that updates itself", desc: "Every lead lands in the right stage with a task, so nothing depends on memory." },
  { id: "report", solves: "For guessing at what's working", icon: BarChart3, title: "Plain reporting", desc: "Where leads came from, how fast they were answered, how many booked, how many closed." },
];

/* Illustrative side-by-side. Times are an example, not measured results. */
const WITHOUT = [
  { icon: Voicemail, time: "Sat 7:42 PM", text: "Call rings out and goes to voicemail." },
  { icon: PhoneOff, time: "Sat 7:43 PM", text: "The caller dials the next company on the list." },
  { icon: PhoneCall, time: "Mon 9:10 AM", text: "You call back. Someone else already has the job." },
  { icon: X, time: "After that", text: "You never find out what that job was worth." },
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
  { title: "Go live", desc: "Setup typically takes 5–7 business days, and ends with a walkthrough for your team." },
  { title: "We keep tuning", desc: "We watch the numbers and adjust the messages and timing based on what books jobs." },
];

/* Starting job values are rough placeholders for the slider, not benchmarks. */
const INDUSTRIES = [
  { id: "hvac", name: "HVAC", avgTicket: 3500, calls: 50 },
  { id: "plumbing", name: "Plumbing", avgTicket: 2800, calls: 50 },
  { id: "electrical", name: "Electrical", avgTicket: 3200, calls: 40 },
  { id: "roofing", name: "Roofing", avgTicket: 12000, calls: 30 },
  { id: "remodeling", name: "Remodeling", avgTicket: 25000, calls: 15 },
  { id: "landscaping", name: "Landscaping", avgTicket: 4500, calls: 30 },
  { id: "painting", name: "Painting", avgTicket: 4000, calls: 30 },
  { id: "cleaning", name: "Cleaning", avgTicket: 350, calls: 50 },
  { id: "pest", name: "Pest control", avgTicket: 400, calls: 50 },
];

const SLIDERS = [
  { key: "monthlyLeads", label: "Phone calls a month from people wanting work", min: 10, max: 500, step: 10 },
  { key: "missedCallPercent", label: "Share of those calls you miss", min: 5, max: 60, step: 5, suffix: "%" },
  { key: "closeRate", label: "Close rate when you do talk to them", min: 5, max: 80, step: 5, suffix: "%" },
  { key: "avgTicket", label: "Average job value", min: 100, max: 50000, step: 50, prefix: "$" },
  { key: "replyRate", label: "Missed callers a text wins back who would otherwise be lost (our assumption, change it)", min: 10, max: 60, step: 5, suffix: "%" },
];

const FAQS = [
  { q: "How long does setup take?", a: "Setup typically takes 5–7 business days. We do the heavy lifting. You give us access and answer a few questions about how you work." },
  { q: "Will it sound like a robot to my customers?", a: "Texts go out from your business number in wording we write with you, so they read like your office. The voice agent is AI. The sample call above is a scripted demo made with AI voices so you can hear the style. How your own agent introduces itself is decided with you during setup, and urgent jobs are handed to you." },
  { q: "Do I need to be technical?", a: "No. If you can use a smartphone, you can use this. We build everything for you, and the mobile app keeps your leads and conversations in one place." },
  { q: "What if I already have a CRM?", a: "We can connect to most existing tools or help you move your data over. We look at your setup during the free audit and recommend the simplest route." },
  { q: "Is there a contract?", a: "No long-term contracts. We would rather earn your business each month than lock you in, and you can cancel anytime." },
  { q: "How is pricing set?", a: "Every business is different, so we quote based on your lead volume, the pieces you need and your goals. You get a clear number after the audit." },
  { q: "What happens on the free audit?", a: "A 30-minute call where we review your current lead flow, point out the gaps, show how the automation would work for your business, and give you a custom ROI projection. No pressure." },
];

/* Counts only missed calls won back by a text-back. Every input, including the reply rate, is shown to the visitor. */
function estimate(v) {
  const missed = v.monthlyLeads * (v.missedCallPercent / 100);
  const jobsBack = missed * (v.replyRate / 100) * (v.closeRate / 100);
  const added = Math.round(jobsBack * v.avgTicket);
  const now = Math.round((v.monthlyLeads - missed) * (v.closeRate / 100) * v.avgTicket);
  return { missed, jobsBack, added, now, annual: added * 12, perCall: (v.closeRate / 100) * v.avgTicket };
}

const money = (n) => "$" + Math.round(n).toLocaleString("en-US");

/* Fades and lifts a block in the first time it scrolls into view. */
function Reveal({ children, delay = 0, className, as = "div", ...rest }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M className={className} {...rest}
      initial={reduce ? false : { opacity: 0, y: 26, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </M>
  );
}

function CountUp({ to, suffix = "" }) {
  return <span>{to}{suffix}</span>;
}

/* Tweens between values so calculator results roll instead of jumping. */
function Rolling({ value, format = (x) => Math.round(x).toLocaleString("en-US") }) {
  const reduce = useReducedMotion();
  const [d, setD] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (reduce) { setD(value); prev.current = value; return; }
    const ctl = animate(prev.current, value, { duration: 0.45, ease: "easeOut", onUpdate: setD });
    prev.current = value;
    return () => ctl.stop();
  }, [value, reduce]);
  return <>{format(d)}</>;
}

/* Tilts its child toward the pointer. */
function Tilt({ children, max = 7, className }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 140, damping: 16 });
  const sy = useSpring(ry, { stiffness: 140, damping: 16 });
  const onMove = (e) => {
    if (reduce || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };
  return (
    <div className={className} style={{ perspective: 1200 }} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div style={{ rotateX: sx, rotateY: sy, transformStyle: "preserve-3d" }}>{children}</motion.div>
    </div>
  );
}

const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

/* Sample call for the voice agent tile. Audio is AI-generated; captions follow the recording. */
const CUES = [{"who": "Caller", "text": "Hi, my AC quit and it's ninety degrees in here.", "start": 0.25, "end": 3.91}, {"who": "Agent", "text": "Sorry about that. I can get a tech out today. What's the address?", "start": 4.36, "end": 8.74}, {"who": "Caller", "text": "1420 Oak Street.", "start": 9.19, "end": 11.45}, {"who": "Agent", "text": "Thanks. I have 2 to 4 this afternoon. Want me to book it?", "start": 11.9, "end": 16.26}, {"who": "Caller", "text": "Yes, please.", "start": 16.71, "end": 18.41}, {"who": "Agent", "text": "Done. A confirmation text is on its way to you now.", "start": 18.86, "end": 22.71}];

function VoiceDemo() {
  const audio = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | loading | playing | paused | error
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(CUES[CUES.length - 1].end);
  const playing = status === "playing";
  const cue = (playing || status === "paused") && CUES.find((q) => t >= q.start - 0.15 && t <= q.end + 0.3);
  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => { if (audio.current) audio.current.pause(); setStatus("error"); }, 8000);
    return () => clearTimeout(timer);
  }, [status]);
  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (status === "loading") { el.pause(); setStatus("idle"); return; }
    if (status === "error") { el.load(); }
    if (el.paused) { setStatus("loading"); el.play().catch((err) => { if (!err || err.name !== "AbortError") setStatus("error"); }); } else el.pause();
  };
  const label = status === "loading" ? "Loading… tap to cancel" : playing ? "Pause" : status === "paused" ? "Resume" : status === "error" ? "Try again" : "Hear a sample call";
  return (
    <div className="vg voice">
      <audio ref={audio} src="/audio/sample-call.mp3" preload="none"
        onPlaying={() => setStatus("playing")} onWaiting={() => setStatus("loading")}
        onPause={(e) => { if (!e.currentTarget.ended) setStatus((x) => (x === "playing" ? "paused" : x)); }}
        onEnded={() => { setStatus("idle"); setT(0); }}
        onError={() => setStatus("error")}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration || dur)}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} />
      <div className={`vg-wave ${playing ? "live" : ""}`} aria-hidden="true">{Array.from({ length: 28 }).map((_, k) => <i key={k} style={{ animationDelay: `${(k % 7) * 0.12}s`, height: `${28 + ((k * 37) % 60)}%` }} />)}</div>
      <div className="voice-bar" aria-hidden="true"><i style={{ width: `${Math.min(100, (t / dur) * 100)}%` }} /></div>
      <div className="voice-row">
        <button type="button" className="voice-btn" onClick={toggle} aria-busy={status === "loading"}>
          {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}{label}
        </button>
        <div className="voice-cap" aria-live="polite">
          {status === "error" ? (
            <div>
              <p>The audio didn't load. Here is the same call as text:</p>
              <ul className="voice-script">{CUES.map((q) => <li key={q.start}><b style={{ color: q.who === "Agent" ? c.cyan : c.gold }}>{q.who}:</b> {q.text}</li>)}</ul>
            </div>
          ) : cue ? <p><b style={{ color: cue.who === "Agent" ? c.cyan : c.gold }}>{cue.who}:</b> {cue.text}</p>
            : <p>{status === "loading" ? "Fetching the recording…" : "23 seconds. Turn your sound on."}</p>}
        </div>
        <p className="voice-note">Scripted sample. Both voices are AI text-to-speech, not a recording of a live call.</p>
      </div>
    </div>
  );
}

function Vignette({ id }) {
  const [slot, setSlot] = useState(null);
  const [stars, setStars] = useState(5);
  const SLOTS = ["8–10 AM", "10–12", "1–3 PM", "3–5 PM"];
  const pop = { hidden: { opacity: 0, y: 10, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 } };
  if (id === "textback") return (
    <motion.div className="vg vg-thread" initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -15% 0px" }} transition={{ staggerChildren: 0.45 }} aria-hidden="true">
      <motion.span variants={pop} className="msg msg-event"><PhoneMissed size={12} />Missed call</motion.span>
      <motion.span variants={pop} className="msg msg-out">Sorry we missed you. How can we help?</motion.span>
      <motion.span variants={pop} className="msg msg-in">Need a quote on a new water heater</motion.span>
      <motion.span variants={pop} className="msg msg-out">Happy to. What's the address?</motion.span>
    </motion.div>
  );
  if (id === "voice") return <VoiceDemo />;
  if (id === "booking") return (
    <div className="vg">
      <div className="vg-slots" role="group" aria-label="Try picking a time">
        {SLOTS.map((t) => <button type="button" key={t} aria-pressed={slot === t} onClick={() => setSlot(slot === t ? null : t)}>{t}</button>)}
      </div>
      <p className="vg-note" aria-live="polite">{slot ? <><Check size={14} />Booked for {slot}. Reminder scheduled.</> : "Try it: tap a time."}</p>
    </div>
  );
  if (id === "lead") return (
    <motion.div className="vg vg-sent" initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ staggerChildren: 0.3, delayChildren: 0.2 }} aria-hidden="true">
      <motion.span variants={pop}><Check size={14} />Text sent</motion.span>
      <motion.span variants={pop}><Check size={14} />Email sent</motion.span>
      <motion.span variants={pop}><Check size={14} />Follow-up queued</motion.span>
    </motion.div>
  );
  if (id === "reviews") return (
    <div className="vg vg-stars" role="group" aria-label="Try rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button type="button" key={n} aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-pressed={stars >= n} onClick={() => setStars(stars === n ? n - 1 : n)} whileHover={{ scale: 1.25, rotate: -8 }} whileTap={{ scale: 0.9 }}>
          <Star size={22} fill={stars >= n ? "currentColor" : "none"} />
        </motion.button>
      ))}
    </div>
  );
  if (id === "pipeline") return (
    <div className="vg vg-pipe" aria-hidden="true">
      {[["New", 2], ["Quoted", 2], ["Booked", 3]].map(([l, n]) => <div key={l}><b>{l}</b>{Array.from({ length: n }).map((_, i) => <i key={i} />)}</div>)}
      <span className="runner" />
    </div>
  );
  if (id === "report") return (
    <div className="vg vg-bars" aria-hidden="true">
      {[34, 52, 41, 66, 58, 79, 88].map((h, i) => (
        <motion.i key={i} initial={{ height: "6%" }} whileInView={{ height: `${h}%` }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
      ))}
    </div>
  );
  return null;
}

/* The chat widget loads only when asked for, so it never covers the page or blocks taps by default. */
function useChat() {
  const [state, setState] = useState("idle"); // idle | loading | ready | error
  const open = () => {
    if (state === "error") { window.location.href = "mailto:support@revolutionai.pro"; return; }
    const api = window.leadConnector && window.leadConnector.chatWidget;
    if (state === "ready") { try { if (api && api.openWidget) api.openWidget(); } catch (e) { /* widget has its own bubble */ } return; }
    if (state !== "idle") return;
    setState("loading");
    const sc = document.createElement("script");
    sc.src = "https://widgets.leadconnectorhq.com/loader.js";
    sc.setAttribute("data-resources-url", "https://widgets.leadconnectorhq.com/chat-widget/loader.js");
    sc.setAttribute("data-widget-id", "6976c17e639c142ec5a07dbc");
    sc.onerror = () => setState("error");
    sc.onload = () => {
      let n = 0;
      const timer = setInterval(() => {
        n += 1;
        const w = window.leadConnector && window.leadConnector.chatWidget;
        if (document.querySelector("chat-widget")) {
          try { if (w && w.openWidget) w.openWidget(); } catch (e) { /* widget opens on its own bubble */ }
          if ((w && w.openWidget) || n > 16) { clearInterval(timer); setState("ready"); }
        } else if (n > 60) { clearInterval(timer); setState("error"); }
      }, 250);
    };
    document.body.appendChild(sc);
  };
  return { state, open };
}

function PhoneDemo({ sid, onPick }) {
  const reduce = useReducedMotion();
  const sc = SCENARIOS.find((s) => s.id === sid);
  const thread = sc.thread;
  const [shown, setShown] = useState(reduce ? thread.length : 1);
  const scroller = useRef(null);
  const done = shown >= thread.length;

  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setShown(reduce ? thread.length : 1);
  }, [sid]);
  const pick = onPick;

  useEffect(() => {
    if (reduce || done) return;
    const next = thread[shown];
    const delay = next.kind === "in" ? 1700 : next.kind === "out" ? 1300 : 800;
    const t = setTimeout(() => setShown((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [shown, reduce, done, thread]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown, sid]);

  const next = thread[shown];
  const typing = !done && next && (next.kind === "in" || next.kind === "out");

  return (
    <div className="phone-wrap">
      <div className="scn" role="group" aria-label="Pick a call to watch">
        {SCENARIOS.map((s) => (
          <button type="button" key={s.id} aria-pressed={sid === s.id} onClick={() => pick(s.id)}>
            {sid === s.id && <motion.span layoutId="scn-pill" className="scn-pill" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            <span className="scn-label"><s.icon size={14} />{s.label}</span>
          </button>
        ))}
      </div>
      <Tilt>
        <div className="phone-stage">
          <div className="phone" role="img" aria-label={`Example text conversation for a ${sc.label.toLowerCase()} call: the missed call is answered by text and handled within minutes.`}>
            <div className="phone-status">
              <span>{done ? sc.clock : thread[0].text.split("· ")[1].replace(/ [AP]M/, "")}</span>
              <span className="flex items-center gap-1.5"><Signal size={13} /><Wifi size={13} /><BatteryFull size={16} /></span>
            </div>
            <div className="phone-head">
              <ChevronLeft size={18} style={{ color: c.cyan }} />
              <div className="phone-avatar">{sc.initials}</div>
              <div>
                <div className="text-[13px] font-semibold leading-tight">{sc.who}</div>
                <div className="text-[11px]" style={{ color: c.muted }}>New caller</div>
              </div>
            </div>
            <div className="phone-thread" ref={scroller}>
              {thread.slice(0, shown).map((m, i) => (
                <motion.div key={`${sid}-${i}`} initial={reduce ? false : { opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.28 }} className={`msg msg-${m.kind}`}>
                  {m.kind === "event" && <PhoneMissed size={13} />}
                  {m.kind === "booked" && <CalendarCheck size={13} />}
                  <span>{m.text}</span>
                </motion.div>
              ))}
              {typing && <div className={`msg msg-${next.kind} typing`} aria-hidden="true"><i /><i /><i /></div>}
            </div>
          </div>
          <span className="chip-float chip-a" aria-hidden="true"><Send size={13} />Texted back in seconds</span>
          <AnimatePresence>
            {done && (
              <motion.span className="chip-float chip-b" aria-hidden="true" initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                <Check size={13} />{sc.chip}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Tilt>
      <div className="phone-caption">
        <span>Example conversations. Yours use your business name and your wording.</span>
        {!reduce && <button type="button" onClick={() => setShown(1)} className="replay" disabled={!done}><RotateCcw size={13} /> Replay</button>}
      </div>
    </div>
  );
}

export default function RevolutionAILanding() {
  const reduce = useReducedMotion();
  const [navOpen, setNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(() => (typeof window !== "undefined" && window.innerWidth >= 1024 ? FAQS.map((_, i) => i) : [0]));
  const [industryId, setIndustryId] = useState("hvac");
  const [vals, setVals] = useState({ monthlyLeads: 50, missedCallPercent: 30, closeRate: 25, avgTicket: 3500, replyRate: 20 });
  const [iframeHeight, setIframeHeight] = useState(1028);
  const [stickyCta, setStickyCta] = useState(false);
  const [mode, setMode] = useState("without");
  const [step, setStep] = useState(0);
  const chat = useChat();
  const [showAll, setShowAll] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const el = document.getElementById("audit-form");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setFormInView(e.isIntersecting), { rootMargin: "0px 0px -10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const [spy, setSpy] = useState("");
  const [sid, setSid] = useState(SCENARIOS[0].id);
  const [tradeId, setTradeId] = useState("hvac");
  const trade = TRADES.find((t) => t.id === tradeId);

  useEffect(() => {
    const els = [...NAV.map(([, id]) => id), "contact"].map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setSpy(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const heroGlow = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--hx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--hy", `${e.clientY - r.top}px`);
  };

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  const heroY = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 140]);

  const menuBtn = useRef(null);
  const flowRef = useRef(null);
  const { scrollYProgress: flowP } = useScroll({ target: flowRef, offset: ["start 78%", "end 62%"] });
  const flowFill = useSpring(flowP, { stiffness: 120, damping: 26 });
  useMotionValueEvent(flowP, "change", (v) => setStep(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length * 1.02))));

  const shotRef = useRef(null);
  const { scrollYProgress: shotP } = useScroll({ target: shotRef, offset: ["start end", "end start"] });
  const shotY = useTransform(shotP, [0, 1], reduce ? ["0%", "0%"] : ["-7%", "7%"]);

  useEffect(() => {
    const onScroll = () => {
      const contact = document.getElementById("contact");
      const nearForm = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
      setStickyCta(window.scrollY > 640 && !nearForm);
      if (window.scrollY < 500) setSpy("");
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
    const wasOpen = navOpen;
    setNavOpen(false);
    const go = () => {
      const el = document.getElementById(id === "contact" && window.innerWidth < 1024 ? "audit-form" : id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    if (wasOpen) setTimeout(go, 80); else go();
  };

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e) => { if (e.key === "Escape") { setNavOpen(false); if (menuBtn.current) menuBtn.current.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const pickIndustry = (id) => {
    setIndustryId(id);
    const ind = INDUSTRIES.find((i) => i.id === id);
    if (ind) setVals((p) => ({ ...p, avgTicket: ind.avgTicket, monthlyLeads: ind.calls }));
  };

  const pickTrade = (t) => {
    setTradeId(t.id);
    if (t.scn) setSid(t.scn);
    if (t.id) pickIndustry(t.id); else { setIndustryId(""); setVals((p) => ({ ...p, avgTicket: 2500, monthlyLeads: 50 })); }
  };

  const industry = INDUSTRIES.find((i) => i.id === industryId);
  const roi = estimate(vals);
  const nowPct = roi.now + roi.added > 0 ? Math.max(8, (roi.now / (roi.now + roi.added)) * 100) : 8;
  const one = (x) => (Math.round(x * 10) / 10).toLocaleString("en-US");
  const lane = mode === "with" ? WITH : WITHOUT;
  const words = (text, start) => text.split(" ").map((w, i) => (
    <span className="word" key={w + i}><motion.span initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.08 * (start + i), ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span></span>
  ));

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
        @media (prefers-reduced-motion: reduce) { .site *, .site *::before, .site *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } .orbit::after { display: none; } }
        .site { background-image: radial-gradient(rgba(255,255,255,.055) 1px, transparent 1px); background-size: 30px 30px; }
        .navlink { color: ${c.muted}; position: relative; transition: color .2s; }
        .navlink[aria-current="true"] { color: ${c.text}; }
        .navlink[aria-current="true"]::after { content: ""; position: absolute; left: 14px; right: 14px; bottom: 2px; height: 2px; border-radius: 2px; background: ${c.cyan}; }
        .hero-cursor { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(420px circle at var(--hx, 70%) var(--hy, 40%), rgba(77,212,231,.13), transparent 65%); }
        @media (hover: none) { .hero-cursor { display: none; } }
        .tile .art { width: 68px; height: 68px; object-fit: contain; margin: -6px 0 0 -6px; filter: drop-shadow(0 10px 18px rgba(0,0,0,.55)); transition: transform .45s cubic-bezier(.22,1,.36,1); }
        .tile:hover .art { transform: translateY(-4px) rotate(-6deg) scale(1.08); }
        .tile .tile-copy h3 { margin-top: 10px; }
        .step-art { float: right; margin: -4px -4px 8px 12px; width: 56px; height: 56px; object-fit: contain; opacity: .28; filter: grayscale(.6); transition: opacity .4s, filter .4s, transform .5s cubic-bezier(.22,1,.36,1); }
        .flow li.lit .step-art { opacity: 1; filter: drop-shadow(0 8px 16px rgba(0,0,0,.5)); transform: rotate(-5deg) scale(1.06); }
        .voice { display: grid; gap: 12px; }
        .vg-wave i { animation-play-state: paused; opacity: .45; } .vg-wave.live i { animation-play-state: running; opacity: 1; }
        .voice-row { display: grid; gap: 8px; }
        .voice-btn { display: inline-flex; align-items: center; gap: 8px; width: fit-content; padding: 9px 15px; border-radius: 999px; font-size: .86rem; font-weight: 700; background: ${c.cyan}; color: #04121A; }
        .voice-cap { min-height: 2.9em; font-size: .86rem; line-height: 1.4; color: ${c.muted}; }
        .voice-cap span { display: block; }
        .percall { margin-top: 16px; padding: 12px 14px; border-radius: 12px; font-size: .92rem; line-height: 1.45; background: rgba(245,166,35,.09); border: 1px solid rgba(245,166,35,.25); }
        .percall b { color: ${c.gold}; font-variant-numeric: tabular-nums; }
        .contact { position: relative; overflow: hidden; }
        .contact-bg { position: absolute; inset: 0; background: url(/img/cta-backdrop.jpg) center / cover no-repeat; opacity: .5; -webkit-mask-image: linear-gradient(180deg, transparent, #000 22%, #000 70%, transparent); mask-image: linear-gradient(180deg, transparent, #000 22%, #000 70%, transparent); }
        .trust { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; font-size: .9rem; line-height: 1.4; color: ${c.muted}; }
        .trust b { color: ${c.text}; }
        .trust img { width: 44px; height: 44px; object-fit: contain; }
        .foot { position: relative; overflow: hidden; border-top: 1px solid ${c.line}; background: radial-gradient(900px 420px at 50% 0%, rgba(77,212,231,.12), transparent 70%), ${c.bg}; }
        .foot-in { position: relative; padding-top: 64px; padding-bottom: 28px; display: grid; gap: 40px; }
        .foot-brand { display: flex; align-items: center; gap: 22px; }
        .foot-brand img { width: 108px; height: 108px; flex: none; filter: drop-shadow(0 0 34px rgba(77,212,231,.45)) drop-shadow(0 14px 26px rgba(0,0,0,.6)); }
        .foot-word { font-size: clamp(1.9rem, 5vw, 2.8rem); font-weight: 700; line-height: 1; }
        .foot-tag { margin-top: 8px; font-weight: 700; font-size: clamp(.95rem, 2.4vw, 1.15rem); }
        .foot-cols { display: grid; gap: 26px; padding-top: 28px; border-top: 1px solid ${c.line}; font-size: .92rem; color: ${c.muted}; }
        @media (min-width: 860px) { .foot-cols { grid-template-columns: 1fr auto; align-items: start; } .foot-base { text-align: right; } }
        .foot-links { display: flex; flex-wrap: wrap; gap: 12px 28px; }
        .foot-links > *, .foot-base a { transition: color .2s; } .foot-links > *:hover, .foot-base a:hover { color: ${c.text}; }
        .foot-base { display: grid; gap: 8px; }
        @media (max-width: 859px) { .foot-base { padding-right: 84px; } }
        .foot-mega { font-weight: 800; font-size: 9.2vw; line-height: 1; white-space: nowrap; text-align: center; padding: 0 0 .18em; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,.14); background: linear-gradient(180deg, rgba(77,212,231,.2), rgba(77,212,231,.04)); -webkit-background-clip: text; background-clip: text; user-select: none; }
        @media (max-width: 767px) { .foot-mega { display: none; } .foot-in { padding-bottom: 92px; } }
        .site { overflow-x: clip; }
        .scn { width: 100%; max-width: 348px; } .scn button { flex: 1 1 auto; padding: 8px 8px; } .scn-label { justify-content: center; width: 100%; }
        @media (max-width: 420px) { .scn button { font-size: .76rem; } .scn-label svg { display: none; } }
        .foot-brand { flex-wrap: wrap; } .foot-brand > div { min-width: 0; flex: 1 1 180px; }
        @media (max-width: 480px) { .foot-brand { gap: 16px; } .foot-brand img { width: 76px; height: 76px; } .foot-word { font-size: clamp(1.45rem, 7.4vw, 2rem); } }
        .solves { display: inline-block; margin: 12px 0 8px; padding: 4px 10px; border-radius: 999px; font-size: .76rem; font-weight: 700; color: ${c.gold}; background: rgba(245,166,35,.1); }
        .tile .tile-copy h3 { margin-top: 0; }
        .leaks { display: grid; gap: 14px; }
        .leaks li { display: grid; gap: 10px; align-items: stretch; }
        @media (min-width: 768px) { .leaks li { grid-template-columns: 1fr 44px 1.15fr; gap: 0; } }
        .leak, .plug { border-radius: 18px; padding: 20px 22px; border: 1px solid ${c.line}; background: ${c.surface}; }
        .leak { border-color: rgba(255,120,100,.28); background: linear-gradient(180deg, rgba(255,120,100,.07), ${c.surface} 70%); }
        .plug { border-color: rgba(77,212,231,.4); background: linear-gradient(180deg, rgba(77,212,231,.1), ${c.surface} 70%); }
        .leaks .tag { display: block; font-size: .76rem; font-weight: 700; margin-bottom: 6px; }
        .leak .tag { color: #FF9A8B; } .plug .tag { color: ${c.cyan}; }
        .leaks p { font-size: 1.04rem; line-height: 1.45; font-weight: 500; }
        .plug small { display: block; margin-top: 10px; font-size: .8rem; color: ${c.gold}; font-weight: 600; }
        .leak-arrow { display: grid; place-items: center; color: ${c.muted}; }
        .vs { border: 1px solid ${c.line}; border-radius: 22px; overflow: hidden; background: ${c.surface}; }
        .vs-head, .vs-row { display: grid; grid-template-columns: 1.1fr 1fr 1fr 1.15fr; }
        .vs-head span { padding: 18px 18px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: .98rem; line-height: 1.2; }
        .vs-row span { padding: 16px 18px; border-top: 1px solid ${c.line}; font-size: .95rem; line-height: 1.4; color: ${c.muted}; }
        .vs-row .vs-label { color: ${c.text}; font-weight: 600; }
        .vs .us { background: rgba(77,212,231,.09); color: ${c.text}; font-weight: 600; }
        .vs-head .us { color: ${c.cyan}; }
        .vs-row .us { display: flex; align-items: flex-start; gap: 8px; } .vs-row .us svg { color: ${c.cyan}; flex: none; margin-top: 3px; }
        @media (max-width: 767px) {
          .vs-head { display: none; }
          .vs-row { grid-template-columns: 1fr; padding: 16px 16px 14px; border-top: 1px solid ${c.line}; } .vs-row:first-of-type { border-top: 0; }
          .vs-row span { padding: 0; border: 0; }
          .vs-row .vs-label { font-size: 1.02rem; margin-bottom: 8px; }
          .vs-row [data-col] { padding: 7px 0; } .vs-row [data-col]::before { content: attr(data-col); display: block; font-size: .72rem; font-weight: 600; color: ${c.muted}; opacity: .8; }
          .vs-row .us { display: block; margin-top: 6px; padding: 10px 12px; border-radius: 12px; } .vs-row .us svg { display: none; } .vs-row .us::before { color: ${c.cyan}; opacity: 1; }
        }
        .voice-bar { height: 4px; border-radius: 2px; background: rgba(255,255,255,.12); overflow: hidden; } .voice-bar i { display: block; height: 100%; background: ${c.cyan}; transition: width .25s linear; }
        .hero .btn { min-height: 52px; } @media (max-width: 480px) { .hero .btn { width: 100%; } }
        .scn button { min-height: 44px; } .replay { min-height: 44px; padding: 0 6px; margin: -12px -6px; }
        .chip { min-height: 44px; }
        .vg-stars button { width: 44px; height: 44px; place-items: center; margin: 0 -8px 0 -3px; }
        .foot-links > * { padding: 8px 0; }
        .ai-tag { position: absolute; z-index: 1; top: 12px; right: 12px; padding: 4px 9px; border-radius: 999px; font-size: .7rem; font-weight: 600; color: #DDE5EE; background: rgba(4,8,16,.62); backdrop-filter: blur(6px); }
        .voice-cap { min-height: 2.9em; } .voice-cap p { margin: 0; }
        .voice-script { margin-top: 6px; display: grid; gap: 4px; }
        .voice-note { font-size: .74rem; color: ${c.muted}; opacity: .85; }
        .math { margin-top: 14px; padding: 12px 14px; border-radius: 12px; font-size: .88rem; line-height: 1.5; color: ${c.muted}; background: rgba(255,255,255,.04); border: 1px solid ${c.line}; font-variant-numeric: tabular-nums; }
        .math b { color: ${c.gold}; white-space: nowrap; }
        .cmp-new { width: 100%; }
        .next { display: grid; gap: 8px; margin: 4px 0 16px; counter-reset: nx; font-size: .9rem; line-height: 1.4; color: ${c.muted}; }
        .next li { counter-increment: nx; display: grid; grid-template-columns: 26px 1fr; gap: 10px; align-items: start; }
        .next li::before { content: counter(nx); width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-size: .78rem; font-weight: 700; color: #04121A; background: ${c.cyan}; }
        .next b { color: ${c.text}; }
        .formclip { overflow: hidden; border-radius: 14px; }
        .formclip { max-width: 640px; margin: 0 auto; } .formclip iframe { display: block; width: calc(100% + 32px) !important; max-width: none; margin: -44px -16px -12px; }
        .chat-fab { position: fixed; right: 16px; bottom: 16px; z-index: 45; width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; color: ${c.cyan}; background: ${c.surface}; border: 1px solid rgba(77,212,231,.5); box-shadow: 0 14px 34px -12px rgba(0,0,0,.8); transition: transform .15s, background .15s; }
        .chat-fab:hover { transform: translateY(-2px); background: #14213B; }
        .spin { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(77,212,231,.3); border-top-color: ${c.cyan}; animation: spin1 .8s linear infinite; }
        @keyframes spin1 { to { transform: rotate(360deg); } }
        .sticky-cta { right: 84px; }
        .proof .fig small { font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; color: ${c.muted}; letter-spacing: 0; }
        .site input[type="range"] { height: 34px; }
        .tile-textback .vg-thread { flex: 1 1 auto; justify-content: center; }
        @media (max-width: 699px) { .tile-lead .vg, .tile-pipeline .vg, .tile-report .vg { display: none; } .tile { gap: 14px; padding: 22px; } }
        .vs-more { margin-top: 14px; min-height: 44px; padding: 0 4px; font-weight: 600; font-size: .92rem; color: ${c.cyan}; text-decoration: underline; text-underline-offset: 3px; }
        @media (max-width: 767px) { .vs:not(.all) .vs-row [data-col]:not(.us) { display: none; } .vs:not(.all) .vs-row .us { margin-top: 0; } .vs:not(.all) .vs-row .us::before { display: none; } .vs-row { padding: 14px 16px 12px; } }
        .sticky-cta { left: 0; right: 0; bottom: 0; padding: 10px 76px calc(10px + env(safe-area-inset-bottom)) 12px; background: rgba(7,12,24,.9); backdrop-filter: blur(12px); border-top: 1px solid ${c.line}; filter: none; }
        @media (max-width: 767px) { .chat-fab { width: 48px; height: 48px; right: 14px; bottom: calc(11px + env(safe-area-inset-bottom)); } }
        #audit-form:focus, section:focus, [tabindex="-1"]:focus { outline: none; }
        .iconbtn { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; color: ${c.cyan}; border: 1px solid rgba(255,255,255,.14); transition: background .15s, border-color .15s; }
        .iconbtn:hover { background: rgba(255,255,255,.06); border-color: ${c.cyan}; }
        .sticky-cta { padding-right: 12px; }
        .scrim { position: fixed; inset: 0; z-index: 40; background: rgba(4,8,16,.74); backdrop-filter: blur(6px); }
        .hero-ai { position: absolute; left: 20px; bottom: 12px; z-index: 1; font-size: .68rem; color: rgba(221,229,238,.6); }
        .voice-btn { min-height: 44px; }
        .proof a, .foot-base a { display: inline-block; padding: 6px 0; }
        @media (min-width: 700px) and (max-width: 1039px) { .tile-pipeline { grid-column: span 2; flex-direction: row; align-items: center; } .tile-pipeline .tile-copy { flex: 1 1 52%; } .tile-pipeline .vg { flex: 1 1 48%; } }
        @property --ang { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        @keyframes spin-ang { to { --ang: 360deg; } }
        .orbit { position: relative; }
        .orbit::after { content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1.5px; pointer-events: none;
          background: conic-gradient(from var(--ang), transparent 0 62%, ${c.cyan} 80%, ${c.gold} 94%, transparent 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude;
          animation: spin-ang 6s linear infinite; }
        .tile.orbit::after { inset: 0; opacity: 0; transition: opacity .3s; } .tile.orbit:hover::after { opacity: 1; }
        .btn-main { position: relative; overflow: hidden; }
        .btn-main::after { content: ""; position: absolute; top: 0; bottom: 0; left: -60%; width: 40%; transform: skewX(-20deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); transition: left .55s ease; }
        .btn-main:hover::after { left: 130%; }
        .aurora { position: absolute; inset: -20% -10% auto -10%; height: 120%; pointer-events: none; filter: blur(70px); opacity: .55; }
        .aurora i { position: absolute; border-radius: 50%; }
        .aurora i:nth-child(1) { width: 46%; height: 60%; right: 2%; top: 14%; background: rgba(77,212,231,.42); animation: drift 14s ease-in-out infinite alternate; }
        .aurora i:nth-child(2) { width: 34%; height: 46%; right: 22%; top: 46%; background: rgba(245,166,35,.22); animation: drift 18s ease-in-out infinite alternate-reverse; }
        @keyframes drift { from { transform: translate3d(-6%, -4%, 0) scale(1); } to { transform: translate3d(8%, 6%, 0) scale(1.18); } }
        .hero h1 .word { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .12em; margin-bottom: -.12em; margin-right: .26em; }
        .hero h1 .word > span { display: inline-block; }
        .hero h1 em .word > span { color: ${c.gold}; }
        .scn { display: flex; gap: 4px; padding: 4px; margin: 0 auto 18px; width: fit-content; max-width: 100%; border-radius: 999px; background: rgba(7,12,24,.7); border: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(10px); }
        .scn button { position: relative; padding: 8px 13px; border-radius: 999px; font-size: .82rem; font-weight: 600; color: ${c.muted}; white-space: nowrap; }
        .scn button[aria-pressed="true"] { color: #04121A; }
        .scn-pill { position: absolute; inset: 0; border-radius: 999px; background: ${c.cyan}; }
        .scn-label { position: relative; display: inline-flex; align-items: center; gap: 6px; }
        .phone-stage { position: relative; transform-style: preserve-3d; }
        .chip-float { position: absolute; display: none; align-items: center; gap: 6px; padding: 9px 14px; border-radius: 999px; font-size: .8rem; font-weight: 600; white-space: nowrap; background: rgba(14,23,43,.92); border: 1px solid rgba(255,255,255,.16); box-shadow: 0 18px 40px -16px rgba(0,0,0,.9); transform: translateZ(60px); }
        @media (min-width: 1280px) { .chip-float { display: inline-flex; } }
        .chip-a { left: -128px; top: 150px; color: ${c.cyan}; animation: bob 5s ease-in-out infinite; }
        .chip-b { left: -150px; bottom: 150px; color: ${c.gold}; }
        @keyframes bob { 0%, 100% { margin-top: 0; } 50% { margin-top: -10px; } }
        .ticker { overflow: hidden; border-bottom: 1px solid ${c.line}; -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
        .ticker-track { display: flex; width: max-content; gap: 44px; padding: 18px 0; animation: slide 46s linear infinite; }
        .ticker:hover .ticker-track { animation-play-state: paused; }
        .ticker span { display: inline-flex; align-items: center; gap: 44px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.05rem; color: rgba(244,247,251,.55); white-space: nowrap; }
        .ticker span::after { content: ""; width: 6px; height: 6px; border-radius: 50%; background: ${c.gold}; }
        @keyframes slide { to { transform: translateX(-50%); } }
        .proof .fig { font-variant-numeric: tabular-nums; }
        .switch { display: inline-flex; padding: 5px; border-radius: 999px; border: 1px solid rgba(255,255,255,.16); background: ${c.surface}; }
        .switch button { position: relative; padding: 11px 20px; border-radius: 999px; font-weight: 600; font-size: .95rem; color: ${c.muted}; }
        .switch button[aria-pressed="true"] { color: #04121A; }
        .switch .pill { position: absolute; inset: 0; border-radius: 999px; }
        .switch .lbl { position: relative; }
        .rail { position: relative; margin-top: 26px; padding: 24px 22px; border-radius: 20px; border: 1px solid ${c.line}; background: ${c.surface}; min-height: 318px; transition: border-color .4s, background .4s; }
        .rail.on { border-color: rgba(77,212,231,.5); background: linear-gradient(180deg, rgba(77,212,231,.1), ${c.surface} 65%); }
        .rail ol { display: grid; gap: 18px; }
        .rail li { display: grid; grid-template-columns: 38px 1fr; gap: 14px; align-items: start; }
        .rail .dot { width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; background: rgba(255,120,100,.12); color: #FF9A8B; }
        .rail.on .dot { background: rgba(77,212,231,.14); color: ${c.cyan}; }
        .rail time { display: block; font-size: .8rem; font-weight: 700; color: #C8D0DC; font-variant-numeric: tabular-nums; }
        .rail.on time { color: ${c.gold}; }
        .rail p { font-size: 1rem; line-height: 1.45; }
        .shot img { top: -8%; height: 116%; }
        .vg-slots button { text-align: center; padding: 11px 6px; border-radius: 12px; font-size: .86rem; font-weight: 600; border: 1px solid rgba(255,255,255,.14); color: ${c.muted}; transition: background .15s, color .15s, border-color .15s, transform .15s; }
        .vg-slots button:hover { border-color: ${c.cyan}; color: ${c.text}; transform: translateY(-1px); }
        .vg-slots button[aria-pressed="true"] { background: ${c.cyan}; border-color: ${c.cyan}; color: #04121A; }
        .vg-note { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: .8rem; font-weight: 600; color: ${c.cyan}; min-height: 1.4em; }
        .vg-stars button { color: ${c.gold}; display: grid; }
        .vg-pipe { position: relative; }
        .vg-pipe .runner { position: absolute; left: 0; top: 22px; width: calc((100% - 16px) / 3); height: 9px; border-radius: 4px; background: ${c.gold}; animation: run 4.5s ease-in-out infinite; }
        @keyframes run { 0%, 18% { transform: translateX(0); opacity: 0; } 24% { opacity: 1; } 40%, 52% { transform: translateX(calc(100% + 8px)); } 74%, 90% { transform: translateX(calc(200% + 16px)); opacity: 1; } 100% { transform: translateX(calc(200% + 16px)); opacity: 0; } }
        .flowwrap { position: relative; } .flow { display: grid; gap: 14px; }
        @media (min-width: 900px) { .flow { grid-template-columns: repeat(4, 1fr); gap: 18px; padding-top: 34px; } }
        .flow-track { position: absolute; background: rgba(255,255,255,.1); border-radius: 2px; overflow: hidden; left: 35px; top: 0; bottom: 0; width: 2px; }
        .flow-track > div { width: 100%; height: 100%; background: linear-gradient(180deg, ${c.cyan}, ${c.gold}); transform-origin: 50% 0; }
        @media (min-width: 900px) { .flow-track { left: 0; right: 0; top: 0; bottom: auto; width: auto; height: 2px; } .flow-track > div { background: linear-gradient(90deg, ${c.cyan}, ${c.gold}); transform-origin: 0 50%; } }
        .flow li { position: relative; padding: 22px 22px 24px 72px; border-radius: 20px; border: 1px solid transparent; transition: background .35s, border-color .35s, opacity .35s, transform .35s; opacity: .5; }
        @media (min-width: 900px) { .flow li { padding: 26px 22px; } }
        .flow li.lit { opacity: 1; background: ${c.surface}; border-color: rgba(77,212,231,.35); }
        @media (min-width: 900px) { .flow li.lit { transform: translateY(-4px); } }
        .flow .num { position: absolute; left: 14px; top: 20px; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font-family: 'Syne', sans-serif; font-weight: 700; background: ${c.bg}; border: 2px solid rgba(255,255,255,.2); color: ${c.muted}; transition: background .35s, color .35s, border-color .35s, box-shadow .35s; }
        @media (min-width: 900px) { .flow .num { position: static; margin-bottom: 18px; } }
        .flow li.lit .num { background: ${c.cyan}; border-color: ${c.cyan}; color: #04121A; box-shadow: 0 0 0 6px rgba(77,212,231,.16); }
        .site input[type="range"]::-webkit-slider-runnable-track { background: linear-gradient(90deg, ${c.cyan} var(--p, 0%), rgba(255,255,255,.12) var(--p, 0%)); }
        .site input[type="range"]::-moz-range-progress { height: 6px; background: ${c.cyan}; border-radius: 3px; }
        .cmp { display: grid; gap: 10px; margin-top: 22px; }
        .cmp-row { display: grid; grid-template-columns: 92px 1fr; align-items: center; gap: 12px; font-size: .82rem; color: ${c.muted}; }
        .cmp-bar { height: 30px; border-radius: 9px; display: flex; align-items: center; justify-content: flex-end; padding: 0 10px; font-weight: 700; font-size: .82rem; font-variant-numeric: tabular-nums; white-space: nowrap; min-width: 86px; }
        .cmp-now { background: rgba(255,255,255,.12); color: ${c.text}; }
        .cmp-new { background: linear-gradient(90deg, ${c.cyan}, ${c.gold}); color: #04121A; }
        .faq-item { transition: background .25s; border-radius: 14px; }
        .faq-item:hover { background: rgba(255,255,255,.03); }
        .faq-plus { transition: transform .3s ease, color .3s; }
        .faq-item.open .faq-plus { transform: rotate(135deg); color: ${c.cyan}; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(7,12,24,.86)", borderBottom: `1px solid ${c.line}` }}>
        <div className="wrap flex items-center justify-between h-16">
          <a href="#top" className="flex items-center gap-3" aria-label="RevolutionAI home">
            <span className="w-11 h-11 shrink-0"><img src="/apple-touch-icon.png" alt="" width="44" height="44" className="w-full h-full object-contain" /></span>
            <span className="display font-bold text-lg">Revolution<span style={{ color: c.cyan }}>AI</span></span>
          </a>
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {NAV.map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} aria-current={spy === id ? "true" : undefined} className="navlink px-3.5 py-2 text-sm font-medium rounded-lg hover:bg-white/5">{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" className="iconbtn" onClick={chat.open} aria-busy={chat.state === "loading"} aria-label={chat.state === "error" ? "Chat didn't load. Email us instead" : "Chat with us"}>
              {chat.state === "loading" ? <span className="spin" /> : <MessageSquare size={20} />}
            </button>
            <span className="hidden sm:block"><button onClick={() => scrollTo("contact")} className="btn btn-main whitespace-nowrap" style={{ padding: "10px 18px", fontSize: ".9rem" }}>Request a free audit</button></span>
            <button className="lg:hidden rounded-lg hover:bg-white/5 grid place-items-center" style={{ width: 44, height: 44 }} ref={menuBtn} onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen} aria-label="Menu">
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <motion.div aria-hidden="true" style={{ scaleX: progress, transformOrigin: "0 50%", height: 2, background: `linear-gradient(90deg, ${c.cyan}, ${c.gold})`, position: "absolute", left: 0, right: 0, bottom: -1 }} />
        <AnimatePresence>
          {navOpen && (
            <motion.nav key="menu" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="lg:hidden overflow-hidden absolute left-0 right-0 top-full" style={{ background: c.bgAlt, borderTop: `1px solid ${c.line}`, borderBottom: `1px solid ${c.line}` }} aria-label="Mobile">
              <div className="wrap py-3">
                {NAV.map(([label, id]) => (
                  <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left px-2 py-3.5 text-base font-medium" style={{ borderBottom: `1px solid ${c.line}` }}>{label}</button>
                ))}
                <button onClick={() => scrollTo("contact")} className="btn btn-main w-full mt-4 mb-2">Request a free audit</button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      {navOpen && <div className="scrim lg:hidden" onClick={() => setNavOpen(false)} aria-hidden="true" />}

      <main id="top">
        {/* Hero */}
        <section className="hero" onPointerMove={heroGlow}>
          <div className="hero-cursor" aria-hidden="true" />
          <motion.div className="hero-photo" aria-hidden="true" style={{ y: heroY }} />
          <span className="hero-ai">Background: AI-generated image</span>
          <div className="aurora" aria-hidden="true"><i /><i /></div>
          <div className="wrap relative grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-14 items-center" style={{ paddingTop: 56, paddingBottom: 76 }}>
            <div>
              <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-sm font-semibold mb-5" style={{ color: c.cyan }}>Done-for-you AI follow-up for home service businesses</motion.p>
              <h1 aria-label="The missed call that booked itself.">
                <span aria-hidden="true">{words("The missed call that", 0)}<em>{words("booked itself.", 4)}</em></span>
              </h1>
              <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}>
                <p className="lede mt-7">
                  You're on a roof, under a sink or in an attic. RevolutionAI answers anyway: it texts back missed calls in seconds, asks the right questions, gets the job onto your calendar and asks for the review afterward. We build it and run it for you.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <button onClick={() => scrollTo("contact")} className="btn btn-main">Request a free audit</button>
                  <button onClick={() => scrollTo("calculator")} className="btn btn-ghost">Run your numbers</button>
                </div>
                <ul className="facts mt-9">
                  {["No long-term contract", "Typically live in 5–7 business days", "Built and managed for you"].map((f) => (
                    <li key={f}><Check size={16} style={{ color: c.cyan }} />{f}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
            <motion.div initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}>
              <PhoneDemo sid={sid} onPick={setSid} />
            </motion.div>
          </div>
        </section>

        {/* Pains by trade */}
        <section id="pains" className="band band-alt" aria-labelledby="pains-h">
          <div className="wrap">
            <Reveal className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-end mb-8">
              <h2 id="pains-h" className="h2">Good work isn't the problem. The leaks are.</h2>
              <p className="lede">Jobs tend to slip away in the same three places. Pick your trade to see where, and what closes each gap.</p>
            </Reveal>
            <div className="chips mb-8" role="group" aria-label="Choose your trade">
              {TRADES.map((t) => (
                <motion.button whileTap={{ scale: 0.94 }} type="button" key={t.name} className="chip" aria-pressed={tradeId === t.id} onClick={() => pickTrade(t)}>{t.name}</motion.button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.ol key={tradeId} className="leaks" initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.12 } }} variants={{ show: { transition: { staggerChildren: 0.12 } } }} aria-live="polite">
                {pains(trade).map((r, i) => (
                  <motion.li key={i} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                    <div className="leak">
                      <span className="tag">The leak</span>
                      <p>{r.pain}</p>
                    </div>
                    <span className="leak-arrow" aria-hidden="true"><ArrowRight size={20} className="hidden md:block" /><ArrowDown size={20} className="md:hidden" /></span>
                    <div className="plug">
                      <span className="tag">The fix</span>
                      <p>{r.fix}</p>
                      <small>{r.tool}</small>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </AnimatePresence>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button onClick={() => scrollTo("contact")} className="btn btn-main">Find my leaks, free</button>
              <button onClick={() => scrollTo("calculator")} className="btn btn-ghost">See what they cost</button>
            </div>
          </div>
        </section>

        {/* Proof */}
        <section aria-labelledby="proof-h">
          <div className="wrap" style={{ paddingTop: 72, paddingBottom: 72 }}>
            <Reveal><h2 id="proof-h" className="h2 mb-10" style={{ maxWidth: "18em" }}>What the research says about slow replies.</h2></Reveal>
            <div className="proof">
              {PROOF.map((p, i) => (
                <Reveal key={p.to} delay={i * 0.12}>
                  <div className="fig">{p.prefix && <small>{p.prefix} </small>}<CountUp to={p.to} suffix={p.suffix} /></div>
                  <p className="mt-3 text-[.95rem] leading-relaxed">{p.text}</p>
                  <p className="mt-2 text-xs" style={{ color: c.muted }}>
                    {p.href ? <a className="underline" href={p.href} target="_blank" rel="noopener noreferrer">{p.source}</a> : p.source}
                  </p>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-xs leading-relaxed" style={{ color: c.muted, maxWidth: "46rem" }}>These studies cover businesses in general, not home services specifically. In the first, "qualify" means having a real conversation with a decision maker.</p>
          </div>
        </section>

        {/* Same call, two outcomes */}
        <section className="band band-alt" aria-labelledby="two-h">
          <div className="wrap grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr] gap-10 lg:gap-14 items-stretch">
            <Reveal as="figure" className="shot">
              <motion.img ref={shotRef} style={{ y: shotY }} src="/img/roofer-at-work.jpg" alt="AI-generated illustration of a roofer nailing shingles at sunset with his phone beside him on the roof." width="1200" height="800" loading="lazy" />
              <span className="ai-tag">AI-generated image</span>
              <figcaption>
                <AnimatePresence mode="wait">
                  <motion.span key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} style={{ display: "block" }}>
                    {mode === "with" ? "The phone rang. The system answered. He kept working." : "You can't answer from up here. You shouldn't have to."}
                  </motion.span>
                </AnimatePresence>
              </figcaption>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 id="two-h" className="h2">Same Saturday call. Two different Mondays.</h2>
              <p className="lede mt-4">Flip the switch to see what happens to one missed call.</p>
              <div className="switch mt-6" role="group" aria-label="Compare outcomes">
                {[["without", "Without a system", "#FF9A8B"], ["with", "With RevolutionAI", c.cyan]].map(([id, label, color]) => (
                  <button type="button" key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>
                    {mode === id && <motion.span layoutId="mode-pill" className="pill" style={{ background: color }} transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                    <span className="lbl">{label}</span>
                  </button>
                ))}
              </div>
              <div className={`rail ${mode === "with" ? "on" : ""}`} aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.ol key={mode} initial="hidden" animate="show" exit={{ opacity: 0, transition: { duration: 0.15 } }} variants={{ show: { transition: { staggerChildren: 0.14 } } }}>
                    {lane.map((r) => (
                      <motion.li key={r.time} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}>
                        <span className="dot"><r.icon size={18} /></span>
                        <div><time>{r.time}</time><p>{r.text}</p></div>
                      </motion.li>
                    ))}
                  </motion.ol>
                </AnimatePresence>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <button onClick={() => scrollTo("contact")} className="btn btn-main">Find my missed jobs</button>
                <span className="text-sm" style={{ color: c.muted }}>Illustrative example. Your audit looks at your own numbers.</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* What we build */}
        <section id="solutions" className="band">
          <div className="wrap">
            <Reveal className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-end mb-10">
              <h2 className="h2">Seven pieces. Each one closes a specific leak.</h2>
              <p className="lede">If it's repetitive, easy to forget, or happens while you're on a job, it belongs in the system. We build it, write it, connect it and keep improving it. Tap around: a few of these are interactive demos.</p>
            </Reveal>
            <ul className="bento">
              {BUILDS.map((b, i) => (
                <Reveal as="li" key={b.id} delay={(i % 3) * 0.08} className={`tile orbit tile-${b.id}`} onMouseMove={spotlight}>
                  <div className="tile-copy">
                    <img className="art" src={`/img/icons/${b.id}.webp`} alt="" width="68" height="68" loading="lazy" />
                    <p className="solves">{b.solves}</p>
                    <h3 className="font-bold text-[1.15rem]">{b.title}</h3>
                    <p className="mt-1.5 text-[.95rem] leading-relaxed" style={{ color: c.muted }}>{b.desc}</p>
                  </div>
                  <Vignette id={b.id} />
                </Reveal>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button onClick={() => scrollTo("contact")} className="btn btn-main">Get it built for me</button>
              <span className="text-sm" style={{ color: c.muted }}>You don't pick and assemble. We set up what your business needs.</span>
            </div>
          </div>
        </section>

        {/* Options compared */}
        <section className="band band-alt" aria-labelledby="cmp-h">
          <div className="wrap">
            <Reveal className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-end mb-10">
              <h2 id="cmp-h" className="h2">Three ways to fix it. Only one stays off your plate.</h2>
              <p className="lede">You can buy software and build it yourself, or hire someone to chase leads. Or you can hand the whole thing to us and keep doing the work you're good at.</p>
            </Reveal>
            <Reveal className={`vs ${showAll ? "all" : ""}`} role="table" aria-label="Comparison of typical options">
              <div className="vs-head" role="row">
                <span role="columnheader" />
                {OPTIONS.map((o, i) => <span role="columnheader" key={o} className={i === 2 ? "us" : ""}>{o}</span>)}
              </div>
              {COMPARE.map(([label, a, b, us]) => (
                <div className="vs-row" role="row" key={label}>
                  <span role="rowheader" className="vs-label">{label}</span>
                  <span role="cell" data-col={OPTIONS[0]}>{a}</span>
                  <span role="cell" data-col={OPTIONS[1]}>{b}</span>
                  <span role="cell" data-col={OPTIONS[2]} className="us"><Check size={16} />{us}</span>
                </div>
              ))}
            </Reveal>
            <button type="button" className="vs-more md:hidden" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? "Hide the other two options" : "Compare with the other two options"}</button>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button onClick={() => scrollTo("contact")} className="btn btn-main">Hand it to us</button>
              <span className="text-sm" style={{ color: c.muted }}>A general comparison of typical options. Your audit looks at your actual setup.</span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="band">
          <div className="wrap">
            <Reveal><h2 className="h2 max-w-2xl">A clean install, typically in 5–7 business days.</h2></Reveal>
            <div className="flowwrap mt-12" ref={flowRef}>
              <div className="flow-track hidden min-[900px]:block" aria-hidden="true"><motion.div style={{ scaleX: flowFill }} /></div>
              <div className="flow-track min-[900px]:hidden" aria-hidden="true"><motion.div style={{ scaleY: flowFill }} /></div>
            <ol className="flow">
              {STEPS.map((s, i) => (
                <li key={s.title} className={i <= step ? "lit" : ""}>
                  <img className="step-art" src={`/img/icons/step-${i + 1}.webp`} alt="" width="56" height="56" loading="lazy" />
                  <span className="num">{i + 1}</span>
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="mt-2 text-[.95rem] leading-relaxed" style={{ color: c.muted }}>{s.desc}</p>
                </li>
              ))}
            </ol>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button onClick={() => scrollTo("contact")} className="btn btn-main">Start with the free audit</button>
              <span className="text-sm" style={{ color: c.muted }}>Step one costs nothing and takes 30 minutes.</span>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="band band-alt">
          <div className="wrap">
            <Reveal className="grid lg:grid-cols-2 gap-10 items-end mb-10">
              <h2 className="h2">What are missed calls costing you?</h2>
              <p className="lede">Slide in a normal month. This counts one thing only: jobs won back when a missed call gets a text instead of silence. No email needed.</p>
            </Reveal>
            <Reveal className="mb-8">
              <div className="chips" role="group" aria-label="Choose your trade">
                {INDUSTRIES.map((i) => (
                  <motion.button whileTap={{ scale: 0.94 }} key={i.id} type="button" className="chip" aria-pressed={industryId === i.id} onClick={() => pickIndustry(i.id)}>{i.name}</motion.button>
                ))}
                <motion.button whileTap={{ scale: 0.94 }} type="button" className="chip" aria-pressed={industryId === ""} onClick={() => { setIndustryId(""); setVals((p) => ({ ...p, avgTicket: 2500, monthlyLeads: 50 })); }}>Another trade</motion.button>
              </div>
              <p className="mt-3 text-xs" style={{ color: c.muted }}>Picking a trade only sets a starting call volume and job value. These are rough placeholders, not industry benchmarks, so set your own.</p>
            </Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_.9fr] gap-6">
              <Reveal className="panel p-6 sm:p-8 min-w-0">
                <div className="grid gap-y-7">
                  {SLIDERS.map((s) => (
                    <div key={s.key}>
                      <label className="field-label" htmlFor={`f-${s.key}`}>
                        <span>{s.label}</span>
                        <output>{s.prefix || ""}{vals[s.key].toLocaleString("en-US")}{s.suffix || ""}</output>
                      </label>
                      <input id={`f-${s.key}`} type="range" min={s.min} max={s.max} step={s.step} value={vals[s.key]}
                        style={{ "--p": `${((vals[s.key] - s.min) / (s.max - s.min)) * 100}%` }}
                        onChange={(e) => setVals((p) => ({ ...p, [s.key]: Number(e.target.value) }))} />
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.1} className="panel orbit p-6 sm:p-8 min-w-0">
                <div aria-live="polite">
                  <p className="text-sm font-medium" style={{ color: c.muted }}>Estimated revenue won back per month</p>
                  <p className="display font-bold mt-1" style={{ color: c.gold, fontSize: "clamp(1.9rem, 5.4vw, 3.4rem)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>+<Rolling value={roi.added} format={money} /></p>
                  <p className="mt-2 text-sm" style={{ color: c.muted }}>About {money(roi.annual)} over a year, if every month looked like this one.</p>
                </div>
                <p className="math">{one(roi.missed)} missed calls × {vals.replyRate}% won back by text × {vals.closeRate}% close rate × {money(vals.avgTicket)} = <b>{money(roi.added)} a month</b></p>
                {vals.avgTicket < 1000 && <p className="math" role="note">For recurring work, enter what a customer is worth to you over a year, not one visit.</p>}
                {roi.annual > 1000000 && <p className="math" role="note">That is a very large number. Check that the inputs describe one normal month.</p>}
                <div className="mt-4">
                  <div className="result-row"><span style={{ color: c.muted }}>Calls you miss a month</span><span className="font-semibold">{one(roi.missed)}</span></div>
                  <div className="result-row"><span style={{ color: c.muted }}>Jobs won back a month, on average</span><span className="font-semibold" style={{ color: c.cyan }}>about {one(roi.jobsBack)}</span></div>
                  <div className="result-row" style={{ borderBottom: 0 }}><span style={{ color: c.muted }}>What an answered call is worth to you</span><span className="font-semibold"><Rolling value={roi.perCall} format={money} /></span></div>
                </div>
                <button onClick={() => scrollTo("contact")} className="btn btn-main w-full mt-5">Check these numbers on a free audit</button>
                <p className="mt-4 text-xs leading-relaxed" style={{ color: c.muted }}>An estimate, not a guarantee. It covers phone calls only and leaves out web leads, reviews and repeat work. It assumes the callers a text wins back would not have reached you another way, and that they close at your usual rate. That share is our assumption, so set it wherever you think is fair. Your audit replaces it with your own numbers.</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="band">
          <div className="wrap grid grid-cols-1 lg:grid-cols-[.8fr_1.2fr] gap-12">
            <Reveal>
              <h2 className="h2">Questions owners ask us first.</h2>
              <p className="lede mt-5">Something else on your mind? Ask it on the audit call, or email <a className="underline" style={{ color: c.cyan }} href="mailto:support@revolutionai.pro">support@revolutionai.pro</a>.</p>
            </Reveal>
            <div>
              {FAQS.map((f, i) => {
                const open = openFaq.includes(i);
                return (
                  <Reveal key={f.q} delay={i * 0.05} className={`faq-item ${open ? "open" : ""}`}>
                    <div style={{ borderBottom: `1px solid ${c.line}` }} className="px-3">
                      <h3 style={{ fontFamily: "inherit", letterSpacing: 0 }}>
                        <button onClick={() => setOpenFaq((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))} aria-expanded={open} aria-controls={`faq-${i}`} className="w-full py-5 flex items-center justify-between gap-6 text-left text-[1.05rem] font-semibold">
                          <span className="min-w-0 flex-1">{f.q}</span>
                          <Plus size={20} className="faq-plus shrink-0" style={{ color: c.muted }} />
                        </button>
                      </h3>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                            <p className="pb-6 pr-10 leading-relaxed" style={{ color: c.muted }}>{f.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="band band-alt contact">
          <div className="contact-bg" aria-hidden="true" />
          <div className="wrap relative grid grid-cols-1 lg:grid-cols-[.85fr_1.15fr] gap-12 items-start">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <h2 className="h2">Request your free automation audit.</h2>
                <p className="lede mt-5">Thirty minutes, your real lead flow, and a straight answer on whether this is worth it for your business.</p>
              </Reveal>
              <ul className="mt-8 space-y-5">
                {[
                  ["We map how leads reach you", "Calls, forms, ads, referrals, and what happens next."],
                  ["We show you the gaps", "Where leads wait, get missed or never hear back."],
                  ["You get an ROI projection", "Built on your numbers, yours to keep."],
                  ["No obligation", "If it's not a fit, we'll say so."],
                ].map(([t, d], i) => (
                  <Reveal as="li" key={t} delay={0.1 + i * 0.1} className="flex gap-3.5">
                    <Check size={20} className="shrink-0 mt-0.5" style={{ color: c.cyan }} />
                    <div><div className="font-semibold">{t}</div><div className="text-[.95rem]" style={{ color: c.muted }}>{d}</div></div>
                  </Reveal>
                ))}
              </ul>
            </div>
            <div id="audit-form" className="panel orbit p-3 sm:p-7" style={{ boxShadow: "0 30px 100px -50px rgba(77,212,231,.5)" }}>
              <div className="trust"><img src="/img/icons/shield.webp" alt="" width="44" height="44" loading="lazy" /><span><b>Free, 30 minutes, no obligation.</b><br />No long-term contract if you go ahead.</span></div>
              <ol className="next">
                <li><span><b>Send the form below.</b> Its button reads "Get My Custom Quote Today"; the quote comes after your free audit.</span></li>
                <li><span><b>We reach out to set a time</b> for your 30-minute audit call.</span></li>
                <li><span><b>You get your audit and ROI projection.</b> Then you decide.</span></li>
              </ol>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: c.muted }}>
                By submitting, you agree to our{" "}
                <Link to="/privacy" className="underline" style={{ color: c.cyan }}>Privacy Policy</Link>{" "}and{" "}
                <Link to="/terms" className="underline" style={{ color: c.cyan }}>Terms of Service</Link>. Text messages are optional: you choose with the checkboxes in the form.
              </p>
              <div className="formclip">
                <iframe
                  src={`https://api.leadconnectorhq.com/widget/form/${FORM_ID}`}
                  style={{ height: `${iframeHeight}px`, border: "none" }}
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
            <button onClick={() => scrollTo("contact")} className="btn btn-main w-full" style={{ padding: "12px 18px" }}>Request a free audit</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="foot">
        <div className="wrap foot-in">
          <Reveal className="foot-brand">
            <motion.img whileHover={{ rotate: 14, scale: 1.05 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} src="/img/emblem.webp" alt="" width="132" height="132" loading="lazy" />
            <div>
              <div className="display foot-word">Revolution<span style={{ color: c.cyan }}>AI</span></div>
              <p className="foot-tag"><span style={{ color: "#5CC96B" }}>Automate.</span> <span style={{ color: c.cyan }}>Optimize.</span> <span style={{ color: c.gold }}>Thrive.</span></p>
            </div>
          </Reveal>
          <div className="foot-cols">
            <nav className="foot-links" aria-label="Footer">
              {NAV.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </nav>
            <div className="foot-base">
              <a href="mailto:support@revolutionai.pro">support@revolutionai.pro</a>
              <span>© {new Date().getFullYear()} RevolutionAI. All rights reserved.</span>
            </div>
          </div>
        </div>
        <div className="foot-mega display" aria-hidden="true">RevolutionAI</div>
      </footer>
    </div>
  );
}
