import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Eye, Compass, Heart, Play, Pause, Map, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ShieldCheck, Globe, BookOpen, Lightbulb, Activity, Award } from 'lucide-react';
import { cn, getDirectDriveLink } from '../lib/utils';
import SEO from '../components/SEO';
import { useCMS } from '../hooks/useCMS';

const DEFAULT_ABOUTPAGE = {
  heroTitle: "About Kingsfold",
  heroSubtitle: "A heritage of excellence, nurturing minds to shape the future.",
  historyTitle: "Our History",
  historyContent1: "Founded on the principles of academic rigor and moral integrity, Kingsfold International Academy has grown to become a beacon of educational excellence in Africa.",
  historyContent2: "We started with a simple vision: to create an environment where the child is the center of the learning process, blending international standard curricula with the rich cultural heritage of Nigeria.",
  historyImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2940&auto=format&fit=crop",
  visionTitle: "Our Vision",
  visionQuote: "To be Africa's leading preparatory academy, raising global leaders who are intellectually empowered, culturally grounded, and morally sound.",
  missionTitle: "Our Mission",
  missionSubtitle: "We are committed to providing a world-class education through a bespoke dual curriculum that empowers students to reach their full potential. We foster a community where curiosity is sparked, character is built, and excellence is normalized.",
  missionPillar1Label: "Academic Rigor",
  missionPillar1Desc: "Challenging intellectual standards.",
  missionPillar2Label: "Character Formation",
  missionPillar2Desc: "Building ethical foundations.",
  missionPillar3Label: "Global Readiness",
  missionPillar3Desc: "Preparing for international stages.",
  missionPillar4Label: "Heritage Pride",
  missionPillar4Desc: "Celebrating Nigerian roots.",
  philosophyEthos: "Educating the whole child—heart, mind, and spirit.",
  philosophyTitle1: "Holistic Pedagogy",
  philosophyDesc1: "Our philosophy transcends literal instruction. We believe every child is a universe of potential. By blending international standards with a deep respect for our heritage, we create a learning environment where academic brilliance and emotional intelligence coexist.",
  philosophyTitle2: "Adaptive Learning",
  philosophyDesc2: "We recognize that the future belongs to those who can unlearn and relearn. Our students are taught to be agile, resilient, and perpetually curious about the world around them.",
  value1Title: "Excellence",
  value1Desc: "Setting the highest standards in every undertaking, whether academic or extracurricular.",
  value2Title: "Integrity",
  value2Desc: "Building a culture of honesty and ethical conduct as our defining mark of character.",
  value3Title: "Discipline",
  value3Desc: "Fostering the self-control and focus required to achieve greatness in a global world.",
  value4Title: "Empathy",
  value4Desc: "Cultivating kindness and respect for the unique perspectives and backgrounds of others.",
  value5Title: "Innovation",
  value5Desc: "Embracing future-ready thinking and creative problem-solving in all aspects of life.",
  principalMessageTitle: "A Message From Our Principal",
  principalMessageContent: `Good morning, distinguished parents; esteemed staff; dear students; and honored guests.

It is my great pleasure to welcome you to our school community—a place where academic excellence, character development, innovation, and global citizenship are nurtured daily. At Kingsfold International Academic, we are committed to providing a world-class education that empowers every child to achieve their fullest potential. 

We believe that education goes beyond the classroom. It is about building confidence, integrity, leadership, and a lifelong passion for learning. Together with our dedicated teachers and supportive parents, we strive to create an environment where every learner feels valued, inspired, and prepared for success in an ever-changing world.

To our students, I encourage you to dream big, work hard, and always uphold the values of respect, discipline, and excellence.

Thank you for being part of this wonderful journey. Together, we will continue to build a brighter future.

God bless you all.`,
  principalSignature: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=260&auto=format&fit=crop&text=Signature",
  principalImage: "https://lh3.googleusercontent.com/d/1Z7xD0_-7X5gCFKn_pBVeFBv1o8qg331U",
  principalName: "Mrs. Olowoyeoshoba",
  principalRole: "Principal & Chief Academic Officer",
  distinctionTitle: "Why Choose Our Academy?",
  distinctionSubtitle: "We go beyond academic results, focusing on the development of character, leadership, and a global perspective in every student.",
  reason1Title: "Personalized Learning",
  reason1Desc: "Bespoke educational paths tailored to each student's unique strengths and learning styles.",
  reason2Title: "Practical Innovation",
  reason2Desc: "A curriculum that prioritizes hands-on experience and future-ready technological proficiency.",
  reason3Title: "Holistic Development",
  reason3Desc: "Nurturing physical, mental, and social well-being alongside rigorous spiritual and academic growth.",
  tourTitle: "Take a Virtual Tour",
  tourSubtitle: "Experience our world-class facilities and serene learning environment from the comfort of your home.",
  tourPoint1Name: "Academic Block",
  tourPoint1Img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=2000",
  tourPoint2Name: "Main Library",
  tourPoint2Img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000",
  tourPoint3Name: "Boarding House",
  tourPoint3Img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000",
  tourPoint4Name: "Sports Complex",
  tourPoint4Img: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=2000",
  aboutLeader1Name: "Jane Doe",
  aboutLeader1Role: "Principal / CEO",
  aboutLeader1Img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
  aboutLeader2Name: "John Smith",
  aboutLeader2Role: "Principal / CEO",
  aboutLeader2Img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
  aboutLeader3Name: "Emily Brown",
  aboutLeader3Role: "Principal / CEO",
  aboutLeader3Img: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1000&auto=format&fit=crop",
  aboutLeader4Name: "Pastor Olusegun Alabi",
  aboutLeader4Role: "Chairman, Board of Governors",
  aboutLeader4Img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  aboutLeader5Name: "Dr. Chioma Nwachukwu",
  aboutLeader5Role: "Vice Principal (Academics)",
  aboutLeader5Img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
  aboutLeader6Name: "Mr. Tunde Adebowale",
  aboutLeader6Role: "Finance & Admin Director",
  aboutLeader6Img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
};

