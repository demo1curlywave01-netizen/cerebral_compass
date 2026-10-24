import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../services/authService';
import { fetchUserByUid, createPaymentOrderApi, verifyPaymentApi } from '../services/userService';
import { fetchAllApplications } from '../services/supabaseClient';
import { getWhatsAppInvoiceUrl } from '../services/api';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Lock,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Download,
  LogOut,
  Sparkles,
  Calendar,
  Award,
  BookOpen,
  Headphones,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';

export default function CandidateDashboardPage({ onNavigate, onSelectApplication }) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [userRecord, setUserRecord] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying65, setPaying65] = useState(false);
  const [payError, setPayError] = useState('');

  const loadData = async () => {
    setLoading(true);
    const user = getCurrentUser();
    setCurrentUser(user);

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch user profile and installment details by UID
      const userRes = await fetchUserByUid(user.uid);
      if (userRes?.success && userRes?.user) {
        setUserRecord(userRes.user);
      }

      // 2. Fetch all applications matching this user's email, phone, or UID
      const allApps = await fetchAllApplications();
      const userEmail = (user.email || '').toLowerCase().trim();
      const userPhone = (user.phone || '').replace(/\D/g, '');

      const matched = (allApps || []).filter((app) => {
        const appEmail = (app.personal?.email || '').toLowerCase().trim();
        const appMobile = (app.personal?.mobile || '').replace(/\D/g, '');
        const appUid = app.uid || app.user_id;

        return (
          (user.uid && appUid === user.uid) ||
          (userEmail && appEmail && userEmail === appEmail) ||
          (userPhone && appMobile && userPhone.length >= 10 && appMobile.includes(userPhone))
        );
      });

      setApplications(matched);
    } catch (err) {
      console.error('Error loading candidate history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleAuthChange = (e) => {
      setCurrentUser(e.detail);
      loadData();
    };
    window.addEventListener('cerebral_auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('cerebral_auth_state_changed', handleAuthChange);
  }, []);

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    if (onNavigate) onNavigate('home');
  };

  // 65% Remaining Installment payment handler
  const handlePayRemaining65 = async () => {
    if (!userRecord) return;
    setPaying65(true);
    setPayError('');

    try {
      const orderRes = await createPaymentOrderApi(userRecord.uid, 2);
      if (!orderRes.success) {
        throw new Error(orderRes.error || 'Failed to initiate payment.');
      }

      // Load Razorpay Checkout Script if not ready
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });
      }

      const options = {
        key: orderRes.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        order_id: orderRes.orderId && !orderRes.orderId.startsWith('order_cc_') ? orderRes.orderId : undefined,
        amount: Math.round(Number(orderRes.amount) * 100),
        currency: 'INR',
        name: 'Cerebral Compass Pvt Ltd',
        description: `Installment 2 (Remaining 65% Balance) — ${userRecord.name || userRecord.student_name}`,
        image: '/logo.png',
        handler: async function (response) {
          try {
            const verifyRes = await verifyPaymentApi({
              orderId: response.razorpay_order_id || orderRes.orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              uid: userRecord.uid,
              installmentNumber: 2,
            });

            if (verifyRes.success) {
              await loadData();
            }
          } catch (e) {
            console.error('Verification error:', e);
          }
        },
        prefill: {
          name: userRecord.name || userRecord.student_name,
          email: userRecord.email,
          contact: userRecord.phone || userRecord.mobile,
        },
        theme: {
          color: '#0284c7',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPayError(err.message || 'Payment initiation failed.');
    } finally {
      setPaying65(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-sky-100 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-extrabold text-slate-900">
              Candidate Login Required
            </h2>
            <p className="text-sm text-slate-600">
              Please sign in with your verified Google account or registered credentials to view your application history and admission dossier.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onNavigate && onNavigate('auth')}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="w-full py-3 px-6 rounded-2xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active dossier details - strictly derived from real submitted applications
  const activeApp = applications.length > 0 ? applications[0] : null;

  return (
    <div className="pt-28 pb-24 light-mesh-bg text-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Candidate Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-500/10 via-sky-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left User Info */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-600 to-indigo-600 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-brand-500/25 shrink-0">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  (currentUser.name || 'C').charAt(0).toUpperCase()
                )}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
                    {currentUser.name || 'Candidate'}
                  </h1>
                  {applications.length > 0 ? (
                    <span className="px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{applications[0].status?.includes('Verified') ? 'Verified Candidate' : 'Application Submitted'}</span>
                    </span>
                  ) : (
                    <span className="px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Registered Account</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-brand-600" />
                    {currentUser.email}
                  </span>
                  {currentUser.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-brand-600" />
                      +91 {currentUser.phone}
                    </span>
                  )}
                  <span className="font-mono text-slate-400 text-xs">
                    UID: {currentUser.uid?.slice(0, 15)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate && onNavigate('application')}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Application</span>
              </button>
              <button
                onClick={loadData}
                disabled={loading}
                title="Refresh Records"
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-600' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Installment Milestone Alert Banner if Active */}
        {userRecord && userRecord.installment1_status === 'paid' && (
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-blue-50 border-2 border-brand-500 shadow-xl space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-300 text-brand-700 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] uppercase font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 35% Advance Registration Paid ✓
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 leading-snug">
                    Installment 1 Received. Remaining 65% ({userRecord.installment2_amount ? `₹${Number(userRecord.installment2_amount).toLocaleString('en-IN')}` : 'Balance'})
                    {userRecord.installment2_status === 'pending'
                      ? ' is now ready for choice locking payment.'
                      : ' will unlock after senior counselling review.'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Package: <strong className="text-slate-800">{userRecord.package_selected || 'Admission Dossier'}</strong> • Stage: <strong className="text-brand-700">{userRecord.stage || 'In Progress'}</strong>
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {userRecord.installment2_status === 'pending' ? (
                <button
                  onClick={handlePayRemaining65}
                  disabled={paying65}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 shrink-0 hover:scale-105 active:scale-95 transition-all"
                >
                  {paying65 ? (
                    <span>Opening Gateway...</span>
                  ) : (
                    <>
                      <span>Pay 65% Balance Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-mono text-xs flex items-center gap-1.5 shrink-0">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>65% Balance (Locked)</span>
                </div>
              )}
            </div>
            {payError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {payError}
              </div>
            )}
          </div>
        )}

        {/* Main Grid: Application History & Dossier Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Applications & Status History */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <h2 className="text-xl font-display font-extrabold text-slate-900">
                  Application Dossiers & History
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {applications.length} Record{applications.length !== 1 ? 's' : ''} Found
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="p-10 rounded-3xl bg-white border border-dashed border-sky-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-display font-bold text-slate-800">
                    No Registered Dossiers Found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You haven’t submitted an official admission counselling application yet. Start your application to unlock personalized choice sheets.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('application')}
                  className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Fill Counselling Form Now</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app, idx) => (
                  <div
                    key={app.id || idx}
                    className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-300 shadow-md hover:shadow-xl transition-all space-y-4"
                  >
                    {/* Top Row: Ref ID + Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Application Reference ID
                        </span>
                        <span className="text-base font-mono font-extrabold text-brand-700">
                          {app.id || 'CC-2026-NEET'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-mono font-bold">
                          {app.currentStage || app.status || 'Under Review'}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{app.paymentStatus || 'Confirmed'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Middle Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Target Course</span>
                        <strong className="text-slate-900 text-sm">{app.academic?.courseInterested || 'MBBS'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Entrance Exam / Rank</span>
                        <strong className="text-slate-900">
                          {app.academic?.entranceExam || 'NEET'} ({app.academic?.rankScore || 'Score Submitted'})
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Category</span>
                        <strong className="text-slate-900">{app.academic?.category || 'General / UR'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Submitted Date</span>
                        <strong className="text-slate-700">
                          {app.submittedAt
                            ? new Date(app.submittedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'October 2026'}
                        </strong>
                      </div>
                    </div>

                    {/* Package and Payment Info */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">Selected Package: </span>
                        <strong className="text-slate-900">{app.packageSelected || 'Standard Dossier'}</strong>
                        {app.transactionId && (
                          <span className="block text-[11px] font-mono text-slate-500 mt-0.5">
                            Txn ID: {app.transactionId}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={getWhatsAppInvoiceUrl(app)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Receipt</span>
                        </a>
                        <button
                          onClick={() => onNavigate && onNavigate('application')}
                          className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-600" />
                          <span>View Form</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Col: Counsellor & Support Dossier Card */}
          <div className="space-y-6">
            {applications.length === 0 ? (
              <>
                {/* Admissions Helpdesk & Support Desk (When No Application Submitted) */}
                <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-xl space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Headphones className="w-5 h-5 text-brand-600" />
                    <h3 className="text-base font-display font-extrabold text-slate-900">
                      Admissions Helpdesk
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    <p>
                      Have queries about admission guidelines, category reservations, or choosing the right counselling package?
                    </p>
                    <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 space-y-1">
                      <span className="font-bold block">Direct Student Helpline</span>
                      <p className="text-[11px] text-sky-700 leading-relaxed">
                        Our admissions support desk is available daily from 9:30 AM to 7:00 PM to guide you before you submit your application.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <a
                      href={`https://wa.me/916204934005?text=Hello%20Cerebral%20Compass,%20I%20am%20${encodeURIComponent(
                        currentUser.name || 'Candidate'
                      )}.%20I%20have%20an%20inquiry%20regarding%20admission%20counselling.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <a
                      href="tel:+916204934005"
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-brand-600" />
                      <span>Call +91 62049 34005</span>
                    </a>
                  </div>
                </div>

                {/* Counselling Roadmap & Process Card */}
                <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Sparkles className="w-5 h-5 text-brand-600" />
                    <h3 className="text-base font-display font-extrabold text-slate-900">
                      How Counselling Works
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <strong className="text-slate-900 block font-semibold">Submit Counselling Application</strong>
                        <span className="text-slate-500 text-[11px] leading-relaxed block">
                          Enter your academic details, target course, and preferred colleges.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <strong className="text-slate-900 block font-semibold">Document & Score Verification</strong>
                        <span className="text-slate-500 text-[11px] leading-relaxed block">
                          Your genuine Aadhaar, scorecards, and board certificates are validated.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <strong className="text-slate-900 block font-semibold">Dedicated Counsellor Allocation</strong>
                        <span className="text-slate-500 text-[11px] leading-relaxed block">
                          A designated senior strategist is assigned to personally curate your choice matrix.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Real Assigned Senior Counsellor Card */}
                <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-xl space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Headphones className="w-5 h-5 text-brand-600" />
                    <h3 className="text-base font-display font-extrabold text-slate-900">
                      {activeApp?.counsellor?.name ? 'Assigned Senior Counsellor' : 'Counsellor Allocation'}
                    </h3>
                  </div>

                  {activeApp?.counsellor?.name ? (
                    <>
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-extrabold text-xl shrink-0">
                          {activeApp.counsellor.name
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase() || 'SC'}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{activeApp.counsellor.name}</h4>
                          <p className="text-xs text-brand-700 font-semibold">
                            {activeApp.counsellor.title || activeApp.counsellor.role || 'Senior Admissions Strategist'}
                          </p>
                          {activeApp.counsellor.phone && (
                            <p className="text-[11px] text-slate-500">{activeApp.counsellor.phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 space-y-1">
                        <span className="font-bold block">Direct Hotline & WhatsApp Desk</span>
                        <p className="text-[11px] text-sky-700 leading-relaxed">
                          Your designated counsellor is available from 9:30 AM to 7:00 PM for rank analysis, state quota reviews, and choice matrix locking.
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <a
                          href={`https://wa.me/${(activeApp.counsellor.phone || '916204934005').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                            activeApp.counsellor.name
                          )},%20I%20am%20${encodeURIComponent(
                            currentUser.name || 'Candidate'
                          )}%20(Ref:%20${activeApp.id || ''}).%20I%20need%20assistance%20with%20my%20counselling%20application.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Connect via WhatsApp</span>
                        </a>
                        <a
                          href={`tel:${(activeApp.counsellor.phone || '+916204934005').replace(/\s/g, '')}`}
                          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4 text-brand-600" />
                          <span>Call {activeApp.counsellor.phone || '+91 62049 34005'}</span>
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Allocation in Progress</span>
                        </div>
                        <p className="text-[11px] text-amber-700 leading-relaxed">
                          Your application has been received. Our senior counselling committee is reviewing your academic details and will assign your dedicated advisor within 24 hours.
                        </p>
                      </div>
                      <a
                        href="https://wa.me/916204934005?text=Hello,%20I%20have%20submitted%20my%20counselling%20application%20and%20would%20like%20to%20know%20the%20status%20of%20my%20counsellor%20allocation."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Inquire on WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Dynamic Real Verification Checklist */}
                <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-brand-600" />
                      <h3 className="text-base font-display font-extrabold text-slate-900">
                        Application Checklist
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                      {activeApp?.id || 'Active'}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-700 font-medium">Aadhaar / ID</span>
                      {activeApp?.personal?.aadhaar ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Submitted (•••• {activeApp.personal.aadhaar.replace(/\D/g, '').slice(-4)})
                        </span>
                      ) : (
                        <span className="text-slate-500 font-semibold flex items-center gap-1 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> Not Provided
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-700 font-medium">Academic Records</span>
                      {(activeApp?.documents && activeApp.documents.length > 0) || activeApp?.academic?.tenthDetails ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Recorded
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold flex items-center gap-1 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending Upload
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-700 font-medium">Entrance Scorecard</span>
                      {activeApp?.academic?.rankScore ? (
                        <span className="text-brand-700 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                          {activeApp.academic.rankScore}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-semibold flex items-center gap-1 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> In Evaluation
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-700 font-medium">Choice Preference Sheet</span>
                      {activeApp?.currentStage?.toLowerCase().includes('choice') || activeApp?.status?.toLowerCase().includes('choice') ? (
                        <span className="text-amber-700 font-bold flex items-center gap-1 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Ready
                        </span>
                      ) : (
                        <span className="text-slate-500 font-semibold flex items-center gap-1 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> Post-Review
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
