import React, { useState } from 'react';
import InstitutionalCertificatesSection from '../components/InstitutionalCertificatesSection';
import { siteData } from '../data/siteData';
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  PhoneCall,
  Sparkles,
  Stethoscope,
  Cpu,
  Briefcase,
  Globe,
  Receipt,
  FileCheck,
} from 'lucide-react';

export default function PackagesPaymentPage({ onNavigate, onApplyWithPackage }) {
  // Active Stream Tab: 'mbbs' | 'btech' | 'mba' | 'abroad'
  const [activeStream, setActiveStream] = useState('mbbs');

  const handleSelectPackage = (pkg) => {
    if (onApplyWithPackage) {
      onApplyWithPackage(`${pkg.category}: ${pkg.name} (${pkg.price})`);
    }
    onNavigate('application');
  };

  const currentStreamData = siteData.streamPlans[activeStream] || siteData.streamPlans.mbbs;

  const streamTabs = [
    { id: 'mbbs', label: 'MBBS / Medical', icon: Stethoscope, count: '4 Plans' },
    { id: 'btech', label: 'B.Tech / Engineering', icon: Cpu, count: '4 Plans' },
    { id: 'mba', label: 'MBA / Management', icon: Briefcase, count: '2 Plans' },
    { id: 'abroad', label: 'Study Abroad', icon: Globe, count: 'Custom' },
  ];

  const flowSteps = [
    { num: '1', title: 'Plan Selection', desc: 'Choose stream & counselling tier' },
    { num: '2', title: 'Student Dossier', desc: 'Marks, percentile & category matrix' },
    { num: '3', title: 'Document Vetting', desc: 'Pre-screen domicile & certificates' },
    { num: '4', title: 'Choice Locking Sheet', desc: 'Data-backed closing rank order' },
    { num: '5', title: 'Admission Success', desc: 'Seat allotment & onboarding' },
  ];

  return (
    <div className="pt-28 pb-24 space-y-16 text-slate-800">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-300 shadow-sm inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Official Institutional Advisory Fees</span>
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900">
              Counselling Packages & Plans
            </h1>
            <p className="text-base text-slate-600 leading-relaxed font-normal">
              Transparent, flat fees with zero hidden contingencies. Backed by legally compliant mentorship contracts from <strong className="text-slate-900 font-bold">Cerebral Compass Pvt Ltd</strong>, verified predictive cutoff models, and GST tax invoicing.
            </p>
          </div>

          {/* Stream Selector Tab Bar */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {streamTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeStream === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStream(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-lg shadow-brand-600/30 scale-105'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-600'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stream Subtitle Banner */}
          <div className="mt-8 text-center">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
              {currentStreamData.streamTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentStreamData.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Package Cards Grid */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid gap-6 items-stretch ${
              currentStreamData.plans.length === 1
                ? 'max-w-xl mx-auto grid-cols-1'
                : currentStreamData.plans.length === 2
                ? 'max-w-4xl mx-auto grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {currentStreamData.plans.map((pkg) => {
              const isPopular = pkg.popular;
              return (
                <div
                  key={pkg.id}
                  className={`p-6 sm:p-7 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                    isPopular
                      ? 'bg-gradient-to-b from-sky-50/90 to-white border-2 border-brand-500 shadow-xl scale-[1.02] z-10'
                      : 'bg-white border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div className="space-y-5">
                    {/* Top Tag & Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-brand-700 font-bold px-2.5 py-0.5 bg-brand-50 rounded-full border border-brand-200">
                        {pkg.category}
                      </span>
                      {pkg.badge && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider ${
                            isPopular
                              ? 'bg-coral-500 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    {/* Plan Title & Price */}
                    <div>
                      <h3 className="font-display font-extrabold text-xl text-slate-900">
                        {pkg.name}
                      </h3>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
                          {pkg.price}
                        </span>
                        <span className="text-xs font-mono font-bold text-coral-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {pkg.tax}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-normal">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Deliverables Included:
                      </div>
                      <ul className="space-y-2">
                        {pkg.features.map((feat, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-700 font-normal leading-tight"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
                    <button
                      onClick={() => handleSelectPackage(pkg)}
                      className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                        isPopular
                          ? 'bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white shadow-lg shadow-brand-600/30 hover:scale-[1.02]'
                          : 'bg-slate-900 hover:bg-brand-700 text-white hover:scale-[1.02]'
                      }`}
                    >
                      <span>Enroll in {pkg.name} →</span>
                    </button>

                    <a
                      href={`https://wa.me/916204934005?text=Namaste%20Cerebral%20Compass%20Pvt%20Ltd,%20I%20am%20interested%20in%20${encodeURIComponent(pkg.name)}%20(${encodeURIComponent(pkg.price)}%20${encodeURIComponent(pkg.tax)}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[11px] font-bold font-mono border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
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

      {/* Transparency & Legal Assurance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Receipt className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-white text-sm">Official GST Tax Invoicing</h4>
              <p className="text-xs text-slate-400 mt-1">
                Every transaction includes a verified GST invoice with SAC Code 999293 (Educational Advisory Services). Input Tax Credit (ITC) compliant.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileCheck className="w-6 h-6 text-sky-400 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-white text-sm">Formal Counselling Contract</h4>
              <p className="text-xs text-slate-400 mt-1">
                Signed bilateral service agreement protecting student rights, detailing timeline commitments, and ensuring 100% merit adherence.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-white text-sm">Trademark Protected (™)</h4>
              <p className="text-xs text-slate-400 mt-1">
                Proprietary rank-prediction algorithms and sequential choice locking matrices protected under the Trade Marks Act, 1999.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Process Pipeline */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-sm">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold text-center mb-6">
              Standard Onboarding & Delivery Pipeline:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {flowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center group hover:border-brand-400 transition-all hover:shadow-md"
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

      {/* Institutional Accreditations, Legal Compliance & Certificates */}
      <InstitutionalCertificatesSection />
    </div>
  );
}
