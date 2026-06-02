import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Globe } from 'lucide-react';
import SEO from '../components/SEO';
import { useCMS } from '../hooks/useCMS';
import { getDirectDriveLink } from '../lib/utils';

interface Director {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
  globe?: string;
}

const DEFAULT_BOARD = {
  heroTitle: "Board of Directors",
  heroSubtitle: "Our board is comprised of distinguished professionals committed to the long-term vision of raising global leaders with integrity and excellence.",
  governanceTitle: "Strategic Governance",
  governanceDesc: "The Board of Directors meets quarterly to review performance, set strategic goals, and ensure the Academy remains true to its mission of academic excellence and character building.",
  directors: [
    {
      name: "Sir (Dr.) Olabode Adeniyi",
      role: "Chairman, Board of Directors",
      bio: "A distinguished industrialist and philanthropist with over 40 years of leadership experience across various sectors. His vision for Kingsfold is rooted in creating an institution that competes globally while maintaining strong African values.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Lady Olabisi Adeniyi",
      role: "Vice Chairperson & Proprietress",
      bio: "An educationist at heart with a passion for child development. She oversees the strategic growth of the academy, ensuring that every student receives a bespoke educational experience that prepares them for future challenges.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Professor Anthony Okafor",
      role: "Director of Educational Quality",
      bio: "A renowned academic with extensive experience in international curriculum development. He ensures that Kingsfold maintains the highest standards of academic excellence and international accreditation.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Barrister Funmi Bello",
      role: "Legal & Compliance Director",
      bio: "With a background in international law and corporate governance, Funmi ensures that the academy's operations are transparent, ethical, and fully compliant with all educational regulations.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    }
  ]
};

const BoardOfDirectorsPage: React.FC = () => {
  const { data: boardData } = useCMS('board', DEFAULT_BOARD);

  const heroTitle = boardData?.heroTitle || DEFAULT_BOARD.heroTitle;
  const heroSubtitle = boardData?.heroSubtitle || DEFAULT_BOARD.heroSubtitle;
  const governanceTitle = boardData?.governanceTitle || DEFAULT_BOARD.governanceTitle;
  const governanceDesc = boardData?.governanceDesc || DEFAULT_BOARD.governanceDesc;
  const directorsList: Director[] = boardData?.directors || DEFAULT_BOARD.directors;

  const boardSchema = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": "Kingsfold International Academy Board of Directors",
    "description": "Meet the visionary leadership team and governance board of Kingsfold International Academy.",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": directorsList.map((dir, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Person",
          "name": dir.name,
          "jobTitle": dir.role,
          "description": dir.bio || "",
          "affiliation": {
            "@type": "EducationalOrganization",
            "name": "Kingsfold International Academy"
          }
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Board of Directors & Governance" 
        description="Meet the visionary leadership team behind Kingsfold International Academy, dedicated to providing world-class education."
        keywords="school leadership, board of directors Lagos, Kingsfold governance, academic trustees Nigeria, school founders"
        schema={boardSchema}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-wine overflow-hidden">
        <div className="absolute top-0 right-0 text-[15rem] font-serif text-white/[0.03] select-none pointer-events-none -mr-20 -mt-10 tracking-tighter italic">
          Governance
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red text-xs font-bold uppercase tracking-[0.4em] mb-4 block"
          >
            Leadership & Governance
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6"
          >
            {heroTitle}
          </motion.h1>
          <div className="w-24 h-1 bg-red mx-auto mb-8"></div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-cream/70 text-lg leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Directors Grid */}
      <section className="py-24 bg-cream-light/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {directorsList.map((director, index) => (
              <motion.div
                key={director.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-700"
              >
                <div className="flex flex-col lg:flex-row h-full">
                  <div className="lg:w-[40%] aspect-[4/5] lg:aspect-auto overflow-hidden">
                    <img
                      src={getDirectDriveLink(director.image) || null}
                      alt={director.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="lg:w-[60%] p-8 lg:p-10 flex flex-col justify-center">
                    <div className="mb-6">
                      <span className="text-red text-[10px] font-bold uppercase tracking-widest mb-2 block">{director.role}</span>
                      <h3 className="font-serif text-2xl lg:text-3xl text-wine mb-2">{director.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-8 italic">
                      "{director.bio}"
                    </p>
                    <div className="flex gap-4 mt-auto">
                      <a href={director.linkedin || "#"} className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-wine hover:bg-wine hover:text-white transition-all transform hover:-translate-y-1">
                        <Linkedin size={18} />
                      </a>
                      <a href={`mailto:${director.email || 'board@kingsfold.com'}`} className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-wine hover:bg-wine hover:text-white transition-all transform hover:-translate-y-1">
                        <Mail size={18} />
                      </a>
                      <a href={director.globe || "#"} className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-wine hover:bg-wine hover:text-white transition-all transform hover:-translate-y-1">
                        <Globe size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board Note */}
      <section className="py-20 bg-wine text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl text-white mb-6">{governanceTitle}</h2>
          <p className="text-cream/60 leading-relaxed">
            {governanceDesc}
          </p>
        </div>
      </section>
    </div>
  );
};

export default BoardOfDirectorsPage;
