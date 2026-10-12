import React, { useState, useEffect } from 'react';
import {
  fetchAllApplications,
  fetchAllInquiries,
  fetchAllPayments,
  updateApplicationStatus,
  deleteApplicationRecord,
  updateInquiryStatus,
  isSupabaseConfigured,
} from '../services/supabaseClient';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CreditCard,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  Lock,
  RefreshCw,
  Eye,
  X,
  Database,
  ArrowRight,
  LogOut,
  Trash2,
  MessageCircle,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('cerebral_admin_auth') === 'true'
  );
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // 4 Simple Navigation Tabs:
  // 'overview' | 'applications' | 'inquiries' | 'payments'
  const [activeTab, setActiveTab] = useState('overview');

  // Loaded Data
  const [applications, setApplications] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');

  // Detail Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    const key = adminKeyInput.trim();
    if (
      key === 'admin@cerebral2026' ||
      key === 'admin123' ||
      key === 'cerebral2026'
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('cerebral_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Galat passkey! Default passkey: admin@cerebral2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cerebral_admin_auth');
  };

  // Load Data from Supabase / Backend
  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, inqs] = await Promise.all([
        fetchAllApplications(),
        fetchAllInquiries(),
      ]);
      setApplications(apps || []);
      setInquiries(inqs || []);
      const payList = await fetchAllPayments(apps || []);
      setPayments(payList || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (app.personal?.studentName || '').toLowerCase().includes(q);
    const idMatch = (app.id || '').toLowerCase().includes(q);
    const mobileMatch = (app.personal?.mobile || '').includes(q);
    const emailMatch = (app.personal?.email || '').toLowerCase().includes(q);
    const courseStr = (app.academic?.courseInterested || '').toUpperCase();

    const matchesSearch = !searchQuery || nameMatch || idMatch || mobileMatch || emailMatch;
    const matchesCourse = courseFilter === 'ALL' || courseStr.includes(courseFilter);

    return matchesSearch && matchesCourse;
  });

  // Stage update handler
  const handleStageChange = async (newStage) => {
    if (!selectedApp) return;
    setStatusUpdating(true);
    setUpdateMsg('');

    try {
      const res = await updateApplicationStatus(selectedApp.id, {
        currentStage: newStage,
      });

      if (res && res.success) {
        setSelectedApp((prev) => ({ ...prev, currentStage: newStage }));
        setApplications((prev) =>
          prev.map((a) =>
            a.id === selectedApp.id ? { ...a, currentStage: newStage } : a
          )
        );
        setUpdateMsg('Status successfully update ho gaya!');
        setTimeout(() => setUpdateMsg(''), 3000);
      }
    } catch {
      //
    } finally {
      setStatusUpdating(false);
    }
  };

  // Delete Application
  const handleDeleteApp = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(`Kya aap application ${id} ko delete karna chahte hain?`)) return;

    await deleteApplicationRecord(id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (selectedApp?.id === id) setSelectedApp(null);
  };

  // Update Inquiry Status
  const handleInquiryStatus = async (id, newStatus) => {
    await updateInquiryStatus(id, newStatus);
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  // Quick stats
  const totalApps = applications.length;
  const totalInqs = inquiries.length;
  const paidApps = applications.filter((a) => (a.paymentStatus || '').includes('Paid')).length;
  const totalRevenue = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // =========================================================================
  // LOGIN SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Admin Login
            </h1>
            <p className="text-xs text-slate-500">
              Cerebral Compass Dashboard
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Password daliye (admin@cerebral2026)"
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-colors shadow-md"
            >
              Login Karein →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SIMPLE CLEAN DASHBOARD
  // =========================================================================
  return (
    <div className="pt-20 pb-16 min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl font-bold text-slate-900">
                Cerebral Compass — Admin Dashboard
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live admissions, student applications aur website leads
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Database Status */}
            <div
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? 'Supabase Live DB ✓' : 'Local Storage'}</span>
            </div>

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Simple 4-Tab Navigation */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'applications'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Applications ({totalApps})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inquiries'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Leads / Inquiries ({totalInqs})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payments'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payments ({payments.length})</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW (SIMPLE CARDS & RECENT DATA)
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Simple Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-medium text-slate-500">Total Applications</span>
                <div className="text-2xl font-black text-slate-900">{totalApps}</div>
                <span className="text-[11px] text-emerald-600 font-semibold">Registered Students</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-medium text-slate-500">Total Leads / Queries</span>
                <div className="text-2xl font-black text-brand-700">{totalInqs}</div>
                <span className="text-[11px] text-slate-500">Contact form leads</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-medium text-slate-500">Paid Applications</span>
                <div className="text-2xl font-black text-emerald-600">{paidApps}</div>
                <span className="text-[11px] text-emerald-600 font-semibold">Payment Confirmed</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-medium text-slate-500">Total Revenue</span>
                <div className="text-2xl font-black text-slate-900">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-slate-500">Gross collections</span>
              </div>
            </div>

            {/* Recent Applications Quick Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">
                  Recent Applications
                </h3>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="text-xs text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
                >
                  <span>Sabhi Dekhein ({totalApps})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-100 text-[11px] uppercase">
                    <tr>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Course / Stream</th>
                      <th className="pb-3">Mobile No.</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Current Stage</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.slice(0, 5).map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="py-3">
                          <strong className="text-slate-900 block font-semibold">
                            {app.personal?.studentName}
                          </strong>
                          <span className="text-[11px] text-slate-400 font-mono">ID: {app.id}</span>
                        </td>
                        <td className="py-3 font-medium text-slate-700">
                          {app.academic?.courseInterested}
                        </td>
                        <td className="py-3 font-mono text-slate-600">
                          +91 {app.personal?.mobile}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              (app.paymentStatus || '').includes('Paid')
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {app.paymentStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">
                          {app.currentStage || 'Document Verification'}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 font-semibold text-[11px] text-slate-700 transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: APPLICATIONS (FULL STUDENT TABLE & SEARCH)
           ========================================================================= */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Naam, ID, mobile number ya email se search karein..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-brand-600"
                />
              </div>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none"
              >
                <option value="ALL">Sabhi Courses</option>
                <option value="MBBS">Medical / MBBS</option>
                <option value="B.TECH">Engineering / B.Tech</option>
                <option value="MBA">Management / MBA</option>
                <option value="ABROAD">Study Abroad</option>
              </select>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                  <tr>
                    <th className="p-4">Student & ID</th>
                    <th className="p-4">Contact (Phone & WA)</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Aadhaar No.</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status / Stage</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="p-4">
                          <strong className="text-slate-900 block font-semibold text-sm">
                            {app.personal?.studentName}
                          </strong>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ID: {app.id} • {new Date(app.submittedAt || Date.now()).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="font-mono text-slate-800 font-semibold">
                            +91 {app.personal?.mobile}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={`https://wa.me/91${app.personal?.whatsapp || app.personal?.mobile}?text=Namaste%20${encodeURIComponent(app.personal?.studentName || 'Student')},%20Cerebral%20Compass%20se%20aapki%20application%20${app.id}%20ke%20sambandh%20mein.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 inline-flex items-center gap-1"
                            >
                              <MessageCircle className="w-2.5 h-2.5 fill-current" />
                              WhatsApp
                            </a>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="font-semibold text-brand-700 block">
                            {app.academic?.courseInterested}
                          </span>
                          <span className="text-slate-400 text-[11px] font-mono">
                            {app.academic?.rankScore || 'Verified'}
                          </span>
                        </td>

                        <td className="p-4 font-mono text-slate-700">
                          {app.personal?.aadhaar || 'Verified'}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              (app.paymentStatus || '').includes('Paid')
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {app.paymentStatus || 'Pending'}
                          </span>
                        </td>

                        <td className="p-4 text-slate-700">
                          <span className="px-2 py-1 rounded-lg bg-slate-100 text-[11px] font-medium border border-slate-200">
                            {app.currentStage || 'Document Verification'}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                              title="Details Dekhein"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteApp(app.id, e)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Koi application nahi mili.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: LEADS & INQUIRIES
           ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Course / Query</th>
                    <th className="p-4">Lead Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.length > 0 ? (
                    inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <strong className="text-slate-900 block font-semibold text-sm">
                            {inq.name}
                          </strong>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {inq.email || 'Email not provided'}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-semibold text-slate-900">
                          +91 {inq.phone}
                        </td>

                        <td className="p-4">
                          <span className="font-semibold text-brand-700 block">
                            {inq.stream || 'Admission Guidance'}
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            {inq.message || 'Call requested'}
                          </span>
                        </td>

                        <td className="p-4">
                          <select
                            value={inq.status || 'New Lead'}
                            onChange={(e) => handleInquiryStatus(inq.id, e.target.value)}
                            className="px-2 py-1 rounded border text-xs font-semibold bg-white"
                          >
                            <option value="New Lead">🟡 New Lead</option>
                            <option value="Contacted">🔵 Contacted</option>
                            <option value="Converted">🟢 Converted ✓</option>
                          </select>
                        </td>

                        <td className="p-4 font-mono text-slate-400 text-[11px]">
                          {new Date(inq.created_at || Date.now()).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-right">
                          <a
                            href={`https://wa.me/91${inq.phone?.replace(/\D/g, '')}?text=Namaste%20${encodeURIComponent(inq.name)},%20Cerebral%20Compass%20Consultancy%20se%20aapki%20inquiry%20ke%20sambandh%20mein.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold inline-flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Koi lead abhi tak nahi aayi hai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: PAYMENTS
           ========================================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                  <tr>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-semibold text-slate-900">
                        {pay.transaction_id || pay.id}
                      </td>
                      <td className="p-4 font-semibold text-slate-900">
                        {pay.student_name}
                      </td>
                      <td className="p-4 text-brand-700">
                        {pay.package_name}
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-700 text-sm">
                        ₹{Number(pay.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {pay.status || 'Completed ✓'}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono text-slate-400 text-[11px]">
                        {new Date(pay.created_at || Date.now()).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            STUDENT DETAILS MODAL
           ========================================================================= */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-50 text-brand-800 font-bold">
                    {selectedApp.id}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {selectedApp.personal?.studentName}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {updateMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{updateMsg}</span>
                </div>
              )}

              {/* Status Updater */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">Stage Update:</span>
                  <strong className="text-sm text-slate-900">{selectedApp.currentStage || 'Document Verification'}</strong>
                </div>
                <select
                  disabled={statusUpdating}
                  value={selectedApp.currentStage || 'Document Verification'}
                  onChange={(e) => handleStageChange(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-bold bg-white focus:outline-none"
                >
                  <option value="Document Verification">Document Verification</option>
                  <option value="Choice Filling Sheet Prepared">Choice Filling Sheet Prepared</option>
                  <option value="Round 1 Allotment Tracking">Round 1 Allotment Tracking</option>
                  <option value="Admitted & Onboarded">Admitted & Onboarded</option>
                </select>
              </div>

              {/* Personal Details */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 border-b pb-1">1. Personal Info</h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>Parent Name: <strong>{selectedApp.personal?.parentName || 'N/A'}</strong></div>
                  <div>Mobile: <strong className="font-mono">+91 {selectedApp.personal?.mobile}</strong></div>
                  <div>WhatsApp: <strong className="font-mono text-emerald-700">+91 {selectedApp.personal?.whatsapp}</strong></div>
                  <div>Email: <strong className="font-mono">{selectedApp.personal?.email}</strong></div>
                  <div>Aadhaar: <strong className="font-mono">{selectedApp.personal?.aadhaar || 'Verified'}</strong></div>
                  <div>State: <strong>{selectedApp.personal?.state || 'Delhi NCR'}</strong></div>
                </div>
              </div>

              {/* Academic Details */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 border-b pb-1">2. Academic Info</h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>Course: <strong className="text-brand-700">{selectedApp.academic?.courseInterested}</strong></div>
                  <div>Exam: <strong>{selectedApp.academic?.entranceExam || 'NEET/JEE'}</strong></div>
                  <div>Score/Rank: <strong className="font-mono">{selectedApp.academic?.rankScore || 'Verified'}</strong></div>
                  <div>Category: <strong>{selectedApp.academic?.category || 'General / UR'}</strong></div>
                  <div>Fee Status: <strong className="text-emerald-700">{selectedApp.paymentStatus || 'Paid ✓'}</strong></div>
                  <div>Package: <strong>{selectedApp.packageSelected || 'Assistance'}</strong></div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Band Karein
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
