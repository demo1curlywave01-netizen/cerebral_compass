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

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [prefilledCourse, setPrefilledCourse] = useState('');
  const [selectedPackageName, setSelectedPackageName] = useState('');
  const [activeApplicationId, setActiveApplicationId] = useState('');

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
        </div>
      </main>

      {/* Floating Interactive WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Global Footer */}
      <Footer onNavigate={setActivePage} />
    </div>
  );
}
