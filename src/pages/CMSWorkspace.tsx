import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertCircle, Loader, Webhook, Home, Settings, LayoutTemplate, Users, BookOpen, DoorOpen, Palette, Newspaper, Image, ClipboardCheck, Mail, CreditCard, Award, Plus, Trash2, ShieldCheck, User, X, Navigation } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';
import { Link } from 'react-router-dom';
import { getDirectDriveLink } from '../lib/utils';

const DEFAULT_NAVBAR = {
  logoImage: "https://drive.google.com/thumbnail?id=1BasYzGGbqpXgKglJSsBaQ4hZcGkjZg7L&sz=w1000",
  logoTextPrimary: "Kingsfold",
  logoTextSecondary: "International Academy",
  navLinks: [
    { 
      name: 'Home', 
      path: '/',
      submenu: [
        { name: 'Default Layout', path: '/home-default' },
        { name: 'Modern Vision', path: '/home-modern' },
        { name: 'Classic Heritage', path: '/home-classic' },
        { name: 'Minimalist Clean', path: '/home-minimal' },
        { name: 'Magazine Editorial', path: '/home-magazine' },
      ]
    },
    { 
      name: 'About Us', 
      path: '/about',
      submenu: [
        { name: 'Our History', path: '/about#history' },
        { name: 'Staff Directory', path: '/staff-directory' },
        { name: 'Board of Directors', path: '/board-of-directors' },
        { name: 'Our Policies', path: '/policies' },
      ]
    },
    { 
      name: 'Academics', 
      path: '/academics',
      submenu: [
        { name: 'Overview', path: '/academics' },
        { name: 'CheckPoint', path: '/academics#checkpoint' },
        { name: 'IGCSE', path: '/academics#igcse' },
        { name: 'WAEC', path: '/academics#waec' },
        { name: 'NECO', path: '/academics#neco' },
        { name: 'JAMB', path: '/academics#jamb' },
        { name: 'Faculty & Staff', path: '/staff-directory' },
        { name: 'Our Policies', path: '/policies' },
      ]
    },
    { name: 'Boarding', path: '/boarding' },
    { name: 'Student Life', path: '/student-life' },
    { name: 'News', path: '/news' },
    { name: 'Gallery', path: '/gallery' },
    { 
      name: 'Admissions', 
      path: '/admissions',
      submenu: [
        { name: 'How to Apply', path: '/admissions' },
        { name: 'Tuition & Fees', path: '/tuition-fees' },
        { name: 'Scholarships', path: '/scholarships' },
        { name: 'Our Policies', path: '/policies' },
        { name: 'Visit Kingsfold', path: '/contact' },
      ]
    },
    { name: 'Contact', path: '/contact' },
  ]
};

const DEFAULT_HEADER = {
  phone: "(+234) 909 598 7223",
  email: "info@kingsfoldinternationalacademy.com.ng",
};

const DEFAULT_FOOTER = {
  aboutText: "Providing world-class British and Nigerian educational curriculum tailored to raise exceptional global leaders.",
  address: "Plot 1, His Glory Avenue, Legina (Bus Stop) Off Itokin Road, Adamo Ikorodu, Lagos.",
  phone: "(+234) 909 598 7223",
  email: "info@kingsfoldinternationalacademy.com.ng",
  logoImage: "https://drive.google.com/thumbnail?id=1BasYzGGbqpXgKglJSsBaQ4hZcGkjZg7L&sz=w1000",
  logoTextPrimary: "Kingsfold",
  logoTextSecondary: "International Academy",
  socialLinks: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#"
  },
  quickLinks: [
    { name: "About Us", path: "/about" },
    { name: "Academics", path: "/academics" },
    { name: "Boarding Life", path: "/boarding" },
    { name: "News & Events", path: "/news" },
    { name: "Media Gallery", path: "/gallery" },
    { name: "School Portal", path: "/portal" },
    { name: "AI Lesson Generator", path: "/ai-lesson-generator" },
    { name: "CMS Admin", path: "/admin-login" },
    { name: "Project Documentation", path: "/documentation" }
  ],
  admissionsLinks: [
    { name: "How to Apply", path: "/admissions" },
    { name: "Fee Structure", path: "/admissions" },
    { name: "Scholarships", path: "/admissions" },
    { name: "Entrance Examination", path: "/admissions" },
    { name: "International Students", path: "/admissions" }
  ]
};

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

const ACCREDITATION_DEFAULT = {
  accreditationTitle: "Our Affiliate and Accreditation",
  accreditationSubtitle: "Global Standards",
  accreditationLogos: [
    "https://lh3.googleusercontent.com/d/11tUEzCGnrk7Cfndb4nn8t9HteW0cWGUN",
    "https://lh3.googleusercontent.com/d/12oOuYDnnGdmBFU0hR8GexO2f1KU7teT1",
    "https://lh3.googleusercontent.com/d/1uIkU8Y92w6BWcgVzTFz_EWLhyrFt-2hK",
    "https://lh3.googleusercontent.com/d/18nei9MAaMdEQNXOSQd1cdtdJdV0thf7W",
    "https://lh3.googleusercontent.com/d/1JaGD1TXjTvU8BFqgI7OljDo0mEJT8yW5",
  ]
};

const DEFAULT_HOMEPAGE = {
  ...ACCREDITATION_DEFAULT,
  slides: [
    "https://lh3.googleusercontent.com/d/1v589yS2v2C7y_h4n18V7k5z-8cK_e9g7",
    "https://lh3.googleusercontent.com/d/1mIWiOWEOhTOjQSr3HTq671SganSeCeC_",
    "https://lh3.googleusercontent.com/d/168n4N_bfIfjU6yhPlKvtC4RRS-0GV84p",
    "https://lh3.googleusercontent.com/d/1iUPYl60tbSKCWv3GSBhjpTyD24GYerhE",
    "https://lh3.googleusercontent.com/d/1rvzcIiqJqwFO88_rK7pjsuifyeeNfxfD",
  ],
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
};

const DEFAULT_ACADEMICSPAGE = {
  ...ACCREDITATION_DEFAULT,
  heroTitle: "Academic Excellence",
  heroSubtitle: "A rigorous examination-focused approach preparing students for global and national success.",
  tab1Label: "CheckPoint",
  tab1Title: "Cambridge Checkpoint",
  tab1Desc: "The Cambridge Checkpoint program provides a robust foundation for students as they transition from primary to lower secondary education.",
  tab1Image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
  tab1Feature1: "Diagnostic assessment of learning progress.",
  tab1Feature2: "Foundation for IGCSE preparation.",
  tab2Label: "IGCSE",
  tab2Title: "Cambridge IGCSE",
  tab2Desc: "The International General Certificate of Secondary Education is the world's most popular international qualification.",
  tab2Image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
  tab2Feature1: "Broad and balanced curriculum.",
  tab2Feature2: "Development of creative thinking.",
  tab3Label: "WAEC",
  tab3Title: "WAEC (WASSCE)",
  tab3Desc: "The standard requirement for university entry in Nigeria and West Africa.",
  tab3Image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200",
  tab3Feature1: "Comprehensive Nigerian curriculum.",
  tab3Feature2: "Recognition by tertiary institutions.",
  tab4Label: "NECO",
  tab4Title: "NECO (SSCE)",
  tab4Desc: "Providing an alternative and valid national certification for Nigerian students.",
  tab4Image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
  tab4Feature1: "National standard for secondary education.",
  tab4Feature2: "Accepted for Nigerian universities.",
  tab5Label: "JAMB",
  tab5Title: "JAMB / UTME",
  tab5Desc: "The gateway to all degree-awarding institutions in Nigeria.",
  tab5Image: "https://images.unsplash.com/photo-1454165833741-979e2dca7d18?auto=format&fit=crop&q=80&w=1200",
  tab5Feature1: "Intensive CBT preparation.",
  tab5Feature2: "Strategic subject combinations.",
  advantageTitle: "Why Our Curriculum Works",
  advantageSubtitle: "The Academic Advantage",
  reason1Title: "Personalized Learning",
  reason1Desc: "Small class sizes allow for individual attention.",
  reason2Title: "Practical Innovation",
  reason2Desc: "Hands-on learning through advanced laboratories.",
  reason3Title: "Holistic Development",
  reason3Desc: "Balanced growth through arts and sports.",
};

const DEFAULT_BOARDINGPAGE = {
  ...ACCREDITATION_DEFAULT,
  heroTitle: "Boarding Life",
  heroSubtitle: "A home away from home, defined by luxury, security, and pastoral care.",
  heroImage: "https://lh3.googleusercontent.com/d/168n4N_bfIfjU6yhPlKvtC4RRS-0GV84p",
  premiumTitle: "A Premium Residential Experience",
  premiumDesc: "Our boarding houses are designed to be a comfortable, secure, and nurturing environment.",
  feature1Title: "Luxury Hostels",
  feature1Desc: "En-suite rooms, climate control, and modern furnishings.",
  feature2Title: "Fine Dining",
  feature2Desc: "Nutritious meals prepared by professional chefs.",
  feature3Title: "Pastoral Care",
  feature3Desc: "Dedicated houseparents ensuring wellbeing.",
  feature4Title: "24/7 Security",
  feature4Desc: "Round-the-clock security and trained guards.",
  voice1Name: "Sade Adeleke",
  voice1Role: "Boarding Prefect",
  voice1Quote: "Living here taught me time management and social balance.",
  voice1Img: "https://images.unsplash.com/photo-1491349174775-aaaf90397099?auto=format&fit=crop&q=80&w=200",
  voice2Name: "Ibrahim Musa",
  voice2Role: "Grade 10 Boarder",
  voice2Quote: "The weekend activities are what I look forward to most.",
  voice2Img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
};

const DEFAULT_STUDENTLIFEPAGE = {
  ...ACCREDITATION_DEFAULT,
  heroTitle: "Student Life",
  heroSubtitle: "Discovering passions, building character, and making memories.",
  classroomTitle: "Beyond the Classroom",
  classroomDesc1: "Our comprehensive co-curricular program is essential to holistic development.",
  classroomDesc2: "Students are encouraged to explore their interests beyond academics.",
  classroomImage1: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2940&auto=format&fit=crop",
  classroomImage2: "https://lh3.googleusercontent.com/d/1s35EKkkymSNk9VJDoImgxzWvmorPlNQf",
  activity1Title: "Sports & Athletics",
  activity1Desc: "Football, Basketball, Swimming, and Athletics.",
  activity2Title: "Arts & Drama",
  activity2Desc: "Fine arts, school productions, and creative writing.",
  activity3Title: "Music & Band",
  activity3Desc: "Orchestra, choir, and individual training.",
  activity4Title: "Clubs & Societies",
  activity4Desc: "Debate, Robotics, Coding, and Model UN.",
  success1Name: "Daniel Okoro",
  success1Activity: "Robotics Team Captain",
  success1Story: "Kingsfold gave me the tools and confidence to build real solutions.",
  success1Img: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=400",
  success2Name: "Chinaza Okeh",
  success2Activity: "Orchestra Soloist",
  success2Story: "The music department helped me master the violin for solo performances.",
  success2Img: "https://images.unsplash.com/photo-1550928431-ee0ec6db30d3?auto=format&fit=crop&q=80&w=400",
  success3Name: "Emeka Obi",
  success3Activity: "Football Forward",
  success3Story: "Sports taught me discipline and how to lead with character.",
  success3Img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400",
};

