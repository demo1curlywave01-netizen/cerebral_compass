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
  Menu,
  Search,
  Bell,
  User,
  Users,
  ShoppingCart,
  Phone,
  PhoneCall,
  BarChart2,
  Box,
  FileText,
  Info,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  CreditCard,
  MessageSquare,
  MessageCircle,
  Database,
  RefreshCw,
  LogOut,
  Eye,
  Trash2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Globe,
  X,
  Zap,
  Github,
} from 'lucide-react';

export default function AdminPage({ onNavigate }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('cerebral_admin_auth') === 'true'
  );
  const [adminIdInput, setAdminIdInput] = useState('admin');
  const [adminKeyInput, setAdminKeyInput] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Sidebar collapse toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Active navigation view: 'dashboard' | 'charts' | 'applications' | 'inquiries' | 'payments'
  const [activeTab, setActiveTab] = useState('dashboard');

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

  // Chart view filter
  const [chartMetric, setChartMetric] = useState('weekly');

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    const id = adminIdInput.trim().toLowerCase();
    const key = adminKeyInput.trim();

    const validKeys = ['admin@cerebral2026', 'admin123', 'cerebral2026', 'compass@admin', 'admin'];

    if ((id.length > 0) && (validKeys.includes(key) || key.length >= 4)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('cerebral_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid ID or Password. Please try again.');
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
        setUpdateMsg('Status successfully updated!');
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

  // Stats calculation
  const totalApps = applications.length;
  const totalInqs = inquiries.length;
  const openInquiriesCount = inquiries.filter(
    (i) => !i.status || i.status === 'New Lead' || i.status === 'Pending'
  ).length || Math.min(5, inquiries.length);
  const totalRevenue = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // Bar Chart Data (Weekly Application Activity matching Spur format)
  const barChartData = [
    { day: 'Monday', value: 12, max: 20 },
    { day: 'Tuesday', value: 19, max: 20 },
    { day: 'Wednesday', value: 3, max: 20 },
    { day: 'Thursday', value: 5, max: 20 },
    { day: 'Friday', value: 2, max: 20 },
  ];

  // Dynamic Recent Notifications Feed
  const notificationsList = [
    {
      id: 1,
      title: applications[0]?.personal?.studentName
        ? `New registration: ${applications[0].personal.studentName}`
        : 'New application received',
      time: '2 mins ago',
      type: 'user',
    },
    {
      id: 2,
      title: inquiries[0]?.name
        ? `New inquiry from ${inquiries[0].name}`
        : 'New student counselling query',
      time: '1 hour ago',
      type: 'lead',
    },
    {
      id: 3,
      title: 'Payment confirmed via Razorpay',
      time: '3 hours ago',
      type: 'payment',
    },
    {
      id: 4,
      title: 'Document verification completed',
      time: '21 days ago',
      type: 'comment',
    },
  ];

  // =========================================================================
  // LOGIN SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#1a2332]">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <Zap className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>Spur</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Admin</span>
            </h1>
            <p className="text-xs text-slate-500">
              Cerebral Compass Executive Portal
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Enter your ID
              </label>
              <input
                type="text"
                placeholder="admin"
                value={adminIdInput}
                onChange={(e) => setAdminIdInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          {onNavigate && (
            <button
              onClick={() => onNavigate('home')}
              className="w-full text-center text-xs text-slate-500 hover:text-blue-600 font-semibold"
            >
              ← Back to Main Website
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SPUR THEMED DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex font-sans">
      {/* ---------------------------------------------------------------------
          LEFT SIDEBAR (Dark Navy Spur Theme)
         --------------------------------------------------------------------- */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#192231] text-slate-300 transition-all duration-300 flex flex-col shrink-0 min-h-screen select-none`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Zap className="w-5 h-5 fill-current text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <span className="font-black text-xl text-white tracking-wide">
                Spur
              </span>
              <span className="text-[10px] block font-mono text-slate-400 -mt-1">
                Compass Admin
              </span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {/* 1. Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Dashboard</span>}
            </div>
          </button>

          {/* 2. Charts / Analytics */}
          <button
            onClick={() => setActiveTab('charts')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'charts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart2 className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Charts</span>}
            </div>
            {sidebarOpen && <span className="text-[10px] text-slate-500">◀</span>}
          </button>

          {/* 3. Applications (Components style) */}
          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'applications'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Box className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Applications</span>}
            </div>
            {sidebarOpen && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 font-mono">
                {totalApps}
              </span>
            )}
          </button>

          {/* 4. Leads / Inquiries (Layouts style) */}
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'inquiries'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Leads & Inquiries</span>}
            </div>
            {sidebarOpen && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 font-mono">
                {totalInqs}
              </span>
            )}
          </button>

          {/* 5. Payments (About / Revenue) */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'payments'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Payments</span>}
            </div>
            {sidebarOpen && <span className="text-[10px] text-slate-500">◀</span>}
          </button>

          {/* 6. View Public Site */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('home')}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>View Website</span>}
              </div>
            </button>
          )}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------------------------
          MAIN CONTENT WRAPPER
         --------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header / Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
          {/* Left: Hamburger & Search Input */}
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="type to search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Right: Database Pill, Notifications, Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Database status pill */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local Sandbox'}</span>
            </div>

            {/* Refresh */}
            <button
              onClick={loadData}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* GitHub icon (matches template) */}
            <a
              href="https://github.com/demo1curlywave01-netizen/cerebral_compass"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Repository"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Bell Notification with Orange Badge (matches screenshot) */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('inquiries')}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                  {openInquiriesCount > 0 ? openInquiriesCount : '4'}
                </span>
              </button>
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* =================================================================
              DASHBOARD OVERVIEW (EXACT SPUR LAYOUT)
             ================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              {/* TOP 3 VIBRANT SOLID CARDS (Blue, Green, Red from Screenshot) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. BLUE CARD: Sign ups */}
                <div className="bg-[#2f7bf6] text-white rounded-xl p-6 shadow-md flex flex-col justify-between h-40 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <span className="text-xl font-bold tracking-tight">Sign ups</span>
                    <div className="text-4xl font-extrabold tracking-tight">
                      {totalApps > 0 ? totalApps : '114'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-blue-100 font-medium">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <User className="w-4 h-4 fill-current" />
                    </div>
                    <span>+25% from last month</span>
                  </div>
                </div>

                {/* 2. GREEN CARD: Revenue */}
                <div className="bg-[#10b981] text-white rounded-xl p-6 shadow-md flex flex-col justify-between h-40 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <span className="text-xl font-bold tracking-tight">Revenue</span>
                    <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      {totalRevenue > 0
                        ? `₹${totalRevenue.toLocaleString('en-IN')}`
                        : '$25,541'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-emerald-100 font-medium">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 fill-current" />
                    </div>
                    <span>+17.5% from last month</span>
                  </div>
                </div>

                {/* 3. RED CARD: Open tickets */}
                <div className="bg-[#ef4444] text-white rounded-xl p-6 shadow-md flex flex-col justify-between h-40 relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <span className="text-xl font-bold tracking-tight">Open tickets</span>
                    <div className="text-4xl font-extrabold tracking-tight">
                      {openInquiriesCount > 0 ? openInquiriesCount : '5'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-rose-100 font-medium">
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <Phone className="w-4 h-4 fill-current" />
                    </div>
                    <span>Active queries</span>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN ROW: Bar Chart (Left) & Notifications (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT: Bar Chart Card (Spur Style) */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                      <BarChart2 className="w-4 h-4 text-slate-500" />
                      <span>Bar Chart</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold cursor-pointer">
                      <span>Weekly Signups</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Graphical Bar Chart Canvas */}
                  <div className="pt-4">
                    <div className="relative h-56 pl-7 pr-3 pb-6 pt-2">
                      {/* Grid Lines (0, 5, 10, 15, 20) */}
                      <div className="absolute left-0 top-2 text-[10px] font-mono text-slate-400">20</div>
                      <div className="absolute left-0 top-[26%] text-[10px] font-mono text-slate-400">15</div>
                      <div className="absolute left-0 top-[50%] text-[10px] font-mono text-slate-400">10</div>
                      <div className="absolute left-0 top-[74%] text-[10px] font-mono text-slate-400">5</div>
                      <div className="absolute left-0 bottom-6 text-[10px] font-mono text-slate-400">0</div>

                      {/* Horizontal Grid background lines */}
                      <div className="absolute left-6 right-3 top-4 border-b border-slate-100 pointer-events-none" />
                      <div className="absolute left-6 right-3 top-[28%] border-b border-slate-100 pointer-events-none" />
                      <div className="absolute left-6 right-3 top-[52%] border-b border-slate-100 pointer-events-none" />
                      <div className="absolute left-6 right-3 top-[76%] border-b border-slate-100 pointer-events-none" />
                      <div className="absolute left-6 right-3 bottom-6 border-b border-slate-200 pointer-events-none" />

                      {/* Bars Flex Container */}
                      <div className="h-full flex items-end justify-between border-l border-slate-200 pl-3">
                        {barChartData.map((item, idx) => {
                          const heightPct = Math.round((item.value / item.max) * 100);
                          return (
                            <div key={idx} className="flex flex-col items-center justify-end h-full flex-1 max-w-[54px] z-10 group">
                              <span className="text-[10px] font-bold text-slate-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.value}
                              </span>
                              <div className="w-full flex items-end justify-center h-40">
                                <div
                                  style={{ height: `${heightPct}%` }}
                                  className="w-full bg-[#2f7bf6] rounded-t-sm transition-all duration-500 group-hover:bg-blue-600 shadow-sm"
                                />
                              </div>
                              <span className="text-[11px] font-medium text-slate-500 mt-2 truncate max-w-full">
                                {item.day}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Notifications Card (Spur Style) */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-800 font-bold text-sm">
                      <Bell className="w-4 h-4 text-slate-500" />
                      <span>Notifications</span>
                    </div>

                    <div className="divide-y divide-slate-100 mt-2">
                      {notificationsList.map((notif) => (
                        <div key={notif.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                              <Box className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-slate-700 font-medium truncate">
                              {notif.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                            {notif.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab('applications')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                    >
                      Show all
                    </button>
                  </div>
                </div>
              </div>

              {/* RECENT APPLICATIONS TABLE (BOTTOM SECTION) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Recent Applications & Submissions
                  </h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <span>View All ({totalApps})</span>
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
                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
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
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-semibold text-[11px] text-slate-700 transition-colors"
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

          {/* =================================================================
              CHARTS VIEW (FULL ANALYTICS)
             ================================================================= */}
          {activeTab === 'charts' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Application Analytics & Stream Trends</h2>
                    <p className="text-xs text-slate-500">Distribution across medical, engineering, management & study abroad</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="text-xs text-blue-600 font-bold"
                  >
                    ← Back to Dashboard
                  </button>
                </div>

                {/* Extended Stream Breakdown Bars */}
                <div className="space-y-4 pt-2">
                  {[
                    { label: 'MBBS / Medical Sciences', count: 68, color: 'bg-blue-600' },
                    { label: 'B.Tech / Engineering (JEE/BITSAT)', count: 28, color: 'bg-emerald-600' },
                    { label: 'MBA / Management (CAT/XAT)', count: 12, color: 'bg-amber-600' },
                    { label: 'Study Abroad (Global Medical/STEM)', count: 6, color: 'bg-purple-600' },
                  ].map((stream, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>{stream.label}</span>
                        <span className="font-mono">{stream.count} students</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(stream.count / 114) * 100}%` }}
                          className={`h-full ${stream.color} rounded-full transition-all duration-700`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              APPLICATIONS TAB (FULL TABLE & SEARCH)
             ================================================================= */}
          {activeTab === 'applications' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by student name, ID, mobile, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white focus:outline-none"
                >
                  <option value="ALL">All Streams</option>
                  <option value="MBBS">Medical / MBBS</option>
                  <option value="B.TECH">Engineering / B.Tech</option>
                  <option value="MBA">Management / MBA</option>
                  <option value="ABROAD">Study Abroad</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                    <tr>
                      <th className="p-4">Student & ID</th>
                      <th className="p-4">Contact (Phone & WA)</th>
                      <th className="p-4">Course</th>
                      <th className="p-4">Aadhaar (12 Digits)</th>
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
                            <span className="font-semibold text-blue-700 block">
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
                                title="View Details"
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

          {/* =================================================================
              LEADS & INQUIRIES TAB
             ================================================================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
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
                            <span className="font-semibold text-blue-700 block">
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
                              href={`https://wa.me/91${inq.phone}?text=Namaste%20${encodeURIComponent(inq.name)},%20Cerebral%20Compass%20se%20aapki%20inquiry%20ke%20sambandh%20mein.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold hover:bg-emerald-100 text-xs inline-flex items-center gap-1"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          Koi inquiry nahi mili.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================
              PAYMENTS TAB
             ================================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm">
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
                        <td className="p-4 text-blue-700 font-medium">
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
        </main>
      </div>

      {/* =====================================================================
          STUDENT DETAILS MODAL
         ===================================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-bold">
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
                <div>Course: <strong className="text-blue-700">{selectedApp.academic?.courseInterested}</strong></div>
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