export default function AboutPage() {
  const { data: aboutContent } = useCMS('aboutpage', DEFAULT_ABOUTPAGE);
  const rawContent = aboutContent || DEFAULT_ABOUTPAGE;
  const content = {
    ...rawContent,
    principalName: rawContent.principalName === "Dr. Elizabeth Kingsfold" ? "Mrs. Olowoyeoshoba" : rawContent.principalName,
    principalImage: (rawContent.principalImage && (
      rawContent.principalImage.includes('1573496359142-b8d87734a5a2') || 
      rawContent.principalImage.includes('export=download')
    )) ? "https://lh3.googleusercontent.com/d/1Z7xD0_-7X5gCFKn_pBVeFBv1o8qg331U" : (rawContent.principalImage || "https://lh3.googleusercontent.com/d/1Z7xD0_-7X5gCFKn_pBVeFBv1o8qg331U"),
    principalMessageContent: (rawContent.principalMessageContent && rawContent.principalMessageContent.includes("seeds of leadership")) 
      ? DEFAULT_ABOUTPAGE.principalMessageContent 
      : (rawContent.principalMessageContent || DEFAULT_ABOUTPAGE.principalMessageContent)
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [currentSection, setCurrentSection] = useState(0);

  const [activeId, setActiveId] = useState('history');

  const sidebarItems = [
    { id: 'history', label: 'Our History' },
    { id: 'vision-mission', label: 'Vision & Mission' },
    { id: 'philosophy', label: 'Our Philosophy' },
    { id: 'values', label: 'Core Values' },
    { id: 'principal', label: "Principal's Message" },
    { id: 'distinction', label: 'Why Choose Us' },
    { id: 'tour', label: 'Virtual Tour' },
    { id: 'leadership', label: 'Our Leadership' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const sectionIds = ['history', 'vision-mission', 'philosophy', 'values', 'principal', 'distinction', 'tour', 'leadership'];
    const observers = sectionIds.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id);
          }
        },
        {
          rootMargin: '-25% 0px -55% 0px'
        }
      );
      observer.observe(el);
      return { el, observer };
    });

    return () => {
      observers.forEach(item => {
        if (item) {
          item.observer.unobserve(item.el);
        }
      });
    };
  }, []);

  const tourSections = [
    { name: content.tourPoint1Name, img: content.tourPoint1Img },
    { name: content.tourPoint2Name, img: content.tourPoint2Img },
    { name: content.tourPoint3Name, img: content.tourPoint3Img },
    { name: content.tourPoint4Name, img: content.tourPoint4Img },
  ];

  const handleNext = () => setCurrentSection((prev) => (prev + 1) % tourSections.length);
  const handlePrev = () => setCurrentSection((prev) => (prev - 1 + tourSections.length) % tourSections.length);
  const togglePlay = () => setIsPlaying(!isPlaying);
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 1));

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Kingsfold International Academy | Heritage & Vision",
    "description": "Discover the mission, vision, and core educational values of Kingsfold International Academy. Learn about our commitment to academic excellence and nurturing future leaders.",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Kingsfold International Academy",
      "logo": "https://lh3.googleusercontent.com/d/1iUPYl60tbSKCWv3GSBhjpTyD24GYerhE"
    }
  };

  return (
    <div className="flex flex-col w-full">
      <SEO 
        title="About Our Academy | Heritage & Vision"
        description="Discover the mission, vision, and values of Kingsfold International Academy. Learn about our commitment to academic excellence and nurturing global leaders in Lagos, Nigeria."
        keywords="About Kingsfold Academy, International School Mission Nigeria, Top School Values, Educational Excellence Lagos"
        schema={aboutSchema}
      />
      {/* Hero Header */}
      <div className="py-24 md:py-32 bg-wine text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif text-white mb-6"
        >
          {content.heroTitle}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-cream/80 max-w-2xl mx-auto"
        >
          {content.heroSubtitle}
        </motion.p>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit pr-8 border-r border-[#6B0F1A]/5 self-start space-y-4">
            <p className="text-[10px] uppercase font-bold text-red tracking-[0.2em] mb-4">Inside Academy</p>
            <div className="relative flex flex-col gap-2">
              {sidebarItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    className={cn(
                      "relative pr-4 py-2.5 text-right text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none outline-none",
                      isActive ? "text-wine font-extrabold" : "text-gray-400 hover:text-wine-dark"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="about-sidebar-indicator"
                        className="absolute right-[-1px] top-1 bottom-1 w-[3px] bg-wine rounded-l-md"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="pt-6 border-t border-[#6B0F1A]/5 mt-6">
              <span className="text-[9px] text-gray-400 block font-medium leading-relaxed">
                Scroll to explore our values, campus tour, and executive management.
              </span>
            </div>
          </aside>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-9 space-y-32">
            <section id="history" className="scroll-mt-32">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif text-wine-dark mb-6">{content.historyTitle}</h2>
            <p className="text-gray-dark/80 leading-relaxed mb-4">
              {content.historyContent1}
            </p>
            <p className="text-gray-dark/80 leading-relaxed">
              {content.historyContent2}
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="aspect-video bg-gray-300 shadow-xl overflow-hidden"
          >
            <img src={getDirectDriveLink(content.historyImage) || null} alt="Campus view" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 font-sans" />
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section id="vision-mission" className="py-24 border-b border-gray-100 mb-24 scroll-mt-32">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-wine p-12 md:p-16 text-white relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
              <Eye className="absolute top-10 right-10 w-32 h-32 text-white/5 -mr-16 -mt-16 group-hover:rotate-12 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-[1px] bg-red"></div>
                  <span className="text-red text-[10px] font-bold uppercase tracking-[0.4em] block">The Long View</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif mb-8 border-b border-white/10 pb-6">{content.visionTitle}</h2>
                <div className="relative">
                  <span className="absolute -top-6 -left-4 text-6xl text-white/10 font-serif">"</span>
                  <p className="text-xl md:text-2xl font-serif text-cream/90 leading-relaxed italic relative z-10">
                    {content.visionQuote}
                  </p>
                </div>
                <div className="w-16 h-1 bg-red mt-12"></div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-cream-light p-12 md:p-16 text-wine border border-wine/5 relative overflow-hidden group"
            >
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-wine/5 rounded-full translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
              <Target className="absolute top-10 right-10 w-32 h-32 text-wine/5 -mr-16 -mt-16 group-hover:-rotate-12 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-[1px] bg-red"></div>
                  <span className="text-red text-[10px] font-bold uppercase tracking-[0.4em] block">Our Purpose</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif mb-8 border-b border-wine/10 pb-6">{content.missionTitle}</h2>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10">
                  {content.missionSubtitle}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    { label: content.missionPillar1Label, desc: content.missionPillar1Desc },
                    { label: content.missionPillar2Label, desc: content.missionPillar2Desc },
                    { label: content.missionPillar3Label, desc: content.missionPillar3Desc },
                    { label: content.missionPillar4Label, desc: content.missionPillar4Desc }
                  ].map((item) => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-wine">
                        <div className="w-1.5 h-1.5 rounded-full bg-red"></div>
                        {item.label}
                      </div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Philosophy - Highlight Section */}
        <section id="philosophy" className="py-24 relative overflow-hidden mb-32 bg-wine-dark rounded-sm scroll-mt-32">
          <div className="absolute inset-0 opacity-10">
             <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000" alt="Background" className="w-full h-full object-cover" />
          </div>
          <div className="max-w-[1000px] mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="inline-flex items-center justify-center p-6 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-10 group hover:bg-white/10 transition-colors">
                <Compass className="w-12 h-12 text-red group-hover:rotate-45 transition-transform duration-700" />
              </div>
              <span className="text-red text-[10px] font-bold uppercase tracking-[0.6em] mb-8 block">The Kingsfold Ethos</span>
              <h2 className="text-5xl md:text-7xl font-serif text-white mb-12 italic leading-tight tracking-tight">
                "{content.philosophyEthos}"
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mt-20 pt-20 border-t border-white/10">
                <div>
                  <h4 className="font-serif text-2xl text-red mb-4">{content.philosophyTitle1}</h4>
                  <p className="text-base text-cream/70 leading-relaxed">
                    {content.philosophyDesc1}
                  </p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl text-red mb-4">{content.philosophyTitle2}</h4>
                  <p className="text-base text-cream/70 leading-relaxed">
                    {content.philosophyDesc2}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Values Section */}
        <section id="values" className="py-24 mb-32 scroll-mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <Heart className="w-12 h-12 text-red mx-auto mb-6" />
            <span className="text-wine text-xs font-bold uppercase tracking-[0.4em] mb-4 block">The Pillars of our Community</span>
            <h2 className="text-4xl md:text-6xl font-serif text-wine">Our Core Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { title: content.value1Title, desc: content.value1Desc, icon: Award },
              { title: content.value2Title, desc: content.value2Desc, icon: ShieldCheck },
              { title: content.value3Title, desc: content.value3Desc, icon: Activity },
              { title: content.value4Title, desc: content.value4Desc, icon: Heart },
              { title: content.value5Title, desc: content.value5Desc, icon: Lightbulb }
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white border border-gray-100 text-center hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-wine mb-6 group-hover:bg-wine group-hover:text-white transition-all">
                  <value.icon size={28} />
                </div>
                <h3 className="font-serif text-2xl text-wine mb-4">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Principal's Message Section */}
        <section id="principal" className="py-24 bg-white border-y border-gray-100 mb-24 scroll-mt-32">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-5 relative"
            >
              <div className="absolute -inset-4 border border-wine/10 translate-x-8 translate-y-8 z-0"></div>
              <div className="relative z-10 aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img 
                  src={getDirectDriveLink(content.principalImage) || null} 
                  alt={content.principalName} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-7 flex flex-col justify-center"
            >
              <span className="text-red uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">Leadership Note</span>
              <h2 className="font-serif text-4xl md:text-5xl text-wine-dark mb-8 leading-tight">{content.principalMessageTitle}</h2>
              
              <div className="relative">
                <span className="absolute -top-10 -left-6 text-9xl text-wine/5 font-serif pointer-events-none">"</span>
                <p className="text-lg md:text-xl text-gray-600 italic font-serif leading-relaxed mb-8 relative z-10 whitespace-pre-line">
                  {content.principalMessageContent}
                </p>
              </div>
              
              <div>
                <h4 className="font-serif text-2xl text-wine-dark">{content.principalName}</h4>
                <p className="text-xs uppercase tracking-widest text-red font-bold mt-1">{content.principalRole}</p>
              </div>
              
              <div className="mt-10 pt-10 border-t border-gray-100">
                <img 
                  src={getDirectDriveLink(content.principalSignature) || null} 
                  alt="Signature" 
                  className="h-12 grayscale opacity-30 invert"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Kingsfold Section */}
        <section id="distinction" className="py-24 bg-cream relative overflow-hidden mb-32 rounded-sm scroll-mt-32">
          <div className="absolute top-0 right-0 w-64 h-64 bg-wine/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3 flex flex-col justify-center">
              <span className="text-red uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Our Distinction</span>
              <h2 className="text-4xl md:text-5xl font-serif text-wine-dark mb-8 leading-tight">{content.distinctionTitle}</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {content.distinctionSubtitle}
              </p>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: content.reason1Title, icon: BookOpen, desc: content.reason1Desc },
                { title: content.reason2Title, icon: Lightbulb, desc: content.reason2Desc },
                { title: content.reason3Title, icon: Activity, desc: content.reason3Desc }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white border border-wine/10 hover:shadow-xl transition-all group"
                >
                   <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center text-wine mb-6 group-hover:bg-wine group-hover:text-white transition-all shadow-sm">
                     <item.icon size={26} />
                   </div>
                   <h3 className="font-serif text-xl text-wine-dark mb-4 leading-tight group-hover:text-red transition-colors">{item.title}</h3>
                   <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                   <div className="mt-6 w-8 h-[2px] bg-red/20 group-hover:w-full transition-all duration-700"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Virtual Tour Section */}
        <section id="tour" className="mb-32 scroll-mt-32">
          <div className="text-center mb-16">
            <span className="text-red uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Interactive Experience</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wine-dark mb-6">{content.tourTitle}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
              {content.tourSubtitle}
            </p>
          </div>

          <div className="relative group aspect-video bg-wine-dark overflow-hidden shadow-2xl border border-wine/10">
            {/* Virtual Tour Content */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <motion.img 
                  animate={{ scale: zoom }}
                  transition={{ duration: 0.3 }}
                  src={getDirectDriveLink(tourSections[currentSection].img)} 
                  alt={tourSections[currentSection].name} 
                  className="w-full h-full object-cover opacity-60"
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Overlay UI */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            </div>

            {/* Play/Pause Center button */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <motion.button 
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center text-white bg-white/5 hover:bg-wine transition-colors group/btn pointer-events-auto"
              >
                {isPlaying ? <Pause className="relative z-10" size={32} /> : <Play className="relative z-10 ml-1" size={32} />}
              </motion.button>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 z-30">
              <button 
                onClick={handlePrev}
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all pointer-events-auto border border-white/10"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-6 z-30">
              <button 
                onClick={handleNext}
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all pointer-events-auto border border-white/10"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* View Status */}
            <div className="absolute top-8 left-8 z-30">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full bg-red", isPlaying && "animate-ping")} />
                <span className="text-[10px] uppercase font-bold tracking-widest text-white">
                  {isPlaying ? 'Autonomous Tour Active' : 'Manual Control Mode'}
                </span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 pointer-events-auto">
              <button onClick={zoomIn} className="text-white hover:text-red transition-colors p-1" title="Zoom In">
                <ZoomIn size={18} />
              </button>
              <div className="w-px h-4 bg-white/20" />
              <button onClick={zoomOut} className="text-white hover:text-red transition-colors p-1" title="Zoom Out">
                <ZoomOut size={18} />
              </button>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex flex-col items-center min-w-[140px]">
                <span className="text-[9px] uppercase font-bold text-white/50 tracking-tighter">Section {currentSection + 1} of {tourSections.length}</span>
                <span className="text-[11px] font-serif font-bold text-white uppercase tracking-widest leading-none mt-0.5">{tourSections[currentSection].name}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-40">
              <motion.div 
                initial={false}
                animate={{ width: `${((currentSection + 1) / tourSections.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="h-full bg-red shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              />
            </div>

            {/* 360 Indicator */}
            <div className="absolute top-8 right-8 z-30">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
               >
                  <Map size={18} />
               </motion.div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tourSections.map((section, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSection(idx)}
                className={cn(
                  "group p-6 bg-white border transition-all text-left relative overflow-hidden",
                  currentSection === idx ? "border-wine" : "border-gray-100 hover:border-wine/30"
                )}
              >
                {currentSection === idx && (
                  <motion.div 
                    layoutId="activeSection"
                    className="absolute inset-0 bg-wine/5"
                  />
                )}
                <div className="relative z-10">
                  <span className={cn(
                    "text-[9px] font-bold block mb-2",
                    currentSection === idx ? "text-wine" : "text-gray-300"
                  )}>Point 0{idx + 1}</span>
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-widest transition-colors",
                    currentSection === idx ? "text-wine" : "text-gray-400 group-hover:text-wine/60"
                  )}>{section.name}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Leadership */}
        <section id="leadership" className="scroll-mt-32">
          <h2 className="text-4xl font-serif text-wine-dark text-center mb-12">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: content.aboutLeader1Name, role: content.aboutLeader1Role, img: content.aboutLeader1Img || DEFAULT_ABOUTPAGE.aboutLeader1Img },
              { name: content.aboutLeader2Name, role: content.aboutLeader2Role, img: content.aboutLeader2Img || DEFAULT_ABOUTPAGE.aboutLeader2Img },
              { name: content.aboutLeader3Name, role: content.aboutLeader3Role, img: content.aboutLeader3Img || DEFAULT_ABOUTPAGE.aboutLeader3Img },
              { name: content.aboutLeader4Name, role: content.aboutLeader4Role, img: content.aboutLeader4Img || DEFAULT_ABOUTPAGE.aboutLeader4Img },
              { name: content.aboutLeader5Name, role: content.aboutLeader5Role, img: content.aboutLeader5Img || DEFAULT_ABOUTPAGE.aboutLeader5Img },
              { name: content.aboutLeader6Name, role: content.aboutLeader6Role, img: content.aboutLeader6Img || DEFAULT_ABOUTPAGE.aboutLeader6Img },
            ].map((leader, i) => (
              <div key={i} className="bg-white group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={getDirectDriveLink(leader.img) || null} alt={leader.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-serif text-xl text-wine-dark mb-1">{leader.name}</h4>
                  <p className="text-xs uppercase tracking-widest text-red">{leader.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
</div>
  );
}

