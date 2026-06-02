import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Star, BookOpen, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useCMS } from '../hooks/useCMS';

const DEFAULT_SCHOLARSHIPS = {
  heroTitle: "Honoring Exceptional Potential",
  heroSubtitle: "At Kingsfold Academy, we are committed to lowering financial barriers for students who demonstrate the drive to change the world.",
  processTitle: "Scholarship Application Process",
  ctaTitle: "Invest in Excellence",
  ctaDesc: "Download our comprehensive scholarship brochure to understand all available grants, endowment opportunities, and donor-sponsored bursaries.",
};

export default function ScholarshipsPage() {
  const { data: cmsData } = useCMS('scholarships', DEFAULT_SCHOLARSHIPS);
  const scholarshipCategories = [
    {
      title: "Academic Excellence",
      icon: <GraduationCap className="w-8 h-8" />,
      desc: "For students with exceptional academic records and high scores in our entrance examinations.",
      criteria: ["Top 5% in entrance exam", "Previous school grade average of 90%+", "Interview performance"],
      benefit: "Up to 50% Tuition Waiver"
    },
    {
      title: "STEM Innovation",
      icon: <Star className="w-8 h-8" />,
      desc: "Recognizing students who have demonstrated remarkable aptitude in Science, Technology, Engineering, and Mathematics.",
      criteria: ["National STEM competition finalist", "Coding/Robotics portfolio", "Special aptitude test"],
      benefit: "Up to 30% Tuition Waiver"
    },
    {
      title: "Arts & Sports Talent",
      icon: <Award className="w-8 h-8" />,
      desc: "Designed for students who exhibit mastery in performing arts, visual arts, or competitive sports at a state or national level.",
      criteria: ["Performance portfolio/Sporting trophies", "Regional representation", "Specialized audition/trial"],
      benefit: "Up to 25% Tuition Waiver"
    }
  ];

  const scholarshipSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Are scholarships available at Kingsfold International Academy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Kingsfold International Academy offers multiple financial grants and scholarships, including Academic Excellence (up to 50% tuition waiver), STEM Innovation (up to 30% waiver), and Arts & Sports Talent (up to 25% waiver)."
        }
      },
      {
        "@type": "Question",
        "name": "How can I apply for a scholarship at Kingsfold Academy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The scholarship application is a 4-step process: First, apply for standard admission. Second, fill out the scholarship and financial aid form. Third, complete the specialized evaluation test and panel interview. Fourth, receive notice of your grant award with your admission letter."
        }
      }
    ]
  };

  return (
    <div className="pt-24 min-h-screen">
      <SEO 
        title="Scholarships & Financial Grants" 
        description="Learn about the merit-based scholarships, STEM innovation grants, and arts and sports waivers available to qualified students at Kingsfold International Academy."
        keywords="Kingsfold Academy Scholarship, school grants Nigeria, secondary school scholarships Lagos"
        schema={scholarshipSchema}
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000" 
            alt="Scholarship" 
            className="w-full h-full object-cover opacity-30 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-cream/80" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-wine rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <Award className="text-white" size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-serif text-wine-dark mb-8 leading-[1.1]"
          >
            {cmsData.heroTitle.split(' ').map((word: string, i: number, arr: string[]) => 
              word === 'Exceptional' ? <span key={i} className="italic text-red">{word} </span> : word + ' '
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            {cmsData.heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-32 px-4 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {scholarshipCategories.map((category, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white group overflow-hidden border border-gray-100 flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="p-12 border-b border-gray-50">
                  <div className="text-red mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 origin-left">
                    {category.icon}
                  </div>
                  <h3 className="text-3xl font-serif text-wine-dark mb-6 leading-tight">{category.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">{category.desc}</p>
                  
                  <div className="bg-cream-light p-6 rounded-lg">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-red mb-2 block">Grant Benefit</span>
                    <span className="text-xl font-serif text-wine font-bold">{category.benefit}</span>
                  </div>
                </div>
                
                <div className="p-12 flex-1 flex flex-col justify-between bg-gray-50/30">
                  <div className="space-y-4 mb-10">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Eligibility Criteria</h4>
                    <ul className="space-y-3">
                      {category.criteria.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-wine mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-[0.2em] text-wine-dark border-b border-wine-dark/20 pb-2 hover:text-red hover:border-red transition-all">
                    Apply for this Grant <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Process Section */}
          <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-wine/5 rounded-full blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1523050338692-7b84940952de?auto=format&fit=crop&q=80&w=1000" 
                alt="Student studying" 
                className="w-full h-auto shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-8 -right-8 bg-wine p-10 z-20 hidden md:block">
                <span className="text-4xl text-white font-serif block mb-2 underline decoration-red underline-offset-8">250+</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">Scholarships Awarded to Date</span>
              </div>
            </motion.div>
            
            <div className="space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <span className="text-red uppercase tracking-[0.4em] text-[10px] font-bold">The Journey</span>
                <h2 className="text-4xl md:text-5xl font-serif text-wine-dark leading-tight">{cmsData.processTitle}</h2>
              </motion.div>
              
              <div className="space-y-10">
                {[
                  { step: "01", title: "Apply for Admission", desc: "Candidates must first submit a standard application for admission to Kingsfold Academy." },
                  { step: "02", title: "Complete Scholarship Form", desc: "Submit the separate financial aid and scholarship grant form along with required portfolio/documents." },
                  { step: "03", title: "Evaluation & Interview", desc: "Shortlisted candidates are invited for a specialized assessment and faculty panel interview." },
                  { step: "04", title: "Final Selection", desc: "Grant decisions are communicated alongside the admission offer letter." },
                ].map((step, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-8 group"
                  >
                    <span className="text-4xl font-serif text-wine italic opacity-20 group-hover:opacity-100 transition-opacity duration-500">{step.step}</span>
                    <div className="space-y-2">
                      <h4 className="text-lg font-serif text-wine-dark">{step.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 bg-wine-dark flex items-center justify-center text-center overflow-hidden relative">
        <div className="max-w-2xl px-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">{cmsData.ctaTitle}</h2>
          <p className="text-white/60 text-sm mb-12 leading-relaxed">
            {cmsData.ctaDesc}
          </p>
          <button className="bg-red text-white py-6 px-12 text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:bg-wine transition-all flex items-center gap-3 mx-auto">
            <BookOpen size={16} /> Download Brochure
          </button>
        </div>
      </section>
    </div>
  );
}
