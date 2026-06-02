import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Zap, Download } from 'lucide-react';
import SEO from '../components/SEO';
import { useCMS } from '../hooks/useCMS';

const DEFAULT_TUITION = {
  heroTitle: "Tuition & Fees",
  sessionTitle: "Academic Session 2025/2026",
  sessionSubtitle: "All fees are quoted per academic session and are subject to periodic review.",
  paymentTerm1Title: "Flexible Payment",
  paymentTerm1Desc: "We offer termly payment plans to ease the financial commitment for our parents and guardians.",
  paymentTerm2Title: "Sibling Discount",
  paymentTerm2Desc: "A 5% - 10% discount is applicable to the tuition fee of a third and fourth sibling respectively.",
  paymentTerm3Title: "Early Bird",
  paymentTerm3Desc: "Payments made in full before the start of the academic session attract a 2.5% discount on tuition.",
  ctaTitle: "Need Financial Consultation?",
  ctaDesc: "Our bursary department is available to discuss payment plans, scholarships, and any other financial inquiries you may have.",
};

export default function TuitionFeesPage() {
  const { data: cmsData } = useCMS('tuition', DEFAULT_TUITION);
  const fees = [
    { level: 'Early Years (EYFS)', tuition: '₦850,000', development: '₦150,000', total: '₦1,000,000' },
    { level: 'Primary (Year 1-6)', tuition: '₦1,200,000', development: '₦200,000', total: '₦1,400,000' },
    { level: 'Secondary (Year 7-11)', tuition: '₦1,850,000', development: '₦250,000', total: '₦2,100,000' },
    { level: 'Sixth Form (Year 12-13)', tuition: '₦2,400,000', development: '₦300,000', total: '₦2,700,000' },
  ];

  const tuitionSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much is the school fee of Kingsfold International Academy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The school fees per academic session are ₦1,000,000 for Early Years (EYFS), ₦1,400,000 for Primary, ₦2,100,000 for Secondary, and ₦2,700,000 for Sixth Form."
        }
      },
      {
        "@type": "Question",
        "name": "Are there payment plans or discounts available for tuition?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Kingsfold International Academy provides flexible termly payment plans, early-bird payment discounts (2.5%), and sibling discounts of 5% - 10% on tuition for families with multiple children."
        }
      }
    ]
  };

  return (
    <div className="pt-24 min-h-screen">
      <SEO 
        title="Tuition Fees & Affordability" 
        description="View the transparent breakdown of our tuition fees, development levy, payment terms, and early bird discounts at Kingsfold International Academy, Ikorodu."
        keywords="Kingsfold Tuition, school fees Ikorodu, private school fees Lagos, boarding school cost Nigeria"
        schema={tuitionSchema}
      />
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000" 
            alt="Finance" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block"
          >
            Admissions
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-wine-dark mb-6"
          >
            {cmsData.heroTitle}
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 md:px-0">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white border border-gray-100 shadow-2xl overflow-hidden mb-16"
          >
            <div className="p-8 md:p-12 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <h2 className="text-3xl font-serif text-wine-dark mb-2">{cmsData.sessionTitle}</h2>
                <p className="text-gray-500 text-sm">{cmsData.sessionSubtitle}</p>
              </div>
              <button className="flex items-center gap-3 bg-wine text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-red transition-colors">
                <Download size={16} /> Download Fee Schedule
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-gray-400">Education Level</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-gray-400">Tuition Fee</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-gray-400">Development Levy</th>
                    <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Total Per Session</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-cream-light transition-colors">
                      <td className="px-8 py-6 font-serif text-wine-dark font-medium">{fee.level}</td>
                      <td className="px-8 py-6 text-sm text-gray-600 font-mono">{fee.tuition}</td>
                      <td className="px-8 py-6 text-sm text-gray-600 font-mono">{fee.development}</td>
                      <td className="px-8 py-6 text-lg text-wine font-bold font-mono text-right">{fee.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
 
          {/* Payment Terms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <CreditCard className="text-red animate-pulse" />, 
                title: cmsData.paymentTerm1Title, 
                desc: cmsData.paymentTerm1Desc 
              },
              { 
                icon: <ShieldCheck className="text-red" />, 
                title: cmsData.paymentTerm2Title, 
                desc: cmsData.paymentTerm2Desc 
              },
              { 
                icon: <Zap className="text-red" />, 
                title: cmsData.paymentTerm3Title, 
                desc: cmsData.paymentTerm3Desc 
              },
            ].map((term, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all group font-sans"
              >
                <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center mb-6 group-hover:bg-wine group-hover:text-white transition-colors">
                  {term.icon}
                </div>
                <h4 className="text-lg font-serif text-wine-dark mb-4">{term.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{term.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-24 bg-wine-dark p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10">
              <h3 className="text-3xl font-serif text-white mb-6">{cmsData.ctaTitle}</h3>
              <p className="text-white/60 text-sm max-w-xl mx-auto mb-10 leading-relaxed">
                {cmsData.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-wine-dark px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-cream transition-all">
                  Book a Consultation
                </button>
                <button className="border border-white/20 text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                  Contact Bursary
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
