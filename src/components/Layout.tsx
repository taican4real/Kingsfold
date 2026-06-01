import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AnnouncementPopup from './AnnouncementPopup';
import BackToTop from './BackToTop';
import Chatbot from './Chatbot';
import MovingElectronsBackground from './MovingElectronsBackground';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <MovingElectronsBackground />
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-wine focus:text-white focus:outline-none focus:ring-2 focus:ring-red"
      >
        Skip to main content
      </a>
      <Navbar />
      <AnnouncementPopup />
      <main id="main-content" className="flex-1 relative z-10" tabIndex={-1}>
        <Outlet />
      </main>
      <Chatbot />
      <BackToTop />
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
