import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";

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

export default function TermsOfService() {
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
        <motion.div className="card rounded-3xl p-6 sm:p-8 md:p-10 mb-8" style={{ boxShadow: `0 0 60px -20px ${colors.goldGlow}` }} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${colors.gold}20` }}>
              <FileText className="w-7 h-7" style={{ color: colors.gold }} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Terms of Service</h1>
              <p className="text-sm mt-1" style={{ color: colors.textMuted }}>Last updated: February 2025</p>
            </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed" style={{ color: colors.textMuted }}>
            <motion.p variants={fadeUp}>
              Welcome to RevolutionAI. By using our website or services, you agree to these Terms of Service. Please read them carefully. These terms include required disclosures for application-to-person (A2P) messaging and general use of our site and services.
            </motion.p>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>1. Description of SMS Use Cases</h2>
              <p className="mb-2">Our services may include sending and receiving SMS (text) and MMS messages on behalf of our business clients. Messages may be used for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong style={{ color: colors.text }}>Transactional:</strong> Lead response, appointment reminders and confirmations, and notifications related to your requests or account.</li>
                <li><strong style={{ color: colors.text }}>Conversational:</strong> Two-way communication when you initiate contact and we or our clients respond.</li>
                <li><strong style={{ color: colors.text }}>Marketing/Promotional:</strong> Only where you have given prior express written consent (e.g., opt-in). Message frequency for marketing will be disclosed at the point of opt-in.</li>
              </ul>
              <p className="mt-2">We comply with TCPA, CTIA Messaging Principles, and carrier requirements for A2P messaging. Consent is obtained and documented before sending marketing messages.</p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>2. Opt-Out Instructions</h2>
              <p className="mb-2">You may opt out of SMS messages at any time by:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Replying <strong style={{ color: colors.text }}>STOP</strong>, <strong style={{ color: colors.text }}>UNSUBSCRIBE</strong>, or <strong style={{ color: colors.text }}>CANCEL</strong> to any message you receive. Opt-out will be processed promptly and you will receive no further marketing or non-transactional messages unless you opt in again.</li>
                <li>Contacting us or the business that sent the message using the customer support contact information below.</li>
              </ul>
              <p className="mt-2">You may receive a one-time confirmation message after opting out. For help with messages, reply <strong style={{ color: colors.text }}>HELP</strong> or contact support.</p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>3. Customer Support Contact</h2>
              <p className="mb-2">For questions, opt-out requests, or support related to our services or SMS/email communications:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Visit our website at <a href="https://revolutionai.pro" className="underline" style={{ color: colors.cyan }}>revolutionai.pro</a> and use the contact or chat options provided.</li>
                <li>Email: <a href="mailto:support@revolutionai.pro" className="underline" style={{ color: colors.cyan }}>support@revolutionai.pro</a> (or the support email displayed on our site).</li>
                <li>Use the contact details provided in any SMS or email you receive from us or our clients.</li>
              </ul>
              <p className="mt-2">We will respond to support and opt-out requests in a timely manner.</p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>4. Message and Data Rate Disclosure</h2>
              <p>
                <strong style={{ color: colors.text }}>Message and data rates may apply.</strong> Standard messaging and data rates from your mobile carrier may apply to SMS and MMS messages sent to and from our services. You are responsible for any charges from your wireless provider. Check your carrier's plan for details. Consent to receive messages is not required as a condition of purchasing any goods or services.
              </p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>5. Carrier Liability Disclaimer</h2>
              <p>
                Wireless carriers (e.g., Verizon, AT&amp;T, T-Mobile, and others) are not liable for delayed or undelivered messages. We are not responsible for carrier outages, filtering, or delivery failures beyond our reasonable control. Message delivery is on a best-effort basis and is not guaranteed. Carriers may block or filter messages at their discretion.
              </p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>6. Age Restriction (18+)</h2>
              <p>
                Our services and any SMS or marketing communications are intended for users who are at least <strong style={{ color: colors.text }}>18 years of age</strong>. By using our services or providing your contact information, you represent that you are at least 18. We do not knowingly collect information from anyone under 18. If you believe we have received information from a minor, please contact us so we can delete it.
              </p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>7. Privacy Policy</h2>
              <p>
                Our collection, use, and disclosure of your information, including in connection with SMS and other communications, are described in our <Link to="/privacy" className="underline" style={{ color: colors.cyan }}>Privacy Policy</Link>. By using our services, you also agree to the terms of our Privacy Policy.
              </p>
            </motion.section>

            <motion.section variants={fadeUp} className="card rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>General Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Continued use of our services after changes constitutes acceptance. Our services are provided "as is" to the extent permitted by law. For full terms governing your use of our platform (including limitations of liability and dispute resolution), please review the complete terms provided to you when you sign up for our services or contact us.
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
            <Link to="/privacy" style={{ color: colors.cyan }}>Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
