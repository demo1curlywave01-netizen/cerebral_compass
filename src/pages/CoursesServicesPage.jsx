import React, { useState } from 'react';
import InstitutionalCertificatesSection from '../components/InstitutionalCertificatesSection';
import { siteData } from '../data/siteData';
import {
  Stethoscope,
  Cpu,
  Briefcase,
  GraduationCap,
  Globe,
  Search,
  CheckCircle2,
  ArrowRight,
  Target,
  FileCheck,
  BadgePercent,
  Info,
} from 'lucide-react';

export default function CoursesServicesPage({ onNavigate, onApplyWithCourse }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceModal, setSelectedServiceModal] = useState(null);

  const domainIcons = {
    mbbs: Stethoscope,
    btech: Cpu,
    mba: Briefcase,
    ug_pg: GraduationCap,
    abroad: Globe,
  };

  const filteredDomains = siteData.domains.filter((d) => {
    const matchesTab = activeTab === 'all' || d.id === activeTab;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.targetExams.some((ex) => ex.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="pt-28 pb-24 space-y-20 light-mesh-bg text-slate-800">
      {/* Page Header */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-700 font-bold bg-sky-100 px-4 py-1.5 rounded-full border border-sky-200">
              Academic Spectrum & Institutional Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900">
              Courses, Cutoffs & Advisory Verticals
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Explore specialized counselling pathways spanning NEET Medical, JoSAA Engineering, IIM Management, Central UG/PG, and World-Class Global Universities.
            </p>
          </div>

          {/* Search & Tabs Toolbar */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white border border-sky-100 shadow-sm">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: 'all', label: 'All Courses' },
                { id: 'mbbs', label: 'MBBS / Medical' },
                { id: 'btech', label: 'B.Tech / Engg' },
                { id: 'mba', label: 'MBA / Mgmt' },
                { id: 'ug_pg', label: 'UG & PG' },
                { id: 'abroad', label: 'Study Abroad' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    
                    setActiveTab(tab.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-md shadow-brand-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search exam, branch, college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Domain Cards Grid */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredDomains.map((dom) => {
              const Icon = domainIcons[dom.id] || GraduationCap;
              return (
                <div
                  key={dom.id}
                  className="bg-white border border-sky-100 hover:border-brand-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-brand-700 shadow-sm">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-xl text-slate-900">
                            {dom.title}
                          </h3>
                          <span className="text-[11px] font-mono text-brand-700 font-semibold uppercase tracking-wider">
                            Admissions Guidance 2026-27
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 shrink-0 font-bold">
                        {dom.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {dom.description}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                        Counselling Blueprint Includes:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dom.features.map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs text-slate-700 font-medium"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Colleges preview */}
                    <div className="pt-2">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                        Target Institutional Hubs:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {dom.colleges.map((c, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-100 text-slate-700 font-medium"
                          >
                            🏛️ {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        
                        setSelectedServiceModal(dom);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>View Detailed Syllabus & Cutoffs</span>
                    </button>

                    <button
                      onClick={() => {
                        
                        if (onApplyWithCourse) onApplyWithCourse(dom.id);
                        onNavigate('application');
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center justify-center gap-1.5 transition-all hover:scale-105"
                    >
                      <span>Apply For {dom.shortTitle}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Institutional Certificates & Trust Section */}
      <InstitutionalCertificatesSection />



      {/* Modal for Service Deep Dive */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="max-w-xl w-full bg-white border border-sky-100 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-brand-700">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    {selectedServiceModal.title}
                  </h3>
                  <span className="text-xs font-mono text-brand-700 font-semibold">
                    Comprehensive Dossier & Rules
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>{selectedServiceModal.description}</p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase font-mono text-brand-700">
                  Key Guidance Protocols:
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-700">
                  {selectedServiceModal.features.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  
                  if (onApplyWithCourse) onApplyWithCourse(selectedServiceModal.id);
                  setSelectedServiceModal(null);
                  onNavigate('application');
                }}
                className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20"
              >
                Proceed to Apply Now →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
