import React, { useState } from 'react';
import CompassHeroNew from '../components/CompassHeroNew';
import DirectionFinder from '../components/DirectionFinder';
import { siteData } from '../data/siteData';
import {
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Stethoscope,
  Cpu,
  Briefcase,
  GraduationCap,
  Globe,
  Award,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  BadgePercent,
  MessageCircle,
  Users,
} from 'lucide-react';

export default function HomePage({ onNavigate, onApplyWithCourse }) {
  const domainIcons = {
    mbbs: Stethoscope,
    btech: Cpu,
    mba: Briefcase,
    ug_pg: GraduationCap,
    abroad: Globe,
  };
  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* =========================================================================
          HERO SECTION WITH ANIMATED TICKER & HIGH-PRECISION COMPASS
         ========================================================================= */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 overflow-hidden">
        {/* Glowing Aurora backdrops */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-sky-200/50 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-rose-200/35 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy & Value Proposition */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-sky-200 shadow-md animate-float">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-ping" />
                <span className="text-xs font-mono tracking-wide text-brand-800 font-extrabold uppercase">
                  Admissions 2026-2027 Strategy Open
                </span>
              </div>

              {/* Tagline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Your Career.{' '}
                <span className="text-brand-600 block sm:inline">Your Direction.</span>{' '}
                <span className="text-coral-500 block">Your Future.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {siteData.brand.subtagline} High-precision choice filling, 10-year closing rank analytics, and accredited admission guidance.
              </p>

              {/* Stream Pills Bar */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                {['MBBS', 'B.Tech', 'MBA', 'UG / PG', 'Study Abroad'].map((s) => (
                  <span
                    key={s}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-semibold text-slate-700 shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                    {s}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <button
                  onClick={() => {
                    const finderEl = document.getElementById('direction-finder-section');
                    if (finderEl) finderEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-bold text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <Compass className="w-4 h-4 animate-spin-slow" />
                  <span>Find Your Direction Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('packages')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all hover:border-brand-300 hover:scale-105"
                >
                  <span>Counselling Packages</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">100% Merit Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-slate-700">ISO 9001:2015 Certified</span>
                </div>
              </div>
            </div>

            {/* Right: The High-Precision Animated Compass Hero */}
            <div className="lg:col-span-6 relative flex justify-center">
              <CompassHeroNew
                onApplyWithCourse={(code) => {
                  if (onApplyWithCourse) onApplyWithCourse(code);
                  onNavigate('application');
                }}
              />
            </div>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white/95 border border-sky-100 shadow-[0_15px_35px_rgba(43,126,164,0.08)] backdrop-blur-xl">
            {[
              { label: 'Students Mentored', val: '12,400+', icon: Users, color: 'text-brand-600' },
              { label: 'Seat Allotment Ratio', val: '98.8%', icon: TrendingUp, color: 'text-emerald-600' },
              { label: 'Loan Facilitated', val: '₹22+ Cr', icon: BadgePercent, color: 'text-sky-600' },
              { label: 'Partner Institutions', val: '450+', icon: Award, color: 'text-coral-500' },
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="flex items-center gap-3 p-2 group hover:translate-x-1 transition-transform">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
                      {m.val}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 font-medium">{m.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE FIND YOUR DIRECTION SECTION
         ========================================================================= */}
      <section id="direction-finder-section" className="scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-700 font-bold bg-sky-100 px-3.5 py-1 rounded-full border border-sky-200">
              Personalized Guidance Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Interactive Find Your Direction
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Answer 3 brief questions to let our proprietary counselling algorithm chart your career azimuth and projected colleges.
            </p>
          </div>

          <DirectionFinder
            onNavigateToApply={(stream) => {
              if (onApplyWithCourse) onApplyWithCourse(stream);
              onNavigate('application');
            }}
          />
        </div>
      </section>

      {/* =========================================================================
          COURSES & DOMAINS SHOWCASE
         ========================================================================= */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-brand-700 font-bold bg-sky-100 px-3.5 py-1 rounded-full border border-sky-200">
                Specialized Verticals
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mt-3">
                Targeted Admissions Counselling
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mt-1">
                From high-stakes NEET AIQ rounds to JoSAA CSAB spot counselling and Ivy-League global applications.
              </p>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-400 text-xs font-semibold text-slate-700 hover:text-brand-700 flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 self-start md:self-auto"
            >
              <span>Explore All Verticals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.domains.map((dom) => {
              const Icon = domainIcons[dom.id] || Compass;
              return (
                <div
                  key={dom.id}
                  className="bg-white rounded-3xl border border-sky-100 hover:border-brand-400 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-brand-700 shadow-sm group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                        {dom.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-brand-700 transition-colors">
                        {dom.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {dom.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Key Exam Targets:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {dom.targetExams.map((ex) => (
                          <span
                            key={ex}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono font-medium"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (onApplyWithCourse) onApplyWithCourse(dom.id);
                        onNavigate('application');
                      }}
                      className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Apply For Counselling</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate('courses')}
                      className="text-xs text-slate-400 hover:text-slate-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          KEY SERVICES PREVIEW (SHORTLISTING, DOCS, LOANS)
         ========================================================================= */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-coral-600 font-bold bg-rose-100 px-3.5 py-1 rounded-full border border-rose-200">
              End-To-End Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Our Core Institutional Services
            </h2>
            <p className="text-sm text-slate-600">
              Beyond guidance, we execute every procedural requirement so you never risk seat cancellation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteData.services.map((srv) => (
              <div
                key={srv.id}
                className="p-8 rounded-3xl bg-white border border-sky-100 hover:border-brand-400 transition-all hover:shadow-2xl hover:-translate-y-1.5 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-brand-700 shadow-sm">
                  {srv.id === 'shortlisting' && <Compass className="w-6 h-6 text-brand-600" />}
                  {srv.id === 'documentation' && <FileCheck className="w-6 h-6 text-emerald-600" />}
                  {srv.id === 'loan' && <BadgePercent className="w-6 h-6 text-coral-500" />}
                </div>

                <div>
                  <span className="text-xs font-mono text-brand-700 uppercase tracking-wider font-semibold">
                    {srv.subtitle}
                  </span>
                  <h3 className="text-xl font-display font-bold text-slate-900 mt-1">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                    {srv.description}
                  </p>
                </div>

                <ul className="space-y-2 pt-2 border-t border-slate-100">
                  {srv.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* =========================================================================
          HIGH-CONVERTING WHATSAPP + CONSULTATION CTA BANNER
         ========================================================================= */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-sky-900 p-8 sm:p-14 overflow-hidden shadow-2xl text-white">
            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 font-bold bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-400/40">
                Direct Counsellor Access
              </span>

              <h2 className="text-3xl sm:text-5xl font-display font-black leading-tight">
                Don’t Risk Your Career With Uncertain Choice Filling.
              </h2>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                Connect directly with our senior admission directors on WhatsApp for immediate NEET / JEE / CAT rank audit and cutoff possibilities.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <a
                  href="https://wa.me/919876543210?text=Hello%20Cerebral%20Compass,%20I%20would%20like%20a%20personal%20counselling%20consultation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Start WhatsApp Consultation Now</span>
                </a>

                <button
                  onClick={() => onNavigate('application')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <span>Submit Counselling Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
