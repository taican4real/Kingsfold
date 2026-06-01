import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Twitter } from 'lucide-react';
import { getDirectDriveLink } from '../lib/utils';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

interface LeadershipSectionProps {
  members?: TeamMember[];
}

const defaultTeamMembers: TeamMember[] = [
  {
    name: "Dr. Olabisi Adeniyi",
    role: "Proprietress & CEO",
    bio: "A visionary leader with over 25 years of experience in international education, dedicated to raising global leaders with integrity.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Mr. Julian White",
    role: "Principal",
    bio: "An experienced British educator specializing in the IGCSE and A-Level curriculum, focusing on academic excellence and holistic development.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Mrs. Sarah Thompson",
    role: "Head of Admissions",
    bio: "Passionate about guiding families through the journey of finding the right educational path for their children at Kingsfold.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Rev. Father John Oke",
    role: "Chaplain & Student Welfare",
    bio: "Committed to the spiritual growth and moral well-being of our students, ensuring a supportive and nurturing boarding environment.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
  }
];

const LeadershipSection: React.FC<LeadershipSectionProps> = ({ members }) => {
  const displayMembers = members || defaultTeamMembers;

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-wine/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-red text-[10px] font-bold uppercase tracking-[0.5em] mb-4 block">The Custodians of Excellence</span>
            <h2 className="text-5xl md:text-6xl font-serif text-wine mb-8">Distinguished <span className="italic">Leadership</span></h2>
            <p className="max-w-2xl mx-auto text-gray-500 text-lg font-light leading-relaxed">
              Our leadership team brings together decades of international experience to provide a world-class educational environment.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-[5px] overflow-hidden mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-700">
                <img
                  src={getDirectDriveLink(member.image) || null}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-wine/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-wine/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 flex items-end p-6">
                  <div className="flex gap-4">
                    <Linkedin size={16} className="text-white/60 hover:text-white cursor-pointer transition-colors" />
                    <Mail size={16} className="text-white/60 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
              </div>

              <div className="text-center group-hover:-translate-y-2 transition-transform duration-500">
                <span className="text-red text-[9px] font-bold uppercase tracking-[0.25em] mb-3 block">{member.role}</span>
                <h3 className="font-serif text-2xl text-wine mb-4 leading-tight">
                  {member.name}
                </h3>
                <div className="w-10 h-[1px] bg-red/30 mx-auto mb-6 group-hover:w-20 transition-all duration-500"></div>
                <p className="text-gray-400 text-[11px] leading-relaxed max-w-[200px] mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
