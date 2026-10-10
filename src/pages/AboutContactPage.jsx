import React, { useState } from 'react';
import { siteData } from '../data/siteData';
import { sendContactInquiry } from '../services/api';
import confetti from 'canvas-confetti';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Target,
  HeartHandshake,
  Loader2,
} from 'lucide-react';

export default function AboutContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    stream: 'MBBS / Medical',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSending(true);
    

    try {
      await sendContactInquiry(formData);
      
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2b7ea4', '#38bdf8', '#e0533c'],
      });
      setSentSuccess(true);
      setFormData({ name: '', phone: '', email: '', stream: 'MBBS / Medical', message: '' });
    } catch {
      //
    } finally {
      setSending(false);
    }
  };

  const toggleFaq = (idx) => {
    
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <div className="pt-28 pb-24 space-y-24 light-mesh-bg text-slate-800">
      {/* =========================================================================
          THE CEREBRAL COMPASS STORY & MISSION
         ========================================================================= */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-700 font-bold bg-sky-100 px-4 py-1.5 rounded-full border border-sky-200">
                Our Genesis & Philosophy
              </span>

              <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 leading-tight">
                Navigating the Maze of Modern Higher Education.
              </h1>

              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                <p>
                  Every academic season across India and abroad, tens of thousands of meritorious students lose premier seats not due to lack of effort, but due to chaotic multi-portal counselling schedules, opaque seat-blocking rules, and ill-informed choice preference sheets.
                </p>
                <p>
                  <strong className="text-slate-900 font-bold">Cerebral Compass</strong> was established with a singular directive: to substitute emotional speculation with statistical cutoff intelligence. Combining over a decade of regulatory counselling mastery with proprietary seat-matrix tracking algorithms, we protect student potential and guide families with uncompromised integrity.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {[
                  { title: 'Zero Misdirection', desc: 'Strict merit & regulatory adherence', icon: ShieldCheck },
                  { title: 'Predictive Cutoffs', desc: '5-year statistical algorithm modeling', icon: Target },
                  { title: 'Complete Empathy', desc: 'Continuous parent & student reassurance', icon: HeartHandshake },
                ].map((pillar, i) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm space-y-2"
                    >
                      <Icon className="w-5 h-5 text-brand-600" />
                      <h4 className="font-display font-bold text-sm text-slate-900">{pillar.title}</h4>
                      <p className="text-xs text-slate-500">{pillar.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Brand Visual Artifact */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md p-8 rounded-3xl bg-white border border-sky-100 shadow-xl space-y-6 text-center">
                <img
                  src="/logo.png"
                  alt="Cerebral Compass"
                  className="w-44 h-auto mx-auto object-contain filter drop-shadow-sm"
                />
                <p className="text-xs text-slate-500 italic font-medium">
                  “Your Career. Your Direction. Your Future.”
                </p>
                <div className="pt-4 border-t border-slate-100 flex justify-around text-center">
                  <div>
                    <span className="font-display font-black text-xl text-slate-900">12k+</span>
                    <span className="text-[10px] font-mono text-slate-500 block font-semibold">Admissions</span>
                  </div>
                  <div>
                    <span className="font-display font-black text-xl text-brand-600">98.8%</span>
                    <span className="text-[10px] font-mono text-slate-500 block font-semibold">Retention</span>
                  </div>
                  <div>
                    <span className="font-display font-black text-xl text-emerald-600">14+</span>
                    <span className="text-[10px] font-mono text-slate-500 block font-semibold">Yrs Mastery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* =========================================================================
          CONTACT FORM & PHYSICAL CONTACT INFO
         ========================================================================= */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Contact Details & Coordinates */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-200">
                Direct Touchpoints
              </span>

              <h2 className="text-3xl font-display font-bold text-slate-900">
                Connect With Our Admission HQ
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Whether you need in-person counselling at our corporate office or a secure virtual session on Google Meet, our team is accessible.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900">Physical Address</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{siteData.brand.address}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900">Direct Helpline</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono font-medium">{siteData.brand.phone}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-coral-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900">Official Correspondence</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{siteData.brand.email}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900">Operational Hours</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{siteData.brand.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-3xl bg-white border border-sky-100 shadow-xl">
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                  Send An Instant Admission Inquiry
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Fill in your details for an immediate callback and cutoff feasibility summary.
                </p>

                {sentSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="font-display font-bold text-lg text-slate-900">Inquiry Received</h4>
                    <p className="text-xs text-emerald-800 font-medium">
                      Our Senior Counsellor has been notified and will message you on WhatsApp within 30 minutes with preliminary cutoff figures.
                    </p>
                    <button
                      onClick={() => setSentSuccess(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Rahul Verma"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                          Mobile / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="student@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                          Stream of Interest
                        </label>
                        <select
                          value={formData.stream}
                          onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                        >
                          <option>MBBS / Medical (NEET)</option>
                          <option>B.Tech / Engineering (JEE/JoSAA)</option>
                          <option>MBA / Management (CAT/XAT)</option>
                          <option>UG & PG (CUET/Law)</option>
                          <option>Study Abroad (Global)</option>
                          <option>Education Loan Assistance</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-700 font-semibold block mb-1">
                        Your Query, Rank or Target Colleges
                      </label>
                      <textarea
                        rows={3}
                        placeholder="State your score, rank, budget or questions..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-brand-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Routing to Senior Counsellor...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Dispatch Consultation Request</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION SECTION
         ========================================================================= */}
      <section className="relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-700 font-bold bg-sky-100 px-4 py-1.5 rounded-full border border-sky-200">
              Clarity & Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Frequently Answered Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers regarding our methodology, payment security, and regulatory protocols.
            </p>
          </div>

          <div className="space-y-3">
            {siteData.faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-sky-100 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-900 hover:text-brand-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-brand-600 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
