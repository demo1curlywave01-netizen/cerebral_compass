import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, ChevronRight } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div className="hidden md:flex items-center gap-3">
          {/* Quick WhatsApp */}
          <a
            href="https://wa.me/917779820944?text=Hello%20Cerebral%20Compass,%20I%20need%20expert%20guidance%20for%20admissions."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-all shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Primary CTA */}
          <button
            onClick={() => handleNavClick('application')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all hover:scale-105 active:scale-95"
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
              href="https://wa.me/917779820944"
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
