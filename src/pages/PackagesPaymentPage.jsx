import React from 'react';
import { siteData } from '../data/siteData';
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  PhoneCall,
} from 'lucide-react';

export default function PackagesPaymentPage({ onNavigate, onApplyWithPackage }) {
  const handleSelectPackage = (pkg) => {
    if (onApplyWithPackage) {
      onApplyWithPackage(pkg.name);
    }
    onNavigate('application');
  };

  const flowSteps = [
    { num: '1', title: 'Plan Selection', desc: 'Personalized choice' },
    { num: '2', title: 'Application Dossier', desc: 'Academic & rank profile' },
    { num: '3', title: 'Document Vetting', desc: 'Affidavits & certificates' },
    { num: '4', title: 'Choice Filling Sheet', desc: 'Predictive rank order' },
    { num: '5', title: 'Admission Success', desc: 'Seat allotment reporting' },
  ];

  return (
    <div className="pt-28 pb-24 space-y-20 text-slate-800">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-200">
              Guidance Tiers & Advisory Retainers
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900">
              Counselling Packages & Retainers
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Transparent, flat fees with zero hidden contingencies. Backed by legally compliant mentorship contracts, verified predictive rank models, and continuous parent support.
            </p>
          </div>

          {/* Workflow Pipeline Visualization */}
          <div className="mt-12 p-6 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold text-center mb-6">
              Standard Onboarding & Delivery Pipeline:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {flowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center group hover:border-brand-400 transition-all hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-mono font-bold text-xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Package Cards */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {siteData.packages.map((pkg) => {
              const isPopular = pkg.popular;
              return (
                <div
                  key={pkg.id}
                  className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                    isPopular
                      ? 'bg-gradient-to-b from-sky-50/70 to-white border-2 border-brand-500 shadow-2xl scale-105 z-10'
                      : 'bg-white border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div className="space-y-6">
                    {/* Top Tag */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-brand-700 font-bold">
                        {pkg.recommendedFor.split(' ')[0]} PLAN
                      </span>
                      {isPopular && (
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-coral-500 to-amber-500 text-white font-mono text-[10px] uppercase font-bold tracking-wider shadow-sm animate-pulse">
                          ★ Most Selected
                        </span>
                      )}
                    </div>

                    {/* Plan Title & Price */}
                    <div>
                      <h3 className="font-display font-extrabold text-2xl text-slate-900">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {pkg.description}
                      </p>

                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="text-sm text-slate-400 line-through">
                          {pkg.originalPrice}
                        </span>
                        <span className="text-3xl sm:text-4xl font-display font-black text-slate-900">
                          {pkg.price}
                        </span>
                        <span className="text-xs font-mono text-slate-400">/ Entire Season</span>
                      </div>
                    </div>

                    {/* Feature Checklist */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Deliverables Included:
                      </div>
                      <ul className="space-y-2.5">
                        {pkg.features.map((feat, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-xs text-slate-700 font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions (Direct Selection & WhatsApp) */}
                  <div className="pt-8 mt-6 border-t border-slate-100 space-y-3">
                    <button
                      onClick={() => handleSelectPackage(pkg)}
                      className={`w-full py-4 rounded-2xl font-display font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                        isPopular
                          ? 'bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white shadow-brand-600/25'
                          : 'bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200'
                      }`}
                    >
                      <span>Enroll in {pkg.name} →</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={`https://wa.me/919876543210?text=Hello%20Cerebral%20Compass,%20I%20am%20interested%20in%20enrolling%20for%20the%20${encodeURIComponent(pkg.name)}%20package.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ask Counsellor on WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Advisory Assurance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-900 font-bold block">
                Ethical Advisory Standards & Contract Security
              </span>
              <span>
                All counselling retainers are supported by official GST invoices and statutory advisory contracts. Transparent guidance with no hidden contingencies.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-700 font-bold">
              100% Transparency
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-700 font-bold">
              Dedicated Mentor
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
