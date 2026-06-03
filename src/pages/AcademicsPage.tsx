import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Monitor, FlaskConical, Languages, ChevronRight, Loader } from 'lucide-react';
import { cn } from '../lib/utils';
import AcademicsAwards from '../components/AcademicsAwards';
import AccreditationSection from '../components/AccreditationSection';
import SEO from '../components/SEO';
import { useCMS } from '../hooks/useCMS';

const DEFAULT_ACADEMICSPAGE = {
  heroTitle: "Academic Excellence",
  heroSubtitle: "A rigorous examination-focused approach preparing students for global and national success.",
  tab1Label: "CheckPoint",
  tab1Title: "Cambridge Checkpoint",
  tab1Desc: "The Cambridge Checkpoint program provides a robust foundation for students as they transition from primary to lower secondary education. It offers a clear framework for success in core subjects.",
  tab1Image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
  tab1Feature1: "Diagnostic assessment of learning progress.",
  tab1Feature2: "Foundation for IGCSE preparation.",
  tab2Label: "IGCSE",
  tab2Title: "Cambridge IGCSE",
  tab2Desc: "The International General Certificate of Secondary Education is the world's most popular international qualification for 14 to 16 year olds. It is recognized by leading universities and employers worldwide.",
  tab2Image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
  tab2Feature1: "Broad and balanced curriculum over 70 subjects.",
  tab2Feature2: "Globally recognized results (Cambridge & Pearson Edexcel).",
  tab3Label: "WAEC",
  tab3Title: "WAEC (WASSCE)",
  tab3Desc: "The West African Examinations Council (WAEC) provides the West African Senior School Certificate Examination (WASSCE), a standard requirement for university entry in Nigeria and West Africa.",
  tab3Image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200",
  tab3Feature1: "Comprehensive Nigerian curriculum coverage.",
  tab3Feature2: "Recognition by all West African tertiary institutions.",
  tab4Label: "NECO",
  tab4Title: "NECO (SSCE)",
  tab4Desc: "The National Examinations Council (NECO) offers the Senior School Certificate Examination (SSCE Internal), providing an alternative and valid national certification for Nigerian secondary school students.",
  tab4Image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
  tab4Feature1: "National standard for secondary education.",
  tab4Feature2: "Accepted for admission into all Nigerian universities.",
  tab5Label: "JAMB",
  tab5Title: "JAMB / UTME",
  tab5Desc: "The Joint Admissions and Matriculation Board's Unified Tertiary Matriculation Examination (UTME) is the gateway to all degree-awarding institutions, polytechnics, and colleges in Nigeria.",
  tab5Image: "https://images.unsplash.com/photo-1454165833741-979e2dca7d18?auto=format&fit=crop&q=80&w=1200",
  tab5Feature1: "Intensive preparation for the Computer Based Test (CBT).",
  tab5Feature2: "Strategic subject combinations for desired careers.",
  advantageTitle: "Why Our Curriculum Works",
  advantageSubtitle: "The Academic Advantage",
  reason1Title: "Personalized Learning",
  reason1Desc: "Small class sizes allow for individual attention and tailored academic support for every student.",
  reason2Title: "Practical Innovation",
  reason2Desc: "Our curriculum emphasizes hands-on learning through advanced laboratories and digital integration.",
  reason3Title: "Holistic Development",
  reason3Desc: "We integrate sports, arts, and leadership training into our academic timetable for balanced growth.",
};

