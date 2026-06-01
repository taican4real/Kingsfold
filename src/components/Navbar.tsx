import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';
import { cn, getDirectDriveLink } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import ThemeToggle from './ThemeToggle';

import { useCMS } from '../hooks/useCMS';

const DEFAULT_HEADER = {
  phone: "(+234) 909 598 7223",
  email: "info@kingsfoldinternationalacademy.com.ng",
};

const DEFAULT_NAVBAR = {
  logoImage: "https://drive.google.com/thumbnail?id=1BasYzGGbqpXgKglJSsBaQ4hZcGkjZg7L&sz=w1000",
  logoTextPrimary: "Kingsfold",
  logoTextSecondary: "International Academy",
  navLinks: [
    { 
      name: 'Home', 
      path: '/',
      submenu: [
        { name: 'Default Layout', path: '/home-default' },
        { name: 'Modern Vision', path: '/home-modern' },
        { name: 'Classic Heritage', path: '/home-classic' },
        { name: 'Minimalist Clean', path: '/home-minimal' },
        { name: 'Magazine Editorial', path: '/home-magazine' },
      ]
    },
    { 
      name: 'About Us', 
      path: '/about',
      submenu: [
        { name: 'Our History', path: '/about#history' },
        { name: 'Staff Directory', path: '/staff-directory' },
        { name: 'Board of Directors', path: '/board-of-directors' },
        { name: 'Our Policies', path: '/policies' },
      ]
    },
    { 
      name: 'Academics', 
      path: '/academics',
      submenu: [
        { name: 'Overview', path: '/academics' },
        { name: 'CheckPoint', path: '/academics#checkpoint' },
        { name: 'IGCSE', path: '/academics#igcse' },
        { name: 'WAEC', path: '/academics#waec' },
        { name: 'NECO', path: '/academics#neco' },
        { name: 'JAMB', path: '/academics#jamb' },
        { name: 'Faculty & Staff', path: '/staff-directory' },
        { name: 'Our Policies', path: '/policies' },
      ]
    },
    { name: 'Boarding', path: '/boarding' },
    { name: 'Student Life', path: '/student-life' },
    { name: 'News', path: '/news' },
    { name: 'Gallery', path: '/gallery' },
    { 
      name: 'Admissions', 
      path: '/admissions',
      submenu: [
        { name: 'How to Apply', path: '/admissions' },
        { name: 'Tuition & Fees', path: '/tuition-fees' },
        { name: 'Scholarships', path: '/scholarships' },
        { name: 'Our Policies', path: '/policies' },
        { name: 'Visit Kingsfold', path: '/contact' },
      ]
    },
    { name: 'Contact', path: '/contact' },
  ]
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const { user, role, isAdmin, isStaff, department, kiaCode } = useAuth();
  
  const { data: headerContent } = useCMS('header', DEFAULT_HEADER);
  const { data: navbarContent } = useCMS('navbar', DEFAULT_NAVBAR);
  
  const navLinks = navbarContent?.navLinks || DEFAULT_NAVBAR.navLinks;

  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false); // Close on route change
    setActiveDropdown(null);
    setMobileSubmenu(null);
  }, [location.pathname]);

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-wine text-white text-xs py-2 px-4 md:px-8 hidden md:flex justify-between items-center z-50 relative" role="complementary" aria-label="Utility Links">
        <div className="flex gap-4">
          <span aria-label="Phone Number">{headerContent.phone}</span>
          <span aria-label="Email Address">{headerContent.email}</span>
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex gap-4 items-center">
              <div className="flex flex-col items-end mr-4 border-r border-white/20 pr-4">
                <span className="text-cream/70 flex items-center gap-1 uppercase tracking-tighter text-[10px]">
                  <UserIcon size={12} /> {user.email} ({role}{role === 'hod' || role === 'teacher' ? `: ${department}` : ''})
                </span>
                {kiaCode && (
                  <span className="text-[9px] font-mono font-bold text-cream tracking-widest mt-1 bg-white/10 px-1 rounded">
                    {kiaCode}
                  </span>
                )}
              </div>
              {isAdmin && (
                <Link to="/admin" className="hover:text-cream transition flex items-center gap-1 border-x border-white/20 px-4">
                  <ShieldCheck size={12} className="text-red" /> Admin Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="hover:text-cream transition flex items-center gap-1"
              >
                <LogOut size={12} /> Logout
              </button>
              {localStorage.getItem('dev_force_role') && (
                <button onClick={() => {
                  localStorage.removeItem('dev_force_role');
                  localStorage.removeItem('dev_force_dept');
                  window.location.reload();
                }} className="text-[9px] underline opacity-50 hover:opacity-100 text-green-300 ml-2">[Clear Forced Role]</button>
              )}
            </div>
          ) : (
            <Link to="/portal" className="hover:text-cream transition">Staff Access</Link>
          )}
          <Link to="/news" className="hover:text-cream transition">News & Events</Link>
          <div className="w-[1px] h-3 bg-white/30" />
          <div className="flex gap-2">
            <span>En</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled 
            ? "bg-white/95 backdrop-blur-sm border-b border-wine/10" 
            : "bg-white border-b border-wine/10"
        )}
      >
        <div className="max-w-[1400px] h-20 mx-auto px-4 md:px-12 flex justify-between items-center shrink-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={getDirectDriveLink(navbarContent?.logoImage || DEFAULT_NAVBAR.logoImage)} 
              alt={`${navbarContent?.logoTextPrimary || DEFAULT_NAVBAR.logoTextPrimary} Logo`}
              className="w-12 h-12 object-contain"
            />
            <div className="leading-tight">
              <h1 className="font-serif font-bold text-lg md:text-xl text-wine tracking-tight uppercase cursor-pointer">
                {navbarContent?.logoTextPrimary || DEFAULT_NAVBAR.logoTextPrimary}
              </h1>
              <p className="text-[10px] text-gray uppercase tracking-[0.2em] leading-none mt-1">
                {navbarContent?.logoTextSecondary || DEFAULT_NAVBAR.logoTextSecondary}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Primary Navigation">
            {navLinks.map((link) => (
              <div 
                key={link.name}
                className="relative group h-full flex items-center"
                onMouseEnter={() => link.submenu && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <NavLink
                  to={link.path}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (link.submenu) {
                        e.preventDefault();
                        setActiveDropdown(activeDropdown === link.name ? null : link.name);
                      }
                    }
                  }}
                  aria-haspopup={link.submenu ? "true" : undefined}
                  aria-expanded={link.submenu ? activeDropdown === link.name : undefined}
                  className={({ isActive }) =>
                    cn(
                      "text-[11px] font-semibold uppercase tracking-wider transition-all relative py-8 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-wine/20 rounded",
                      isActive ? "text-wine" : "text-gray-dark hover:text-wine"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {link.submenu && <ChevronDown size={14} className={cn("transition-transform", activeDropdown === link.name && "rotate-180")} aria-hidden="true" />}
                      {isActive && (
                        <motion.div
                          layoutId="nav-underline"
                          className="absolute bottom-2 left-0 right-0 h-[2px] bg-wine"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {link.submenu && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-2xl py-4 z-50"
                    >
                      {link.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray hover:bg-cream-light hover:text-wine transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <Link 
              to="/admissions" 
              className="bg-wine text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-red shadow-lg transition-colors"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button 
              className="p-2 text-wine focus:outline-none focus:ring-2 focus:ring-wine/20 rounded"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-wine/10 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-cream-light/30">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <img 
                    src={getDirectDriveLink(navbarContent?.logoImage || DEFAULT_NAVBAR.logoImage)} 
                    alt={`${navbarContent?.logoTextPrimary || DEFAULT_NAVBAR.logoTextPrimary} Logo`}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-serif font-bold text-wine tracking-tight uppercase text-sm">{navbarContent?.logoTextPrimary || DEFAULT_NAVBAR.logoTextPrimary}</span>
                </Link>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-wine hover:bg-wine/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-wine/20"
                    aria-label="Close menu"
                  >
                    <X size={24} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-6 space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div 
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <NavLink
                            to={link.path}
                            onClick={() => !link.submenu && setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              cn(
                                "flex-1 py-4 font-serif text-lg transition-colors",
                                isActive ? "text-wine font-bold" : "text-gray-dark hover:text-wine"
                              )
                            }
                          >
                            {link.name}
                          </NavLink>
                          {link.submenu && (
                            <button 
                              onClick={() => setMobileSubmenu(mobileSubmenu === link.name ? null : link.name)}
                              className="p-4 text-wine/40 hover:text-wine transition-colors"
                              aria-label={mobileSubmenu === link.name ? `Collapse ${link.name} menu` : `Expand ${link.name} menu`}
                              aria-expanded={mobileSubmenu === link.name}
                            >
                              <ChevronDown 
                                size={20} 
                                className={cn("transition-transform duration-300", mobileSubmenu === link.name && "rotate-180")} 
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {link.submenu && mobileSubmenu === link.name && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden bg-cream-light/30 rounded-lg"
                            >
                              <div className="py-2 flex flex-col">
                                {link.submenu.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    to={sub.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-wine transition-colors"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                                {link.name === 'Academics' && (
                                  <Link
                                    to="/portal"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-wine transition-colors"
                                  >
                                    Staff Access
                                  </Link>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
                <Link 
                  to="/admissions" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-4 bg-wine text-white text-center text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-red transition-all"
                >
                  Apply Now
                </Link>
                <div className="flex gap-3">
                  <Link 
                    to="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-3 border border-wine/20 text-wine text-center text-[10px] font-bold uppercase tracking-widest hover:bg-wine/5 transition-all"
                  >
                    Visit Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
