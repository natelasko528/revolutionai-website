import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Sparkles, Zap, Shield, Clock, BarChart3, Phone, Calendar, Star, 
  MessageSquare, TrendingUp, Quote, Minus, Plus, Menu, X, CheckCircle2, Bot, 
  Target, Building2, DollarSign, Users, Percent, Timer,
  Calculator, ChevronDown, Briefcase, Car, Paintbrush, Leaf, Hammer, Scissors,
  Utensils, Camera, Heart, Scale, Dumbbell, Dog,
  Droplets, Plug, Wind, Lock
} from "lucide-react";

const LOGO_SRC = "/RevolutionAi-Logo-3-cropped%20%281%29.png";

export default function RevolutionAILanding() {
  const [navOpen, setNavOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);
  const [calcValues, setCalcValues] = useState({
    monthlyLeads: 50,
    closeRate: 25,
    avgTicket: 2500,
    hoursOnFollowUp: 15,
    missedCallPercent: 30,
    responseTime: 24
  });

  const colors = {
    bg: "#070C18",
    bgAlt: "#0B1224",
    surface: "#0F172A",
    border: "rgba(255,255,255,0.08)",
    borderLight: "rgba(255,255,255,0.12)",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    cyan: "#4DD4E7",
    cyanGlow: "rgba(77,212,231,0.25)",
    gold: "#F5A623",
    goldGlow: "rgba(245,166,35,0.2)",
  };

  const industries = [
    { id: "hvac", name: "HVAC Services", icon: Wind, avgTicket: 3500, multiplier: 1.2 },
    { id: "plumbing", name: "Plumbing", icon: Droplets, avgTicket: 2800, multiplier: 1.15 },
    { id: "electrical", name: "Electrical Contractors", icon: Plug, avgTicket: 3200, multiplier: 1.18 },
    { id: "roofing", name: "Roofing", icon: Building2, avgTicket: 12000, multiplier: 1.3 },
    { id: "realestate", name: "Real Estate", icon: Building2, avgTicket: 15000, multiplier: 1.25 },
    { id: "dental", name: "Dental Practice", icon: Sparkles, avgTicket: 2200, multiplier: 1.2 },
    { id: "medspa", name: "Med Spa / Aesthetics", icon: Heart, avgTicket: 1800, multiplier: 1.35 },
    { id: "legal", name: "Legal Services", icon: Scale, avgTicket: 5000, multiplier: 1.22 },
    { id: "chiropractic", name: "Chiropractic", icon: Heart, avgTicket: 1500, multiplier: 1.18 },
    { id: "landscaping", name: "Landscaping", icon: Leaf, avgTicket: 4500, multiplier: 1.15 },
    { id: "remodeling", name: "Home Remodeling", icon: Hammer, avgTicket: 25000, multiplier: 1.28 },
    { id: "painting", name: "Painting Contractors", icon: Paintbrush, avgTicket: 4000, multiplier: 1.12 },
    { id: "auto", name: "Auto Services", icon: Car, avgTicket: 1200, multiplier: 1.1 },
    { id: "salon", name: "Salon / Barbershop", icon: Scissors, avgTicket: 150, multiplier: 1.4 },
    { id: "fitness", name: "Fitness / Personal Training", icon: Dumbbell, avgTicket: 200, multiplier: 1.35 },
    { id: "photography", name: "Photography", icon: Camera, avgTicket: 2500, multiplier: 1.2 },
    { id: "catering", name: "Catering / Events", icon: Utensils, avgTicket: 5000, multiplier: 1.25 },
    { id: "cleaning", name: "Cleaning Services", icon: Sparkles, avgTicket: 350, multiplier: 1.3 },
    { id: "pest", name: "Pest Control", icon: Lock, avgTicket: 400, multiplier: 1.25 },
    { id: "veterinary", name: "Veterinary Services", icon: Dog, avgTicket: 800, multiplier: 1.18 },
  ];

  const testimonials = [
    { quote: "We went from losing 40% of leads to booking 80% within 5 minutes. The ROI was immediate.", author: "Marcus Chen", role: "Owner, Premier Plumbing Co.", metric: "+127%", metricLabel: "Bookings" },
    { quote: "I was spending 3 hours a day on follow-ups. Now it's all automated and my close rate went UP by 34%.", author: "Sarah Mitchell", role: "Real Estate Team Lead", metric: "20hrs", metricLabel: "Saved weekly" },
    { quote: "The missed call text-back alone has generated $47K in jobs we would have lost.", author: "David Rodriguez", role: "Rodriguez Electric LLC", metric: "$47K", metricLabel: "Recovered" }
  ];

  const faqs = [
    { q: "How long does setup take?", a: "Most businesses are fully operational within 5-7 business days. We handle the heavy lifting — you just provide access and answer a few questions about your workflow." },
    { q: "Do I need technical skills?", a: "Absolutely not. If you can use a smartphone, you can use RevolutionAI. We build everything for you, and our mobile app makes managing leads simple." },
    { q: "What if I already have a CRM?", a: "We can integrate with most existing tools or help you migrate your data. We'll evaluate your setup during the free audit and recommend the best approach." },
    { q: "Is there a contract?", a: "No long-term contracts. We earn your business every month by delivering results. Cancel anytime." },
    { q: "How is pricing determined?", a: "Every business is unique. We customize our solutions based on your specific needs, volume, and goals. Book a demo to get a personalized quote." },
    { q: "What's included in the free demo?", a: "A 30-minute call where we audit your current lead flow, identify gaps, show you exactly how automation would work for YOUR business, and provide a custom ROI projection. No pressure, real value." }
  ];

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedIndustry) {
      const industry = industries.find(i => i.id === selectedIndustry);
      if (industry) setCalcValues(prev => ({ ...prev, avgTicket: industry.avgTicket }));
    }
  }, [selectedIndustry]);

  const scrollTo = (id) => { 
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); 
    setNavOpen(false); 
  };

  const calculateROI = () => {
    const industry = industries.find(i => i.id === selectedIndustry);
    const multiplier = industry?.multiplier || 1.2;
    const { monthlyLeads, closeRate, avgTicket, hoursOnFollowUp, missedCallPercent, responseTime } = calcValues;
    const currentClosedDeals = Math.round(monthlyLeads * (closeRate / 100));
    const currentMonthlyRevenue = currentClosedDeals * avgTicket;
    const missedCalls = Math.round(monthlyLeads * (missedCallPercent / 100));
    const lostFromMissedCalls = Math.round(missedCalls * (closeRate / 100) * 0.6);
    const improvedCloseRate = Math.min(closeRate * multiplier, 85);
    const recoveredFromMissedCalls = Math.round(lostFromMissedCalls * 0.75);
    const newClosedDeals = Math.round(monthlyLeads * (improvedCloseRate / 100)) + recoveredFromMissedCalls;
    const newMonthlyRevenue = newClosedDeals * avgTicket;
    const hoursSaved = Math.round(hoursOnFollowUp * 0.85);
    const responseTimeImprovement = responseTime > 1 ? Math.round(((responseTime - 0.5) / responseTime) * 100) : 50;
    return {
      hoursSaved,
      monthlyHoursSaved: hoursSaved * 4,
      responseTimeImprovement,
      recoveredLeads: recoveredFromMissedCalls,
      currentRevenue: currentMonthlyRevenue,
      projectedRevenue: newMonthlyRevenue,
      additionalRevenue: newMonthlyRevenue - currentMonthlyRevenue,
      annualImpact: (newMonthlyRevenue - currentMonthlyRevenue) * 12
    };
  };

  const roi = calculateROI();
  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <div className="min-h-screen" style={{ background: colors.bg, color: colors.text, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        h1, h2, h3 { font-family: 'Syne', sans-serif; }
        .btn-primary { background: linear-gradient(135deg, ${colors.cyan}, #38BDF8); color: #0F172A; font-weight: 600; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px ${colors.cyanGlow}; }
        .card { background: ${colors.surface}; border: 1px solid ${colors.border}; }
        .glow-cyan { box-shadow: 0 0 60px -20px ${colors.cyanGlow}; }
        .glow-gold { box-shadow: 0 0 60px -20px ${colors.goldGlow}; }
        input[type="range"] { -webkit-appearance: none; background: transparent; cursor: pointer; }
        input[type="range"]::-webkit-slider-runnable-track { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; background: linear-gradient(135deg, #4DD4E7, #38BDF8); border-radius: 50%; margin-top: -7px; }
        input[type="range"]::-moz-range-track { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; }
        input[type="range"]::-moz-range-thumb { width: 20px; height: 20px; background: linear-gradient(135deg, #4DD4E7, #38BDF8); border-radius: 50%; cursor: pointer; border: none; }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: colors.cyan, top: "-15%", left: "-10%" }} />
        <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: colors.gold, bottom: "-10%", right: "-5%" }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(${colors.cyan} 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
      </div>

      {/* STICKY CTA BANNER - NEW */}
      {showBanner && (
        <div className="sticky top-0 z-[60]" style={{ background: `linear-gradient(90deg, ${colors.cyan}, #38BDF8, ${colors.cyan})` }}>
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center justify-center gap-2 text-center">
              <Sparkles className="w-4 h-4 hidden sm:block" style={{ color: colors.bg }} />
              <span className="text-sm font-medium" style={{ color: colors.bg }}>
                <span className="hidden sm:inline">Limited Time: </span>
                <strong>Free Automation Audit</strong>
                <span className="hidden md:inline"> — Discover exactly how much revenue you're leaving on the table</span>
              </span>
              <button onClick={() => scrollTo("contact")} className="ml-2 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 transition hover:scale-105" style={{ background: colors.bg, color: colors.cyan }}>
                Claim Now <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <button onClick={() => setShowBanner(false)} className="p-1 rounded-full transition hover:bg-black/10" style={{ color: colors.bg }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <header className={`sticky ${showBanner ? "top-[52px]" : "top-0"} left-0 right-0 z-50 border-b backdrop-blur-xl`} style={{ borderColor: colors.border, background: "rgba(7,12,24,0.92)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${colors.border}` }}>
                <img src={LOGO_SRC} alt="RevolutionAI" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-base sm:text-lg tracking-tight">Revolution<span style={{ color: colors.cyan }}>AI</span></div>
                <div className="text-[11px] sm:text-xs tracking-wider uppercase" style={{ color: colors.textMuted }}>Automate. Optimize. Thrive.</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {[["Solutions", "solutions"], ["How It Works", "how"], ["ROI Calculator", "calculator"], ["FAQ", "faq"]].map(([label, id]) => (
                <button key={id} onClick={() => scrollTo(id)} className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-white/5" style={{ color: colors.textMuted }}>{label}</button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <button onClick={() => scrollTo("contact")} className="hidden sm:flex btn-primary items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
                Get Your Quote <ArrowRight className="w-4 h-4" />
              </button>
              <button className="md:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setNavOpen(!navOpen)}>
                {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {navOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="md:hidden overflow-hidden border-t" style={{ borderColor: colors.border, background: colors.bgAlt }}>
              <div className="p-4 space-y-2">
                {[["Solutions", "solutions"], ["How It Works", "how"], ["ROI Calculator", "calculator"], ["FAQ", "faq"], ["Get Quote", "contact"]].map(([label, id]) => (
                  <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-white/5" style={{ color: colors.textMuted }}>{label}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6" style={{ borderColor: colors.border, background: "rgba(255,255,255,0.03)" }}>
                <Sparkles className="w-4 h-4" style={{ color: colors.gold }} />
                <span className="text-sm">AI-Powered Automation for Local Businesses</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Stop losing leads.
                <span className="block mt-2" style={{ background: `linear-gradient(135deg, ${colors.cyan}, ${colors.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Close more deals — automatically.
                </span>
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed max-w-lg" style={{ color: colors.textMuted }}>
                RevolutionAI builds your complete automation engine: missed-call text-back, instant lead nurture, appointment booking, review requests, and AI-assisted messaging — so your business runs 24/7.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => scrollTo("contact")} className="btn-primary px-8 py-4 rounded-xl text-base flex items-center gap-2">
                  Get Your Free Audit <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => scrollTo("calculator")} className="px-8 py-4 rounded-xl text-base font-medium border flex items-center gap-2 hover:bg-white/5 transition" style={{ borderColor: colors.border }}>
                  <Calculator className="w-5 h-5" /> Calculate Your ROI
                </button>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-8 flex items-center gap-6 text-sm" style={{ color: colors.textMuted }}>
                <div className="flex items-center gap-2"><Shield className="w-4 h-4" style={{ color: colors.cyan }} /> No contracts</div>
                <div className="flex items-center gap-2"><Zap className="w-4 h-4" style={{ color: colors.cyan }} /> Setup in days</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" style={{ color: colors.cyan }} /> 24/7 automation</div>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
              <div className="card rounded-3xl p-6 glow-cyan">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${colors.border}` }}>
                      <img src={LOGO_SRC} alt="RevolutionAI" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-semibold">Lead Response Engine</div>
                      <div className="text-xs" style={{ color: colors.textMuted }}>Live automation preview</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${colors.cyan}20`, color: colors.cyan }}>ALWAYS ON</div>
                </div>
                <div className="space-y-3">
                  {["New lead captured", "Instant text + email sent", "AI qualification started", "Appointment booked", "Pipeline updated", "Review request queued"].map((step, i) => (
                    <motion.div key={step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: i % 2 === 0 ? colors.cyan : colors.gold, boxShadow: `0 0 10px ${i % 2 === 0 ? colors.cyan : colors.gold}50` }} />
                      <span className="flex-1 text-sm">{step}</span>
                      <span className="text-xs" style={{ color: colors.textMuted }}>{["0s", "30s", "2m", "5m", "6m", "1d"][i]}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[["< 60s", "Avg reply"], ["7+", "Follow-ups"], ["↓ 0", "Lost leads"]].map(([val, label]) => (
                    <div key={label} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="text-lg font-bold" style={{ color: colors.cyan }}>{val}</div>
                      <div className="text-xs" style={{ color: colors.textMuted }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-4" style={{ background: colors.bgAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-wider mb-2" style={{ color: colors.gold }}>What We Automate</div>
            <h2 className="text-3xl sm:text-4xl font-bold">The boring stuff that steals your time</h2>
            <p className="mt-4 max-w-2xl mx-auto" style={{ color: colors.textMuted }}>If it's repetitive, manual, or easy to forget — it can be automated. We package proven workflows and tailor them to your exact business.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Instant Lead Response", desc: "New lead? They get a text & email immediately, then follow-up until they book." },
              { icon: Bot, title: "AI Qualification", desc: "Your assistant asks the right questions, routes leads, and flags hot opportunities." },
              { icon: Calendar, title: "Appointment Booking", desc: "Let prospects book in seconds. Cut no-shows with confirmations and reminders." },
              { icon: Star, title: "Reviews & Referrals", desc: "Automatically ask happy customers for reviews and revive old leads." },
              { icon: Target, title: "Pipeline Management", desc: "Every lead lands in the right stage with tasks and reminders so nothing slips." },
              { icon: BarChart3, title: "Simple Reporting", desc: "Know what's working: source, speed-to-lead, appointments, close rate." }
            ].map((item) => (
              <div key={item.title} className="card p-6 rounded-2xl hover:border-white/20 transition group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${colors.cyan}15` }}>
                  <item.icon className="w-6 h-6" style={{ color: colors.cyan }} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm" style={{ color: colors.textMuted }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-wider mb-2" style={{ color: colors.gold }}>How It Works</div>
            <h2 className="text-3xl sm:text-4xl font-bold">A clean, fast install. No chaos.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Discovery Call", desc: "We learn your business, current tools, and biggest bottlenecks." },
              { step: "2", title: "Custom Build", desc: "We configure your automation engine with your branding and workflows." },
              { step: "3", title: "Launch & Train", desc: "Go live with full support and a simple walkthrough for your team." },
              { step: "4", title: "Optimize", desc: "We monitor, tweak, and improve based on real performance data." }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl font-bold" style={{ background: `linear-gradient(135deg, ${colors.cyan}, ${colors.gold})`, color: colors.bg }}>
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm" style={{ color: colors.textMuted }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="calculator" className="py-20 px-4" style={{ background: colors.bgAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-wider mb-2" style={{ color: colors.gold }}>ROI Calculator</div>
            <h2 className="text-3xl sm:text-4xl font-bold">See Your Potential Savings</h2>
            <p className="mt-4 max-w-2xl mx-auto" style={{ color: colors.textMuted }}>Enter your business metrics to see how much time and money you could save with RevolutionAI.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card rounded-3xl p-6">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2"><Calculator className="w-5 h-5" style={{ color: colors.cyan }} />Your Business Metrics</h3>
              
              {/* Industry Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Your Industry</label>
                <div className="relative">
                  <button onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)} className="w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between transition" style={{ borderColor: colors.border, background: "rgba(255,255,255,0.03)" }}>
                    {selectedIndustry ? (
                      <span className="flex items-center gap-2">
                        {(() => { const ind = industries.find(i => i.id === selectedIndustry); const Icon = ind?.icon; return Icon ? <Icon className="w-4 h-4" /> : null; })()}
                        {industries.find(i => i.id === selectedIndustry)?.name}
                      </span>
                    ) : <span style={{ color: colors.textMuted }}>Choose your industry...</span>}
                    <ChevronDown className={`w-4 h-4 transition ${industryDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {industryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border overflow-hidden z-10 max-h-60 overflow-y-auto" style={{ borderColor: colors.border, background: colors.surface }}>
                      {industries.map((ind) => (
                        <button key={ind.id} onClick={() => { setSelectedIndustry(ind.id); setIndustryDropdownOpen(false); }} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition text-sm">
                          <ind.icon className="w-4 h-4" style={{ color: colors.cyan }} />
                          {ind.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-6">
                {[
                  { key: "monthlyLeads", label: "Monthly Leads", icon: Users, min: 10, max: 500, step: 10 },
                  { key: "closeRate", label: "Current Close Rate", icon: Percent, min: 5, max: 80, step: 5, suffix: "%" },
                  { key: "avgTicket", label: "Average Ticket Price", icon: DollarSign, min: 100, max: 50000, step: 100, prefix: "$" },
                  { key: "hoursOnFollowUp", label: "Hours/Week on Follow-ups", icon: Timer, min: 2, max: 40, step: 1, suffix: " hrs" },
                  { key: "missedCallPercent", label: "Missed Call Rate", icon: Phone, min: 5, max: 60, step: 5, suffix: "%" },
                  { key: "responseTime", label: "Avg Response Time", icon: Clock, min: 1, max: 48, step: 1, suffix: " hrs" }
                ].map((slider) => (
                  <div key={slider.key}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-sm font-medium"><slider.icon className="w-4 h-4" style={{ color: colors.textMuted }} />{slider.label}</label>
                      <span className="text-sm font-semibold" style={{ color: colors.cyan }}>{slider.prefix || ""}{calcValues[slider.key].toLocaleString()}{slider.suffix || ""}</span>
                    </div>
                    <input type="range" min={slider.min} max={slider.max} step={slider.step} value={calcValues[slider.key]} onChange={(e) => setCalcValues(prev => ({ ...prev, [slider.key]: Number(e.target.value) }))} className="w-full" />
                    <div className="flex justify-between text-xs mt-1" style={{ color: colors.textMuted }}><span>{slider.prefix || ""}{slider.min}{slider.suffix || ""}</span><span>{slider.prefix || ""}{slider.max.toLocaleString()}{slider.suffix || ""}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="card rounded-3xl p-6 glow-cyan">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Clock className="w-5 h-5" style={{ color: colors.cyan }} />Time Savings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}><div className="text-3xl font-bold" style={{ color: colors.cyan }}>{roi.hoursSaved}hrs</div><div className="text-sm" style={{ color: colors.textMuted }}>Saved per week</div></div>
                  <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}><div className="text-3xl font-bold" style={{ color: colors.cyan }}>{roi.monthlyHoursSaved}hrs</div><div className="text-sm" style={{ color: colors.textMuted }}>Saved per month</div></div>
                  <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}><div className="text-3xl font-bold" style={{ color: colors.gold }}>{roi.responseTimeImprovement}%</div><div className="text-sm" style={{ color: colors.textMuted }}>Faster response</div></div>
                  <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}><div className="text-3xl font-bold" style={{ color: colors.gold }}>{roi.recoveredLeads}</div><div className="text-sm" style={{ color: colors.textMuted }}>Recovered leads/mo</div></div>
                </div>
              </div>
              <div className="card rounded-3xl p-6 glow-gold">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5" style={{ color: colors.gold }} />Revenue Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}><span style={{ color: colors.textMuted }}>Current Monthly Revenue</span><span className="font-semibold">${roi.currentRevenue.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}><span style={{ color: colors.textMuted }}>Projected Monthly Revenue</span><span className="font-semibold" style={{ color: colors.cyan }}>${roi.projectedRevenue.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center p-4 rounded-xl border" style={{ borderColor: colors.gold, background: `${colors.gold}10` }}><span className="font-medium">Additional Monthly Revenue</span><span className="text-xl font-bold" style={{ color: colors.gold }}>+${roi.additionalRevenue.toLocaleString()}</span></div>
                  <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${colors.cyan}20, ${colors.gold}20)` }}><span className="font-medium">Annual Revenue Impact</span><span className="text-2xl font-bold" style={{ color: colors.cyan }}>+${roi.annualImpact.toLocaleString()}</span></div>
                </div>
                <button onClick={() => scrollTo("contact")} className="btn-primary w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-2">Get Your Custom Quote <ArrowRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-wider mb-2" style={{ color: colors.gold }}>Success Stories</div>
            <h2 className="text-3xl sm:text-4xl font-bold">Real Results from Real Businesses</h2>
          </div>
          <div className="card rounded-3xl p-8 relative">
            <Quote className="absolute top-6 left-6 w-10 h-10 opacity-20" style={{ color: colors.cyan }} />
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                <p className="text-xl leading-relaxed mb-6">"{testimonials[activeTestimonial].quote}"</p>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <div className="font-semibold">{testimonials[activeTestimonial].author}</div>
                    <div className="text-sm" style={{ color: colors.textMuted }}>{testimonials[activeTestimonial].role}</div>
                  </div>
                  <div className="h-12 w-px" style={{ background: colors.border }} />
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: colors.cyan }}>{testimonials[activeTestimonial].metric}</div>
                    <div className="text-xs" style={{ color: colors.textMuted }}>{testimonials[activeTestimonial].metricLabel}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} className="w-2 h-2 rounded-full transition" style={{ background: i === activeTestimonial ? colors.cyan : colors.border }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4" style={{ background: colors.bgAlt }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-wider mb-2" style={{ color: colors.gold }}>FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-bold">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="card rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left">
                  <span className="font-medium">{faq.q}</span>
                  {openFaq === i ? <Minus className="w-5 h-5" style={{ color: colors.cyan }} /> : <Plus className="w-5 h-5" style={{ color: colors.textMuted }} />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: colors.textMuted }}>{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Lead Capture */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="text-sm uppercase tracking-wider mb-2" style={{ color: colors.gold }}>Get Started</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Stop Losing Leads?</h2>
              <p className="text-lg mb-6" style={{ color: colors.textMuted }}>Book your free automation audit and get a personalized ROI projection for your business.</p>
              <div className="space-y-4">
                {[["30-minute strategy call", "Understand your workflow"], ["Custom automation audit", "Identify gaps & opportunities"], ["ROI projection", "See your potential savings"], ["No obligation", "Just real value"]].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: colors.cyan }} />
                    <div><div className="font-medium">{title}</div><div className="text-sm" style={{ color: colors.textMuted }}>{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card rounded-3xl p-4 sm:p-6 md:p-8 glow-cyan overflow-visible">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${colors.border}` }}>
                  <img src={LOGO_SRC} alt="RevolutionAI" className="w-full h-full object-contain" />
                </div>
                <div><div className="font-bold">Revolution<span style={{ color: colors.cyan }}>AI</span></div><div className="text-xs" style={{ color: colors.textMuted }}>Free Automation Audit</div></div>
              </div>
              {/* Embedded Form Container - uses CSS for responsive height */}
              <div className="form-embed-container w-full overflow-visible">
                <iframe
                  src="https://api.leadconnectorhq.com/widget/form/2aMmnobuUyI2iG1fB1v9"
                  className="form-embed-iframe"
                  id="inline-2aMmnobuUyI2iG1fB1v9"
                  data-layout="{'id':'INLINE'}"
                  data-trigger-type="alwaysShow"
                  data-trigger-value=""
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="Form 0"
                  data-height="100%"
                  data-layout-iframe-id="inline-2aMmnobuUyI2iG1fB1v9"
                  data-form-id="2aMmnobuUyI2iG1fB1v9"
                  title="Form 0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t px-4" style={{ borderColor: colors.border, background: colors.bg }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${colors.border}` }}>
              <img src={LOGO_SRC} alt="RevolutionAI" className="w-full h-full object-contain" />
            </div>
            <div><div className="font-bold text-base sm:text-lg">Revolution<span style={{ color: colors.cyan }}>AI</span></div><div className="text-[11px] sm:text-xs" style={{ color: colors.textMuted }}>Automate. Optimize. Thrive.</div></div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: colors.textMuted }}>
            {["Solutions", "ROI Calculator", "FAQ", "Privacy", "Terms"].map((l, i) => (<button key={i} onClick={() => i < 3 ? scrollTo(["solutions", "calculator", "faq"][i]) : null} className="hover:text-white">{l}</button>))}
          </div>
          <div className="text-sm" style={{ color: colors.textMuted }}>© {new Date().getFullYear()} RevolutionAI</div>
        </div>
      </footer>
    </div>
  );
}
