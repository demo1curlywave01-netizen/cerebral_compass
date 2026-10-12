import React, { useState } from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, CheckCircle2, Phone, Mail } from 'lucide-react';

export default function Footer({ onNavigate }) {

  return (
    <footer className="relative bg-[#0b2540] text-slate-200 pt-16 pb-12 overflow-hidden border-t border-sky-900/50">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-sky-800/40">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-white/20">
              <img
                src="/logo.png"
                alt="Cerebral Compass Pvt Ltd"
                className="h-20 w-auto object-contain"
              />
            </div>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed font-normal">
              “Your Career. Your Direction. Your Future.” <strong className="text-white font-semibold">Cerebral Compass Pvt Ltd</strong> — Trademark Registered & MCA Incorporated Educational Consultancy for Medical, Engineering, Management, and Global admissions.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/916204934005"
                target="_blank"
                rel="noopener noreferrer"
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

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Contact & Support
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Have admission queries or need cutoff advice? Connect directly with our senior advisors.
            </p>

            <button
              onClick={() => onNavigate('about')}
              className="w-full py-2.5 px-4 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 space-y-1.5 text-xs text-slate-300 font-mono">
              <a
                href="tel:+917779820944"
                className="hover:text-sky-300 flex items-center gap-2 transition-colors"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+91 77798 20944</span>
              </a>
              <a
                href="mailto:thecerebralcompass@gmail.com"
                className="hover:text-sky-300 flex items-center gap-2 transition-colors truncate"
              >
                <Mail className="w-3 h-3 text-sky-400" />
                <span>thecerebralcompass@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-normal">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>
              Cerebral Compass Pvt Ltd • Trademark Registered • 100% GST Invoicing Compliant
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
