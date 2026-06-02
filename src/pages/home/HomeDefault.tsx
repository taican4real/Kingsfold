import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, Globe, Shield, Award } from 'lucide-react';
import { cn, getDirectDriveLink } from '../../lib/utils';
import { HERO_IMAGES } from '../../constants';
import SEO from '../../components/SEO';

export default function HomeDefault() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <SEO 
        title="Best British International Boarding School in Lagos"
        description="Kingsfold International Academy (Default Layout) is a premium private boarding school in Ikorodu, Lagos, Nigeria offering high standards of British and Nigerian curricula."
        canonical="https://www.kingsfoldinternationalacademy.com.ng"
      />
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${HERO_IMAGES[currentImageIndex]}")` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
          
          {/* Navigation Arrows */}
          <div className="absolute inset-0 z-20 flex items-center justify-between px-4 md:px-12 pointer-events-none">
            <button 
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto backdrop-blur-sm group focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            </button>
            <button 
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto backdrop-blur-sm group focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next slide"
            >
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {HERO_IMAGES.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  "h-1 transition-all duration-1000 outline-none",
                  currentImageIndex === idx ? "w-12 bg-red" : "w-6 bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-12 flex flex-col items-start text-left mt-16 md:mt-0 pointer-events-none">
          <div className="pointer-events-auto">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            <span className="text-white font-sans text-xs font-bold tracking-[0.3em] uppercase block mb-4 border-l-2 border-red pl-4">The Kingsfold Advantage</span>
          </motion.div>
          
          <div className="bg-white/10 backdrop-blur-md border-l-4 border-red p-6 md:p-8 max-w-xl text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] mb-6 font-medium"
            >
              Nurturing Global Leaders Through Academic Excellence
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="text-sm md:text-base text-gray-200 leading-relaxed font-light mb-8"
            >
              Kingsfold combines the rigor of the British National Curriculum with the cultural richness of Nigeria, providing a truly international boarding experience.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                to="/admissions" 
                className="flex-1 text-center py-4 bg-[#6B0F1A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C1121F] transition-colors"
              >
                Apply Now
              </Link>
              <Link 
                to="/about" 
                className="flex-1 text-center py-4 bg-transparent border border-[#6B0F1A] text-white bg-black/60 hover:bg-[#6B0F1A] text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Book a Tour
              </Link>
            </motion.div>
          </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#6B0F1A] w-full shrink-0">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 h-auto md:h-24 py-8 md:py-0 flex flex-wrap flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full md:w-auto">
            {[
              { num: "98%", label: "Univ. Placement" },
              { num: "1:8", label: "Teacher Ratio" },
              { num: "24/7", label: "Medical Support" },
              { num: "15+", label: "Sports Clubs" },
            ].map((stat, i) => (
              <React.Fragment key={i}>
                <div className="text-white text-center">
                  <div className="text-3xl font-serif font-bold mb-1">{stat.num}</div>
                  <div className="text-[9px] uppercase tracking-widest text-white/60">{stat.label}</div>
                </div>
                {i < 3 && <div className="hidden md:block w-px h-8 bg-white/20"></div>}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex items-center gap-6 mt-6 md:mt-0 opacity-40 grayscale brightness-200 invert">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">COBIS</span>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Cambridge</span>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-32 w-full max-w-[1400px] mx-auto px-4 md:px-12 text-[#1a1a1a]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-wine translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 z-0 rounded-[5px]"></div>
            <img 
              src={getDirectDriveLink("https://lh3.googleusercontent.com/d/1XCbsIM9C2_3ousgIcg1W5rZ3fCYdGttN")} 
              alt="Students" 
              className="relative z-10 w-full h-[500px] md:h-[600px] object-cover rounded-[5px]"
            />
          </div>
          <div>
            <span className="text-[#C1121F] font-sans text-xs font-bold tracking-[0.3em] uppercase block mb-4">Our Philosophy</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#6B0F1A] leading-tight mb-8">
              A Legacy of <span className="italic">Academic</span> Sophistication.
            </h2>
            <p className="text-gray-dark/80 text-lg leading-relaxed mb-10">
              At Kingsfold International Academy, we provide an environment that fosters intellectual curiosity, leadership, and moral integrity.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-wine font-medium uppercase tracking-widest text-sm border-b-2 border-wine pb-1 hover:text-red hover:border-red transition-colors"
            >
              Discover Our Story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Performers Section */}
      <section className="py-24 bg-cream border-y border-[#6B0F1A]/10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-[#C1121F] font-sans text-xs font-bold tracking-[0.3em] uppercase block mb-4">Academic Excellence</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[#6B0F1A] leading-tight">Our Top Performers</h2>
              <p className="text-gray-500 mt-4 text-sm leading-relaxed">Celebrating the remarkable achievements of our students who consistently set new benchmarks in international and national examinations.</p>
            </div>
            <Link to="/academics" className="text-[10px] font-bold uppercase tracking-widest text-[#6B0F1A] border-b border-[#6B0F1A] pb-1 hover:text-[#C1121F] hover:border-[#C1121F] transition-all mb-2">
              View Academic Program
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Oluwaseun Adeyemi", achievement: "9 A*s in IGCSE", exam: "Cambridge IGCSE", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400" },
              { name: "Zainab Ibrahim", achievement: "356 JAMB Score", exam: "UTME 2025", img: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=400" },
              { name: "Kamsi Okoro", achievement: "44/45 points", exam: "Intl. Baccalaureate", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" },
              { name: "Fatima Yusuf", achievement: "A* in Further Math", exam: "A-Levels", img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400" },
            ].map((performer, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white border border-gray-100 group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img 
                    src={performer.img} 
                    alt={performer.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#C1121F] text-white py-1 px-3 text-[9px] font-bold uppercase tracking-widest">
                    Top Scorer
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-serif text-xl text-[#6B0F1A] mb-2">{performer.name}</h4>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#1a1a1a] font-bold text-sm tracking-tight">{performer.achievement}</span>
                    <span className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider">{performer.exam}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars / Features */}
      <section className="py-24 bg-white w-full border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 flex flex-col md:flex-row gap-16">
          <div className="md:w-[42%] flex flex-col justify-center">
            <span className="text-[#C1121F] font-sans text-xs font-bold tracking-[0.3em] uppercase block mb-4">The Kingsfold Advantage</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#6B0F1A] leading-tight mb-8">Why Choose Our Academy?</h2>
            
            <div className="flex gap-4 mt-4">
              <Link to="/about" className="flex-1 border text-center border-[#6B0F1A] text-[#6B0F1A] py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#6B0F1A] hover:text-white transition-all">
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="md:w-[58%] flex flex-col gap-6">
            {[
              { title: "Dual Curriculum", desc: "Rigorous academic framework combining British IGCSE/A-Levels with Nigerian standards ensuring global university placement." },
              { title: "Premium Boarding", desc: "Luxurious, secure residential facilities designed for comfort, safety, and focused study environments." },
              { title: "Global Exposure", desc: "International faculty, foreign exchange programs, and diverse student body representation fostering early cultural awareness." },
            ].map((pillar, i) => (
              <div key={i} className="flex gap-5 bg-white p-6 md:p-8 border border-gray-100 hover:shadow-lg transition-all group">
                <div className="text-4xl font-serif text-[#6B0F1A] opacity-20 italic font-light shrink-0">0{i + 1}</div>
                <div>
                  <h4 className="font-bold text-sm text-[#1a1a1a] mb-2 uppercase tracking-tight">{pillar.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Showcase Links (CTAs) */}
      <section className="py-32 w-full max-w-[1400px] mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Academics", img: "https://lh3.googleusercontent.com/d/1mIWiOWEOhTOjQSr3HTq671SganSeCeC_", link: "/academics" },
            { title: "Boarding Life", img: "https://lh3.googleusercontent.com/d/168n4N_bfIfjU6yhPlKvtC4RRS-0GV84p", link: "/boarding" },
            { title: "Student Life", img: "https://lh3.googleusercontent.com/d/1s35EKkkymSNk9VJDoImgxzWvmorPlNQf", link: "/student-life" },
          ].map((item, i) => (
            <Link key={i} to={item.link} className="group relative h-[450px] overflow-hidden flex items-end">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-dark/90 via-wine-dark/40 to-transparent" />
              <div className="relative z-10 p-8 w-full flex justify-between items-center">
                <h3 className="font-serif text-3xl text-white">{item.title}</h3>
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-red group-hover:border-red transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* CTA section */}
      <section className="relative py-32 overflow-hidden bg-white border-y border-gray-100 flex items-center justify-center text-center">
        <div className="relative z-10 px-4 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-[#C1121F] font-sans text-xs font-bold tracking-[0.3em] uppercase block mb-4">Admissions Open</span>
          <h2 className="font-serif text-4xl md:text-6xl text-[#6B0F1A] mb-8">Ready to Begin the Journey?</h2>
          <p className="text-gray-500 mb-10 text-sm leading-relaxed max-w-md">Admissions are currently open for the upcoming academic session. Secure your child's place in our prestigious academy today.</p>
          <Link 
            to="/admissions" 
            className="bg-[#6B0F1A] text-white py-4 px-10 text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-3 hover:bg-[#C1121F] shadow-xl transition-all"
          >
            Start Application <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
