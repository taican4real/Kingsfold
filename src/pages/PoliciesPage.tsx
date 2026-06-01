import React from 'react';
import { Shield, FileText, Lock, Users, ChevronRight, Download, Briefcase, BookOpen, Monitor, HeartOff, Home, GraduationCap, Library as LibraryIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import SEO from '../components/SEO';

const policies = [
  {
    id: 'safeguarding',
    title: 'Child Safeguarding & Protection',
    description: 'Our comprehensive policy ensuring the safety and emotional well-being of every student under our care.',
    fullText: 'Kingsfold International Academy is committed to ensuring that all children in our care are protected from harm. Our approach encompasses proactive monitoring, staff training, and rigorous reporting procedures. We believe that safeguarding is everyone\'s responsibility. \n\nThis policy outlines our procedures for identifying and responding to concerns about child welfare, including physical, emotional, and digital safety. We maintain a designated safeguarding team and ensure all staff undergo standard background checks and annual training updates.',
    icon: Shield,
    lastUpdated: 'Sept 2025'
  },
  {
    id: 'anti-bullying',
    title: 'Anti-Bullying Policy',
    description: 'A zero-tolerance approach to bullying in any form, fostering a culture of mutual respect and kindness.',
    fullText: 'At Kingsfold, we foster a culture of mutual respect and kindness. Any form of bullying—physical, verbal, or social—is strictly prohibited and met with immediate disciplinary action. We promote a "Speak Up" environment where students feel safe reporting incidents without fear of retaliation. \n\nPrevention strategies include regular workshops, peer mentoring, and integrated emotional intelligence training. Our goal is to ensure every student feels valued and secure within our learning community.',
    icon: HeartOff,
    lastUpdated: 'Feb 2026'
  },
  {
    id: 'admissions',
    title: 'Admissions Policy',
    description: 'Transparent guidelines on our selection criteria, application process, and enrollment standards.',
    fullText: 'Admission to Kingsfold International Academy is based on academic potential, character, and compatibility with our values. Our process is transparent and merit-based. \n\nKey steps include application submission, entrance examination performance, and a candidate interview. We value diversity and seek students who will contribute positively to our community. All candidates must meet the age requirements for their respective grades as of the start of the academic year.',
    icon: Users,
    lastUpdated: 'Jan 2026'
  },
  {
    id: 'ict-acceptable-use',
    title: 'ICT & Acceptable Use',
    description: 'Guidelines for the responsible use of technology, digital resources, and campus network infrastructure.',
    fullText: 'The use of ICT resources at Kingsfold is a privilege designed to enhance learning. Users are expected to act responsibly, ethically, and legally in all digital interactions. \n\nThis policy prohibits unauthorized access, the distribution of inappropriate content, and any actions that compromise the security of our network. We implement advanced filtering and monitoring systems to ensure a safe digital environment for all students and staff.',
    icon: Monitor,
    lastUpdated: 'March 2026'
  },
  {
    id: 'teaching-learning',
    title: 'Teaching and Learning',
    description: 'Our pedagogical framework and quality standards for classroom instruction and academic delivery.',
    fullText: 'Our teaching philosophy blends British IGCSE/A-Level standards with the Nigerian curriculum to create a globally competitive academic experience. We prioritize student-centered learning, critical thinking, and practical application. \n\nTeachers are expected to implement differentiated instruction to cater to varying learning styles and abilities. Continuous professional development ensures our faculty remains at the forefront of educational innovation.',
    icon: GraduationCap,
    lastUpdated: 'Jan 2026'
  },
  {
    id: 'hostel-conduct',
    title: 'Hostel (Boarding) Policy',
    description: 'Operational guidelines and residential standards for students living within our campus boarding houses.',
    fullText: 'Our boarding houses are designed to be a "home away from home," prioritizing safety, comfort, and community. Residents are expected to adhere to daily routines, maintain personal hygiene, and respect their peers and house-parents. \n\nDiscipline within the hostel is based on responsibility and mutual respect. We provide structured study times, supervised leisure activities, and professional medical support to ensure the holistic well-being of our boarders.',
    icon: Home,
    lastUpdated: 'Dec 2025'
  },
  {
    id: 'library-policy',
    title: 'Library & Resource Use',
    description: 'Rules governing access to our physical and digital libraries, borrowing procedures, and research conduct.',
    fullText: 'The Kingsfold Library is a hub for research, study, and creative exploration. Users are encouraged to utilize our diverse collection of physical books and digital databases while maintaining a quiet and respectful atmosphere. \n\nBorrowing guidelines, resource preservation rules, and ethical research standards are strictly enforced. Our library staff are available to assist students in developing information literacy and research skills.',
    icon: LibraryIcon,
    lastUpdated: 'Nov 2025'
  },
  {
    id: 'academic-integrity',
    title: 'Academic Integrity',
    description: 'Standards for honesty and ethics in all academic pursuits and examinations.',
    fullText: 'Academic honesty is a cornerstone of the Kingsfold experience. We expect all students to produce original work and properly cite all sources of information. Plagiarism, cheating, and collusion are considered serious offenses. \n\nWe utilize advanced detection software to maintain high standards of integrity. Students are educated on the importance of ethical scholarship and the value of their own intellectual contributions.',
    icon: FileText,
    lastUpdated: 'Oct 2025'
  },
  {
    id: 'staff-conduct',
    title: 'Staff Code of Conduct',
    description: 'The professional standards and ethical guidelines expected of all faculty and administrative staff members.',
    fullText: 'All staff at Kingsfold are expected to maintain the highest levels of professional and ethical conduct. Our educators serve as role models for our students, and as such, their behavior must reflect the values of integrity, respect, and excellence. \n\nThis policy outlines expectations regarding interactions with students, professional collaboration, confidentiality, and institutional loyalty. Failure to adhere to these standards may result in disciplinary action.',
    icon: Briefcase,
    lastUpdated: 'Feb 2026'
  },
  {
    id: 'student-conduct',
    title: 'Student Code of Conduct',
    description: 'The behavioral expectations, disciplinary procedures, and core values required of every student in our community.',
    fullText: 'Every Kingsfold student is expected to embody our core values of respect, excellence, and leadership. This code defines the standards of behavior in classrooms, common areas, and during school-related activities. \n\nWe use a restorative justice approach to discipline, focusing on understanding the impact of actions and making amends. Students are encouraged to take ownership of their behavior and strive for continuous personal growth.',
    icon: BookOpen,
    lastUpdated: 'March 2026'
  },
  {
    id: 'privacy',
    title: 'Data Privacy & Protection',
    description: 'How we collect, use, and protect the personal data of our students and their families.',
    fullText: 'We take the privacy of our community seriously. Personal data is collected solely for educational and administrative purposes and is protected by robust encryption and access control systems. \n\nKingsfold complies with relevant data protection regulations and ensures that third-party service providers meet our stringent security standards. Parents and staff have the right to access and correct their personal information as held by the Academy.',
    icon: Lock,
    lastUpdated: 'Dec 2025'
  },
];

import { useCMS } from '../hooks/useCMS';

const DEFAULT_POLICIES = {
  heroTitle: "Our Policies",
  heroSubtitle: "Ensuring a safe, transparent, and ethical environment for our entire community.",
  clarificationTitle: "Request Clarification",
  clarificationDesc: "If you have any questions regarding our policies or require more details on a specific guideline, please do not hesitate to contact our administrative office.",
};

export default function PoliciesPage() {
  const { data: cmsData } = useCMS('policies', DEFAULT_POLICIES);
  const schoolInfo = {
    name: "KINGSFOLD INTERNATIONAL ACADEMY",
    address: "Plot 1, His Glory Avenue, Legina (Bus Stop) Off Itokin Road, Adamo Ikorodu, Lagos",
    phone: "(+234) 909 598 7223",
    email: "info@kingsfoldinternationalacademy.com.ng",
    website: "kingsfoldinternationalacademy.com.ng"
  };

  const handleDownloadPDF = (policy: typeof policies[0]) => {
    const doc = new jsPDF();
    
    // Branding Header Block
    doc.setFillColor(107, 15, 26); // Wine color #6B0F1A
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('times', 'bold');
    doc.text(schoolInfo.name, 105, 18, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const addressLines = doc.splitTextToSize(schoolInfo.address, 160);
    doc.text(addressLines, 105, 28, { align: 'center' });
    doc.text(`T: ${schoolInfo.phone} | E: ${schoolInfo.email}`, 105, 38, { align: 'center' });
    
    // Policy Title
    doc.setTextColor(107, 15, 26);
    doc.setFontSize(20);
    doc.setFont('times', 'bold');
    doc.text(policy.title.toUpperCase(), 20, 65);
    
    // Metadata
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Official Institutional Policy | Status: Approved | Last Revised: ${policy.lastUpdated}`, 20, 73);
    
    // Separation Line
    doc.setDrawColor(107, 15, 26);
    doc.setLineWidth(0.5);
    doc.line(20, 78, 190, 78);
    
    // Policy Content
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const bodyText = `POLICY OVERVIEW:\n${policy.description}\n\nDETAILED GUIDELINES:\n${policy.fullText}\n\nThis document serves as the official operational guide for the stated policy at Kingsfold International Academy. All members of the community (Staff, Students, and Parents) are expected to review and comply with these provisions in full.\n\nSigned,\n\nAdministration\nKingsfold International Academy`;
    
    const splitText = doc.splitTextToSize(bodyText, 170);
    doc.text(splitText, 20, 90);
    
    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated on ${new Date().toLocaleDateString()} | Confidential Document | Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    }

    doc.save(`KIA_Policy_${policy.id}.pdf`);
  };

  const policiesSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the safeguarding and child protection policy at Kingsfold Academy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kingsfold International Academy is committed to child protection with rigorous reporting procedures, a dedicated team, staff training, and deep digital filtering safety."
        }
      },
      {
        "@type": "Question",
        "name": "What are the rules regarding bullying at Kingsfold Academy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kingsfold operates on a strict zero-tolerance anti-bullying policy, building emotional intelligence, proactive peer-mentorship, and safe report loops."
        }
      }
    ]
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <SEO 
        title="Official School Policies" 
        description="Read the institutional codes and guidelines governing safeguarding, anti-bullying, admissions, residential conduct, and digital responsibility at Kingsfold International Academy."
        keywords="school rules, child safeguarding Lagos, boarding school code, Kingsfold policies"
        schema={policiesSchema}
      />
      {/* Header */}
      <div className="py-24 md:py-32 bg-wine text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <FileText size={400} className="text-white" />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">{cmsData.heroTitle}</h1>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto">{cmsData.heroSubtitle}</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {policies.map((policy, i) => (
            <motion.div 
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 border border-wine/10 hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-cream flex items-center justify-center text-wine group-hover:bg-wine group-hover:text-white transition-all duration-500">
                  <policy.icon size={28} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-wine-dark">{policy.title}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Last Updated: {policy.lastUpdated}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-8 flex-1 leading-relaxed">{policy.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                <button 
                  onClick={() => handleDownloadPDF(policy)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-wine hover:text-red transition-all group/btn"
                >
                  <span>Read Full Policy</span>
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => handleDownloadPDF(policy)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-wine transition-colors"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-wine p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-serif mb-4">{cmsData.clarificationTitle}</h2>
            <p className="text-cream/70 mb-8">
              {cmsData.clarificationDesc}
            </p>
            <div className="inline-flex items-center gap-4 border-b border-white/30 pb-2 hover:border-white transition-all cursor-pointer">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Contact Administration</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