const DEFAULT_NEWSEVENTSPAGE = {
  heroTitle: "News & Events",
  heroSubtitle: "Staying connected with our community through information and engagement.",
  news: [
    { id: "1", title: "Kingsfold Students Win National Math Olympiad", date: "May 4, 2026", img: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2944&auto=format&fit=crop", excerpt: "Our students demonstrated exceptional problem-solving skills..." },
    { id: "2", title: "Annual Inter-House Sports Competition 2026", date: "April 18, 2026", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2940&auto=format&fit=crop", excerpt: "Red House emerged victorious after a thrilling display of athleticism..." },
    { id: "3", title: "Launch of New STEM Laboratory", date: "April 2, 2026", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2940&auto=format&fit=crop", excerpt: "The state-of-the-art laboratory features advanced robotics kits..." }
  ],
  events: [
    { id: "1", date: 15, month: "JUN", fullDate: "Monday, June 15, 2026", title: "Entrance Examination (Batch B)", time: "09:00 AM - 02:00 PM", location: "Main Hall", type: "Academic" },
    { id: "2", date: 22, month: "JUN", fullDate: "Monday, June 22, 2026", title: "End of Term Musical Concert", time: "04:00 PM - 07:00 PM", location: "Performing Arts Center", type: "Cultural" },
    { id: "3", date: 28, month: "JUN", fullDate: "Sunday, June 28, 2026", title: "PTA General Meeting", time: "02:00 PM - 04:00 PM", location: "School Chapel", type: "Community" },
    { id: "4", date: 10, month: "JUL", fullDate: "Friday, July 10, 2026", title: "Graduation Ceremony (Class of 2026)", time: "10:00 AM - 01:00 PM", location: "Grand Pavilion", type: "Ceremony" },
  ]
};

const DEFAULT_GALLERYPAGE = {
  heroTitle: "Media Gallery",
  heroSubtitle: "Visual highlights from Kingsfold International Academy.",
};

const DEFAULT_ADMISSIONSPAGE = {
  heroTitle: "Admissions",
  heroSubtitle: "Join the Kingsfold family. Start your child's journey today.",
  registrationTitle: "Student Registration",
  registrationSubtitle: "Online Enrollment",
  registrationDesc: "Please complete all required fields. Our admissions team will review your application.",
};

const DEFAULT_CONTACTPAGE = {
  heroTitle: "Contact Us",
  heroSubtitle: "We would love to hear from you. Get in touch with our admissions team.",
  contactTitle: "Get In Touch",
  addressTitle: "Our Campus",
  addressText: "Plot 1, His Glory Avenue, Legina (Bus Stop) Off Itokin Road, Adamo Ikorodu, Lagos.",
  phoneTitle: "Phone",
  phoneText: "(+234) 909 598 7223",
  emailTitle: "Email",
  emailText: "info@kingsfoldinternationalacademy.com.ng",
  formTitle: "Send us a Message",
};

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
      linkedin: "",
      email: "",
      globe: ""
    },
    {
      name: "Lady Olabisi Adeniyi",
      role: "Vice Chairperson & Proprietress",
      bio: "An educationist at heart with a passion for child development. She oversees the strategic growth of the academy, ensuring that every student receives a bespoke educational experience that prepares them for future challenges.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
      linkedin: "",
      email: "",
      globe: ""
    },
    {
      name: "Professor Anthony Okafor",
      role: "Director of Educational Quality",
      bio: "A renowned academic with extensive experience in international curriculum development. He ensures that Kingsfold maintains the highest standards of academic excellence and international accreditation.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
      linkedin: "",
      email: "",
      globe: ""
    },
    {
      name: "Barrister Funmi Bello",
      role: "Legal & Compliance Director",
      bio: "With a background in international law and corporate governance, Funmi ensures that the academy's operations are transparent, ethical, and fully compliant with all educational regulations.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
      linkedin: "",
      email: "",
      globe: ""
    }
  ]
};

const DEFAULT_POLICIES = {
  heroTitle: "Our Policies",
  heroSubtitle: "Ensuring a safe, transparent, and ethical environment for our entire community.",
  clarificationTitle: "Request Clarification",
  clarificationDesc: "If you have any questions regarding our policies or require more details on a specific guideline, please do not hesitate to contact our administrative office.",
};

const DEFAULT_TUITION = {
  heroTitle: "Tuition & Fees",
  sessionTitle: "Academic Session 2025/2026",
  sessionSubtitle: "All fees are quoted per academic session and are subject to periodic review.",
  paymentTerm1Title: "Flexible Payment",
  paymentTerm1Desc: "We offer termly payment plans to ease the financial commitment for our parents and guardians.",
  paymentTerm2Title: "Sibling Discount",
  paymentTerm2Desc: "A 5% - 10% discount is applicable to the tuition fee of a third and fourth sibling respectively.",
  paymentTerm3Title: "Early Bird",
  paymentTerm3Desc: "Payments made in full before the start of the academic session attract a 2.5% discount on tuition.",
  ctaTitle: "Need Financial Consultation?",
  ctaDesc: "Our bursary department is available to discuss payment plans, scholarships, and any other financial inquiries you may have.",
};

const DEFAULT_SCHOLARSHIPS = {
  heroTitle: "Honoring Exceptional Potential",
  heroSubtitle: "At Kingsfold Academy, we are committed to lowering financial barriers for students who demonstrate the drive to change the world.",
  processTitle: "Scholarship Application Process",
  ctaTitle: "Invest in Excellence",
  ctaDesc: "Download our comprehensive scholarship brochure to understand all available grants, endowment opportunities, and donor-sponsored bursaries.",
};

