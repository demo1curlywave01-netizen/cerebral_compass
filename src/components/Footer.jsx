import React, { useState } from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribed(true);
  };

  return (
    <footer className="relative bg-[#0b2540] text-slate-200 pt-16 pb-12 overflow-hidden border-t border-sky-900/50">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-sky-800/40">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <img
              src="/logo.png"
              alt="Cerebral Compass"
              className="h-14 w-auto object-contain brightness-110 filter drop-shadow"
            />

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed font-normal">
              “Your Career. Your Direction. Your Future.” Proprietary data-backed counselling algorithms for Medical, Engineering, Management, and International admissions.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playTick()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Instant WhatsApp Helpline</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Home Page', id: 'home' },
                { label: 'Courses & Services', id: 'courses' },
                { label: 'Counselling Form (Apply)', id: 'application' },
                { label: 'Counselling Packages', id: 'packages' },
                { label: 'About & Leadership', id: 'about' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      
                      onNavigate(item.id);
                    }}
                    className="hover:text-sky-300 transition-colors text-slate-300 hover:translate-x-1 inline-block"
                  >
                    → {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Domains */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Admissions
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• MBBS / Medical (NEET UG/PG)</li>
              <li>• B.Tech / Engineering (JoSAA & CSAB)</li>
              <li>• MBA / Management (CAT & XAT)</li>
              <li>• UG & PG (CUET & Law)</li>
              <li>• Study Abroad (USA, UK, Europe)</li>
              <li>• Education Loans (SBI & NBFCs)</li>
            </ul>
          </div>

          {/* Contact & Alerts */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Counselling Alerts
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Get timely notification alerts when MCC, JoSAA, and State Round 1 choice filling locks open.
            </p>
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter parent or student email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-sky-800/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Subscribe for Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscribed! You will receive verified cutoff alerts.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-normal">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>
              ISO 9001:2015 Certified Educational Consultancy • Data Privacy Compliant
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('legal')}
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('legal')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('legal')}
              className="hover:text-white transition-colors"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
