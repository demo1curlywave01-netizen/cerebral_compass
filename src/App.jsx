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
import AuthPage from './pages/AuthPage';
import CandidateDashboardPage from './pages/CandidateDashboardPage';

export default function App() {
  const getInitialRouting = () => {
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
        return { page: 'admin', legalTab: 'terms' };
      }
      if (path.includes('privacy') || hash.includes('privacy') || search.includes('privacy')) {
        return { page: 'legal', legalTab: 'privacy' };
      }
      if (path.includes('terms') || hash.includes('terms') || search.includes('terms')) {
        return { page: 'legal', legalTab: 'terms' };
      }
      if (path.includes('refund') || hash.includes('refund') || search.includes('refund')) {
        return { page: 'legal', legalTab: 'refund' };
      }
      if (path === '/legal' || hash.includes('legal')) {
        return { page: 'legal', legalTab: 'terms' };
      }
      if (path === '/courses' || hash.includes('courses')) {
        return { page: 'courses', legalTab: 'terms' };
      }
      if (path === '/about' || hash.includes('about')) {
        return { page: 'about', legalTab: 'terms' };
      }
      if (path === '/auth' || path === '/login' || hash.includes('login') || hash.includes('auth')) {
        return { page: 'auth', legalTab: 'terms' };
      }
    }
    return { page: 'home', legalTab: 'terms' };
  };

  const initialRoute = getInitialRouting();
  const [activePage, setActivePage] = useState(initialRoute.page);
  const [activeLegalTab, setActiveLegalTab] = useState(initialRoute.legalTab);
  const [prefilledCourse, setPrefilledCourse] = useState('');
  const [selectedPackageName, setSelectedPackageName] = useState('');
  const [activeApplicationId, setActiveApplicationId] = useState('');

  // Handle browser URL routing and back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRouting();
      setActivePage(route.page);
      if (route.page === 'legal') {
        setActiveLegalTab(route.legalTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser address bar cleanly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activePage === 'admin') {
        if (window.location.pathname !== '/admin') {
          window.history.pushState(null, '', '/admin');
        }
      } else if (activePage === 'legal') {
        const targetPath = activeLegalTab === 'privacy' ? '/privacy-policy' : activeLegalTab === 'terms' ? '/terms' : '/legal';
        if (window.location.pathname !== targetPath) {
          window.history.pushState(null, '', targetPath);
        }
      } else if (window.location.pathname === '/admin' || window.location.pathname.includes('privacy') || window.location.pathname.includes('terms')) {
        window.history.pushState(null, '', '/');
      }
    }
  }, [activePage, activeLegalTab]);

  // Scroll smoothly to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Detect incoming Google OAuth login redirect callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;
      if (
        hash.includes('access_token=') ||
        hash.includes('type=recovery') ||
        search.includes('code=')
      ) {
        // Automatically route to candidate application dossier on successful OAuth return
        setActivePage('application');

        // Automatically clean up the long OAuth token hash from the URL bar
        setTimeout(() => {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }, 400);
      }
    }
  }, []);

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

  // Standalone full-viewport experience for admin console
  if (activePage === 'admin') {
    return <AdminPage onNavigate={setActivePage} />;
  }

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
            <LegalPage initialTab={activeLegalTab} />
          )}

          {activePage === 'admin' && (
            <AdminPage />
          )}

          {activePage === 'auth' && (
            <AuthPage
              onNavigate={setActivePage}
              onAuthSuccess={(user) => {
                setActivePage('dashboard');
              }}
            />
          )}

          {activePage === 'dashboard' && (
            <CandidateDashboardPage
              onNavigate={setActivePage}
            />
          )}
        </div>
      </main>

      {/* Floating Interactive WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Global Footer */}
      <Footer
        onNavigate={(page, tab) => {
          setActivePage(page);
          if (tab) setActiveLegalTab(tab);
        }}
      />
    </div>
  );
}
