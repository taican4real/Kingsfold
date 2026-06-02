import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Music, Trophy, Users, Quote, Award, Sparkles, Loader } from 'lucide-react';
import SEO from '../components/SEO';
import AccreditationSection from '../components/AccreditationSection';
import { useCMS } from '../hooks/useCMS';
import { getDirectDriveLink } from '../lib/utils';

const DEFAULT_STUDENTLIFEPAGE = {
  heroTitle: "Student Life",
  heroSubtitle: "Discovering passions, building character, and making memories.",
  classroomTitle: "Beyond the Classroom",
  classroomDesc1: "Our co-curricular program is essential to the holistic development of our students.",
  classroomDesc2: "Whether on the field, in the studio, or through service, students explore their interests.",
  classroomImage1: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2940&auto=format&fit=crop",
  classroomImage2: "https://lh3.googleusercontent.com/d/1s35EKkkymSNk9VJDoImgxzWvmorPlNQf",
  activity1Title: "Sports & Athletics",
  activity1Desc: "Football, Basketball, Swimming, Athletics, and Tennis.",
  activity2Title: "Arts & Drama",
  activity2Desc: "Fine arts, school productions, and creative writing.",
  activity3Title: "Music & Band",
  activity3Desc: "Orchestra, choir, and individual instrument training.",
  activity4Title: "Clubs & Societies",
  activity4Desc: "Debate, Robotics, Coding, Model UN, and Chess club.",
  success1Name: "Daniel Okoro",
  success1Activity: "Robotics Team Captain",
  success1Story: "I started here with just an interest in computers. Now, I lead a team competing internationally.",
  success1Img: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=400",
  success2Name: "Chinaza Okeh",
  success2Activity: "Orchestra Soloist",
  success2Story: "The music department here is exceptional. Individual attention helped me master the violin.",
  success2Img: "https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?auto=format&fit=crop&q=80&w=400",
  success3Name: "Emeka Obi",
  success3Activity: "Football Forward",
  success3Story: "Sports taught me discipline. Being part of the school team means learning how to lead.",
  success3Img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04844?auto=format&fit=crop&q=80&w=400",
};

export default function StudentLifePage() {
  const { data: sl, loading } = useCMS('studentlife', DEFAULT_STUDENTLIFEPAGE);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream"><Loader className="animate-spin text-wine" size={40} /></div>;
  }

  const studentLifeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Vibrant Student Life & Extra-Curriculars | Kingsfold Academy",
    "description": "Discover extra-curricular clubs, musical training, drama clubs, and competitive athletics that nurture holistic leaders at Kingsfold International Academy.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Kingsfold International Academy"
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <SEO 
        title={sl.heroTitle || "Student Life & Extra-Curriculars"}
        description={sl.heroSubtitle || "Explore music clubs, drama societies, competitive sports, and life skills programs that inspire learners at Kingsfold International Academy."}
        keywords="student clubs Lagos, school sports academy Nigeria, drama club Lagos, extra curricular activities"
        schema={studentLifeSchema}
      />
      <div className="py-24 md:py-32 bg-wine text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif text-white mb-6 uppercase tracking-tighter"
        >
          {sl.heroTitle}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-cream/80 max-w-2xl mx-auto"
        >
          {sl.heroSubtitle}
        </motion.p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-serif text-4xl text-wine-dark mb-6">{sl.classroomTitle}</h2>
            <p className="text-gray-dark/80 leading-relaxed mb-6">
              {sl.classroomDesc1}
            </p>
            <p className="text-gray-dark/80 leading-relaxed">
              {sl.classroomDesc2}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            <motion.img 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              src={getDirectDriveLink(sl.classroomImage1) || null} 
              className="w-full h-48 object-cover shadow-xl grayscale hover:grayscale-0 transition-all duration-700 font-sans" 
              alt="Activity 1" 
            />
            <motion.img 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              src={getDirectDriveLink(sl.classroomImage2) || null} 
              className="w-full h-48 object-cover mt-8 shadow-xl grayscale hover:grayscale-0 transition-all duration-700 font-sans" 
              alt="Activity 2" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {[
            { icon: Trophy, title: sl.activity1Title, desc: sl.activity1Desc },
            { icon: Palette, title: sl.activity2Title, desc: sl.activity2Desc },
            { icon: Music, title: sl.activity3Title, desc: sl.activity3Desc },
            { icon: Users, title: sl.activity4Title, desc: sl.activity4Desc },
          ].map((activity, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-8 border border-gray-100 hover:border-wine/20 transition-all text-center group"
            >
              <activity.icon className="w-10 h-10 text-red mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-xl text-wine mb-2">{activity.title}</h3>
              <p className="text-sm text-gray-400">{activity.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Accreditation Section */}
        <div className="-mx-4 md:-mx-12 mb-24">
          <AccreditationSection 
            title={(sl as any).accreditationTitle}
            subtitle={(sl as any).accreditationSubtitle}
            logos={(sl as any).accreditationLogos}
          />
        </div>

        {/* Student Stories */}
        <section className="py-24 bg-wine-dark text-white relative overflow-hidden -mx-4 md:-mx-12 px-4 md:px-12 mb-20">
          <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                 <div className="flex items-center gap-3 mb-4">
                   <Sparkles className="text-red" size={20} />
                   <span className="text-red uppercase tracking-[0.4em] text-[10px] font-bold">Unlocking Potential</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-serif">Success Stories</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((num) => (
                <motion.div 
                  key={num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-8 h-full hover:bg-white/10 transition-all border-b-4 border-b-red"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-red/30">
                      <img src={getDirectDriveLink((sl as any)[`success${num}Img`]) || null} alt={(sl as any)[`success${num}Name`]} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-white">{(sl as any)[`success${num}Name`]}</h4>
                      <span className="text-[10px] uppercase tracking-widest text-red font-bold">{(sl as any)[`success${num}Activity`]}</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-xs italic leading-relaxed">
                    "{(sl as any)[`success${num}Story`]}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
