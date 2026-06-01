import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, Globe, Shield, Award, Quote, Clock } from 'lucide-react';
import { cn, getDirectDriveLink } from '../lib/utils';
import AccreditationSection from '../components/AccreditationSection';
import LeadershipSection from '../components/LeadershipSection';
import Counter from '../components/Counter';
import SEO from '../components/SEO';
import { useCMS } from '../hooks/useCMS';
import { HERO_IMAGES } from '../constants';

const DEFAULT_HOMEPAGE = {
  slides: HERO_IMAGES,
  heroTitle: "Nurturing Global Leaders Through Academic Excellence",
  heroSubtitle: "Kingsfold combines the rigor of the British National Curriculum with the cultural richness of Nigeria, providing a truly international boarding experience.",
  philosophyTitle: "A Legacy of Academic Sophistication.",
  philosophyImage1: "https://lh3.googleusercontent.com/d/1XCbsIM9C2_3ousgIcg1W5rZ3fCYdGttN",
  philosophyImage2: "https://lh3.googleusercontent.com/d/1mIWiOWEOhTOjQSr3HTq671SganSeCeC_",
  philosophyPillar1Title: "Intellectual Rigor",
  philosophyPillar1Desc: "We deliver a bespoke curriculum that challenges students to think critically, solve complex problems, and engage with global perspectives.",
  philosophyPillar2Title: "Refined Character",
  philosophyPillar2Desc: "Beyond academics, we nurture the soul. Our students are taught to lead with integrity, empathy, and a strong moral compass.",
  philosophyPillar3Title: "Global Mindset",
  philosophyPillar3Desc: "We prepare our graduates for the world's most competitive universities while remaining deeply rooted in Nigerian heritage.",
  pillarsTitle: "Why Choose Our Academy?",
  pillar1Title: "Dual Curriculum",
  pillar1Desc: "Rigorous academic framework combining British IGCSE/A-Levels with Nigerian standards.",
  pillar2Title: "Premium Boarding",
  pillar2Desc: "Luxurious, secure residential facilities designed for comfort and focused study.",
  pillar3Title: "Global Exposure",
  pillar3Desc: "International faculty and exchange programs fostering global cultural awareness.",
  pillar4Title: "Character Refinement",
  pillar4Desc: "A holistic focus on leadership and ethical integrity alongside academic mastery.",
  eventsTitle: "Recent & Upcoming Events",
  event1Title: "Annual Merit Awards 2026",
  event1Date: "June 24, 2026",
  event1Category: "Ceremony",
  event1Img: "https://lh3.googleusercontent.com/d/1Bf8I-3-q_m-m_p_q_f_u_l_S_V_m_S_W",
  event2Title: "British Council Debate Finals",
  event2Date: "May 18, 2026",
  event2Category: "Academic",
  event2Img: "https://lh3.googleusercontent.com/d/1X67_g0-M0X0Xm3_X7_-q9W8n9-s5F_6Z",
  event3Title: "International STEM Workshop",
  event3Date: "May 02, 2026",
  event3Category: "Workshop",
  event3Img: "https://lh3.googleusercontent.com/d/1mIWiOWEOhTOjQSr3HTq671SganSeCeC_",
  performer1Name: "Oluwaseun Adeyemi",
  performer1Achievement: "9 A*s in IGCSE",
  performer1Exam: "Cambridge IGCSE",
  performer1Dest: "University of Toronto",
  performer1Img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600",
  performer2Name: "Zainab Ibrahim",
  performer2Achievement: "356 JAMB Score",
  performer2Exam: "UTME 2025",
  performer2Dest: "Imperial College London",
  performer2Img: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&q=80&w=600",
  performer3Name: "Kamsi Okoro",
  performer3Achievement: "44/45 points",
  performer3Exam: "Intl. Baccalaureate",
  performer3Dest: "Stanford University",
  performer3Img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
  performer4Name: "Fatima Yusuf",
  performer4Achievement: "A* in Further Math",
  performer4Exam: "A-Levels",
  performer4Dest: "Harvard University",
  performer4Img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=600",
  performer5Name: "Adebowale Olumide",
  performer5Achievement: "8 A*s in IGCSE",
  performer5Exam: "Cambridge IGCSE",
  performer5Dest: "University of Oxford",
  performer5Img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
  performer6Name: "Chioma Eze",
  performer6Achievement: "345 JAMB Score",
  performer6Exam: "UTME 2025",
  performer6Dest: "Covenant University",
  performer6Img: "https://images.unsplash.com/photo-1531123897727-8f129e1eb121?auto=format&fit=crop&q=80&w=600",
  leader1Name: "Dr. Olabisi Adeniyi",
  leader1Role: "Proprietress & CEO",
  leader1Bio: "A visionary leader with over 25 years of experience in international education, dedicated to raising global leaders with integrity.",
  leader1Img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
  leader2Name: "Mr. Julian White",
  leader2Role: "Principal",
  leader2Bio: "An experienced British educator specializing in the IGCSE and A-Level curriculum, focusing on academic excellence and holistic development.",
  leader2Img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  leader3Name: "Mrs. Sarah Thompson",
  leader3Role: "Head of Admissions",
  leader3Bio: "Passionate about guiding families through the journey of finding the right educational path for their children at Kingsfold.",
  leader3Img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
  leader4Name: "Rev. Father John Oke",
  leader4Role: "Chaplain & Student Welfare",
  leader4Bio: "Committed to the spiritual growth and moral well-being of our students, ensuring a supportive and nurturing boarding environment.",
  leader4Img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
};

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: homeContent } = useCMS('homepage', DEFAULT_HOMEPAGE);
  const slides = homeContent.slides && homeContent.slides.length > 0 ? homeContent.slides : HERO_IMAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per image
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % slides.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Content fallbacks (now primary content)
  const statsContent = [
    { num: "98%", label: "Univ. Placement", icon: Award },
    { num: "1:8", label: "Faculty Ratio", icon: Shield },
    { num: "24/7", label: "Medical Support", icon: Globe },
    { num: "15+", label: "Sports Clubs", icon: Award },
  ];

  const philosophyContent = {
    title: homeContent.philosophyTitle,
    image1: homeContent.philosophyImage1 || "https://lh3.googleusercontent.com/d/1XCbsIM9C2_3ousgIcg1W5rZ3fCYdGttN",
    image2: homeContent.philosophyImage2 || "https://lh3.googleusercontent.com/d/1mIWiOWEOhTOjQSr3HTq671SganSeCeC_",
    pillars: [
      {
        title: homeContent.philosophyPillar1Title,
        desc: homeContent.philosophyPillar1Desc,
        icon: <BookOpen className="w-6 h-6" />
      },
      {
        title: homeContent.philosophyPillar2Title,
        desc: homeContent.philosophyPillar2Desc,
        icon: <Shield className="w-6 h-6" />
      },
      {
        title: homeContent.philosophyPillar3Title,
        desc: homeContent.philosophyPillar3Desc,
        icon: <Globe className="w-6 h-6" />
      }
    ]
  };

  const performersContent = [
    { 
      name: homeContent.performer1Name, 
      achievement: homeContent.performer1Achievement, 
      exam: homeContent.performer1Exam, 
      dest: homeContent.performer1Dest,
      img: homeContent.performer1Img 
    },
    { 
      name: homeContent.performer2Name, 
      achievement: homeContent.performer2Achievement, 
      exam: homeContent.performer2Exam, 
      dest: homeContent.performer2Dest,
      img: homeContent.performer2Img 
    },
    { 
      name: homeContent.performer3Name, 
      achievement: homeContent.performer3Achievement, 
      exam: homeContent.performer3Exam, 
      dest: homeContent.performer3Dest,
      img: homeContent.performer3Img 
    },
    { 
      name: homeContent.performer4Name, 
      achievement: homeContent.performer4Achievement, 
      exam: homeContent.performer4Exam, 
      dest: homeContent.performer4Dest,
      img: homeContent.performer4Img 
    },
    { 
      name: homeContent.performer5Name, 
      achievement: homeContent.performer5Achievement, 
      exam: homeContent.performer5Exam, 
      dest: homeContent.performer5Dest,
      img: homeContent.performer5Img 
    },
    { 
      name: homeContent.performer6Name, 
      achievement: homeContent.performer6Achievement, 
      exam: homeContent.performer6Exam, 
      dest: homeContent.performer6Dest,
      img: homeContent.performer6Img 
    },
  ];

  const pillarsContent = {
    title: homeContent.pillarsTitle,
    list: [
      { title: homeContent.pillar1Title, icon: BookOpen, desc: homeContent.pillar1Desc },
      { title: homeContent.pillar2Title, icon: Shield, desc: homeContent.pillar2Desc },
      { title: homeContent.pillar3Title, icon: Globe, desc: homeContent.pillar3Desc },
      { title: homeContent.pillar4Title, icon: Award, desc: homeContent.pillar4Desc },
    ]
  };

  const showcasesContent = [
    { title: "Academics", img: "https://lh3.googleusercontent.com/d/1mIWiOWEOhTOjQSr3HTq671SganSeCeC_", link: "/academics" },
    { title: "Boarding Life", img: "https://lh3.googleusercontent.com/d/168n4N_bfIfjU6yhPlKvtC4RRS-0GV84p", link: "/boarding" },
    { title: "Student Life", img: "https://lh3.googleusercontent.com/d/1s35EKkkymSNk9VJDoImgxzWvmorPlNQf", link: "/student-life" },
  ];

  const ctaContent = {
    title: "Ready to Begin the Journey?",
    btnText: "Start Application",
    btnLink: "/admissions"
  };

  const eventsContent = {
    title: homeContent.eventsTitle,
    list: [
      { 
        title: homeContent.event1Title, 
        date: homeContent.event1Date, 
        category: homeContent.event1Category,
        img: homeContent.event1Img 
      },
      { 
        title: homeContent.event2Title, 
        date: homeContent.event2Date, 
        category: homeContent.event2Category,
        img: homeContent.event2Img 
      },
      { 
        title: homeContent.event3Title, 
        date: homeContent.event3Date, 
        category: homeContent.event3Category,
        img: homeContent.event3Img 
      },
    ]
  };

  const leadershipContent = [
    { name: homeContent.leader1Name, role: homeContent.leader1Role, bio: homeContent.leader1Bio, image: homeContent.leader1Img },
    { name: homeContent.leader2Name, role: homeContent.leader2Role, bio: homeContent.leader2Bio, image: homeContent.leader2Img },
    { name: homeContent.leader3Name, role: homeContent.leader3Role, bio: homeContent.leader3Bio, image: homeContent.leader3Img },
    { name: homeContent.leader4Name, role: homeContent.leader4Role, bio: homeContent.leader4Bio, image: homeContent.leader4Img },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <SEO 
        title="Best British International School in Lagos | Day & Boarding"
        description="Kingsfold International Academy is a premier British International School in Lagos, Nigeria. Offering dual British and Nigerian curricula with world-class facilities for Preschool, Primary, and Secondary education."
        keywords="Best British International School in Lagos, Top Boarding School in Nigeria, British Curriculum Lagos, Cambridge International School Nigeria, International School Lekki, Best Secondary School Lagos"
      />
      {/* Hero Section */}
      <section 
        className="relative h-[85vh] min-h-[600px] w-full flex items-center overflow-hidden"
        aria-roledescription="carousel"
        aria-label="Hero carousel featuring Kingsfold Academy"
      >
        {/* Animated Slideshow Background */}
        <div className="absolute inset-0 z-0" aria-live="polite">
          <AnimatePresence mode="wait">
              <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${getDirectDriveLink(slides[currentImageIndex])}")` }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Kingsfold Academy featured image ${currentImageIndex + 1} of ${slides.length}`}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          
          {/* Navigation Arrows */}
          <div className="absolute inset-0 z-20 flex items-center justify-between px-4 md:px-12 pointer-events-none">
            <button 
              onClick={prevImage}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto backdrop-blur-sm group focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            </button>
            <button 
              onClick={nextImage}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto backdrop-blur-sm group focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next slide"
            >
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, idx) => (
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
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 md:px-12 flex flex-col items-start text-left mt-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8 flex items-center"
          >
            <div className="w-[1.5px] h-4 bg-red mr-4"></div>
            <span className="text-white font-sans text-[10px] font-bold tracking-[0.3em] uppercase">
              The Kingsfold Advantage
            </span>
          </motion.div>
          
          <div className="relative bg-white/20 backdrop-blur-md border-l-[3px] border-red p-10 md:p-16 max-w-2xl text-white shadow-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-[30px] md:text-[45px] font-serif leading-[1.1] mb-10 font-medium tracking-tight"
            >
              {homeContent.heroTitle}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="text-[12px] md:text-[16px] text-gray-200 leading-relaxed font-light mb-12 max-w-lg"
            >
              {homeContent.heroSubtitle}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link 
                to="/admissions" 
                className="bg-[#6B0F1A] text-white py-4 px-10 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-wine transition-all min-w-[180px] text-center"
              >
                Apply Now
              </Link>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link 
                  to="/about" 
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 px-10 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/20 transition-all min-w-[180px] text-center block"
                >
                  Book a Tour
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-12 md:-mt-16 mb-0">
        <div className="hidden md:block max-w-[1200px] mx-auto px-4">
          <div className="bg-wine shadow-[0_20px_50px_rgba(74,10,18,0.4)] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <filter id="noise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
              </svg>
            </div>
            
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border-white/5 border">
              {statsContent.map((stat: any, i: number) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="px-6 py-10 md:py-12 flex flex-col items-center justify-center text-center group/item hover:bg-white/5 transition-colors"
                >
                  <div className="mb-4 text-white transition-colors duration-500">
                    <Award size={20} strokeWidth={1.5} />
                  </div>
                  <div className="text-3xl md:text-5xl font-serif font-medium text-white mb-2 tracking-tight">
                    <Counter value={stat.num} />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 group-hover/item:text-white/80 transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-red to-transparent opacity-30" />
          </div>
        </div>
      </section>

      {/* Accreditation Section */}
      <AccreditationSection 
        title={(homeContent as any).accreditationTitle}
        subtitle={(homeContent as any).accreditationSubtitle}
        logos={(homeContent as any).accreditationLogos}
      />

      {/* Philosophy Section */}
      <section className="py-24 md:py-40 relative overflow-hidden">
        <div className="absolute top-20 right-0 text-[15rem] font-serif text-wine/[0.02] select-none pointer-events-none whitespace-nowrap -mr-40 tracking-tighter italic">
          Sophistics
        </div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/5] md:aspect-square">
                <motion.div 
                   className="absolute inset-0 z-10 p-4 bg-white shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img 
                    src={getDirectDriveLink(philosophyContent.image1 || "https://lh3.googleusercontent.com/d/1XCbsIM9C2_3ousgIcg1W5rZ3fCYdGttN")} 
                    alt="Kingsfold Academy campus excellence and high educational standards" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  className="absolute -top-10 -left-10 md:-top-20 md:-left-20 w-1/2 aspect-[3/4] z-20 p-3 bg-white shadow-xl hidden md:block"
                >
                  <img 
                    src={getDirectDriveLink(philosophyContent.image2 || "https://lh3.googleusercontent.com/d/1mIWiOWEOhTOjQSr3HTq671SganSeCeC_")} 
                    alt="Focused primary student engaged in academic learning" 
                    className="w-full h-full object-cover brightness-90 hover:brightness-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <div className="absolute -bottom-10 -right-10 w-2/5 aspect-square z-20 flex items-center justify-center bg-wine p-8 shadow-2xl hidden md:flex">
                  <div className="text-center">
                    <Quote className="text-red/30 w-8 h-8 mb-4 mx-auto" />
                    <p className="text-cream text-[10px] font-sans font-bold uppercase tracking-[0.2em] leading-relaxed">
                      "Excellence is not an act, but a habit."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-red"></div>
                  <span className="text-red font-sans text-xs font-bold tracking-[0.4em] uppercase">Our Philosophy</span>
                </div>
                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-wine leading-[1.1] mb-10 tracking-tight">
                  {philosophyContent.title}
                </h2>
                <div className="space-y-8 mb-12">
                  {philosophyContent.pillars.map((pillar: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * idx }}
                      className="flex gap-6 group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full border border-wine/10 flex items-center justify-center text-wine group-hover:bg-wine group-hover:text-white transition-all duration-500">
                        {idx === 0 ? <BookOpen size={24}/> : idx === 1 ? <Shield size={24}/> : <Globe size={24}/>}
                      </div>
                      <div>
                        <h4 className="font-serif text-xl text-wine mb-2">{pillar.title}</h4>
                        <p className="text-gray-600 text-base leading-relaxed">{pillar.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-4 bg-wine text-white px-10 py-5 text-[10px] font-bold uppercase tracking-widest hover:bg-red transition-all shadow-xl group"
                >
                  Discover Our Story <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <LeadershipSection members={leadershipContent} />

      {/* Top Performers Section */}
      <section className="py-24 bg-cream relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-wine/10 pb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[1px] bg-red"></div>
                <span className="text-[#C1121F] font-sans text-xs font-bold tracking-[0.3em] uppercase">Academic Brilliance</span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl text-[#6B0F1A] leading-tight mb-6">Our Top Performers</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {performersContent.map((performer: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="bg-white border border-gray-100 rounded-[5px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-700 h-full flex flex-col">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img 
                      src={getDirectDriveLink(performer.img || `https://i.pravatar.cc/600?img=${i + 10}`)} 
                      alt={`Photo of ${performer.name}, top performer at Kingsfold Academy`} 
                      className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0" 
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute bottom-0 left-0 bg-wine text-white py-2 px-4 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                       <Award size={12} className="text-red" aria-hidden="true" />
                       Scholar
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-4">
                       <span className="text-red text-[9px] font-bold uppercase tracking-widest block mb-1">{performer.exam}</span>
                       <h4 className="font-serif text-2xl text-[#6B0F1A] leading-tight transition-colors">{performer.name}</h4>
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="bg-cream-light p-4 border-l-2 border-wine/20">
                        <span className="text-[#1a1a1a] font-serif italic text-lg leading-none">{performer.achievement}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe size={14} className="text-wine/40" />
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{performer.dest}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 bg-white w-full border-y border-gray-100 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10 flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[40%] flex flex-col justify-center">
            <h2 className="font-serif text-5xl md:text-6xl text-[#6B0F1A] leading-tight mb-8">{pillarsContent.title}</h2>
            <Link to="/about" className="group flex items-center gap-4 bg-wine text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-red transition-all shadow-xl max-w-fit">
              <span>Our Heritage</span> <ArrowRight size={14} />
            </Link>
          </div>
          <div className="lg:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillarsContent.list.map((pillar: any, i: number) => (
                <div key={i} className="group p-8 md:p-10 bg-white border border-gray-100 hover:shadow-2xl transition-all">
                  {i === 0 ? <BookOpen size={28} className="text-wine mb-6" aria-hidden="true" /> : 
                   i === 1 ? <Shield size={28} className="text-wine mb-6" aria-hidden="true" /> :
                   i === 2 ? <Globe size={28} className="text-wine mb-6" aria-hidden="true" /> :
                   <Award size={28} className="text-wine mb-6" aria-hidden="true" />}
                  <h3 className="font-serif text-xl text-[#6B0F1A] mb-3">{pillar.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{pillar.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 bg-[#FCFBF7] w-full border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#6B0F1A] mb-4 block">Calendar & Highlights</span>
              <h2 className="font-serif text-5xl text-[#6B0F1A] leading-tight">{eventsContent.title}</h2>
            </div>
            <Link to="/news" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#6B0F1A]">
              <span>Full Calendar</span>
              <div className="w-8 h-[1px] bg-wine group-hover:w-12 transition-all"></div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {eventsContent.list.map((event: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative h-64 mb-6 overflow-hidden bg-cream border border-wine/5">
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-wine border border-wine/10">
                    {event.category}
                  </div>
                  {event.img && (
                    <img 
                      src={getDirectDriveLink(event.img)} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-wine/0 group-hover:bg-wine/10 transition-colors" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Clock size={12} />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#6B0F1A] group-hover:text-red transition-colors leading-snug">
                    {event.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Showcases */}
      <section className="py-32 w-full max-w-[1400px] mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcasesContent.map((item: any, i: number) => (
            <Link key={i} to={item.link} className="group relative h-[450px] overflow-hidden flex items-end">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${getDirectDriveLink(item.img)})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="relative z-10 p-8 w-full flex justify-between items-center">
                <h3 className="font-serif text-3xl text-white">{item.title}</h3>
                <ArrowRight className="text-white" size={24} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-32 overflow-hidden bg-white border-y border-gray-100 flex items-center justify-center text-center">
        <div className="relative z-10 px-4 max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="font-serif text-4xl md:text-6xl text-[#6B0F1A] mb-8">{ctaContent.title}</h2>
          <Link to={ctaContent.btnLink} className="bg-[#6B0F1A] text-white py-4 px-10 text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-3 hover:bg-red shadow-xl transition-all">
            {ctaContent.btnText} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
