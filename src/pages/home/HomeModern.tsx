import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { HERO_IMAGES } from '../../constants';

export default function HomeModern() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full bg-white overflow-hidden">
      {/* Centered Bold Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center opacity-20 grayscale"
              style={{ backgroundImage: `url("${HERO_IMAGES[currentImageIndex]}")` }}
            />
          </AnimatePresence>
          
          {/* Navigation Arrows */}
          <div className="absolute inset-0 z-20 flex items-center justify-between px-4 md:px-12 pointer-events-none">
            <button 
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-wine/20 flex items-center justify-center text-wine hover:bg-wine hover:text-white transition-all duration-300 pointer-events-auto backdrop-blur-sm group focus:outline-none focus:ring-2 focus:ring-wine"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            </button>
            <button 
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-wine/20 flex items-center justify-center text-wine hover:bg-wine hover:text-white transition-all duration-300 pointer-events-auto backdrop-blur-sm group focus:outline-none focus:ring-2 focus:ring-wine"
              aria-label="Next slide"
            >
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3 pointer-events-auto">
            {HERO_IMAGES.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  "h-1 transition-all duration-1000 outline-none",
                  currentImageIndex === idx ? "w-12 bg-red" : "w-6 bg-wine/30 hover:bg-wine/50"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl pointer-events-none">
          <div className="pointer-events-auto inline-block">
            <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-red/10 text-red px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 inline-block">
              Visionary Education
            </span>
            <h1 className="text-5xl md:text-8xl font-serif text-wine-dark leading-tight mb-8">
              Empowering the <span className="text-red italic">Next</span> Generation.
            </h1>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              We redefine excellence through a cutting-edge curriculum that bridges tradition and technology. Welcome to the future of learning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/admissions" className="px-12 py-5 bg-wine text-white uppercase tracking-widest text-[10px] font-bold hover:bg-red transition-all shadow-xl hover:shadow-2xl">
                Explore Admissions
              </Link>
              <Link to="/academics" className="group flex items-center gap-3 text-wine font-bold uppercase tracking-widest text-[10px]">
                Our Curriculum <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-10 border-2 border-wine/20 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-wine rounded-full" />
        </motion.div>
      </section>

      {/* Grid Features */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-gray-200 border border-gray-200">
            {[
              { icon: Zap, title: "Innovation", desc: "Leading the way with state-of-the-art STEM laboratories and digital integration." },
              { icon: Shield, title: "Integrity", desc: "Building character through values that stand the test of time." },
              { icon: Target, title: "Excellence", desc: "A commitment to achieving top-tier honors in global examinations." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-12 hover:bg-wine hover:text-white transition-all group duration-500">
                <item.icon className="w-10 h-10 text-red mb-8 group-hover:text-white transition-colors" />
                <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
                <p className="text-gray-500 group-hover:text-white/80 transition-colors leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
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
