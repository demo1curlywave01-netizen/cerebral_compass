import React, { useState } from 'react';
import InstitutionalCertificatesSection from '../components/InstitutionalCertificatesSection';
import {
  FileText,
  Shield,
  RefreshCw,
  XCircle,
  HardDrive,
  AlertTriangle,
  Mail,
  Printer,
} from 'lucide-react';

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState('terms');

  const tabs = [
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'refund', label: 'Payment & Refund Policy', icon: RefreshCw },
    { id: 'cancellation', label: 'Cancellation Policy', icon: XCircle },
    { id: 'data', label: 'Document & Data Handling', icon: HardDrive },
    { id: 'disclaimer', label: 'Outcome Disclaimer', icon: AlertTriangle },
    { id: 'support', label: 'Support & Grievances', icon: Mail },
  ];

  return (
    <div className="pt-28 pb-24 space-y-12 light-mesh-bg text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-600 font-bold bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
            Regulatory & Institutional Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900">
            Legal, Policy & Governance Terms
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Last Updated: Academic Admissions Cycle 2026-2027. Governed by the laws of India and applicable educational frameworks.
          </p>
        </div>

        {/* Layout: Sidebar Tabs + Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="p-3 rounded-2xl bg-white border border-sky-100 shadow-sm space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      
                      setActiveTab(tab.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-md shadow-brand-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-between shadow-sm">
              <span>Need a signed copy?</span>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 font-medium"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>

          {/* Main Legal Content Panel */}
          <div className="lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-white border border-sky-100 shadow-xl text-slate-700 text-xs sm:text-sm leading-relaxed space-y-6">
            {/* 1. TERMS & CONDITIONS */}
            {activeTab === 'terms' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-display font-bold text-slate-900 border-b border-slate-100 pb-3">
                  1. Terms & Conditions of Advisory Service
                </h2>
                <p>
                  Welcome to <strong className="text-slate-900 font-bold">Cerebral Compass Pvt Ltd</strong>. By accessing this platform, submitting an application dossier, or engaging in consultation services, you agree to comply with the terms stipulated herein.
                </p>
                <h3 className="font-bold text-slate-900 text-sm pt-2">1.1 Nature of Services</h3>
                <p>
                  Cerebral Compass Pvt Ltd provides professional career counseling, predictive cutoff modeling, college shortlisting, documentation auditing, and institutional choice filling guidance. We act exclusively as independent educational strategists and advisors.
                </p>
                <h3 className="font-bold text-slate-900 text-sm pt-2">1.2 Candidate Responsibility</h3>
                <p>
                  The candidate and parent/guardian are solely responsible for verifying the authenticity of submitted marks, caste categories, domicile documents, and entrance exam credentials. Any misrepresentation will result in immediate termination of mentorship without refund.
                </p>
                <h3 className="font-bold text-slate-900 text-sm pt-2">1.3 Intellectual Property & Trademark</h3>
                <p>
                  All proprietary cutoff ranking software, algorithm outputs, choice sheets, and custom diagnostic reports generated by Cerebral Compass Pvt Ltd remain our exclusive intellectual property protected under the Trade Marks Act, 1999 and Copyright laws of India.
                </p>
              </div>
            )}

            {/* 2. PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-display font-bold text-slate-900 border-b border-slate-100 pb-3">
                  2. Privacy Policy & Digital Personal Data Protection
                </h2>
                <p>
                  We are deeply committed to student data privacy in strict compliance with the Digital Personal Data Protection (DPDP) Act, 2023, and international privacy standards.
                </p>
                <h3 className="font-bold text-slate-900 text-sm pt-2">2.1 Information Collected</h3>
                <p>
                  We collect student names, contact information, date of birth, exam scores, scorecards, and identity proofs purely for the execution of college shortlisting and portal verification.
                </p>
                <h3 className="font-bold text-slate-900 text-sm pt-2">2.2 Non-Disclosure to Third Parties</h3>
                <p>
                  We explicitly state that we NEVER sell, broker, or rent candidate personal details or phone numbers to third-party telemarketers, unsolicited private coaching academies, or unauthorized agents.
                </p>
                <h3 className="font-bold text-slate-900 text-sm pt-2">2.3 Encryption Standards</h3>
                <p>
                  All communication channels are encrypted with TLS 1.3, and uploaded identity and academic credentials are encrypted at rest using AES-256 standard encryption on dedicated servers.
                </p>
              </div>
            )}

            {/* 3. PAYMENT & REFUND POLICY */}
            {activeTab === 'refund' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-display font-bold text-slate-900 border-b border-slate-100 pb-3">
                  3. Payment & Refund Policy
                </h2>
                <p>
                  We adhere to ethical and transparent commercial billing practices. All package fees are published openly on our platform with zero hidden commissions.
                </p>
                <h3 className="font-bold text-slate-900 text-sm pt-2">3.1 Payment Processing</h3>
                <p>
                  Payments are processed through verified PCI-DSS compliant gateways such as Razorpay, supporting UPI, NetBanking, and credit/debit cards. We never hold or store raw payment card data on our servers.
                </p>
                <h3 className="font-bold text-slate-900 text-sm pt-2">3.2 Refund Conditions</h3>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  <li>
                    <strong>Pre-Session Cancellation:</strong> If a cancellation is requested in writing within 48 hours of payment AND prior to the first 1-on-1 strategy session, an 80% refund will be issued (20% administrative handling fee deducted).
                  </li>
                  <li>
                    <strong>Post-Session Delivery:</strong> Once the dedicated counsellor has formulated the custom choice locking sheet or conducted 1-on-1 strategy sessions, no refunds will be granted, as intellectual services have been rendered.
                  </li>
                </ul>
              </div>
            )}

            {/* 4. CANCELLATION POLICY */}
            {activeTab === 'cancellation' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-display font-bold text-slate-900 border-b border-slate-100 pb-3">
                  4. Cancellation Policy
                </h2>
                <p>
                  Candidates who wish to withdraw their counselling enrollment must submit an official cancellation request via their registered email to <span className="text-brand-700 font-mono font-bold">thecerebralcompass@gmail.com</span> quoting their Application ID.
                </p>
                <p>
                  Refund processing takes 5 to 7 business days following formal approval and is returned to the original source account.
                </p>
              </div>
            )}

            {/* 5. DOCUMENT & DATA HANDLING */}
            {activeTab === 'data' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-display font-bold text-slate-900 border-b border-slate-100 pb-3">
                  5. Document & Data Handling Architecture
                </h2>
                <p>
                  Because educational admissions require sensitive personal records (Aadhaar, passport, domicile certificates, caste verification, scorecards), we have implemented strict physical and digital isolation protocols.
                </p>
                <h3 className="font-bold text-slate-900 text-sm pt-2">5.1 Server-Side Storage</h3>
                <p>
                  No documents are left unencrypted or exposed in public browser stores. All uploaded records are dispatched directly to secure cloud storage vaults with unique hash checksums.
                </p>
                <h3 className="font-bold text-slate-900 text-sm pt-2">5.2 Data Retention & Purging</h3>
                <p>
                  Candidate documents are automatically scheduled for permanent deletion from active servers 90 days after the completion of the respective academic year's final stray vacancy round, unless retention is mandated by law.
                </p>
              </div>
            )}

            {/* 6. OUTCOME DISCLAIMER */}
            {activeTab === 'disclaimer' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-display font-bold text-slate-900 border-b border-slate-100 pb-3">
                  6. Mandatory Disclaimer Regarding Admission Outcomes
                </h2>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  ⚠️ <strong>IMPORTANT NOTICE FOR STUDENTS & PARENTS:</strong>
                </div>
                <p>
                  Seat allocation in any medical, engineering, management, or university institution in India and abroad is governed strictly by competent statutory authorities (including the Medical Counselling Committee - MCC, National Medical Commission - NMC, JoSAA, CSAB, state DME authorities, and individual university boards).
                </p>
                <p>
                  Cerebral Compass is an educational consultancy that assists in data analysis, candidate profile optimization, strategic choice-filling sequences, and documentation preparation.
                </p>
                <p className="font-semibold text-slate-900">
                  We DO NOT sell, guarantee, or manufacture seats under any illegal "management backdoor quota" or bypass statutory entrance exam merit. Any claim made by unauthorized individuals in our name guaranteeing a seat is fraudulent and should be reported immediately.
                </p>
              </div>
            )}

            {/* 7. SUPPORT & GRIEVANCES */}
            {activeTab === 'support' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-xl font-display font-bold text-slate-900 border-b border-slate-100 pb-3">
                  7. Support & Grievance Redressal
                </h2>
                <p>
                  If you have concerns, feedback, or queries regarding service delivery, our Grievance Officer is available to assist:
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p><strong className="text-slate-900">Grievance Officer:</strong> Adv. Sandeep Rawat</p>
                  <p><strong className="text-slate-900">Designation:</strong> Head of Regulatory Affairs & Grievances</p>
                  <p><strong className="text-slate-900">Email:</strong> thecerebralcompass@gmail.com</p>
                  <p><strong className="text-slate-900">Escalation TAT:</strong> Official reply within 24 to 48 business hours</p>
                  <p><strong className="text-slate-900">Office Address:</strong> Muzaffarpur, Bihar - 842002</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Institutional Accreditations, Legal Compliance & Certificates */}
      <InstitutionalCertificatesSection />
    </div>
  );
}