export default function AcademicsPage() {
  const { data: academics, loading } = useCMS('academics', DEFAULT_ACADEMICSPAGE);
  const [activeTabId, setActiveTabId] = useState(1);
  const location = useLocation();



  useEffect(() => {
    const hash = location.hash.replace('#', '').toLowerCase();
    if (hash === 'checkpoint') setActiveTabId(1);
    if (hash === 'igcse') setActiveTabId(2);
    if (hash === 'waec') setActiveTabId(3);
    if (hash === 'neco') setActiveTabId(4);
    if (hash === 'jamb') setActiveTabId(5);
  }, [location.hash]);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-cream"><Loader className="animate-spin text-wine" size={40} /></div>;
  }

  const tabs = [
    { id: 1, label: academics.tab1Label },
    { id: 2, label: academics.tab2Label },
    { id: 3, label: academics.tab3Label },
    { id: 4, label: academics.tab4Label },
    { id: 5, label: academics.tab5Label },
  ];

  const getActiveContent = () => {
    const prefix = `tab${activeTabId}`;
    return {
      title: (academics as any)[`${prefix}Title`],
      desc: (academics as any)[`${prefix}Desc`],
      image: (academics as any)[`${prefix}Image`],
      features: [
        { icon: BookOpen, text: (academics as any)[`${prefix}Feature1`] },
        { icon: Monitor, text: (academics as any)[`${prefix}Feature2`] },
      ]
    };
  };

  const activeContent = getActiveContent();

  const academicsSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalProgram",
    "name": "Kingsfold Academy Academic Program",
    "description": "Comprehensive preschool, primary, and secondary school curriculum blending the British National Curriculum (IGCSE, A-Levels) with the Nigerian National Curriculum.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Kingsfold International Academy"
    },
    "educationalCredentialAwarded": "Cambridge IGCSE, BECE, West African Senior School Certificate (WASSCE)",
    "programType": "Day & Boarding Academic Program"
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <SEO 
        title={academics.heroTitle || "Academics Department"}
        description={academics.heroSubtitle || "Kingsfold Academy provides academic excellence blending British IGCSE & A-Levels with the Nigerian educational curriculum."}
        keywords="Kingsfold academics, British curriculum Lagos, IGCSE schools Nigeria, West African primary curriculum, boarding school studies"
        schema={academicsSchema}
      />
      <div className="py-24 md:py-32 bg-wine-dark text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif text-cream mb-6"
        >
          {academics.heroTitle}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-cream/80 max-w-2xl mx-auto"
        >
          {academics.heroSubtitle}
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 w-full">
        {/* Main Content */}
        <div className="space-y-32">
            
            <section id="awards" className="scroll-mt-32">
              <AcademicsAwards />
            </section>

            <section id="accreditation" className="scroll-mt-32">
              <AccreditationSection 
                title={(academics as any).accreditationTitle}
                subtitle={(academics as any).accreditationSubtitle}
                logos={(academics as any).accreditationLogos}
              />
            </section>

            <section id="curriculum" className="scroll-mt-32">
              {/* Tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-16">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={cn(
                      "px-6 py-3 uppercase tracking-widest text-sm transition-all duration-300 border",
                      activeTabId === tab.id 
                        ? "bg-wine text-white border-wine font-bold shadow-lg scale-105 z-10" 
                        : "bg-transparent text-wine border-wine/20 font-medium hover:border-wine hover:bg-wine/5"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <motion.div 
                key={activeTabId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
              >
                <div className="aspect-[4/3] bg-gray-200 shadow-2xl overflow-hidden">
                  <img 
                    src={activeContent.image || null} 
                    alt={activeContent.title} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div>
                  <span className="text-red font-bold uppercase tracking-widest text-sm mb-4 block">Qualification Track</span>
                  <h2 className="text-4xl md:text-5xl font-serif text-wine-dark mb-6">
                    {activeContent.title}
                  </h2>
                  <p className="text-gray-dark/80 mb-6 leading-relaxed">
                    {activeContent.desc}
                  </p>
                  <ul className="flex flex-col gap-4 mb-8 text-gray-dark">
                    {activeContent.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="mt-1 p-1 bg-cream-light text-wine rounded shadow-sm">
                          <feature.icon size={18}/>
                        </div>
                        <span className="text-sm font-medium">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="px-8 py-4 bg-wine text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-red shadow-xl transition-all">
                    Download Syllabus Guide
                  </button>
                </div>
              </motion.div>
            </section>

            {/* Advantage Section */}
            <section id="advantage" className="mt-32 pt-20 border-t border-wine/5 font-sans scroll-mt-32">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <span className="text-red uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">{academics.advantageSubtitle}</span>
                <h2 className="text-4xl font-serif text-wine-dark mb-6">{academics.advantageTitle}</h2>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((num, idx) => (
                  <motion.div 
                    key={num} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                    className="p-8 bg-white border border-gray-100 hover:border-wine/20 hover:shadow-xl transition-all text-center rounded-sm"
                  >
                    <h4 className="font-serif text-xl text-wine-dark mb-4">{(academics as any)[`reason${num}Title`]}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{(academics as any)[`reason${num}Desc`]}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
  );
}
