import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";

const LOGO_SRC = "/RevolutionAi-Logo-3-cropped%20%281%29.png";

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

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: colors.bg, color: colors.text, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        h1, h2, h3 { font-family: 'Syne', sans-serif; }
        .card { background: ${colors.surface}; border: 1px solid ${colors.border}; }
      `}</style>

      {/* Background effects - match landing */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: colors.cyan, top: "-15%", left: "-10%" }} />
        <div className="absolute w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: colors.gold, bottom: "-10%", right: "-5%" }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(${colors.cyan} 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
      </div>

      <header className="sticky top-0 left-0 right-0 z-50 border-b backdrop-blur-xl" style={{ borderColor: colors.border, background: "rgba(7,12,24,0.92)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${colors.border}` }}>
                <img src={LOGO_SRC} alt="RevolutionAI" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold">Revolution<span style={{ color: colors.cyan }}>AI</span></div>
                <div className="text-[11px] tracking-wider uppercase" style={{ color: colors.textMuted }}>Automate. Optimize. Thrive.</div>
              </div>
            </Link>
            <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-white/5" style={{ color: colors.textMuted }}>
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <motion.div className="card rounded-3xl p-6 sm:p-8 md:p-10 mb-8" style={{ boxShadow: `0 0 60px -20px ${colors.cyanGlow}` }} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${colors.cyan}20` }}>
              <Shield className="w-7 h-7" style={{ color: colors.cyan }} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
              <p className="text-sm mt-1" style={{ color: colors.textMuted }}>Last updated: February 2025</p>
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed" style={{ color: colors.textMuted }}>
            <motion.p variants={fadeUp}>
              RevolutionAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, services, or communicate with us via SMS, email, or other channels. It is designed to meet applicable U.S. and international standards, including those related to application-to-person (A2P) messaging and general web privacy practices.
            </motion.p>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>1. What Information We Collect</h2>
              <p className="mb-2">We may collect the following categories of information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong style={{ color: colors.text }}>Contact information:</strong> Name, email address, phone number, business name, and mailing address when you submit forms, request a demo, or contact us.</li>
                <li><strong style={{ color: colors.text }}>Communication data:</strong> Records of SMS messages, emails, and other communications you have with us or that are processed through our systems on behalf of our clients.</li>
                <li><strong style={{ color: colors.text }}>Usage and technical data:</strong> IP address, browser type, device type, pages visited, and similar data when you use our website.</li>
                <li><strong style={{ color: colors.text }}>Business and lead data:</strong> Information you or our clients provide about leads, appointments, and business workflows when using our automation services.</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>2. How We Use Your Data</h2>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide, operate, and improve our automation and lead-response services.</li>
                <li>Send you service-related communications, including SMS and email, in accordance with your consent and preferences.</li>
                <li>Respond to your inquiries and provide customer support.</li>
                <li>Send marketing and promotional communications only where you have given prior express consent (e.g., opted in).</li>
                <li>Analyze usage to improve our website and services.</li>
                <li>Comply with legal obligations and protect our rights.</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>3. SMS Opt-In Details (A2P / TCPA)</h2>
              <p className="mb-2">When you opt in to receive SMS messages from us or from businesses using our platform:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>You provide your mobile number and consent to receive recurring automated and/or marketing text messages at that number.</li>
                <li>Message frequency varies (e.g., appointment reminders, follow-ups, and promotional messages as disclosed at opt-in).</li>
                <li>Consent is not required as a condition of purchasing any goods or services. You may opt out at any time by replying STOP, UNSUBSCRIBE, or CANCEL, or by contacting us.</li>
                <li>We and our clients maintain documented, verifiable consent for each number to which we send marketing or promotional SMS, consistent with TCPA and CTIA guidelines.</li>
                <li>For help at any time, reply HELP to any message or contact us using the information in our <Link to="/terms" className="underline" style={{ color: colors.cyan }}>Terms of Service</Link>.</li>
              </ul>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>4. Cookies and Tracking Practices</h2>
              <p className="mb-2">We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Remember your preferences and settings.</li>
                <li>Understand how you use our website (e.g., analytics) to improve performance.</li>
                <li>Support security and fraud prevention.</li>
              </ul>
              <p className="mt-2">
                You can control cookies through your browser settings. Disabling certain cookies may limit some website features. We do not sell your personal information to third parties for cross-context behavioral advertising. We do not share your personal information for third-party marketing purposes without your consent.
              </p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>5. Data Security and Handling</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your data, including encryption in transit and at rest where applicable, access controls, and secure hosting. We retain your information only as long as necessary to provide our services, comply with law, or resolve disputes. When data is no longer needed, we securely delete or anonymize it.
              </p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>6. Your Rights (Including CCPA & GDPR)</h2>
              <p className="mb-2">Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access and receive a copy of the personal data we hold about you.</li>
                <li>Correct or update inaccurate data.</li>
                <li>Request deletion of your personal data.</li>
                <li>Opt out of marketing (including SMS and email) at any time via STOP/unsubscribe or by contacting us.</li>
                <li>Object to or restrict certain processing.</li>
                <li>Withdraw consent where processing is based on consent.</li>
                <li>Data portability (where applicable).</li>
              </ul>
              <p className="mt-2">
                California residents: We do not sell personal information as defined under the CCPA. You may exercise your rights by contacting us. Residents of the European Economic Area may have additional rights under GDPR and may contact us or their supervisory authority.
              </p>
              <p className="mt-2">To exercise these rights, contact us using the details in the "Contact Us" section below.</p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>7. Mobile Information Sharing Statement</h2>
              <p>
                We do not share your mobile number or SMS content with third parties for their marketing purposes. We may share data with service providers who assist us in delivering SMS, hosting, analytics, or support, under strict confidentiality and data-processing agreements. We may also disclose information when required by law or to protect our rights and safety.
              </p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>Contact Us</h2>
              <p>
                For privacy-related questions, to exercise your rights, or to opt out of communications, contact us at the support contact provided on our website or in our <Link to="/terms" className="underline" style={{ color: colors.cyan }}>Terms of Service</Link>.
              </p>
            </motion.section>
          </div>
        </motion.div>
      </main>

      <footer className="relative py-12 border-t px-4" style={{ borderColor: colors.border, background: colors.bg }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${colors.border}` }}>
              <img src={LOGO_SRC} alt="RevolutionAI" className="w-full h-full object-contain" />
            </div>
            <div><div className="font-bold">Revolution<span style={{ color: colors.cyan }}>AI</span></div><div className="text-xs" style={{ color: colors.textMuted }}>© {new Date().getFullYear()}</div></div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: colors.textMuted }}>
            <Link to="/" style={{ color: colors.cyan }}>Home</Link>
            <Link to="/terms" style={{ color: colors.cyan }}>Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
