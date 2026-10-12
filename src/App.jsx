import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import InteractiveBackground from './components/InteractiveBackground';
import HomePage from './pages/HomePage';
import CoursesServicesPage from './pages/CoursesServicesPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import PackagesPaymentPage from './pages/PackagesPaymentPage';
import AboutContactPage from './pages/AboutContactPage';
import LegalPage from './pages/LegalPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const getInitialPage = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path === '/admin' ||
        path.startsWith('/admin/') ||
        hash.includes('admin') ||
        search.includes('admin')
      ) {
        return 'admin';
      }
    }
    return 'home';
  };

  const [activePage, setActivePage] = useState(getInitialPage);
  const [prefilledCourse, setPrefilledCourse] = useState('');
  const [selectedPackageName, setSelectedPackageName] = useState('');
  const [activeApplicationId, setActiveApplicationId] = useState('');

  // Handle browser URL /admin routing and back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path === '/admin' ||
        path.startsWith('/admin/') ||
        hash.includes('admin') ||
        search.includes('admin')
      ) {
        setActivePage('admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser address bar when switching to or from admin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activePage === 'admin') {
        if (window.location.pathname !== '/admin') {
          window.history.pushState(null, '', '/admin');
        }
      } else if (window.location.pathname === '/admin') {
        window.history.pushState(null, '', '/');
      }
    }
  }, [activePage]);

  // Scroll smoothly to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Handlers for cross-page interactive pipelines
  const handleApplyWithCourse = (courseCode) => {
    setPrefilledCourse(courseCode);
    setActivePage('application');
  };

  const handleApplyWithPackage = (pkgName) => {
    setSelectedPackageName(pkgName);
    setActivePage('application');
  };

  const handleApplicationSuccess = (appId) => {
    setActiveApplicationId(appId);
    setActivePage('packages');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col relative selection:bg-brand-500 selection:text-white">
      {/* Interactive Dynamic Animated Background (Particles + Fluid Aurora) */}
      <InteractiveBackground />

      {/* Persistent Navigation Bar with Bigger Logo & Spacing */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Page View with Sliding Experience */}
      <main className="flex-grow relative z-10">
        <div key={activePage} className="page-slide-in">
          {activePage === 'home' && (
            <HomePage
              onNavigate={setActivePage}
              onApplyWithCourse={handleApplyWithCourse}
            />
          )}

          {activePage === 'courses' && (
            <CoursesServicesPage
              onNavigate={setActivePage}
              onApplyWithCourse={handleApplyWithCourse}
            />
          )}

          {activePage === 'application' && (
            <ApplicationFormPage
              initialCourse={prefilledCourse}
              initialPackage={selectedPackageName}
              onNavigate={setActivePage}
              onApplicationSuccess={handleApplicationSuccess}
            />
          )}

          {activePage === 'packages' && (
            <PackagesPaymentPage
              onNavigate={setActivePage}
              onApplyWithPackage={handleApplyWithPackage}
            />
          )}

          {activePage === 'about' && (
            <AboutContactPage />
          )}

          {activePage === 'legal' && (
            <LegalPage />
          )}

          {activePage === 'admin' && (
            <AdminPage />
          )}
        </div>
      </main>

      {/* Floating Interactive WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Global Footer */}
      <Footer onNavigate={setActivePage} />
    </div>
  );
}
