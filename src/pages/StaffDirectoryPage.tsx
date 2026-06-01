import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, Phone, ChevronRight, Filter, User, Printer } from 'lucide-react';
import { cn, getDirectDriveLink } from '../lib/utils';
import SEO from '../components/SEO';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  image: string;
  qualification: string;
  bio: string;
}

import { useCMS } from '../hooks/useCMS';

const DEFAULT_STAFF = {
  heroTitle: "Expert Faculty",
  heroSubtitle: "Kingsfold’s educators are carefully selected for their academic brilliance, pedagogical expertise, and commitment to nurturing character.",
  joinTitle: "Passionate about Academic Excellence?",
  joinDesc: "We are always looking for visionary educators to join our growing community of distinction. Explore our open positions and career paths.",
  members: [
    {
      id: 1,
      name: "Mrs. Olowoyeoshoba",
      role: "Principal & Chief Academic Officer",
      department: "Administration",
      email: "principal@kingsfold.com",
      phone: "+234 800 123 4567",
      qualification: "M.Ed. in Educational Leadership (Oxford)",
      image: "https://lh3.googleusercontent.com/d/1Z7xD0_-7X5gCFKn_pBVeFBv1o8qg331U",
      bio: "With over 20 years in international education, Mrs. Olowoyeoshoba specializes in developing dual curricula that blend Nigerian heritage with global standards.",
    },
    {
      id: 2,
      name: "Mr. Samuel Adebayo",
      role: "Vice Principal (Senior School)",
      department: "Administration",
      email: "s.adebayo@kingsfold.com",
      phone: "+234 800 123 4568",
      qualification: "M.Ed. in School Management",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
      bio: "A disciplined leader focused on academic rigor and student character formation in the senior years.",
    },
    {
      id: 3,
      name: "Dr. James Wilson",
      role: "Head of Science Department",
      department: "STEM",
      email: "j.wilson@kingsfold.com",
      phone: "+234 800 123 4570",
      qualification: "Ph.D. in Particle Physics",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
      bio: "Leading our innovation labs, Dr. Wilson integrates practical robotics and AI into the core science curriculum.",
    },
    {
      id: 4,
      name: "Ms. Sarah Jenkins",
      role: "Senior English Literature Lead",
      department: "Humanities",
      email: "s.jenkins@kingsfold.com",
      phone: "+234 800 123 4571",
      qualification: "M.A. in Comparative Literature",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
      bio: "Passionate about classical and contemporary African literature, inspiring students to find their voice through writing.",
    },
    {
      id: 5,
      name: "Mr. David Okonkwo",
      role: "Director of Sports & Well-being",
      department: "Athletics",
      email: "d.okonkwo@kingsfold.com",
      phone: "+234 800 123 4572",
      qualification: "Certified Olympic Coach",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
      bio: "Believes that physical discipline is the foundation of mental strength, overseeing our state-of-the-art sports facilities.",
    },
    {
      id: 6,
      name: "Mrs. Victoria Thompson",
      role: "Head of Primary School",
      department: "Administration",
      email: "v.thompson@kingsfold.com",
      phone: "+234 800 123 4569",
      qualification: "PGCE International",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
      bio: "Ensuring the foundational years are filled with wonder, exploration, and structured academic growth.",
    },
    {
      id: 7,
      name: "Mr. Jean-Pierre Silva",
      role: "Head of Modern Languages",
      department: "Humanities",
      email: "j.silva@kingsfold.com",
      phone: "+234 800 123 4573",
      qualification: "M.A. Linguistics (Sorbonne)",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600",
      bio: "Championing multilingualism, Jean-Pierre coordinates our French, Mandarin, and Spanish language programs.",
    },
    {
      id: 8,
      name: "Dr. Amara Eke",
      role: "Mathematics Lead",
      department: "STEM",
      email: "a.eke@kingsfold.com",
      phone: "+234 800 123 4574",
      qualification: "Ph.D. Mathematical Sciences",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600",
      bio: "Making complex concepts accessible, Dr. Eke leads our competitive mathematics team and coding initiatives.",
    }
  ]
};

