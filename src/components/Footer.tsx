import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';
import { getDirectDriveLink } from '../lib/utils';

const DEFAULT_FOOTER = {
  aboutText: "Providing world-class British and Nigerian educational curriculum tailored to raise exceptional global leaders.",
  address: "Plot 1, His Glory Avenue, Legina (Bus Stop) Off Itokin Road, Adamo Ikorodu, Lagos.",
  phone: "(+234) 909 598 7223",
  email: "info@kingsfoldinternationalacademy.com.ng",
  logoImage: "https://drive.google.com/thumbnail?id=1BasYzGGbqpXgKglJSsBaQ4hZcGkjZg7L&sz=w1000",
  logoTextPrimary: "Kingsfold",
  logoTextSecondary: "International Academy",
  socialLinks: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#"
  },
  quickLinks: [
    { name: "About Us", path: "/about" },
    { name: "Academics", path: "/academics" },
    { name: "Boarding Life", path: "/boarding" },
    { name: "News & Events", path: "/news" },
    { name: "Media Gallery", path: "/gallery" },
    { name: "School Portal", path: "/portal" },
    { name: "AI Lesson Generator", path: "/ai-lesson-generator" },
    { name: "CMS Admin", path: "/admin-login" },
    { name: "Project Documentation", path: "/documentation" }
  ],
  admissionsLinks: [
    { name: "How to Apply", path: "/admissions" },
    { name: "Fee Structure", path: "/admissions" },
    { name: "Scholarships", path: "/admissions" },
    { name: "Entrance Examination", path: "/admissions" },
    { name: "International Students", path: "/admissions" }
  ]
};

export default function Footer() {
  const { data: footerContent } = useCMS('footer', DEFAULT_FOOTER);

  return (
    <footer className="bg-cream text-gray-dark border-t border-[#6B0F1A]/10 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={getDirectDriveLink(footerContent?.logoImage || "https://drive.google.com/thumbnail?id=1BasYzGGbqpXgKglJSsBaQ4hZcGkjZg7L&sz=w1000")} 
                alt={`${footerContent?.logoTextPrimary || "Kingsfold"} Logo`}
                className="w-12 h-12 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-serif font-semibold text-lg md:text-xl text-wine leading-tight uppercase tracking-wide">
                  {footerContent?.logoTextPrimary || "Kingsfold"}
                </span>
                <span className="text-[10px] md:text-xs text-gray uppercase tracking-widest leading-none">
                  {footerContent?.logoTextSecondary || "International Academy"}
                </span>
              </div>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed max-w-sm">
              {footerContent.aboutText}
            </p>
            <div className="flex gap-4">
              <a href={footerContent.socialLinks?.facebook || "#"} className="w-10 h-10 rounded-full border border-wine/20 flex items-center justify-center hover:bg-wine hover:text-white transition-all" aria-label="Follow us on Facebook">
                <Facebook size={18} aria-hidden="true" />
              </a>
              <a href={footerContent.socialLinks?.twitter || "#"} className="w-10 h-10 rounded-full border border-wine/20 flex items-center justify-center hover:bg-wine hover:text-white transition-all" aria-label="Follow us on Twitter">
                <Twitter size={18} aria-hidden="true" />
              </a>
              <a href={footerContent.socialLinks?.instagram || "#"} className="w-10 h-10 rounded-full border border-wine/20 flex items-center justify-center hover:bg-wine hover:text-white transition-all" aria-label="Follow us on Instagram">
                <Instagram size={18} aria-hidden="true" />
              </a>
              <a href={footerContent.socialLinks?.linkedin || "#"} className="w-10 h-10 rounded-full border border-wine/20 flex items-center justify-center hover:bg-wine hover:text-white transition-all" aria-label="Follow us on LinkedIn">
                <Linkedin size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B0F1A]">Quick Links</h4>
              <div className="flex flex-col gap-3 text-xs text-gray-500 font-sans tracking-wide">
                {(footerContent.quickLinks || DEFAULT_FOOTER.quickLinks).map((link: any, i: number) => (
                  <Link key={i} to={link.path} className="hover:text-[#6B0F1A] transition">{link.name}</Link>
                ))}
              </div>
            </div>

          {/* Admissions */}
          <div className="flex flex-col gap-6">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B0F1A]">Admissions</h4>
            <div className="flex flex-col gap-3 text-xs text-gray-500 font-sans tracking-wide">
              {(footerContent.admissionsLinks || DEFAULT_FOOTER.admissionsLinks).map((link: any, i: number) => (
                <Link key={i} to={link.path} className="hover:text-[#6B0F1A] transition">{link.name}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B0F1A]">Contact Us</h4>
            <div className="flex flex-col gap-4 text-xs text-gray-500 font-sans tracking-wide leading-relaxed">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span>{footerContent.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" />
                <span>{footerContent.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <span>{footerContent.email}</span>
              </div>
            </div>
            {/* Newsletter */}
            <div className="mt-4">
              <h5 className="font-sans text-[10px] font-bold tracking-[0.2em] mb-4 uppercase text-wine">Subscribe to Newsletter</h5>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
                <input 
                  id="newsletter-email"
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-white border border-gray-200 px-4 py-3 text-xs w-full outline-none focus:border-wine transition-colors"
                  required
                />
                <button 
                  type="submit"
                  className="bg-wine hover:bg-red px-4 py-3 text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-semibold tracking-wider text-gray-400">
          <p className="text-center md:text-left">© {new Date().getFullYear()} Kingsfold International Academy. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <Link to="/privacy-policy" className="hover:text-[#6B0F1A] transition">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-[#6B0F1A] transition">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-[#6B0F1A] transition">Cookie Policy</Link>
            <Link to="/admin-login" className="hover:text-[#6B0F1A] transition flex md:hidden">Staff Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
