import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, ChevronRight, User, LogOut, KeyRound } from 'lucide-react';
import { getCurrentUser, logout } from '../services/authService';

export default function Navbar({ activePage, setActivePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const handleAuthChange = (e) => {
      setCurrentUser(e.detail || getCurrentUser());
    };
    window.addEventListener('cerebral_auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('cerebral_auth_state_changed', handleAuthChange);
  }, [activePage]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setActivePage('home');
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'courses', label: 'Courses & Services' },
    { id: 'application', label: 'Counselling Form' },
    { id: 'packages', label: 'Packages' },
    { id: 'about', label: 'About & Contact' },
    { id: 'legal', label: 'Legal & Policy' },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-sky-100 shadow-sm py-2.5'
          : 'bg-white/85 backdrop-blur-md py-3.5 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Full Brand Logo - Bigger, clearly spaced */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center group text-left focus:outline-none pr-4 sm:pr-8"
        >
          <img
            src="/logo.png"
            alt="Cerebral Compass Pvt Ltd Logo"
            onError={(e) => {
              if (!e.currentTarget.dataset.fallback) {
                e.currentTarget.dataset.fallback = '1';
                e.currentTarget.src = '/logo.jpeg';
              }
            }}
            className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-slate-50/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-md shadow-brand-600/25'
                    : item.highlight
                    ? 'text-brand-700 hover:text-brand-900 hover:bg-sky-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {item.icon && <item.icon className="w-3.5 h-3.5 text-brand-600" />}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono uppercase bg-coral-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Candidate Authentication Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-1 pr-2 shadow-sm">
              <button
                onClick={() => handleNavClick('dashboard')}
                className="flex items-center gap-2 text-xs font-bold text-sky-900 hover:text-brand-700 transition-colors py-0.5 px-1.5"
                title="Open Candidate Dashboard & Application History"
              >
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px] font-extrabold shadow-sm shrink-0 overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (currentUser.name || 'C').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-left">
                  <span className="max-w-[110px] truncate block leading-tight font-extrabold text-slate-800">
                    {currentUser.name?.split(' ')[0] || 'Candidate'}
                  </span>
                  <span className="text-[9px] font-mono text-brand-600 block leading-none font-bold">
                    My History 📋
                  </span>
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-0.5"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                activePage === 'auth'
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-600 shadow-sm'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-brand-600" />
              <span>Candidate Login</span>
            </button>
          )}

          {/* Quick WhatsApp */}
          <a
            href="https://wa.me/916204934005?text=Hello%20Cerebral%20Compass,%20I%20need%20expert%20guidance%20for%20admissions."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-all shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Primary CTA */}
          <button
            onClick={() => handleNavClick('application')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>Apply Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-coral-500" /> : <Menu className="w-5 h-5 text-brand-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 backdrop-blur-2xl border-b border-sky-100 px-6 py-6 animate-fadeIn shadow-2xl">
          <div className="space-y-2">
            {/* Candidate Portal in Mobile */}
            {currentUser ? (
              <div className="p-3 mb-2 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 flex items-center justify-between">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-2.5 text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden shadow-sm">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (currentUser.name || 'C').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-brand-600 font-bold font-mono">View My Dossier History →</p>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-rose-600 font-bold border border-rose-200 rounded-lg bg-white hover:bg-rose-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-2"
              >
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-brand-600" />
                  <span>Candidate Login / Register</span>
                </div>
                <span className="text-[10px] bg-brand-600 text-white px-2 py-0.5 rounded-full">Sign In</span>
              </button>
            )}

            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-md'
                      : 'text-slate-700 hover:text-brand-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <item.icon className="w-4 h-4 text-brand-600" />}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono uppercase bg-coral-500 text-white px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 gap-3">
            <a
              href="https://wa.me/916204934005"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <button
              onClick={() => handleNavClick('application')}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 text-white text-xs font-bold"
            >
              Apply Now →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