export default function StaffDirectoryPage() {
  const { data: cmsData } = useCMS('staff', DEFAULT_STAFF);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const departments = ["All", "Administration", "STEM", "Humanities", "Athletics"];

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = "Kingsfold_International_Academy_Faculty_Directory";
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  const staffList = cmsData?.members || DEFAULT_STAFF.members;

  const filteredStaff = staffList.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeTab === "All" || member.department === activeTab;
    return matchesSearch && matchesFilter;
  });

  const staffSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Kingsfold International Academy Faculty Leaders",
    "description": "Meet our professional British and Nigerian certified teachers, educators, and senior academic directors.",
    "numberOfItems": 6,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Academic Director"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Head of Secondary"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Head of Primary"
      }
    ]
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <SEO 
        title="Faculty & Staff Directory" 
        description="Meet the highly qualified, experienced, and dedicated educators and admin staff directing the academic journey at Kingsfold International Academy, Ikorodu." 
        keywords="school staff, teachers Lagos, Kingsfold educators, high school headteacher Nigeria"
        schema={staffSchema}
      />

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 bg-wine overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-10"
            alt="Faculty background"
          />
        </div>
        <div className="absolute top-0 right-0 text-[18rem] font-serif text-white/[0.03] select-none pointer-events-none -mr-40 -mt-20 italic">
          Faculty
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-red"></div>
              <span className="text-red text-[10px] font-bold uppercase tracking-[0.4em] block">Our People</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 leading-tight">{cmsData.heroTitle.split(' ').map((word: string, i: number) => i === 1 ? <span key={i} className="italic text-red/90">{word} </span> : word + ' ')}</h1>
            <p className="text-xl text-cream/70 leading-relaxed font-light">
              {cmsData.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-wine/5 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-[650px] items-stretch sm:items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-wine transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name, role or qualification..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-cream-light/50 border border-transparent p-5 pl-14 text-sm outline-none focus:bg-white focus:border-wine transition-all rounded-none"
                />
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-3 bg-wine text-white px-8 py-5 text-[10px] font-bold uppercase tracking-widest hover:bg-red hover:text-white transition-all shadow-md group border border-wine font-sans whitespace-nowrap cursor-pointer"
                title="Print Directory to PDF"
              >
                <Printer size={16} className="text-white group-hover:scale-110 transition-transform" />
                <span>Print to PDF</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto no-scrollbar scroll-smooth">
              <div className="p-2 bg-wine/5 rounded-full mr-2 hidden lg:block">
                <Filter size={14} className="text-wine" />
              </div>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveTab(dept)}
                  className={cn(
                    "px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-bold border transition-all shrink-0 whitespace-nowrap cursor-pointer",
                    activeTab === dept 
                      ? "bg-wine border-wine text-white shadow-xl shadow-wine/20" 
                      : "bg-white border-gray-100 text-gray-400 hover:border-wine/30 hover:text-wine"
                  )}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Print-specific stylesheet */}
      <style>{`
        @media print {
          /* Hide non-printable elements */
          header, footer, nav, 
          section.relative.bg-wine, 
          section.sticky, 
          section.bg-wine-dark, 
          .print-hidden, 
          button, 
          a {
            display: none !important;
          }
          
          /* Force page margins */
          @page {
            size: A4 portrait;
            margin: 15mm 10mm 15mm 10mm;
          }
          
          /* Reset backgrounds and colors for perfect printing */
          body {
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
          }
          
          /* Core layouts */
          .print-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
            width: 100% !important;
          }
          
          /* Elements inside list cards designed to stay together */
          .print-card {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            display: flex !important;
            flex-direction: column !important;
            border: 1px solid #eaeaea !important;
            padding: 16px !important;
            background: #ffffff !important;
            margin-bottom: 0 !important;
          }

          /* Force image display & maintain layout */
          .print-image-wrap {
            aspect-ratio: 3/4 !important;
            height: auto !important;
            max-height: 200px !important;
            overflow: hidden !important;
            margin-bottom: 12px !important;
          }
          
          .print-image {
            filter: none !important;
            -webkit-filter: none !important;
            object-fit: cover !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          .print-bio {
            opacity: 1 !important;
            display: block !important;
            color: #444444 !important;
            margin-top: 8px !important;
            font-size: 11px !important;
            line-height: 1.4 !important;
          }
        }
      `}</style>

      {/* Staff Grid */}
      <section className="py-24 bg-cream-light/10">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          
          {/* Print-only beautifully styled header */}
          <div className="hidden print:block mb-10 pb-6 border-b-2 border-wine">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="https://drive.google.com/thumbnail?id=1BasYzGGbqpXgKglJSsBaQ4hZcGkjZg7L&sz=w1000" 
                  alt="Kingsfold Academy Logo"
                  className="w-16 h-16 object-contain"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h1 className="text-3xl font-serif text-wine font-bold leading-tight uppercase tracking-tight">Kingsfold International Academy</h1>
                  <p className="text-sm uppercase tracking-widest text-gray-500 font-sans mt-0.5">Faculty &amp; Staff Directory</p>
                </div>
              </div>
              <div className="text-right font-sans">
                <p className="text-xs font-mono text-gray">Printed: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {activeTab !== 'All' ? (
                  <p className="text-xs text-wine font-bold mt-1 uppercase tracking-wider">Department: {activeTab}</p>
                ) : (
                  <p className="text-xs text-wine font-bold mt-1 uppercase tracking-wider">Full Directory</p>
                )}
                <p className="text-[10px] text-gray mt-0.5 italic">{filteredStaff.length} Faculty Members Selected</p>
              </div>
            </div>
          </div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 print-grid"
          >
            <AnimatePresence mode="popLayout">
              {filteredStaff.map((member) => (
                <motion.div
                  layout
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.5 }}
                  className="group flex flex-col h-full print-card"
                >
                  <div className="aspect-[3/4] overflow-hidden relative mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700 print-image-wrap">
                    <img 
                      src={getDirectDriveLink(member.image) || null} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110 print-image"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-wine/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 p-6 flex items-end print-hidden">
                      <div className="flex gap-4">
                        <Mail className="text-white/60 hover:text-white cursor-pointer" size={16} />
                        <Phone className="text-white/60 hover:text-white cursor-pointer" size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-red"></div>
                      <span className="text-red text-[9px] font-bold uppercase tracking-widest">{member.department}</span>
                    </div>
                    <h3 className="text-2xl font-serif text-wine mb-1 leading-tight group-hover:text-red transition-colors">{member.name}</h3>
                    <p className="text-wine-dark/60 text-[10px] font-bold uppercase tracking-widest mb-4">{member.role}</p>
                    <p className="text-gray-400 text-[10px] italic mb-6 border-b border-wine/5 pb-4">{member.qualification}</p>

                    <p className="text-gray-500 text-xs leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 print-bio">
                      {member.bio}
                    </p>

                    {/* Print-only premium contact details card extension */}
                    <div className="hidden print:flex flex-col gap-1.5 mt-auto pt-3 border-t border-gray-100 text-[10px] text-gray-600 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Mail size={11} className="text-wine shrink-0 text-wine/80" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone size={11} className="text-wine shrink-0 text-wine/80" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredStaff.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 border border-dashed border-gray-200"
            >
              <div className="w-20 h-20 rounded-full bg-cream mx-auto flex items-center justify-center mb-6">
                <Search size={32} className="text-wine/30" />
              </div>
              <h3 className="text-2xl font-serif text-wine mb-2">No matching faculty found</h3>
              <p className="text-gray-400">Try adjusting your search terms or filters.</p>
              <button 
                onClick={() => { setSearchTerm(""); setActiveTab("All"); }}
                className="mt-8 text-wine font-bold uppercase text-[10px] tracking-widest border-b border-wine/20 hover:border-wine transition-all"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="py-24 bg-wine-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb28f74b0cd?auto=format&fit=crop&q=80&w=2000" 
            alt="Faculty meeting background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="text-red text-xs font-bold uppercase tracking-[0.4em] mb-6 block">Join Our Mission</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-8">{cmsData.joinTitle}</h2>
          <p className="text-cream/70 text-lg leading-relaxed mb-12">
            {cmsData.joinDesc}
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-4 bg-white text-wine px-10 py-5 text-[10px] font-bold uppercase tracking-widest hover:bg-red hover:text-white transition-all shadow-xl"
          >
            Work at Kingsfold <ChevronRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}

