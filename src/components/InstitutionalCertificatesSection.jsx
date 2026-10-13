import React from 'react';
import {
  ShieldCheck,
  Building2,
  FileText,
  Scale,
  BookmarkCheck,
  Receipt,
  ExternalLink,
  Download,
} from 'lucide-react';

export default function InstitutionalCertificatesSection() {
  return (
    <section className="relative py-12 border-t border-b border-sky-100/60 bg-gradient-to-b from-slate-50/60 via-white to-sky-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-300 shadow-sm inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Government Recognized & Statutory Compliant</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Institutional Accreditations, Legal Compliance & Certificates
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            <strong className="text-slate-900 font-bold">Cerebral Compass Pvt Ltd</strong> is a government-incorporated corporate entity operating with registered trademarks, certified GST tax invoicing, and legally binding client counselling contracts.
          </p>
        </div>

        {/* 3 Main Official PDF Document Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Document 1: SPICE+ MCA Approval Letter */}
          <div className="bg-white rounded-3xl p-7 border-2 border-sky-100 hover:border-brand-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-brand-600 shadow-sm group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  MCA Approved ✓
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase text-brand-700 tracking-wider">
                  Ministry of Corporate Affairs
                </span>
                <h3 className="font-display font-bold text-xl text-slate-900 mt-1">
                  SPICE+ Incorporation & Approval Letter
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Official Government of India approval under the Companies Act, 2013 formally incorporating <strong className="text-slate-800">Cerebral Compass Pvt Ltd</strong>. Complete statutory corporate verification.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span>Govt Authority:</span>
                  <strong className="text-slate-900">MCA / ROC India</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Format:</span>
                  <span className="text-brand-700 font-bold">Official PDF Document</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <a
                href="/documents/spice-approval-letter.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-600/20 transition-all hover:scale-102"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View PDF</span>
              </a>
              <a
                href="/documents/spice-approval-letter.pdf"
                download="Cerebral_Compass_Pvt_Ltd_SPICE_Plus_Approval.pdf"
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Document 2: Official Career Counselling Contract */}
          <div className="bg-white rounded-3xl p-7 border-2 border-emerald-100 hover:border-emerald-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Legal Contract ✓
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase text-emerald-700 tracking-wider">
                  Student & Parent Protection
                </span>
                <h3 className="font-display font-bold text-xl text-slate-900 mt-1">
                  Career Counselling & Service Agreement
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Legally vetted bilateral agreement signed with parents and students guaranteeing clear deliverables, zero hidden fees, verified milestone timelines, and complete consumer safeguards.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span>Contract Scope:</span>
                  <strong className="text-slate-900">Merit Admission Support</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Format:</span>
                  <span className="text-emerald-700 font-bold">Official Agreement PDF</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <a
                href="/documents/career-counselling-contract.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Contract</span>
              </a>
              <a
                href="/documents/career-counselling-contract.pdf"
                download="Cerebral_Compass_Career_Counselling_Contract.pdf"
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                title="Download Contract"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Document 3: All Legal Pages Dossier */}
          <div className="bg-white rounded-3xl p-7 border-2 border-slate-200 hover:border-slate-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                  <Scale className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                  Statutory Dossier ✓
                </span>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase text-slate-600 tracking-wider">
                  Full Regulatory Compliance
                </span>
                <h3 className="font-display font-bold text-xl text-slate-900 mt-1">
                  All Legal, Privacy & Policy Pages
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Complete institutional documentation including Terms & Conditions, Digital Personal Data Protection (DPDP Act) privacy shield, fair cancellation rules, and grievance escalation mechanism.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span>Governing Law:</span>
                  <strong className="text-slate-900">Laws of India (NCR)</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Format:</span>
                  <span className="text-slate-800 font-bold">Complete Legal Dossier PDF</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <a
                href="/documents/all-legal-pages.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Legal Pages</span>
              </a>
              <a
                href="/documents/all-legal-pages.pdf"
                download="Cerebral_Compass_All_Legal_Pages.pdf"
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                title="Download Legal Pages"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 2 Special Trust Pillars: Trademark & GST Tax Invoicing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Trademark Registered Box */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-white to-sky-50/60 border border-sky-200 shadow-sm flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0 shadow-sm">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-brand-700 font-bold bg-brand-100 px-2 py-0.5 rounded">
                  Trade Marks Act, 1999
                </span>
                <span className="text-xs text-slate-500 font-mono">Government Certified</span>
              </div>
              <h4 className="font-display font-extrabold text-lg text-slate-900">
                Government Trademark Registered Brand (™)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                <strong className="text-slate-900">Cerebral Compass™</strong> is a registered trademark under the Government of India. Our diagnostic choice-filling software, historical closing rank databases, and counselling matrices are legally protected intellectual property with zero tolerance for unaccredited duplicates.
              </p>
            </div>
          </div>

          {/* GST Tax Invoicing Box */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-white to-emerald-50/60 border border-emerald-200 shadow-sm flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  100% Tax Compliant
                </span>
                <span className="text-xs text-slate-500 font-mono">SAC Code 999293</span>
              </div>
              <h4 className="font-display font-extrabold text-lg text-slate-900">
                Official GST Invoicing & Reconciled Payments
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Every fee payment made via Razorpay or direct bank transfer receives a computerized, verified GST Tax Invoice from <strong className="text-slate-900">Cerebral Compass Pvt Ltd</strong>. Eligible for Input Tax Credit (ITC) with zero cash dealings or unauthorized surcharges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