export default function CMSWorkspace() {
  const [activeTab, setActiveTab] = useState<'homepage' | 'aboutpage' | 'academics' | 'boarding' | 'studentlife' | 'newsevents' | 'gallery' | 'admissions' | 'contact' | 'header' | 'navbar' | 'footer' | 'staff' | 'policies' | 'tuition' | 'scholarships' | 'board'>('header');
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => {
        setSaveStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);
  
  const headerCMS = useCMS('header', DEFAULT_HEADER);
  const navbarCMS = useCMS('navbar', DEFAULT_NAVBAR);
  const footerCMS = useCMS('footer', DEFAULT_FOOTER);
  const homepageCMS = useCMS('homepage', DEFAULT_HOMEPAGE);
  const aboutpageCMS = useCMS('aboutpage', DEFAULT_ABOUTPAGE);
  const academicsCMS = useCMS('academics', DEFAULT_ACADEMICSPAGE);
  const boardingCMS = useCMS('boarding', DEFAULT_BOARDINGPAGE);
  const studentlifeCMS = useCMS('studentlife', DEFAULT_STUDENTLIFEPAGE);
  const newseventsCMS = useCMS('newsevents', DEFAULT_NEWSEVENTSPAGE);
  const galleryCMS = useCMS('gallery', DEFAULT_GALLERYPAGE);
  const admissionsCMS = useCMS('admissions', DEFAULT_ADMISSIONSPAGE);
  const contactCMS = useCMS('contact', DEFAULT_CONTACTPAGE);
  const staffCMS = useCMS('staff', DEFAULT_STAFF);
  const boardCMS = useCMS('board', DEFAULT_BOARD);
  const policiesCMS = useCMS('policies', DEFAULT_POLICIES);
  const tuitionCMS = useCMS('tuition', DEFAULT_TUITION);
  const scholarshipsCMS = useCMS('scholarships', DEFAULT_SCHOLARSHIPS);

  const [localHeader, setLocalHeader] = useState(DEFAULT_HEADER);
  const [localNavbar, setLocalNavbar] = useState(DEFAULT_NAVBAR);
  const [localFooter, setLocalFooter] = useState(DEFAULT_FOOTER);
  const [localHomepage, setLocalHomepage] = useState(DEFAULT_HOMEPAGE);
  const [localAboutpage, setLocalAboutpage] = useState(DEFAULT_ABOUTPAGE);
  const [localAcademics, setLocalAcademics] = useState(DEFAULT_ACADEMICSPAGE);
  const [localBoarding, setLocalBoarding] = useState(DEFAULT_BOARDINGPAGE);
  const [localStudentLife, setLocalStudentLife] = useState(DEFAULT_STUDENTLIFEPAGE);
  const [localNewsEvents, setLocalNewsEvents] = useState(DEFAULT_NEWSEVENTSPAGE);
  const [localGallery, setLocalGallery] = useState(DEFAULT_GALLERYPAGE);
  const [localAdmissions, setLocalAdmissions] = useState(DEFAULT_ADMISSIONSPAGE);
  const [localContact, setLocalContact] = useState(DEFAULT_CONTACTPAGE);
  const [localStaff, setLocalStaff] = useState(DEFAULT_STAFF);
  const [localBoard, setLocalBoard] = useState(DEFAULT_BOARD);
  const [localPolicies, setLocalPolicies] = useState(DEFAULT_POLICIES);
  const [localTuition, setLocalTuition] = useState(DEFAULT_TUITION);
  const [localScholarships, setLocalScholarships] = useState(DEFAULT_SCHOLARSHIPS);

  const [initializedMap, setInitializedMap] = useState<Record<string, boolean>>({});

  const [editingStaffIndex, setEditingStaffIndex] = useState<number | null>(null);
  const [editingBoardIndex, setEditingBoardIndex] = useState<number | null>(null);

  // Sync locals when loaded
  useEffect(() => {
    if (!headerCMS.loading && headerCMS.data && !initializedMap.header) {
      setLocalHeader(headerCMS.data);
      setInitializedMap(prev => ({ ...prev, header: true }));
    }
  }, [headerCMS.loading, headerCMS.data, initializedMap]);

  useEffect(() => {
    if (!navbarCMS.loading && navbarCMS.data && !initializedMap.navbar) {
      setLocalNavbar(navbarCMS.data);
      setInitializedMap(prev => ({ ...prev, navbar: true }));
    }
  }, [navbarCMS.loading, navbarCMS.data, initializedMap]);

  useEffect(() => {
    if (!footerCMS.loading && footerCMS.data && !initializedMap.footer) {
      setLocalFooter(footerCMS.data);
      setInitializedMap(prev => ({ ...prev, footer: true }));
    }
  }, [footerCMS.loading, footerCMS.data, initializedMap]);

  useEffect(() => {
    if (!homepageCMS.loading && homepageCMS.data && !initializedMap.homepage) {
      setLocalHomepage(homepageCMS.data);
      setInitializedMap(prev => ({ ...prev, homepage: true }));
    }
  }, [homepageCMS.loading, homepageCMS.data, initializedMap]);

  useEffect(() => {
    if (!aboutpageCMS.loading && aboutpageCMS.data && !initializedMap.aboutpage) {
      const rawData = aboutpageCMS.data;
      const sanitized = {
        ...rawData,
        principalName: rawData.principalName === "Dr. Elizabeth Kingsfold" ? "Mrs. Olowoyeoshoba" : rawData.principalName,
        principalImage: (rawData.principalImage && (
          rawData.principalImage.includes('1573496359142-b8d87734a5a2') || 
          rawData.principalImage.includes('export=download')
        )) ? "https://lh3.googleusercontent.com/d/1Z7xD0_-7X5gCFKn_pBVeFBv1o8qg331U" : (rawData.principalImage || "https://lh3.googleusercontent.com/d/1Z7xD0_-7X5gCFKn_pBVeFBv1o8qg331U"),
        principalMessageContent: (rawData.principalMessageContent && rawData.principalMessageContent.includes("seeds of leadership")) 
          ? DEFAULT_ABOUTPAGE.principalMessageContent 
          : (rawData.principalMessageContent || DEFAULT_ABOUTPAGE.principalMessageContent)
      };
      setLocalAboutpage(sanitized);
      setInitializedMap(prev => ({ ...prev, aboutpage: true }));
    }
  }, [aboutpageCMS.loading, aboutpageCMS.data, initializedMap]);

  useEffect(() => {
    if (!academicsCMS.loading && academicsCMS.data && !initializedMap.academics) {
      setLocalAcademics(academicsCMS.data);
      setInitializedMap(prev => ({ ...prev, academics: true }));
    }
  }, [academicsCMS.loading, academicsCMS.data, initializedMap]);

  useEffect(() => {
    if (!boardingCMS.loading && boardingCMS.data && !initializedMap.boarding) {
      setLocalBoarding(boardingCMS.data);
      setInitializedMap(prev => ({ ...prev, boarding: true }));
    }
  }, [boardingCMS.loading, boardingCMS.data, initializedMap]);

  useEffect(() => {
    if (!studentlifeCMS.loading && studentlifeCMS.data && !initializedMap.studentlife) {
      setLocalStudentLife(studentlifeCMS.data);
      setInitializedMap(prev => ({ ...prev, studentlife: true }));
    }
  }, [studentlifeCMS.loading, studentlifeCMS.data, initializedMap]);

  useEffect(() => {
    if (!newseventsCMS.loading && newseventsCMS.data && !initializedMap.newsevents) {
      setLocalNewsEvents(newseventsCMS.data);
      setInitializedMap(prev => ({ ...prev, newsevents: true }));
    }
  }, [newseventsCMS.loading, newseventsCMS.data, initializedMap]);

  useEffect(() => {
    if (!galleryCMS.loading && galleryCMS.data && !initializedMap.gallery) {
      setLocalGallery(galleryCMS.data);
      setInitializedMap(prev => ({ ...prev, gallery: true }));
    }
  }, [galleryCMS.loading, galleryCMS.data, initializedMap]);

  useEffect(() => {
    if (!admissionsCMS.loading && admissionsCMS.data && !initializedMap.admissions) {
      setLocalAdmissions(admissionsCMS.data);
      setInitializedMap(prev => ({ ...prev, admissions: true }));
    }
  }, [admissionsCMS.loading, admissionsCMS.data, initializedMap]);

  useEffect(() => {
    if (!contactCMS.loading && contactCMS.data && !initializedMap.contact) {
      setLocalContact(contactCMS.data);
      setInitializedMap(prev => ({ ...prev, contact: true }));
    }
  }, [contactCMS.loading, contactCMS.data, initializedMap]);

  useEffect(() => {
    if (!staffCMS.loading && staffCMS.data && !initializedMap.staff) {
      setLocalStaff(staffCMS.data);
      setInitializedMap(prev => ({ ...prev, staff: true }));
    }
  }, [staffCMS.loading, staffCMS.data, initializedMap]);

  useEffect(() => {
    if (!boardCMS.loading && boardCMS.data && !initializedMap.board) {
      setLocalBoard(boardCMS.data);
      setInitializedMap(prev => ({ ...prev, board: true }));
    }
  }, [boardCMS.loading, boardCMS.data, initializedMap]);

  useEffect(() => {
    if (!policiesCMS.loading && policiesCMS.data && !initializedMap.policies) {
      setLocalPolicies(policiesCMS.data);
      setInitializedMap(prev => ({ ...prev, policies: true }));
    }
  }, [policiesCMS.loading, policiesCMS.data, initializedMap]);

  useEffect(() => {
    if (!tuitionCMS.loading && tuitionCMS.data && !initializedMap.tuition) {
      setLocalTuition(tuitionCMS.data);
      setInitializedMap(prev => ({ ...prev, tuition: true }));
    }
  }, [tuitionCMS.loading, tuitionCMS.data, initializedMap]);

  useEffect(() => {
    if (!scholarshipsCMS.loading && scholarshipsCMS.data && !initializedMap.scholarships) {
      setLocalScholarships(scholarshipsCMS.data);
      setInitializedMap(prev => ({ ...prev, scholarships: true }));
    }
  }, [scholarshipsCMS.loading, scholarshipsCMS.data, initializedMap]);


  const isSaving = headerCMS.loading || navbarCMS.loading || footerCMS.loading || homepageCMS.loading || aboutpageCMS.loading || 
                   academicsCMS.loading || boardingCMS.loading || studentlifeCMS.loading || 
                   newseventsCMS.loading || galleryCMS.loading || admissionsCMS.loading || contactCMS.loading ||
                   staffCMS.loading || boardCMS.loading || policiesCMS.loading || tuitionCMS.loading || scholarshipsCMS.loading;

  const handleSave = async (isAutoSave = false) => {
    try {
      let savedAny = false;

      const saveIfChanged = async (localData: any, cmsData: any, updateData: any) => {
        if (JSON.stringify(localData) !== JSON.stringify(cmsData)) {
          const success = await updateData(localData);
          if (!success) {
            throw new Error("Unable to update Firestore. Check internet connection and permissions.");
          }
          savedAny = true;
        }
      };

      await saveIfChanged(localHeader, headerCMS.data, headerCMS.updateData);
      await saveIfChanged(localNavbar, navbarCMS.data, navbarCMS.updateData);
      await saveIfChanged(localFooter, footerCMS.data, footerCMS.updateData);
      await saveIfChanged(localHomepage, homepageCMS.data, homepageCMS.updateData);
      await saveIfChanged(localAboutpage, aboutpageCMS.data, aboutpageCMS.updateData);
      await saveIfChanged(localAcademics, academicsCMS.data, academicsCMS.updateData);
      await saveIfChanged(localBoarding, boardingCMS.data, boardingCMS.updateData);
      await saveIfChanged(localStudentLife, studentlifeCMS.data, studentlifeCMS.updateData);
      await saveIfChanged(localNewsEvents, newseventsCMS.data, newseventsCMS.updateData);
      await saveIfChanged(localGallery, galleryCMS.data, galleryCMS.updateData);
      await saveIfChanged(localAdmissions, admissionsCMS.data, admissionsCMS.updateData);
      await saveIfChanged(localContact, contactCMS.data, contactCMS.updateData);
      await saveIfChanged(localStaff, staffCMS.data, staffCMS.updateData);
      await saveIfChanged(localBoard, boardCMS.data, boardCMS.updateData);
      await saveIfChanged(localPolicies, policiesCMS.data, policiesCMS.updateData);
      await saveIfChanged(localTuition, tuitionCMS.data, tuitionCMS.updateData);
      await saveIfChanged(localScholarships, scholarshipsCMS.data, scholarshipsCMS.updateData);

      if (!isAutoSave && savedAny) {
        setSaveStatus({ type: 'success', message: 'All pending changes saved successfully!' });
      } else if (!isAutoSave && !savedAny) {
        setSaveStatus({ type: 'info', message: 'No pending changes to save.' });
      }
    } catch (e: any) {
      console.error("Save error:", e);
      if (!isAutoSave) {
        setSaveStatus({ type: 'error', message: `Failed to save content: ${e.message || String(e)}` });
      }
    }
  };

  const autoSaveRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    autoSaveRef.current = () => handleSave(true);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoSaveRef.current) autoSaveRef.current();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderNavbarEditor = () => (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-6 mb-6">
        <h3 className="text-xl font-serif text-wine mb-4">Logo Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Logo Text Primary</label>
            <input 
              type="text" 
              value={localNavbar.logoTextPrimary}
              onChange={e => setLocalNavbar({...localNavbar, logoTextPrimary: e.target.value})}
              className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Logo Text Secondary</label>
            <input 
              type="text" 
              value={localNavbar.logoTextSecondary}
              onChange={e => setLocalNavbar({...localNavbar, logoTextSecondary: e.target.value})}
              className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Logo Image URL</label>
            <input 
              type="text" 
              value={localNavbar.logoImage}
              onChange={e => setLocalNavbar({...localNavbar, logoImage: e.target.value})}
              className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
              placeholder="Google Drive link or valid image URL"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-xl font-serif text-wine">Navigation Links</h3>
        <button
          onClick={() => setLocalNavbar(prev => ({...prev, navLinks: [...prev.navLinks, { name: 'New Link', path: '/' }]}))}
          className="px-4 py-2 bg-wine/10 text-wine hover:bg-wine hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          + Add Top Link
        </button>
      </div>
      
      <div className="space-y-4">
        {localNavbar.navLinks.map((link, i) => (
          <div key={i} className="p-4 border border-gray-200 bg-gray-50 flex flex-col gap-4">
            <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Name</label>
                 <input 
                   value={link.name} 
                   onChange={e => {
                     const newLinks = [...localNavbar.navLinks];
                     newLinks[i].name = e.target.value;
                     setLocalNavbar({...localNavbar, navLinks: newLinks});
                   }} 
                   className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-wine" 
                 />
               </div>
               <div className="flex-1">
                 <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Path</label>
                 <input 
                   value={link.path} 
                   onChange={e => {
                     const newLinks = [...localNavbar.navLinks];
                     newLinks[i].path = e.target.value;
                     setLocalNavbar({...localNavbar, navLinks: newLinks});
                   }} 
                   className="w-full p-2 border border-gray-200 text-sm focus:outline-none focus:border-wine" 
                 />
               </div>
               <div className="flex items-end">
                 <button
                    onClick={() => {
                     const newLinks = [...localNavbar.navLinks];
                     newLinks.splice(i, 1);
                     setLocalNavbar({...localNavbar, navLinks: newLinks});
                    }}
                    className="px-4 py-2 bg-red/10 text-red hover:bg-red hover:text-white text-[10px] font-bold uppercase tracking-widest h-[38px]"
                 >
                   Delete
                 </button>
               </div>
            </div>
            
            <div className="pl-6 md:pl-8 border-l-2 border-wine/20 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-wine">Submenu Links</label>
                <button
                  onClick={() => {
                     const newLinks = [...localNavbar.navLinks];
                     if (!newLinks[i].submenu) newLinks[i].submenu = [];
                     newLinks[i].submenu!.push({ name: 'New Sublink', path: '/' });
                     setLocalNavbar({...localNavbar, navLinks: newLinks});
                  }}
                  className="text-[10px] uppercase font-bold text-wine hover:underline"
                >
                  + Add Sublink
                </button>
              </div>
              
              <div className="space-y-2">
                {link.submenu?.map((sub, j) => (
                  <div key={j} className="flex gap-2">
                    <input 
                       value={sub.name} 
                       placeholder="Name"
                       onChange={e => {
                         const newLinks = [...localNavbar.navLinks];
                         if(newLinks[i].submenu) newLinks[i].submenu![j].name = e.target.value;
                         setLocalNavbar({...localNavbar, navLinks: newLinks});
                       }} 
                       className="flex-1 p-2 border border-gray-200 text-sm focus:outline-none focus:border-wine" 
                     />
                     <input 
                       value={sub.path} 
                       placeholder="Path"
                       onChange={e => {
                         const newLinks = [...localNavbar.navLinks];
                         if(newLinks[i].submenu) newLinks[i].submenu![j].path = e.target.value;
                         setLocalNavbar({...localNavbar, navLinks: newLinks});
                       }} 
                       className="flex-1 p-2 border border-gray-200 text-sm focus:outline-none focus:border-wine" 
                     />
                     <button
                        onClick={() => {
                         const newLinks = [...localNavbar.navLinks];
                         if(newLinks[i].submenu) newLinks[i].submenu!.splice(j, 1);
                         setLocalNavbar({...localNavbar, navLinks: newLinks});
                        }}
                        className="px-3 bg-red/10 text-red hover:bg-red hover:text-white text-xs"
                     >
                       <X size={14} />
                     </button>
                  </div>
                ))}
                {(!link.submenu || link.submenu.length === 0) && (
                   <p className="text-xs text-gray-400 italic">No submenu links</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeaderEditor = () => (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Top Bar Contact Phone</label>
        <input 
          type="text" 
          value={localHeader.phone}
          onChange={e => setLocalHeader({...localHeader, phone: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Top Bar Contact Email</label>
        <input 
          type="text" 
          value={localHeader.email}
          onChange={e => setLocalHeader({...localHeader, email: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>
    </div>
  );

  const renderFooterEditor = () => (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-gray-100 pb-6 mb-6">
        <h3 className="text-xl font-serif text-wine mb-4">Logo Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Logo Text Primary</label>
            <input 
              type="text" 
              value={localFooter.logoTextPrimary || ''}
              onChange={e => setLocalFooter({...localFooter, logoTextPrimary: e.target.value})}
              className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Logo Text Secondary</label>
            <input 
              type="text" 
              value={localFooter.logoTextSecondary || ''}
              onChange={e => setLocalFooter({...localFooter, logoTextSecondary: e.target.value})}
              className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Logo Image URL</label>
            <input 
              type="text" 
              value={localFooter.logoImage || ''}
              onChange={e => setLocalFooter({...localFooter, logoImage: e.target.value})}
              className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
              placeholder="Google Drive link or valid image URL"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">About Text (Left Column)</label>
        <textarea 
          value={localFooter.aboutText}
          onChange={e => setLocalFooter({...localFooter, aboutText: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine h-24"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Contact Address</label>
        <textarea 
          value={localFooter.address}
          onChange={e => setLocalFooter({...localFooter, address: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine h-24"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Contact Phone</label>
        <input 
          type="text" 
          value={localFooter.phone}
          onChange={e => setLocalFooter({...localFooter, phone: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Contact Email</label>
        <input 
          type="text" 
          value={localFooter.email}
          onChange={e => setLocalFooter({...localFooter, email: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-xl font-serif text-wine mb-4">Social Links</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Facebook URL</label>
            <input 
              type="text" 
              value={localFooter.socialLinks?.facebook || ''}
              onChange={e => setLocalFooter({...localFooter, socialLinks: {...localFooter.socialLinks, facebook: e.target.value}})}
              className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Twitter URL</label>
            <input 
              type="text" 
              value={localFooter.socialLinks?.twitter || ''}
              onChange={e => setLocalFooter({...localFooter, socialLinks: {...localFooter.socialLinks, twitter: e.target.value}})}
              className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Instagram URL</label>
            <input 
              type="text" 
              value={localFooter.socialLinks?.instagram || ''}
              onChange={e => setLocalFooter({...localFooter, socialLinks: {...localFooter.socialLinks, instagram: e.target.value}})}
              className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">LinkedIn URL</label>
            <input 
              type="text" 
              value={localFooter.socialLinks?.linkedin || ''}
              onChange={e => setLocalFooter({...localFooter, socialLinks: {...localFooter.socialLinks, linkedin: e.target.value}})}
              className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-serif text-wine">Quick Links</h4>
          <button
            onClick={() => {
              const links = localFooter.quickLinks ? [...localFooter.quickLinks] : [];
              setLocalFooter({...localFooter, quickLinks: [...links, { name: 'New Link', path: '/' }]});
            }}
            className="px-4 py-2 bg-wine/10 text-wine hover:bg-wine hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            + Add Link
          </button>
        </div>
        <div className="space-y-4">
          {localFooter.quickLinks?.map((link: any, i: number) => (
            <div key={i} className="flex gap-4">
              <input 
                type="text" 
                value={link.name}
                placeholder="Link Name"
                onChange={e => {
                  const links = [...localFooter.quickLinks];
                  links[i].name = e.target.value;
                  setLocalFooter({...localFooter, quickLinks: links});
                }}
                className="flex-1 p-3 border border-gray-200 focus:outline-none focus:border-wine"
              />
              <input 
                type="text" 
                value={link.path}
                placeholder="Link Path (e.g. /about)"
                onChange={e => {
                  const links = [...localFooter.quickLinks];
                  links[i].path = e.target.value;
                  setLocalFooter({...localFooter, quickLinks: links});
                }}
                className="flex-1 p-3 border border-gray-200 focus:outline-none focus:border-wine"
              />
              <button
                onClick={() => {
                  const links = [...localFooter.quickLinks];
                  links.splice(i, 1);
                  setLocalFooter({...localFooter, quickLinks: links});
                }}
                className="px-4 py-3 bg-red/10 text-red hover:bg-red hover:text-white text-xs"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-serif text-wine">Admissions Links</h4>
          <button
            onClick={() => {
              const links = localFooter.admissionsLinks ? [...localFooter.admissionsLinks] : [];
              setLocalFooter({...localFooter, admissionsLinks: [...links, { name: 'New Link', path: '/' }]});
            }}
            className="px-4 py-2 bg-wine/10 text-wine hover:bg-wine hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            + Add Link
          </button>
        </div>
        <div className="space-y-4">
          {localFooter.admissionsLinks?.map((link: any, i: number) => (
            <div key={i} className="flex gap-4">
              <input 
                type="text" 
                value={link.name}
                placeholder="Link Name"
                onChange={e => {
                  const links = [...localFooter.admissionsLinks];
                  links[i].name = e.target.value;
                  setLocalFooter({...localFooter, admissionsLinks: links});
                }}
                className="flex-1 p-3 border border-gray-200 focus:outline-none focus:border-wine"
              />
              <input 
                type="text" 
                value={link.path}
                placeholder="Link Path (e.g. /about)"
                onChange={e => {
                  const links = [...localFooter.admissionsLinks];
                  links[i].path = e.target.value;
                  setLocalFooter({...localFooter, admissionsLinks: links});
                }}
                className="flex-1 p-3 border border-gray-200 focus:outline-none focus:border-wine"
              />
              <button
                onClick={() => {
                  const links = [...localFooter.admissionsLinks];
                  links.splice(i, 1);
                  setLocalFooter({...localFooter, admissionsLinks: links});
                }}
                className="px-4 py-3 bg-red/10 text-red hover:bg-red hover:text-white text-xs"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccreditationEditor = (localState: any, setLocalState: any) => (
    <div className="space-y-4 pt-4 border-t border-gray-100 mt-8">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine">Affiliate & Accreditation Section</h4>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Title</label>
        <input 
          type="text" 
          value={localState.accreditationTitle || ''}
          onChange={e => setLocalState({...localState, accreditationTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Subtitle</label>
        <input 
          type="text" 
          value={localState.accreditationSubtitle || ''}
          onChange={e => setLocalState({...localState, accreditationSubtitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Accreditation Logos (Image URLs, one per line)</label>
        <textarea 
          rows={5}
          value={(localState.accreditationLogos || []).join('\n')}
          onChange={e => {
            const lines = e.target.value.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
            setLocalState({...localState, accreditationLogos: lines});
          }}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine font-mono text-xs"
        />
      </div>
    </div>
  );

  const renderHomepageEditor = () => (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Hero Section Title</label>
        <input 
          type="text" 
          value={localHomepage.heroTitle}
          onChange={e => setLocalHomepage({...localHomepage, heroTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Hero Section Description</label>
        <textarea 
          value={localHomepage.heroSubtitle}
          onChange={e => setLocalHomepage({...localHomepage, heroSubtitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine h-24"
        />
      </div>
      
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Hero Slides (Image URLs, one per line)</label>
        <textarea 
          rows={5}
          value={localHomepage.slides.join('\n')}
          onChange={e => {
            const lines = e.target.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
            setLocalHomepage({...localHomepage, slides: lines});
          }}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine font-mono text-xs"
        />
        <p className="text-[10px] text-gray-400 mt-1">For best results, use direct drive links or image URLs.</p>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Philosophy Section Title</label>
        <input 
          type="text" 
          value={localHomepage.philosophyTitle}
          onChange={e => setLocalHomepage({...localHomepage, philosophyTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Philosophy Image 1 (Left)</label>
          <input 
            type="text" 
            value={localHomepage.philosophyImage1}
            onChange={e => setLocalHomepage({...localHomepage, philosophyImage1: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Philosophy Image 2 (Right)</label>
          <input 
            type="text" 
            value={localHomepage.philosophyImage2}
            onChange={e => setLocalHomepage({...localHomepage, philosophyImage2: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine">Philosophy Pillars</h4>
        
        <div className="p-4 bg-gray-50 space-y-4">
          <input 
            type="text" 
            placeholder="Pillar 1 Title"
            value={localHomepage.philosophyPillar1Title}
            onChange={e => setLocalHomepage({...localHomepage, philosophyPillar1Title: e.target.value})}
            className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine"
          />
          <textarea 
            placeholder="Pillar 1 Description"
            value={localHomepage.philosophyPillar1Desc}
            onChange={e => setLocalHomepage({...localHomepage, philosophyPillar1Desc: e.target.value})}
            className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine h-20"
          />
        </div>

        <div className="p-4 bg-gray-50 space-y-4">
          <input 
            type="text" 
            placeholder="Pillar 2 Title"
            value={localHomepage.philosophyPillar2Title}
            onChange={e => setLocalHomepage({...localHomepage, philosophyPillar2Title: e.target.value})}
            className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine"
          />
          <textarea 
            placeholder="Pillar 2 Description"
            value={localHomepage.philosophyPillar2Desc}
            onChange={e => setLocalHomepage({...localHomepage, philosophyPillar2Desc: e.target.value})}
            className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine h-20"
          />
        </div>

        <div className="p-4 bg-gray-50 space-y-4">
          <input 
            type="text" 
            placeholder="Pillar 3 Title"
            value={localHomepage.philosophyPillar3Title}
            onChange={e => setLocalHomepage({...localHomepage, philosophyPillar3Title: e.target.value})}
            className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine"
          />
          <textarea 
            placeholder="Pillar 3 Description"
            value={localHomepage.philosophyPillar3Desc}
            onChange={e => setLocalHomepage({...localHomepage, philosophyPillar3Desc: e.target.value})}
            className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine h-20"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Pillars Section Title</label>
        <input 
          type="text" 
          value={localHomepage.pillarsTitle}
          onChange={e => setLocalHomepage({...localHomepage, pillarsTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">
          Leadership Team
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="p-4 bg-gray-50 border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder={`Leader ${num} Name`}
                  value={(localHomepage as any)[`leader${num}Name`]}
                  onChange={e => setLocalHomepage({...localHomepage, [`leader${num}Name`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 focus:outline-none focus:border-wine bg-white text-sm"
                />
                <input 
                  type="text" 
                  placeholder={`Leader ${num} Role`}
                  value={(localHomepage as any)[`leader${num}Role`]}
                  onChange={e => setLocalHomepage({...localHomepage, [`leader${num}Role`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 focus:outline-none focus:border-wine bg-white text-sm"
                />
                <input 
                  type="text" 
                  placeholder={`Leader ${num} Image URL`}
                  value={(localHomepage as any)[`leader${num}Img`]}
                  onChange={e => setLocalHomepage({...localHomepage, [`leader${num}Img`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 focus:outline-none focus:border-wine bg-white text-[10px] font-mono"
                />
              </div>
              <textarea 
                placeholder={`Leader ${num} Bio`}
                value={(localHomepage as any)[`leader${num}Bio`]}
                onChange={e => setLocalHomepage({...localHomepage, [`leader${num}Bio`]: e.target.value})}
                className="w-full p-2 border border-gray-200 focus:outline-none focus:border-wine bg-white h-full text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">
          Top Performers
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <div key={num} className="p-4 bg-gray-50 border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder={`Performer ${num} Name`}
                  value={(localHomepage as any)[`performer${num}Name`]}
                  onChange={e => setLocalHomepage({...localHomepage, [`performer${num}Name`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 focus:outline-none focus:border-wine bg-white text-sm"
                />
                <input 
                  type="text" 
                  placeholder={`Performer ${num} Achievement (e.g. 9 A*s)`}
                  value={(localHomepage as any)[`performer${num}Achievement`]}
                  onChange={e => setLocalHomepage({...localHomepage, [`performer${num}Achievement`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 focus:outline-none focus:border-wine bg-white text-sm"
                />
                <input 
                  type="text" 
                  placeholder={`Performer ${num} Exam (e.g. IGCSE)`}
                  value={(localHomepage as any)[`performer${num}Exam`]}
                  onChange={e => setLocalHomepage({...localHomepage, [`performer${num}Exam`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 focus:outline-none focus:border-wine bg-white text-sm"
                />
              </div>
              <div className="space-y-2">
                <input 
                   type="text" 
                   placeholder={`Performer ${num} Destination (e.g. Harvard)`}
                   value={(localHomepage as any)[`performer${num}Dest`]}
                   onChange={e => setLocalHomepage({...localHomepage, [`performer${num}Dest`]: e.target.value})}
                   className="w-full p-2 border border-gray-200 focus:outline-none focus:border-wine bg-white text-sm"
                 />
                 <input 
                   type="text" 
                   placeholder={`Performer ${num} Image URL`}
                   value={(localHomepage as any)[`performer${num}Img`]}
                   onChange={e => setLocalHomepage({...localHomepage, [`performer${num}Img`]: e.target.value})}
                   className="w-full p-2 border border-gray-200 focus:outline-none focus:border-wine bg-white text-[10px] font-mono"
                 />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red flex justify-between items-center">
          Pillars Content
          <span className="text-[8px] font-normal text-gray-400">(4 Items Total)</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-4">
              <span className="text-[9px] font-bold text-wine/40">Pillar #{num}</span>
              <input 
                type="text" 
                placeholder={`Pillar ${num} Title`}
                value={(localHomepage as any)[`pillar${num}Title`]}
                onChange={e => setLocalHomepage({...localHomepage, [`pillar${num}Title`]: e.target.value})}
                className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine bg-white"
              />
              <textarea 
                placeholder={`Pillar ${num} Description`}
                value={(localHomepage as any)[`pillar${num}Desc`]}
                onChange={e => setLocalHomepage({...localHomepage, [`pillar${num}Desc`]: e.target.value})}
                className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine h-20 bg-white"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-8 border-t border-gray-100">
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Events Section Title</label>
        <input 
          type="text" 
          value={localHomepage.eventsTitle}
          onChange={e => setLocalHomepage({...localHomepage, eventsTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>

      <div className="space-y-4 pt-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red flex justify-between items-center">
          Recent Events
          <span className="text-[8px] font-normal text-gray-400">(3 Items Total)</span>
        </h4>
        
        <div className="space-y-4">
          {[1, 2, 3].map(num => (
            <div key={num} className="p-6 bg-gray-50 border border-gray-200 space-y-4">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-[9px] font-bold text-wine/40 uppercase">Event Feature #{num}</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Event Title"
                    value={(localHomepage as any)[`event${num}Title`]}
                    onChange={e => setLocalHomepage({...localHomepage, [`event${num}Title`]: e.target.value})}
                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Date (e.g. June 24, 2026)"
                    value={(localHomepage as any)[`event${num}Date`]}
                    onChange={e => setLocalHomepage({...localHomepage, [`event${num}Date`]: e.target.value})}
                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine bg-white"
                  />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Category (Ceremony, Academic...)"
                    value={(localHomepage as any)[`event${num}Category`]}
                    onChange={e => setLocalHomepage({...localHomepage, [`event${num}Category`]: e.target.value})}
                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine bg-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Image URL"
                    value={(localHomepage as any)[`event${num}Img`]}
                    onChange={e => setLocalHomepage({...localHomepage, [`event${num}Img`]: e.target.value})}
                    className="w-full p-3 border border-gray-200 focus:outline-none focus:border-wine bg-white font-mono text-[10px]"
                  />
               </div>
            </div>
          ))}
        </div>
      </div>
      {renderAccreditationEditor(localHomepage, setLocalHomepage)}
    </div>
  );

  const renderAboutPageEditor = () => (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Hero Title"
            value={localAboutpage.heroTitle}
            onChange={e => setLocalAboutpage({...localAboutpage, heroTitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
          <input 
            type="text" 
            placeholder="Hero Subtitle"
            value={localAboutpage.heroSubtitle}
            onChange={e => setLocalAboutpage({...localAboutpage, heroSubtitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Our History</h4>
        <input 
          type="text" 
          placeholder="History Section Title"
          value={localAboutpage.historyTitle}
          onChange={e => setLocalAboutpage({...localAboutpage, historyTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <textarea 
          placeholder="History Description 1"
          value={localAboutpage.historyContent1}
          onChange={e => setLocalAboutpage({...localAboutpage, historyContent1: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
        />
        <textarea 
          placeholder="History Description 2"
          value={localAboutpage.historyContent2}
          onChange={e => setLocalAboutpage({...localAboutpage, historyContent2: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
        />
        <input 
          type="text" 
          placeholder="History Image URL"
          value={localAboutpage.historyImage}
          onChange={e => setLocalAboutpage({...localAboutpage, historyImage: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white font-mono text-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
        <div className="space-y-4">
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Vision</h4>
           <input 
            type="text" 
            placeholder="Vision Title"
            value={localAboutpage.visionTitle}
            onChange={e => setLocalAboutpage({...localAboutpage, visionTitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
          <textarea 
            placeholder="Vision Quote"
            value={localAboutpage.visionQuote}
            onChange={e => setLocalAboutpage({...localAboutpage, visionQuote: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-32"
          />
        </div>
        <div className="space-y-4">
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Mission</h4>
           <input 
            type="text" 
            placeholder="Mission Title"
            value={localAboutpage.missionTitle}
            onChange={e => setLocalAboutpage({...localAboutpage, missionTitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
          <textarea 
            placeholder="Mission Subtitle"
            value={localAboutpage.missionSubtitle}
            onChange={e => setLocalAboutpage({...localAboutpage, missionSubtitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-32"
          />
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Mission Pillars</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
              <input 
                type="text" 
                placeholder="Label"
                value={(localAboutpage as any)[`missionPillar${num}Label`]}
                onChange={e => setLocalAboutpage({...localAboutpage, [`missionPillar${num}Label`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-xs"
              />
              <textarea 
                placeholder="Description"
                value={(localAboutpage as any)[`missionPillar${num}Desc`]}
                onChange={e => setLocalAboutpage({...localAboutpage, [`missionPillar${num}Desc`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-[10px] h-16"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Philosophy</h4>
        <textarea 
          placeholder="Philosophy Ethos Quote"
          value={localAboutpage.philosophyEthos}
          onChange={e => setLocalAboutpage({...localAboutpage, philosophyEthos: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-20 italic font-serif"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(num => (
            <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
              <input 
                type="text" 
                placeholder="Title"
                value={(localAboutpage as any)[`philosophyTitle${num}`]}
                onChange={e => setLocalAboutpage({...localAboutpage, [`philosophyTitle${num}`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-sm font-bold"
              />
              <textarea 
                placeholder="Description"
                value={(localAboutpage as any)[`philosophyDesc${num}`]}
                onChange={e => setLocalAboutpage({...localAboutpage, [`philosophyDesc${num}`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-xs h-32"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Core Values</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(num => (
            <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
              <input 
                type="text" 
                placeholder="Value Title"
                value={(localAboutpage as any)[`value${num}Title`]}
                onChange={e => setLocalAboutpage({...localAboutpage, [`value${num}Title`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-[10px] font-bold"
              />
              <textarea 
                placeholder="Description"
                value={(localAboutpage as any)[`value${num}Desc`]}
                onChange={e => setLocalAboutpage({...localAboutpage, [`value${num}Desc`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-[9px] h-24"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Principal's Message</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Section Title"
              value={localAboutpage.principalMessageTitle}
              onChange={e => setLocalAboutpage({...localAboutpage, principalMessageTitle: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white text-sm"
            />
            <textarea 
              placeholder="Message Content"
              value={localAboutpage.principalMessageContent}
              onChange={e => setLocalAboutpage({...localAboutpage, principalMessageContent: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white h-48 text-sm"
            />
          </div>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Principal Name"
              value={localAboutpage.principalName}
              onChange={e => setLocalAboutpage({...localAboutpage, principalName: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white text-sm"
            />
             <input 
              type="text" 
              placeholder="Principal Role"
              value={localAboutpage.principalRole}
              onChange={e => setLocalAboutpage({...localAboutpage, principalRole: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white text-sm"
            />
            <input 
              type="text" 
              placeholder="Image URL"
              value={localAboutpage.principalImage}
              onChange={e => setLocalAboutpage({...localAboutpage, principalImage: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white font-mono text-[10px]"
            />
            <input 
              type="text" 
              placeholder="Signature URL"
              value={localAboutpage.principalSignature}
              onChange={e => setLocalAboutpage({...localAboutpage, principalSignature: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white font-mono text-[10px]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Why Choose Us</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <input 
              type="text" 
              placeholder="Distinction Title"
              value={localAboutpage.distinctionTitle}
              onChange={e => setLocalAboutpage({...localAboutpage, distinctionTitle: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white text-sm"
            />
            <input 
              type="text" 
              placeholder="Distinction Subtitle"
              value={localAboutpage.distinctionSubtitle}
              onChange={e => setLocalAboutpage({...localAboutpage, distinctionSubtitle: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white text-sm"
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {[1, 2, 3].map(num => (
             <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
                <input 
                  type="text" 
                  placeholder="Reason Title"
                  value={(localAboutpage as any)[`reason${num}Title`]}
                  onChange={e => setLocalAboutpage({...localAboutpage, [`reason${num}Title`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 bg-white text-xs font-bold"
                />
                <textarea 
                  placeholder="Reason Description"
                  value={(localAboutpage as any)[`reason${num}Desc`]}
                  onChange={e => setLocalAboutpage({...localAboutpage, [`reason${num}Desc`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 bg-white text-[10px] h-20"
                />
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Virtual Tour</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <input 
              type="text" 
              placeholder="Tour Title"
              value={localAboutpage.tourTitle}
              onChange={e => setLocalAboutpage({...localAboutpage, tourTitle: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white text-sm"
            />
            <input 
              type="text" 
              placeholder="Tour Subtitle"
              value={localAboutpage.tourSubtitle}
              onChange={e => setLocalAboutpage({...localAboutpage, tourSubtitle: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white text-sm"
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[1, 2, 3, 4].map(num => (
             <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
                <input 
                  type="text" 
                  placeholder="Point Name"
                  value={(localAboutpage as any)[`tourPoint${num}Name`]}
                  onChange={e => setLocalAboutpage({...localAboutpage, [`tourPoint${num}Name`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 bg-white text-xs"
                />
                <input 
                  type="text" 
                  placeholder="Point Image URL"
                  value={(localAboutpage as any)[`tourPoint${num}Img`]}
                  onChange={e => setLocalAboutpage({...localAboutpage, [`tourPoint${num}Img`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 bg-white font-mono text-[9px]"
                />
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Leadership</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3, 4, 5, 6].map(num => (
             <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
                <input 
                  type="text" 
                  placeholder="Leader Name"
                  value={(localAboutpage as any)[`aboutLeader${num}Name`]}
                  onChange={e => setLocalAboutpage({...localAboutpage, [`aboutLeader${num}Name`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 bg-white text-xs font-bold"
                />
                <input 
                  type="text" 
                  placeholder="Leader Role"
                  value={(localAboutpage as any)[`aboutLeader${num}Role`]}
                  onChange={e => setLocalAboutpage({...localAboutpage, [`aboutLeader${num}Role`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 bg-white text-[10px]"
                />
                <input 
                  type="text" 
                  placeholder="Leader Image URL"
                  value={(localAboutpage as any)[`aboutLeader${num}Img`]}
                  onChange={e => setLocalAboutpage({...localAboutpage, [`aboutLeader${num}Img`]: e.target.value})}
                  className="w-full p-2 border border-gray-200 bg-white font-mono text-[9px]"
                />
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const renderAcademicsEditor = () => (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Hero Title"
            value={localAcademics.heroTitle}
            onChange={e => setLocalAcademics({...localAcademics, heroTitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
          <input 
            type="text" 
            placeholder="Hero Subtitle"
            value={localAcademics.heroSubtitle}
            onChange={e => setLocalAcademics({...localAcademics, heroSubtitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
        </div>
      </div>

      {[1, 2, 3, 4, 5].map(num => (
        <div key={num} className="space-y-4 pt-8 border-t border-gray-100">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine">Tab {num}: {(localAcademics as any)[`tab${num}Label`]}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Tab Label"
              value={(localAcademics as any)[`tab${num}Label`]}
              onChange={e => setLocalAcademics({...localAcademics, [`tab${num}Label`]: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white"
            />
            <input 
              type="text" 
              placeholder="Title"
              value={(localAcademics as any)[`tab${num}Title`]}
              onChange={e => setLocalAcademics({...localAcademics, [`tab${num}Title`]: e.target.value})}
              className="w-full p-3 border border-gray-200 bg-white"
            />
          </div>
          <textarea 
            placeholder="Description"
            value={(localAcademics as any)[`tab${num}Desc`]}
            onChange={e => setLocalAcademics({...localAcademics, [`tab${num}Desc`]: e.target.value})}
            className="w-full p-3 border border-gray-200 bg-white h-24"
          />
          <input 
            type="text" 
            placeholder="Image URL"
            value={(localAcademics as any)[`tab${num}Image`]}
            onChange={e => setLocalAcademics({...localAcademics, [`tab${num}Image`]: e.target.value})}
            className="w-full p-3 border border-gray-200 bg-white font-mono text-[10px]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Feature 1"
              value={(localAcademics as any)[`tab${num}Feature1`]}
              onChange={e => setLocalAcademics({...localAcademics, [`tab${num}Feature1`]: e.target.value})}
              className="w-full p-2 border border-gray-200 bg-white text-xs"
            />
            <input 
              type="text" 
              placeholder="Feature 2"
              value={(localAcademics as any)[`tab${num}Feature2`]}
              onChange={e => setLocalAcademics({...localAcademics, [`tab${num}Feature2`]: e.target.value})}
              className="w-full p-2 border border-gray-200 bg-white text-xs"
            />
          </div>
        </div>
      ))}

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Academic Advantage</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(num => (
            <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
              <input 
                type="text" 
                placeholder="Reason Title"
                value={(localAcademics as any)[`reason${num}Title`]}
                onChange={e => setLocalAcademics({...localAcademics, [`reason${num}Title`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-sm font-bold"
              />
              <textarea 
                placeholder="Reason Description"
                value={(localAcademics as any)[`reason${num}Desc`]}
                onChange={e => setLocalAcademics({...localAcademics, [`reason${num}Desc`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-xs h-24"
              />
            </div>
          ))}
        </div>
      </div>
      {renderAccreditationEditor(localAcademics, setLocalAcademics)}
    </div>
  );

  const renderBoardingEditor = () => (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
        <input 
          type="text" 
          placeholder="Hero Title"
          value={localBoarding.heroTitle}
          onChange={e => setLocalBoarding({...localBoarding, heroTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <input 
          type="text" 
          placeholder="Hero Subtitle"
          value={localBoarding.heroSubtitle}
          onChange={e => setLocalBoarding({...localBoarding, heroSubtitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <input 
          type="text" 
          placeholder="Hero Image URL"
          value={localBoarding.heroImage}
          onChange={e => setLocalBoarding({...localBoarding, heroImage: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white font-mono text-[10px]"
        />
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px) font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Premium Experience</h4>
        <textarea 
          placeholder="Description"
          value={localBoarding.premiumDesc}
          onChange={e => setLocalBoarding({...localBoarding, premiumDesc: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-gray-100">
        {[1, 2, 3, 4].map(num => (
          <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
            <input 
              type="text" 
              placeholder="Feature Title"
              value={(localBoarding as any)[`feature${num}Title`]}
              onChange={e => setLocalBoarding({...localBoarding, [`feature${num}Title`]: e.target.value})}
              className="w-full p-2 border border-gray-200 bg-white text-xs font-bold"
            />
            <textarea 
              placeholder="Feature Description"
              value={(localBoarding as any)[`feature${num}Desc`]}
              onChange={e => setLocalBoarding({...localBoarding, [`feature${num}Desc`]: e.target.value})}
              className="w-full p-2 border border-gray-200 bg-white text-[10px] h-20"
            />
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Boarder Voices</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(num => (
            <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-3">
              <input 
                type="text" 
                placeholder="Name"
                value={(localBoarding as any)[`voice${num}Name`]}
                onChange={e => setLocalBoarding({...localBoarding, [`voice${num}Name`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-sm"
              />
              <input 
                type="text" 
                placeholder="Role"
                value={(localBoarding as any)[`voice${num}Role`]}
                onChange={e => setLocalBoarding({...localBoarding, [`voice${num}Role`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-xs"
              />
              <textarea 
                placeholder="Quote"
                value={(localBoarding as any)[`voice${num}Quote`]}
                onChange={e => setLocalBoarding({...localBoarding, [`voice${num}Quote`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-xs h-24"
              />
              <input 
                type="text" 
                placeholder="Image URL"
                value={(localBoarding as any)[`voice${num}Img`]}
                onChange={e => setLocalBoarding({...localBoarding, [`voice${num}Img`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white font-mono text-[9px]"
              />
            </div>
          ))}
        </div>
      </div>
      {renderAccreditationEditor(localBoarding, setLocalBoarding)}
    </div>
  );

  const renderStudentLifeEditor = () => (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
        <input 
          type="text" 
          placeholder="Hero Title"
          value={localStudentLife.heroTitle}
          onChange={e => setLocalStudentLife({...localStudentLife, heroTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <input 
          type="text" 
          placeholder="Hero Subtitle"
          value={localStudentLife.heroSubtitle}
          onChange={e => setLocalStudentLife({...localStudentLife, heroSubtitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Beyond Classroom</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Image 1"
            value={localStudentLife.classroomImage1}
            onChange={e => setLocalStudentLife({...localStudentLife, classroomImage1: e.target.value})}
            className="w-full p-3 border border-gray-200 font-mono text-[10px]"
          />
          <input 
            type="text" 
            placeholder="Image 2"
            value={localStudentLife.classroomImage2}
            onChange={e => setLocalStudentLife({...localStudentLife, classroomImage2: e.target.value})}
            className="w-full p-3 border border-gray-200 font-mono text-[10px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-gray-100">
        {[1, 2, 3, 4].map(num => (
          <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
            <input 
              type="text" 
              placeholder="Activity Title"
              value={(localStudentLife as any)[`activity${num}Title`]}
              onChange={e => setLocalStudentLife({...localStudentLife, [`activity${num}Title`]: e.target.value})}
              className="w-full p-2 border border-gray-200 bg-white text-sm font-bold"
            />
            <textarea 
              placeholder="Activity Description"
              value={(localStudentLife as any)[`activity${num}Desc`]}
              onChange={e => setLocalStudentLife({...localStudentLife, [`activity${num}Desc`]: e.target.value})}
              className="w-full p-2 border border-gray-200 bg-white text-xs h-20"
            />
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px) font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Success Stories</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(num => (
            <div key={num} className="p-4 bg-gray-50 border border-gray-200 space-y-3">
              <input 
                type="text" 
                placeholder="Name"
                value={(localStudentLife as any)[`success${num}Name`]}
                onChange={e => setLocalStudentLife({...localStudentLife, [`success${num}Name`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-sm"
              />
              <input 
                type="text" 
                placeholder="Activity"
                value={(localStudentLife as any)[`success${num}Activity`]}
                onChange={e => setLocalStudentLife({...localStudentLife, [`success${num}Activity`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-xs"
              />
              <textarea 
                placeholder="Story"
                value={(localStudentLife as any)[`success${num}Story`]}
                onChange={e => setLocalStudentLife({...localStudentLife, [`success${num}Story`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white text-[11px] h-32"
              />
              <input 
                type="text" 
                placeholder="Image URL"
                value={(localStudentLife as any)[`success${num}Img`]}
                onChange={e => setLocalStudentLife({...localStudentLife, [`success${num}Img`]: e.target.value})}
                className="w-full p-2 border border-gray-200 bg-white font-mono text-[9px]"
              />
            </div>
          ))}
        </div>
      </div>
      {renderAccreditationEditor(localStudentLife, setLocalStudentLife)}
    </div>
  );

  const renderNewsEventsEditor = () => (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Hero Title</label>
          <input 
            type="text" 
            value={localNewsEvents.heroTitle}
            onChange={e => setLocalNewsEvents({...localNewsEvents, heroTitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Hero Subtitle</label>
          <textarea 
            value={localNewsEvents.heroSubtitle}
            onChange={e => setLocalNewsEvents({...localNewsEvents, heroSubtitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine h-24"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine">News Items</h4>
          <button 
            onClick={() => {
              const newNews = [...(localNewsEvents.news || [])];
              newNews.push({ id: Date.now().toString(), title: "New Story", date: "Jan 1, 2026", img: "", excerpt: "Short description..." });
              setLocalNewsEvents({ ...localNewsEvents, news: newNews });
            }}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-red hover:text-wine"
          >
            <Plus size={12} /> Add News
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(localNewsEvents.news || []).map((newsItem: any, index: number) => (
            <div key={newsItem.id} className="p-4 bg-gray-50 border border-gray-100 relative group">
              <button
                onClick={() => {
                  const newNews = localNewsEvents.news.filter((_: any, i: number) => i !== index);
                  setLocalNewsEvents({ ...localNewsEvents, news: newNews });
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-red opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
              <div className="space-y-3 mt-4">
                <input 
                  type="text" 
                  placeholder="Title"
                  value={newsItem.title}
                  onChange={e => {
                    const newNews = localNewsEvents.news.map((item: any, i: number) => 
                      i === index ? { ...item, title: e.target.value } : item
                    );
                    setLocalNewsEvents({ ...localNewsEvents, news: newNews });
                  }}
                  className="w-full p-2 border border-gray-200 bg-white text-xs font-bold"
                />
                <input 
                  type="text" 
                  placeholder="Date (e.g. May 4, 2026)"
                  value={newsItem.date}
                  onChange={e => {
                    const newNews = localNewsEvents.news.map((item: any, i: number) => 
                      i === index ? { ...item, date: e.target.value } : item
                    );
                    setLocalNewsEvents({ ...localNewsEvents, news: newNews });
                  }}
                  className="w-full p-2 border border-gray-200 bg-white text-xs"
                />
                <input 
                  type="text" 
                  placeholder="Image URL"
                  value={newsItem.img}
                  onChange={e => {
                    const newNews = localNewsEvents.news.map((item: any, i: number) => 
                      i === index ? { ...item, img: e.target.value } : item
                    );
                    setLocalNewsEvents({ ...localNewsEvents, news: newNews });
                  }}
                  className="w-full p-2 border border-gray-200 bg-white font-mono text-[9px]"
                />
                <textarea 
                  placeholder="Excerpt"
                  value={newsItem.excerpt}
                  onChange={e => {
                    const newNews = localNewsEvents.news.map((item: any, i: number) => 
                      i === index ? { ...item, excerpt: e.target.value } : item
                    );
                    setLocalNewsEvents({ ...localNewsEvents, news: newNews });
                  }}
                  className="w-full p-2 border border-gray-200 bg-white text-[11px] h-20"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine">Calendar Events</h4>
          <button 
            onClick={() => {
              const newEvents = [...(localNewsEvents.events || [])];
              newEvents.push({ id: Date.now().toString(), date: 1, month: "JAN", fullDate: "Thursday, January 1, 2026", title: "New Event", time: "09:00 AM", location: "Main Hall", type: "Academic" });
              setLocalNewsEvents({ ...localNewsEvents, events: newEvents });
            }}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-red hover:text-wine"
          >
            <Plus size={12} /> Add Event
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {(localNewsEvents.events || []).map((eventItem: any, index: number) => (
            <div key={eventItem.id} className="p-4 bg-gray-50 border border-gray-100 relative group flex flex-col md:flex-row gap-4">
              <button
                onClick={() => {
                  const newEvents = localNewsEvents.events.filter((_: any, i: number) => i !== index);
                  setLocalNewsEvents({ ...localNewsEvents, events: newEvents });
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-red opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
              
              <div className="flex flex-col gap-2 w-full md:w-1/4">
                <input 
                  type="number" 
                  placeholder="Day (1-31)"
                  value={eventItem.date}
                  onChange={e => {
                    const newEvents = localNewsEvents.events.map((item: any, i: number) => 
                      i === index ? { ...item, date: parseInt(e.target.value) || 1 } : item
                    );
                    setLocalNewsEvents({ ...localNewsEvents, events: newEvents });
                  }}
                  className="w-full p-2 border border-gray-200 bg-white text-xs font-bold"
                />
                <input 
                  type="text" 
                  placeholder="Month (e.g. JUN)"
                  value={eventItem.month}
                  onChange={e => {
                    const newEvents = localNewsEvents.events.map((item: any, i: number) => 
                      i === index ? { ...item, month: e.target.value } : item
                    );
                    setLocalNewsEvents({ ...localNewsEvents, events: newEvents });
                  }}
                  className="w-full p-2 border border-gray-200 bg-white text-xs font-bold uppercase"
                />
              </div>

              <div className="flex flex-col gap-2 w-full md:w-3/4">
                <input 
                  type="text" 
                  placeholder="Event Title"
                  value={eventItem.title}
                  onChange={e => {
                    const newEvents = localNewsEvents.events.map((item: any, i: number) => 
                      i === index ? { ...item, title: e.target.value } : item
                    );
                    setLocalNewsEvents({ ...localNewsEvents, events: newEvents });
                  }}
                  className="w-full p-2 border border-gray-200 bg-white text-xs font-bold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Full Date String"
                    value={eventItem.fullDate}
                    onChange={e => {
                      const newEvents = localNewsEvents.events.map((item: any, i: number) => 
                        i === index ? { ...item, fullDate: e.target.value } : item
                      );
                      setLocalNewsEvents({ ...localNewsEvents, events: newEvents });
                    }}
                    className="w-full p-2 border border-gray-200 bg-white text-[11px]"
                  />
                  <input 
                    type="text" 
                    placeholder="Time (e.g. 09:00 AM - 02:00 PM)"
                    value={eventItem.time}
                    onChange={e => {
                      const newEvents = localNewsEvents.events.map((item: any, i: number) => 
                        i === index ? { ...item, time: e.target.value } : item
                      );
                      setLocalNewsEvents({ ...localNewsEvents, events: newEvents });
                    }}
                    className="w-full p-2 border border-gray-200 bg-white text-[11px]"
                  />
                  <input 
                    type="text" 
                    placeholder="Location"
                    value={eventItem.location}
                    onChange={e => {
                      const newEvents = localNewsEvents.events.map((item: any, i: number) => 
                        i === index ? { ...item, location: e.target.value } : item
                      );
                      setLocalNewsEvents({ ...localNewsEvents, events: newEvents });
                    }}
                    className="w-full p-2 border border-gray-200 bg-white text-[11px]"
                  />
                  <input 
                    type="text" 
                    placeholder="Type (e.g. Academic, Cultural)"
                    value={eventItem.type}
                    onChange={e => {
                      const newEvents = localNewsEvents.events.map((item: any, i: number) => 
                        i === index ? { ...item, type: e.target.value } : item
                      );
                      setLocalNewsEvents({ ...localNewsEvents, events: newEvents });
                    }}
                    className="w-full p-2 border border-gray-200 bg-white text-[11px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGalleryEditor = () => (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Hero Title</label>
        <input 
          type="text" 
          value={localGallery.heroTitle}
          onChange={e => setLocalGallery({...localGallery, heroTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine"
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Hero Subtitle</label>
        <textarea 
          value={localGallery.heroSubtitle}
          onChange={e => setLocalGallery({...localGallery, heroSubtitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine h-24"
        />
      </div>
    </div>
  );

  const renderAdmissionsEditor = () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
        <input 
          type="text" 
          placeholder="Hero Title"
          value={localAdmissions.heroTitle}
          onChange={e => setLocalAdmissions({...localAdmissions, heroTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <input 
          type="text" 
          placeholder="Hero Subtitle"
          value={localAdmissions.heroSubtitle}
          onChange={e => setLocalAdmissions({...localAdmissions, heroSubtitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Registration Info</h4>
        <input 
          type="text" 
          placeholder="Main Title"
          value={localAdmissions.registrationTitle}
          onChange={e => setLocalAdmissions({...localAdmissions, registrationTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <textarea 
          placeholder="Description"
          value={localAdmissions.registrationDesc}
          onChange={e => setLocalAdmissions({...localAdmissions, registrationDesc: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
        />
      </div>
    </div>
  );
  const renderStaffEditor = () => {
    const members = localStaff.members || DEFAULT_STAFF.members;
    
    const updateMember = (index: number, updatedFields: any) => {
      const copy = [...members];
      copy[index] = { ...copy[index], ...updatedFields };
      setLocalStaff({ ...localStaff, members: copy });
    };

    const addMember = () => {
      const newMember = {
        id: Date.now(),
        name: "New Faculty Member",
        role: "Educator / Role",
        department: "STEM",
        email: "name@kingsfold.com",
        phone: "+234 800 123 4500",
        qualification: "B.Ed. / M.Sc.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
        bio: "Brief bio of the newly added educator.",
      };
      const copy = [...members, newMember];
      setLocalStaff({ ...localStaff, members: copy });
      setEditingStaffIndex(copy.length - 1);
    };

    const deleteMember = (index: number) => {
      if (confirm("Are you sure you want to delete this faculty member?")) {
        const copy = members.filter((_, i) => i !== index);
        setLocalStaff({ ...localStaff, members: copy });
        setEditingStaffIndex(null);
      }
    };

    return (
      <div className="space-y-6 max-w-2xl bg-white">
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
          <input 
            type="text" 
            placeholder="Hero Title"
            value={localStaff.heroTitle}
            onChange={e => setLocalStaff({...localStaff, heroTitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
          <textarea 
            placeholder="Hero Subtitle"
            value={localStaff.heroSubtitle}
            onChange={e => setLocalStaff({...localStaff, heroSubtitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
          />
        </div>

        <div className="space-y-4 pt-8 border-t border-gray-100">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Faculty & Staff Profiles</h4>
          <p className="text-xs text-gray-500 mb-2">Create, edit or delete the faculty profiles listed in the Staff Directory.</p>
          
          <div className="space-y-3">
            {members.map((member, idx) => {
              const isEditing = editingStaffIndex === idx;
              return (
                <div key={member.id || idx} className="border border-gray-200 bg-gray-50/20">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setEditingStaffIndex(isEditing ? null : idx)}
                  >
                    <div className="flex items-center gap-3">
                      {member.image ? (
                        <img src={getDirectDriveLink(member.image)} alt={member.name} className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 bg-wine/10 flex items-center justify-center rounded text-wine">
                          <User size={18} />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-wine">{member.name || "Unnamed Educator"}</p>
                        <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">{member.role || "No Role Specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button 
                        type="button"
                        onClick={() => setEditingStaffIndex(isEditing ? null : idx)}
                        className="text-[10px] font-bold uppercase tracking-widest text-wine px-3 py-1 bg-cream hover:bg-wine hover:text-white transition-colors border border-transparent"
                      >
                        {isEditing ? "Collapse" : "Edit"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => deleteMember(idx)}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-600 px-3 py-1 bg-red-50 hover:bg-red-600 hover:text-white transition-colors border border-transparent"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="p-6 border-t border-gray-100 bg-white space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Name</label>
                          <input 
                            type="text" 
                            value={member.name} 
                            onChange={e => updateMember(idx, { name: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Role / Designation</label>
                          <input 
                            type="text" 
                            value={member.role} 
                            onChange={e => updateMember(idx, { role: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Department</label>
                          <select 
                            value={member.department} 
                            onChange={e => updateMember(idx, { department: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine bg-white"
                          >
                            <option value="Administration">Administration</option>
                            <option value="STEM">STEM</option>
                            <option value="Humanities">Humanities</option>
                            <option value="Athletics">Athletics</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Qualification</label>
                          <input 
                            type="text" 
                            value={member.qualification} 
                            onChange={e => updateMember(idx, { qualification: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                          <input 
                            type="text" 
                            value={member.email} 
                            onChange={e => updateMember(idx, { email: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone number</label>
                          <input 
                            type="text" 
                            value={member.phone} 
                            onChange={e => updateMember(idx, { phone: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Profile Photo URL</label>
                        <input 
                          type="text" 
                          value={member.image} 
                          onChange={e => updateMember(idx, { image: e.target.value })}
                          className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Biography / Description</label>
                        <textarea 
                          value={member.bio} 
                          onChange={e => updateMember(idx, { bio: e.target.value })}
                          className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine h-20"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button 
            type="button"
            onClick={addMember}
            className="w-full py-4 border border-dashed border-wine/20 text-xs font-bold uppercase tracking-widest text-wine hover:border-wine hover:bg-cream/20 transition-all text-center"
          >
            ＋ Add New Faculty Member
          </button>
        </div>

        <div className="space-y-4 pt-8 border-t border-gray-100">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Careers CTA</h4>
          <input 
            type="text" 
            placeholder="CTA Title"
            value={localStaff.joinTitle}
            onChange={e => setLocalStaff({...localStaff, joinTitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
          <textarea 
            placeholder="CTA Description"
            value={localStaff.joinDesc}
            onChange={e => setLocalStaff({...localStaff, joinDesc: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
          />
        </div>
      </div>
    );
  };

  const renderBoardEditor = () => {
    const directors = localBoard.directors || DEFAULT_BOARD.directors;
    
    const updateDirector = (index: number, updatedFields: any) => {
      const copy = [...directors];
      copy[index] = { ...copy[index], ...updatedFields };
      setLocalBoard({ ...localBoard, directors: copy });
    };

    const addDirector = () => {
      const newDirector = {
        name: "New Director Profile",
        role: "Board Member / Director",
        bio: "Brief biography of the director.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
        linkedin: "",
        email: "",
        globe: ""
      };
      const copy = [...directors, newDirector];
      setLocalBoard({ ...localBoard, directors: copy });
      setEditingBoardIndex(copy.length - 1);
    };

    const deleteDirector = (index: number) => {
      if (confirm("Are you sure you want to delete this board director?")) {
        const copy = directors.filter((_, i) => i !== index);
        setLocalBoard({ ...localBoard, directors: copy });
        setEditingBoardIndex(null);
      }
    };

    return (
      <div className="space-y-6 max-w-2xl bg-white">
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
          <input 
            type="text" 
            placeholder="Hero Title"
            value={localBoard.heroTitle}
            onChange={e => setLocalBoard({...localBoard, heroTitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
          <textarea 
            placeholder="Hero Subtitle"
            value={localBoard.heroSubtitle}
            onChange={e => setLocalBoard({...localBoard, heroSubtitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
          />
        </div>

        <div className="space-y-4 pt-8 border-t border-gray-100">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Board of Directors Profiles</h4>
          <p className="text-xs text-gray-500 mb-2">Create, edit or delete governance profiles listed in the Board of Directors page.</p>
          
          <div className="space-y-3">
            {directors.map((director, idx) => {
              const isEditing = editingBoardIndex === idx;
              return (
                <div key={idx} className="border border-gray-200 bg-gray-50/20">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setEditingBoardIndex(isEditing ? null : idx)}
                  >
                    <div className="flex items-center gap-3">
                      {director.image ? (
                        <img src={getDirectDriveLink(director.image)} alt={director.name} className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 bg-wine/10 flex items-center justify-center rounded text-wine">
                          <User size={18} />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-wine">{director.name || "Unnamed Director"}</p>
                        <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">{director.role || "No Role Specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button 
                        type="button"
                        onClick={() => setEditingBoardIndex(isEditing ? null : idx)}
                        className="text-[10px] font-bold uppercase tracking-widest text-wine px-3 py-1 bg-cream hover:bg-wine hover:text-white transition-colors border border-transparent"
                      >
                        {isEditing ? "Collapse" : "Edit"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => deleteDirector(idx)}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-600 px-3 py-1 bg-red-50 hover:bg-red-600 hover:text-white transition-colors border border-transparent"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="p-6 border-t border-gray-100 bg-white space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Name</label>
                          <input 
                            type="text" 
                            value={director.name} 
                            onChange={e => updateDirector(idx, { name: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Role / Title</label>
                          <input 
                            type="text" 
                            value={director.role} 
                            onChange={e => updateDirector(idx, { role: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">LinkedIn URL</label>
                          <input 
                            type="text" 
                            value={director.linkedin || ""} 
                            onChange={e => updateDirector(idx, { linkedin: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                          <input 
                            type="email" 
                            value={director.email || ""} 
                            onChange={e => updateDirector(idx, { email: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Website (Globe) URL</label>
                          <input 
                            type="text" 
                            value={director.globe || ""} 
                            onChange={e => updateDirector(idx, { globe: e.target.value })}
                            className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Profile Photo URL</label>
                        <input 
                          type="text" 
                          value={director.image} 
                          onChange={e => updateDirector(idx, { image: e.target.value })}
                          className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Biography / Description</label>
                        <textarea 
                          value={director.bio} 
                          onChange={e => updateDirector(idx, { bio: e.target.value })}
                          className="w-full p-3 border border-gray-200 text-xs focus:outline-none focus:border-wine h-20"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button 
            type="button"
            onClick={addDirector}
            className="w-full py-4 border border-dashed border-wine/20 text-xs font-bold uppercase tracking-widest text-wine hover:border-wine hover:bg-cream/20 transition-all text-center"
          >
            ＋ Add New Board Member
          </button>
        </div>

        <div className="space-y-4 pt-8 border-t border-gray-100">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Governance Section</h4>
          <input 
            type="text" 
            placeholder="Governance Title"
            value={localBoard.governanceTitle}
            onChange={e => setLocalBoard({...localBoard, governanceTitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
          <textarea 
            placeholder="Governance Description"
            value={localBoard.governanceDesc}
            onChange={e => setLocalBoard({...localBoard, governanceDesc: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
          />
        </div>
      </div>
    );
  };

  const renderPoliciesEditor = () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
        <input 
          type="text" 
          placeholder="Hero Title"
          value={localPolicies.heroTitle}
          onChange={e => setLocalPolicies({...localPolicies, heroTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <textarea 
          placeholder="Hero Subtitle"
          value={localPolicies.heroSubtitle}
          onChange={e => setLocalPolicies({...localPolicies, heroSubtitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
        />
      </div>
      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Clarification Section</h4>
        <input 
          type="text" 
          placeholder="Title"
          value={localPolicies.clarificationTitle}
          onChange={e => setLocalPolicies({...localPolicies, clarificationTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <textarea 
          placeholder="Description"
          value={localPolicies.clarificationDesc}
          onChange={e => setLocalPolicies({...localPolicies, clarificationDesc: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
        />
      </div>
    </div>
  );

  const renderTuitionEditor = () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
        <input 
          type="text" 
          placeholder="Hero Title"
          value={localTuition.heroTitle}
          onChange={e => setLocalTuition({...localTuition, heroTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
      </div>
      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Session Details</h4>
        <input 
          type="text" 
          placeholder="Session Title"
          value={localTuition.sessionTitle}
          onChange={e => setLocalTuition({...localTuition, sessionTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <textarea 
          placeholder="Session Subtitle"
          value={localTuition.sessionSubtitle}
          onChange={e => setLocalTuition({...localTuition, sessionSubtitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
        />
      </div>
      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Payment Terms</h4>
        {[0, 1, 2].map(num => (
          <div key={num} className="p-4 bg-gray-50 space-y-2">
            <input 
              type="text" 
              placeholder={`Term ${num + 1} Title`}
              value={(localTuition as any)[`paymentTerm${num + 1}Title`]}
              onChange={e => setLocalTuition({...localTuition, [`paymentTerm${num + 1}Title`]: e.target.value})}
              className="w-full p-2 border border-gray-200 text-xs"
            />
            <textarea 
              placeholder={`Term ${num + 1} Description`}
              value={(localTuition as any)[`paymentTerm${num + 1}Desc`]}
              onChange={e => setLocalTuition({...localTuition, [`paymentTerm${num + 1}Desc`]: e.target.value})}
              className="w-full p-2 border border-gray-200 text-xs h-16"
            />
          </div>
        ))}
      </div>
      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Financial consultation CTA</h4>
        <input 
          type="text" 
          placeholder="CTA Title"
          value={localTuition.ctaTitle}
          onChange={e => setLocalTuition({...localTuition, ctaTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <textarea 
          placeholder="CTA Description"
          value={localTuition.ctaDesc}
          onChange={e => setLocalTuition({...localTuition, ctaDesc: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
        />
      </div>
    </div>
  );

  const renderScholarshipsEditor = () => (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
        <input 
          type="text" 
          placeholder="Hero Title"
          value={localScholarships.heroTitle}
          onChange={e => setLocalScholarships({...localScholarships, heroTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <textarea 
          placeholder="Hero Subtitle"
          value={localScholarships.heroSubtitle}
          onChange={e => setLocalScholarships({...localScholarships, heroSubtitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
        />
      </div>
      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Process Section</h4>
        <input 
          type="text" 
          placeholder="Process Title"
          value={localScholarships.processTitle}
          onChange={e => setLocalScholarships({...localScholarships, processTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
      </div>
      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">CTA Section</h4>
        <input 
          type="text" 
          placeholder="CTA Title"
          value={localScholarships.ctaTitle}
          onChange={e => setLocalScholarships({...localScholarships, ctaTitle: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
        />
        <textarea 
          placeholder="CTA Description"
          value={localScholarships.ctaDesc}
          onChange={e => setLocalScholarships({...localScholarships, ctaDesc: e.target.value})}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white h-24"
        />
      </div>
    </div>
  );

  const renderContactEditor = () => (
    <div className="space-y-6 max-w-4xl pb-20">
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Hero Section</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Hero Title"
            value={localContact.heroTitle}
            onChange={e => setLocalContact({...localContact, heroTitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
          <input 
            type="text" 
            placeholder="Hero Subtitle"
            value={localContact.heroSubtitle}
            onChange={e => setLocalContact({...localContact, heroSubtitle: e.target.value})}
            className="w-full p-4 border border-gray-200 focus:outline-none focus:border-wine bg-white"
          />
        </div>
      </div>

      <div className="space-y-4 pt-8 border-t border-gray-100">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-wine underline underline-offset-4 decoration-red">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h5 className="text-[9px] uppercase font-bold text-gray-400">Address</h5>
            <textarea 
              placeholder="Address Text"
              value={localContact.addressText}
              onChange={e => setLocalContact({...localContact, addressText: e.target.value})}
              className="w-full p-2 border border-gray-200 bg-white h-20 text-xs"
            />
          </div>
          <div className="space-y-4">
            <h5 className="text-[9px] uppercase font-bold text-gray-400">Phone & Email</h5>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Phone Text"
                value={localContact.phoneText}
                onChange={e => setLocalContact({...localContact, phoneText: e.target.value})}
                className="w-full p-2 border border-gray-200 text-xs"
              />
              <input 
                type="text" 
                placeholder="Email Text"
                value={localContact.emailText}
                onChange={e => setLocalContact({...localContact, emailText: e.target.value})}
                className="w-full p-2 border border-gray-200 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Webhook className="text-red" size={24} />
              <span className="text-red text-[10px] font-bold uppercase tracking-widest">Workspace</span>
            </div>
            <h1 className="font-serif text-4xl text-wine italic">Content Management</h1>
          </div>
          <Link to="/admin" className="flex items-center gap-2 text-wine text-xs font-bold uppercase tracking-widest hover:text-red transition-colors">
            <Home size={16} /> Admin Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
               <button 
                  onClick={() => setActiveTab('header')}
                  className={`w-full text-left p-6 border transition-all ${activeTab === 'header' ? 'bg-wine text-white border-wine' : 'bg-white border-gray-200 text-wine hover:border-wine/30 shadow-sm'}`}
               >
                 <Settings className={`mb-4 ${activeTab === 'header' ? 'text-red' : 'text-wine'}`} size={20} />
                 <p className="text-sm font-bold uppercase tracking-widest">Global Header</p>
                 <p className={`text-[10px] uppercase tracking-widest mt-1 ${activeTab === 'header' ? 'text-white/50' : 'text-gray-400'}`}>Contact & Socials</p>
               </button>

               <button 
                  onClick={() => setActiveTab('navbar')}
                  className={`w-full text-left p-6 border transition-all ${activeTab === 'navbar' ? 'bg-wine text-white border-wine' : 'bg-white border-gray-200 text-wine hover:border-wine/30 shadow-sm'}`}
               >
                 <Navigation className={`mb-4 ${activeTab === 'navbar' ? 'text-red' : 'text-wine'}`} size={20} />
                 <p className="text-sm font-bold uppercase tracking-widest">Navigation</p>
                 <p className={`text-[10px] uppercase tracking-widest mt-1 ${activeTab === 'navbar' ? 'text-white/50' : 'text-gray-400'}`}>Top Menu Links</p>
               </button>

               <button 
                  onClick={() => setActiveTab('homepage')}
                  className={`w-full text-left p-6 border transition-all ${activeTab === 'homepage' ? 'bg-wine text-white border-wine' : 'bg-white border-gray-200 text-wine hover:border-wine/30 shadow-sm'}`}
               >
                 <LayoutTemplate className={`mb-4 ${activeTab === 'homepage' ? 'text-red' : 'text-wine'}`} size={20} />
                 <p className="text-sm font-bold uppercase tracking-widest">Homepage</p>
                 <p className={`text-[10px] uppercase tracking-widest mt-1 ${activeTab === 'homepage' ? 'text-white/50' : 'text-gray-400'}`}>Hero & Sections</p>
               </button>

               {/* About Us Sub-navigation Accordion Panel */}
               <div className="border border-wine/10 bg-cream/5 p-4 space-y-3 shadow-sm rounded-none">
                 <div className="flex items-center gap-2 px-1 pb-2 border-b border-wine/5">
                   <Users className="text-wine" size={16} />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-wine/80">About Us Section</span>
                 </div>
                 
                 <div className="space-y-1.5 pl-1">
                   <button 
                      onClick={() => setActiveTab('aboutpage')}
                      className={`w-full text-left px-3 py-2.5 border transition-all flex flex-col ${activeTab === 'aboutpage' ? 'bg-wine text-white border-wine' : 'bg-white border-gray-100 text-wine hover:bg-cream/10'}`}
                   >
                     <p className="text-[11px] font-bold uppercase tracking-widest">Mission & Values</p>
                     <p className={`text-[9px] uppercase tracking-widest mt-0.5 ${activeTab === 'aboutpage' ? 'text-white/60' : 'text-gray-400'}`}>Main About Page</p>
                   </button>

                   <button 
                      onClick={() => setActiveTab('staff')}
                      className={`w-full text-left px-3 py-2.5 border transition-all flex flex-col ${activeTab === 'staff' ? 'bg-wine text-white border-wine' : 'bg-white border-gray-100 text-wine hover:bg-cream/10'}`}
                   >
                     <p className="text-[11px] font-bold uppercase tracking-widest">Staff Directory</p>
                     <p className={`text-[9px] uppercase tracking-widest mt-0.5 ${activeTab === 'staff' ? 'text-white/60' : 'text-gray-400'}`}>Faculty Profiles</p>
                   </button>

                   <button 
                      onClick={() => setActiveTab('board')}
                      className={`w-full text-left px-3 py-2.5 border transition-all flex flex-col ${activeTab === 'board' ? 'bg-wine text-white border-wine' : 'bg-white border-gray-100 text-wine hover:bg-cream/10'}`}
                   >
                     <p className="text-[11px] font-bold uppercase tracking-widest">Board of Directors</p>
                     <p className={`text-[9px] uppercase tracking-widest mt-0.5 ${activeTab === 'board' ? 'text-white/60' : 'text-gray-400'}`}>Governing Board</p>
                   </button>

                   <button 
                      onClick={() => setActiveTab('policies')}
                      className={`w-full text-left px-3 py-2.5 border transition-all flex flex-col ${activeTab === 'policies' ? 'bg-wine text-white border-wine' : 'bg-white border-gray-100 text-wine hover:bg-cream/10'}`}
                   >
                     <p className="text-[11px] font-bold uppercase tracking-widest">Our Policies</p>
                     <p className={`text-[9px] uppercase tracking-widest mt-0.5 ${activeTab === 'policies' ? 'text-white/60' : 'text-gray-400'}`}>Regulatory Articles</p>
                   </button>
                 </div>
               </div>

               {[
                 { id: 'academics', label: 'Academics', icon: BookOpen, sub: 'Curriculum' },
                 { id: 'boarding', label: 'Boarding', icon: DoorOpen, sub: 'Hostel Life' },
                 { id: 'studentlife', label: 'Student Life', icon: Palette, sub: 'Activities' },
                 { id: 'newsevents', label: 'News & Events', icon: Newspaper, sub: 'Blog' },
                 { id: 'gallery', label: 'Gallery', icon: Image, sub: 'Media' },
                 { id: 'admissions', label: 'Admissions', icon: ClipboardCheck, sub: 'Enrollment' },
                 { id: 'tuition', label: 'Tuition & Fees', icon: CreditCard, sub: 'Finance' },
                 { id: 'scholarships', label: 'Scholarships', icon: Award, sub: 'Grants' },
                 { id: 'contact', label: 'Contact Us', icon: Mail, sub: 'Support' },
               ].map((tab) => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left p-6 border transition-all ${activeTab === tab.id ? 'bg-wine text-white border-wine' : 'bg-white border-gray-200 text-wine hover:border-wine/30 shadow-sm'}`}
                 >
                   <tab.icon className={`mb-4 ${activeTab === tab.id ? 'text-red' : 'text-wine'}`} size={20} />
                   <p className="text-sm font-bold uppercase tracking-widest">{tab.label}</p>
                   <p className={`text-[10px] uppercase tracking-widest mt-1 ${activeTab === tab.id ? 'text-white/50' : 'text-gray-400'}`}>{tab.sub}</p>
                 </button>
               ))}

               <button 
                  onClick={() => setActiveTab('footer')}
                  className={`w-full text-left p-6 border transition-all ${activeTab === 'footer' ? 'bg-wine text-white border-wine' : 'bg-white border-gray-200 text-wine hover:border-wine/30 shadow-sm'}`}
               >
                 <AlertCircle className={`mb-4 ${activeTab === 'footer' ? 'text-red' : 'text-wine'}`} size={20} />
                 <p className="text-sm font-bold uppercase tracking-widest">Global Footer</p>
                 <p className={`text-[10px] uppercase tracking-widest mt-1 ${activeTab === 'footer' ? 'text-white/50' : 'text-gray-400'}`}>Information Links</p>
               </button>
          </div>

          {/* Editor */}
          <div className="lg:col-span-3">
             <div className="bg-white border border-wine/5 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="font-serif text-xl text-wine">
                    Editing: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h3>
                  <button 
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-wine text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-red transition-all disabled:opacity-50"
                  >
                    {isSaving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />} 
                    Save Changes
                  </button>
                </div>

                <div className="p-8 flex-1">
                  {Object.keys(initializedMap).length < 3 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                      <Loader className="animate-spin" size={32} />
                      <p className="text-[10px] uppercase tracking-widest font-bold">Synchronizing Nodes...</p>
                    </div>
                  ) : (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === 'header' && renderHeaderEditor()}
                      {activeTab === 'navbar' && renderNavbarEditor()}
                      {activeTab === 'footer' && renderFooterEditor()}
                      {activeTab === 'homepage' && renderHomepageEditor()}
                      {activeTab === 'aboutpage' && renderAboutPageEditor()}
                      {activeTab === 'academics' && renderAcademicsEditor()}
                      {activeTab === 'boarding' && renderBoardingEditor()}
                      {activeTab === 'studentlife' && renderStudentLifeEditor()}
                      {activeTab === 'newsevents' && renderNewsEventsEditor()}
                      {activeTab === 'gallery' && renderGalleryEditor()}
                      {activeTab === 'admissions' && renderAdmissionsEditor()}
                      {activeTab === 'contact' && renderContactEditor()}
                      {activeTab === 'staff' && renderStaffEditor()}
                      {activeTab === 'board' && renderBoardEditor()}
                      {activeTab === 'policies' && renderPoliciesEditor()}
                      {activeTab === 'tuition' && renderTuitionEditor()}
                      {activeTab === 'scholarships' && renderScholarshipsEditor()}
                    </motion.div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {saveStatus && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-none shadow-[0_10px_40px_rgba(0,0,0,0.15)] border text-sm max-w-sm flex items-start gap-3 transition-all ${
            saveStatus.type === 'success'
              ? 'bg-[#EBF7EE] text-[#1E4620] border-[#C3E8CA]'
              : saveStatus.type === 'error'
              ? 'bg-[#FDF2F2] text-[#9B1C1C] border-[#FDE8E8]'
              : 'bg-[#F0F5FF] text-[#1E3A8A] border-[#D1E2FF]'
          }`}
        >
          <div className="flex-1">
            <p className="font-bold uppercase tracking-wider text-[11px]">
              {saveStatus.type === 'success' ? 'Changes Saved' : saveStatus.type === 'error' ? 'Save Error' : 'Notice'}
            </p>
            <p className="text-xs mt-1">{saveStatus.message}</p>
          </div>
          <button 
            onClick={() => setSaveStatus(null)} 
            className="text-gray-400 hover:text-gray-600 font-bold px-1 text-lg leading-none"
          >
            &times;
          </button>
        </motion.div>
      )}
    </div>
  );
}
