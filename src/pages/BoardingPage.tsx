import React from 'react';
import { motion } from 'framer-motion';
import { Home, Coffee, ShieldCheck, HeartPulse, Quote, Award, Loader } from 'lucide-react';
import SEO from '../components/SEO';
import AccreditationSection from '../components/AccreditationSection';
import { useCMS } from '../hooks/useCMS';
import { getDirectDriveLink } from '../lib/utils';

const DEFAULT_BOARDINGPAGE = {
  heroTitle: "Boarding Life",
  heroSubtitle: "A home away from home, defined by luxury, security, and pastoral care.",
  heroImage: "https://lh3.googleusercontent.com/d/168n4N_bfIfjU6yhPlKvtC4RRS-0GV84p",
  premiumTitle: "A Premium Residential Experience",
  premiumDesc: "Our boarding houses are designed to be a comfortable, secure, and nurturing environment. We offer en-suite facilities, structured study hours, and weekend activities that keep our students engaged and happy.",
  feature1Title: "Luxury Hostels",
  feature1Desc: "En-suite rooms, climate control, and modern furnishings.",
  feature2Title: "Fine Dining",
  feature2Desc: "Nutritious, multi-course meals prepared by professional chefs.",
  feature3Title: "Pastoral Care",
  feature3Desc: "Dedicated houseparents ensuring emotional and physical wellbeing.",
  feature4Title: "24/7 Security",
  feature4Desc: "Round-the-clock CCTV, secure perimeter, and trained guards.",
  voice1Name: "Sade Adeleke",
  voice1Role: "Boarding Prefect",
  voice1Quote: "Living here taught me time management. Between structured study hours and free time in the common room, I've learned how to balance my academic goals with social life perfectly.",
  voice1Img: "https://images.unsplash.com/photo-1491349174775-aaaf90397099?auto=format&fit=crop&q=80&w=200",
  voice2Name: "Ibrahim Musa",
  voice2Role: "Grade 10 Boarder",
  voice2Quote: "The weekend activities are what I look forward to most. From film nights to inter-house football matches, there's always a sense of excitement and healthy competition.",
  voice2Img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
};

export default function BoardingPage() {
  const { data: boarding, loading } = useCMS('boarding', DEFAULT_BOARDINGPAGE);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream"><Loader className="animate-spin text-wine" size={40} /></div>;
  }

  const boardingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Exceptional Boarding Experience | Kingsfold Academy",
    "description": "Discover the luxurious 'home away from home' boarding houses, nutritious catering, supervised study, and outstanding recreational facilities at Kingsfold International Academy.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Kingsfold International Academy"
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <SEO 
        title={boarding.heroTitle || "Boarding & Hostel Life"}
        description={boarding.heroSubtitle || "Explore our residential boarding houses featuring supervised studies, holistic student care, and safe environment at Kingsfold Academy."}
        keywords="boarding life Nigeria, safe hostels Lagos, premier boarding school, residential high school"
        schema={boardingSchema}
      />
      <div className="relative py-32 md:py-48 text-center px-4 overflow-hidden flex items-center justify-center">
        <div style={{ backgroundImage: `url(${boarding.heroImage})` }} className="absolute inset-0 bg-cover bg-center" />
        <div className="absolute inset-0 bg-wine-dark/80" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif text-cream mb-6">{boarding.heroTitle}</h1>
          <p className="text-lg text-cream/90">{boarding.heroSubtitle}</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-20 w-full">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-serif text-wine-dark mb-6">{boarding.premiumTitle}</h2>
          <p className="text-gray-dark/80 leading-relaxed">
            {boarding.premiumDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            { icon: Home, title: boarding.feature1Title, desc: boarding.feature1Desc },
            { icon: Coffee, title: boarding.feature2Title, desc: boarding.feature2Desc },
            { icon: HeartPulse, title: boarding.feature3Title, desc: boarding.feature3Desc },
            { icon: ShieldCheck, title: boarding.feature4Title, desc: boarding.feature4Desc }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 border-t-4 border-red shadow-sm transition-all hover:shadow-lg">
              <feature.icon className="w-8 h-8 text-wine mb-4" />
              <h3 className="font-serif text-xl text-wine-dark mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Accreditation Section */}
        <div className="-mx-4 md:-mx-12 mb-24">
          <AccreditationSection 
            title={(boarding as any).accreditationTitle}
            subtitle={(boarding as any).accreditationSubtitle}
            logos={(boarding as any).accreditationLogos}
          />
        </div>

        {/* Boarder Voices Section */}
        <section className="py-24 bg-white border-y border-wine/5 relative overflow-hidden -mx-4 md:-mx-12 px-4 md:px-12">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.02] flex items-center justify-center">
             <Quote size={600} className="text-wine" />
          </div>
          
          <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-red font-sans text-xs font-bold tracking-[0.3em] uppercase block mb-4 italic">Community Living</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[#6B0F1A] leading-tight">Boarder Voices</h2>
              <p className="text-gray-500 mt-4 max-w-xl text-sm leading-relaxed">Direct insights from our boarding students on living on campus.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[1, 2].map((num) => (
                <motion.div 
                  key={num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-cream p-10 md:p-12 border-l-4 border-wine relative group"
                >
                  <Quote size={24} className="text-red mb-6 opacity-40" />
                  <p className="text-wine-dark font-serif text-xl italic leading-relaxed mb-8">"{(boarding as any)[`voice${num}Quote`]}"</p>
                  
                  <div className="flex items-center gap-5 pt-8 border-t border-wine/10">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-wine/20">
                      <img src={getDirectDriveLink((boarding as any)[`voice${num}Img`]) || null} alt={(boarding as any)[`voice${num}Name`]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-wine">{(boarding as any)[`voice${num}Name`]}</h4>
                      <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-red/60">{(boarding as any)[`voice${num}Role`]}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
