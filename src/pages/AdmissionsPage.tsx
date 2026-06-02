import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Upload, CheckCircle2, ChevronRight, ChevronLeft, Camera, X, Clock, FileText, Eye, Trash2, Loader } from 'lucide-react';
import { PatternFormat } from 'react-number-format';
import { cn } from '../lib/utils';
import CountdownTimer from '../components/CountdownTimer';
import SEO from '../components/SEO';
import { useCMS } from '../hooks/useCMS';
import { DEFAULT_NEWSEVENTSPAGE } from './NewsEventsPage';

const DEFAULT_ADMISSIONSPAGE = {
  heroTitle: "Admissions",
  heroSubtitle: "Join the Kingsfold family. Start your child's journey toward global leadership today.",
  enrollmentTitle: "Student Registration",
  enrollmentSubtitle: "Please complete all required fields. Our admissions team will review your application and contact you within 48 hours.",
};

const faqs = [
  {
    question: "When is the deadline for applications?",
    answer: "We accept applications on a rolling basis, but we recommend applying at least 4 months before the start of the academic session to ensure placement and completion of the entrance examinations."
  },
  {
    question: "Do you offer scholarships?",
    answer: "Yes, Kingsfold offers several merit-based grants. You can view our full range of awards on our scholarships page.",
    link: "/scholarships",
    linkText: "View Scholarships"
  },
  {
    question: "What are the school fees?",
    answer: "Fees vary by year group. We maintain a transparent fee structure with flexible payment plans.",
    link: "/tuition-fees",
    linkText: "See Fee Schedule"
  },
  {
    question: "How does the dual curriculum work?",
    answer: "Our students follow the British National Curriculum (IGCSE and A-Levels) alongside the Nigerian National Curriculum (JSCE and SSCE)."
  },
  {
    question: "Is boarding mandatory for all students?",
    answer: "While we believe boarding offers the best environment, we do offer a day-school option for local families."
  }
];

export default function AdmissionsPage() {
  const { data: admissions, loading } = useCMS('admissions', DEFAULT_ADMISSIONSPAGE);
  const { data: newsEvents } = useCMS('newsevents', DEFAULT_NEWSEVENTSPAGE);
  
  const events = (newsEvents && newsEvents.events) || DEFAULT_NEWSEVENTSPAGE.events;

  // Find the latest entrance exam date
  const entranceExamEvents = (events || []).filter((event: any) => 
    event && event.title && event.title.toLowerCase().includes('entrance')
  );

  let calculatedDeadline = "2026-08-15T00:00:00"; // Fallback: default deadline

  if (entranceExamEvents.length > 0) {
    const datesWithTimestamps = entranceExamEvents.map((event: any) => {
      // 1. Try format by fullDate
      if (event.fullDate) {
        const d = new Date(event.fullDate);
        if (!isNaN(d.getTime())) {
          return { date: d, timestamp: d.getTime(), event };
        }
      }
      
      // 2. Fallback to month, date, and default year of 2026
      if (event.month && event.date) {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const monthIdx = monthNames.indexOf(event.month.trim().toUpperCase());
        if (monthIdx !== -1) {
          const year = 2026;
          const d = new Date(year, monthIdx, Number(event.date));
          if (!isNaN(d.getTime())) {
            return { date: d, timestamp: d.getTime(), event };
          }
        }
      }
      
      return null;
    }).filter(Boolean) as Array<{ date: Date; timestamp: number; event: any }>;

    if (datesWithTimestamps.length > 0) {
      // Sort in descending order to get the latest date
      datesWithTimestamps.sort((a, b) => b.timestamp - a.timestamp);
      
      const latestExam = datesWithTimestamps[0];
      const d = latestExam.date;
      const yearStr = d.getFullYear();
      const monthStr = String(d.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      
      // Attempt to extract time if present (e.g. "09:00 AM - 02:00 PM")
      let timeStr = "09:00:00";
      const eventTime = latestExam.event.time;
      if (eventTime) {
        const match = eventTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (match) {
          let hours = parseInt(match[1], 10);
          const minutes = match[2];
          const ampm = match[3].toUpperCase();
          if (ampm === "PM" && hours < 12) hours += 12;
          if (ampm === "AM" && hours === 12) hours = 0;
          timeStr = `${String(hours).padStart(2, '0')}:${minutes}:00`;
        }
      }
      
      calculatedDeadline = `${yearStr}-${monthStr}-${dayStr}T${timeStr}`;
    }
  }

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    dob: '',
    gender: 'Male',
    guardianName: '',
    relationship: '',
    email: '',
    phone: '',
    previousSchool: '',
    lastGrade: '',
    gpa: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user changes value
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Profile Picture State
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Documents State
  const [docs, setDocs] = useState<{
    birthCertificate: { name: string; size: string; progress: number; preview: string | null; type: string } | null;
    vaccinationRecords: { name: string; size: string; progress: number; preview: string | null; type: string } | null;
  }>({
    birthCertificate: null,
    vaccinationRecords: null
  });

  const [documentErrors, setDocumentErrors] = useState<Record<string, string>>({});

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream"><Loader className="animate-spin text-wine" size={40} /></div>;
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const startDocUpload = (fieldName: 'birthCertificate' | 'vaccinationRecords', file: File) => {
    // Clear error
    setDocumentErrors(prev => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });

    // Initial state
    setDocs(prev => ({
      ...prev,
      [fieldName]: {
        name: file.name,
        size: formatFileSize(file.size),
        progress: 0,
        preview: null,
        type: file.type
      }
    }));
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setDocs(prev => {
        const current = prev[fieldName];
        if (!current) {
          clearInterval(interval);
          return prev;
        }

        if (current.progress >= 100) {
          clearInterval(interval);
          
          // Set preview URL if it's an image
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setDocs(d => ({
                ...d,
                [fieldName]: { ...d[fieldName]!, preview: reader.result as string, progress: 100 }
              }));
            };
            reader.readAsDataURL(file);
          } else {
             // For PDFs or other files, we just keep the name and icon
          }
          
          return prev;
        }
        
        return {
          ...prev,
          [fieldName]: { ...current, progress: current.progress + 20 }
        };
      });
    }, 150);
  };

  const removeDoc = (fieldName: 'birthCertificate' | 'vaccinationRecords') => {
    setDocs(prev => ({ ...prev, [fieldName]: null }));
  };

  const totalSteps = 5;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      startUpload(file);
    }
  };

  const startUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfilePic(reader.result as string);
          };
          reader.readAsDataURL(file);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
    }

    if (step === 2) {
      if (!formData.guardianName.trim()) newErrors.guardianName = 'Guardian name is required';
      if (!formData.relationship.trim()) newErrors.relationship = 'Relationship is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (step === 3) {
      if (!formData.previousSchool.trim()) newErrors.previousSchool = 'Previous school name is required';
      if (!formData.lastGrade.trim()) newErrors.lastGrade = 'Last grade completed is required';
    }

    if (step === 4) {
      if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact name is required';
      if (!formData.emergencyPhone.trim()) {
        newErrors.emergencyPhone = 'Emergency phone is required';
      } else if (!/^\+?[\d\s-]{10,}$/.test(formData.emergencyPhone)) {
        newErrors.emergencyPhone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      startUpload(file);
    }
  };

  const removeProfilePic = () => {
    setProfilePic(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setCurrentStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        console.error('Registration failed');
        alert('There was an issue submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const admissionsSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I apply for admission at Kingsfold International Academy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The enrollment process consists of basic steps: 1. Fill out the online admission form on this page. 2. Submit previous transcripts and records. 3. Sit for the entrance examinations. 4. Complete a collaborative family panel interview."
        }
      },
      {
        "@type": "Question",
        "name": "What documents are required for school admission?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Required materials include a birth certificate copy, recent academic reports, passport photographs, and proof of payment for the application form registration."
        }
      }
    ]
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <SEO 
        title={admissions.heroTitle || "Admissions Office"}
        description={admissions.heroSubtitle || "Apply for admission to Kingsfold International Academy. Secure enrollment in our world-class dual curriculum British-Nigerian school."}
        keywords="boarding school admissions, entrance exam registration Lagos, private school application Nigeria, enroll in Kingsfold"
        schema={admissionsSchema}
      />
      <div className="py-24 md:py-32 text-center px-4 bg-wine">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif text-cream mb-6 uppercase"
        >
          {admissions.heroTitle}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-cream/80 max-w-2xl mx-auto"
        >
          {admissions.heroSubtitle}
        </motion.p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-20 w-full">
        {/* Registration Title */}
        <div className="text-center mb-12">
          <span className="text-red uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">Online Enrollment</span>
          <h2 className="text-4xl md:text-5xl font-serif text-wine-dark">{admissions.enrollmentTitle}</h2>
          <p className="text-gray-500 mt-4 text-sm max-w-xl mx-auto">{admissions.enrollmentSubtitle}</p>
        </div>

        {/* Countdown Timer */}
        <CountdownTimer deadline={calculatedDeadline} />

        {/* Multi-Step Form */}
        <div className="bg-white border border-wine/10 shadow-2xl relative overflow-hidden mb-32">
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 px-8 text-center flex flex-col items-center"
            >
              <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
              <h3 className="text-3xl font-serif text-wine-dark mb-4">Registration Received</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Thank you for applying to Kingsfold International Academy. A confirmation email has been sent to your primary contact.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="px-10 py-4 bg-wine text-white text-[11px] font-bold uppercase tracking-widest hover:bg-red transition-colors"
              >
                Start New Application
              </button>
            </motion.div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="h-1 bg-gray-100 w-full">
                <motion.div 
                  className="h-full bg-wine"
                  initial={{ width: "20%" }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="p-8 md:p-12">
                {/* Step Indicators */}
                <div className="flex justify-between items-center mb-12 overflow-x-auto pb-4 md:pb-0 gap-6">
                  {[
                    "Student Profile",
                    "Guardianship",
                    "Academic History",
                    "Final Documents",
                    "Review & Submit"
                  ].map((label, idx) => (
                    <div key={idx} className="flex items-center gap-3 shrink-0">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                        currentStep > idx + 1 ? "bg-green-500 border-green-500 text-white" : 
                        currentStep === idx + 1 ? "bg-wine border-wine text-white" : 
                        "bg-white border-gray-200 text-gray-400"
                      )}>
                        {currentStep > idx + 1 ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>
                      <span className={cn(
                        "text-[10px] uppercase tracking-widest font-bold",
                        currentStep === idx + 1 ? "text-wine" : "text-gray-400"
                      )}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <h3 className="text-xl font-serif text-wine-dark mb-6">Personal Details</h3>
                        
                        {/* Profile Picture Upload Section */}
                        <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-gray-50">
                          <div 
                            className="relative group"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <div className={cn(
                              "w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all duration-300",
                              isDragging ? "border-red bg-red/5 scale-105" : "border-wine/5 bg-gray-100",
                              !profilePic && "border-dashed"
                            )}>
                              {profilePic ? (
                                <img src={profilePic} alt="Profile Preview" className="w-full h-full object-cover" />
                              ) : (
                                <Camera className={cn("w-8 h-8 transition-colors", isDragging ? "text-red" : "text-gray-300")} />
                              )}
                              
                              {/* Progress Overlay */}
                              {isUploading && (
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                                  <div className="text-white text-xs font-bold mb-1">{uploadProgress}%</div>
                                  <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                                     <motion.div 
                                       className="h-full bg-red"
                                       initial={{ width: 0 }}
                                       animate={{ width: `${uploadProgress}%` }}
                                     />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {profilePic && !isUploading && (
                              <button 
                                type="button"
                                onClick={removeProfilePic}
                                className="absolute -top-2 -right-2 bg-red text-white p-1.5 rounded-full shadow-lg hover:bg-wine-dark transition-all hover:scale-110 z-10"
                              >
                                <X size={14} />
                              </button>
                            )}

                            {isDragging && (
                              <div className="absolute inset-0 rounded-full border-2 border-red animate-pulse" />
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-4 text-center md:text-left">
                            <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#1a1a1a]">Student Profile Picture</h4>
                            <p className="text-xs text-gray-500 max-w-xs">Drag and drop or click to upload a passport photograph. Max size 2MB.</p>
                            
                            <div className="relative group/upload inline-block">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleProfilePicUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                disabled={isUploading}
                              />
                              <button 
                                type="button"
                                className={cn(
                                  "px-6 py-3 border text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 mx-auto md:mx-0",
                                  isUploading ? "bg-gray-100 border-gray-200 text-gray-400" : "border-wine text-wine hover:bg-wine hover:text-white"
                                )}
                              >
                                {isUploading ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-wine/20 border-t-wine rounded-full animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload size={14} /> {profilePic ? "Change Photo" : "Select Photo"}
                                  </>
                                )}
                              </button>
                            </div>
                            
                            {/* Visual Progress Feedback */}
                            {isUploading && (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-wider text-wine/60">
                                  <span>Transferring File</span>
                                  <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full max-w-xs h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-red"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">First Name</label>
                            <input 
                              type="text" 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={cn(
                                "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                errors.firstName ? "border-red" : "border-gray-200"
                              )} 
                            />
                            {errors.firstName && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.firstName}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Surname</label>
                            <input 
                              type="text" 
                              name="surname"
                              value={formData.surname}
                              onChange={handleInputChange}
                              className={cn(
                                "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                errors.surname ? "border-red" : "border-gray-200"
                              )} 
                            />
                            {errors.surname && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.surname}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Date of Birth</label>
                            <input 
                              type="date" 
                              name="dob"
                              value={formData.dob}
                              onChange={handleInputChange}
                              className={cn(
                                "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                errors.dob ? "border-red" : "border-gray-200"
                              )} 
                            />
                            {errors.dob && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.dob}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Gender</label>
                            <select 
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="w-full border-b border-gray-200 p-3 outline-none focus:border-wine text-sm bg-transparent"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xl font-serif text-wine-dark mb-6">Guardian Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Guardian Full Name</label>
                            <input 
                              type="text" 
                              name="guardianName"
                              value={formData.guardianName}
                              onChange={handleInputChange}
                              className={cn(
                                "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                errors.guardianName ? "border-red" : "border-gray-200"
                              )} 
                            />
                            {errors.guardianName && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.guardianName}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Relationship</label>
                            <input 
                              type="text" 
                              name="relationship"
                              value={formData.relationship}
                              onChange={handleInputChange}
                              className={cn(
                                "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                errors.relationship ? "border-red" : "border-gray-200"
                              )} 
                              placeholder="e.g. Father, Mother, Uncle" 
                            />
                            {errors.relationship && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.relationship}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Email Address</label>
                            <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={cn(
                                "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                errors.email ? "border-red" : "border-gray-200"
                              )} 
                            />
                            {errors.email && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.email}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Phone Number</label>
                            <PatternFormat 
                              format="+234 ###-###-####"
                              mask="_"
                              name="phone"
                              value={formData.phone}
                              onValueChange={(values) => {
                                setFormData(prev => ({ ...prev, phone: values.formattedValue }));
                                if (errors.phone) {
                                  setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.phone;
                                    return newErrors;
                                  });
                                }
                              }}
                              className={cn(
                                "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                errors.phone ? "border-red" : "border-gray-200"
                              )} 
                              placeholder="+234 XXX-XXX-XXXX"
                            />
                            {errors.phone && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.phone}</p>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-xl font-serif text-wine-dark mb-6">Academic Background</h3>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Previous School Name</label>
                            <input 
                              type="text" 
                              name="previousSchool"
                              value={formData.previousSchool}
                              onChange={handleInputChange}
                              className={cn(
                                "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                errors.previousSchool ? "border-red" : "border-gray-200"
                              )} 
                            />
                            {errors.previousSchool && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.previousSchool}</p>}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Last Grade Completed</label>
                              <input 
                                type="text" 
                                name="lastGrade"
                                value={formData.lastGrade}
                                onChange={handleInputChange}
                                className={cn(
                                  "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                  errors.lastGrade ? "border-red" : "border-gray-200"
                                )} 
                              />
                              {errors.lastGrade && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.lastGrade}</p>}
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Overall GPA / Average</label>
                              <input 
                                type="text" 
                                name="gpa"
                                value={formData.gpa}
                                onChange={handleInputChange}
                                className="w-full border-b border-gray-200 p-3 outline-none focus:border-wine text-sm" 
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div 
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <h3 className="text-xl font-serif text-wine-dark mb-6">Required Documents</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Birth Certificate Upload */}
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Birth Certificate</label>
                            {docs.birthCertificate ? (
                              <div className="border border-wine/10 p-4 bg-cream/5 flex items-center gap-4 group/doc relative h-[140px]">
                                <div className="w-16 h-16 bg-white border border-wine/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  {docs.birthCertificate.preview ? (
                                    <img src={docs.birthCertificate.preview} className="w-full h-full object-cover" alt="Preview" />
                                  ) : (
                                    <FileText className="text-wine/20" size={32} />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-bold text-wine-dark truncate">{docs.birthCertificate.name}</p>
                                  <p className="text-[10px] text-gray-400 mt-1">{docs.birthCertificate.size}</p>
                                  
                                  {docs.birthCertificate.progress < 100 ? (
                                    <div className="mt-2 space-y-1">
                                      <div className="flex justify-between text-[9px] font-bold text-wine/60 uppercase">
                                        <span>Uploading</span>
                                        <span>{docs.birthCertificate.progress}%</span>
                                      </div>
                                      <div className="w-full h-1 bg-wine/5 rounded-full overflow-hidden">
                                        <motion.div 
                                          className="h-full bg-red"
                                          initial={{ width: 0 }}
                                          animate={{ width: `${docs.birthCertificate.progress}%` }}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="mt-2 flex items-center gap-2 text-green-600">
                                      <CheckCircle2 size={12} />
                                      <span className="text-[9px] font-bold uppercase tracking-wider">Ready for Review</span>
                                    </div>
                                  )}
                                </div>

                                <div className="absolute top-2 right-2 flex gap-2">
                                  {docs.birthCertificate.progress === 100 && (
                                    <button 
                                      type="button"
                                      onClick={() => removeDoc('birthCertificate')}
                                      className="p-1.5 bg-red text-white scale-0 group-hover/doc:scale-100 transition-all hover:bg-wine-dark"
                                      title="Remove File"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="relative border-2 border-dashed border-gray-200 p-10 text-center hover:border-wine transition-colors group cursor-pointer h-[140px] flex flex-col items-center justify-center">
                                <input 
                                  type="file" 
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                  onChange={(e) => e.target.files?.[0] && startDocUpload('birthCertificate', e.target.files[0])}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <Upload className="w-8 h-8 mx-auto text-gray-300 group-hover:text-wine mb-3 transition-colors" />
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Click to Upload</h4>
                                <p className="text-[10px] text-gray-400">PDF or Image (Max 5MB)</p>
                              </div>
                            )}
                          </div>

                          {/* Vaccination Records Upload */}
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Vaccination Records</label>
                            {docs.vaccinationRecords ? (
                              <div className="border border-wine/10 p-4 bg-cream/5 flex items-center gap-4 group/doc relative h-[140px]">
                                <div className="w-16 h-16 bg-white border border-wine/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  {docs.vaccinationRecords.preview ? (
                                    <img src={docs.vaccinationRecords.preview} className="w-full h-full object-cover" alt="Preview" />
                                  ) : (
                                    <FileText className="text-wine/20" size={32} />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-bold text-wine-dark truncate">{docs.vaccinationRecords.name}</p>
                                  <p className="text-[10px] text-gray-400 mt-1">{docs.vaccinationRecords.size}</p>
                                  
                                  {docs.vaccinationRecords.progress < 100 ? (
                                    <div className="mt-2 space-y-1">
                                      <div className="flex justify-between text-[9px] font-bold text-wine/60 uppercase">
                                        <span>Uploading</span>
                                        <span>{docs.vaccinationRecords.progress}%</span>
                                      </div>
                                      <div className="w-full h-1 bg-wine/5 rounded-full overflow-hidden">
                                        <motion.div 
                                          className="h-full bg-red"
                                          initial={{ width: 0 }}
                                          animate={{ width: `${docs.vaccinationRecords.progress}%` }}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="mt-2 flex items-center gap-2 text-green-600">
                                      <CheckCircle2 size={12} />
                                      <span className="text-[9px] font-bold uppercase tracking-wider">Ready for Review</span>
                                    </div>
                                  )}
                                </div>

                                <div className="absolute top-2 right-2 flex gap-2">
                                  {docs.vaccinationRecords.progress === 100 && (
                                    <button 
                                      type="button"
                                      onClick={() => removeDoc('vaccinationRecords')}
                                      className="p-1.5 bg-red text-white scale-0 group-hover/doc:scale-100 transition-all hover:bg-wine-dark"
                                      title="Remove File"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="relative border-2 border-dashed border-gray-200 p-10 text-center hover:border-wine transition-colors group cursor-pointer h-[140px] flex flex-col items-center justify-center">
                                <input 
                                  type="file" 
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                  onChange={(e) => e.target.files?.[0] && startDocUpload('vaccinationRecords', e.target.files[0])}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <Upload className="w-8 h-8 mx-auto text-gray-300 group-hover:text-wine mb-3 transition-colors" />
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Click to Upload</h4>
                                <p className="text-[10px] text-gray-400">PDF or Image (Max 5MB)</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-50">
                          <h4 className="text-[12px] font-bold uppercase tracking-widest text-wine-dark">Emergency Contact</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleInputChange}
                                placeholder="Contact Person Name" 
                                className={cn(
                                  "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                  errors.emergencyContact ? "border-red" : "border-gray-200"
                                )} 
                              />
                              {errors.emergencyContact && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.emergencyContact}</p>}
                            </div>
                            <div className="space-y-2">
                              <PatternFormat 
                                format="+234 ###-###-####"
                                mask="_"
                                name="emergencyPhone"
                                value={formData.emergencyPhone}
                                onValueChange={(values) => {
                                  setFormData(prev => ({ ...prev, emergencyPhone: values.formattedValue }));
                                  if (errors.emergencyPhone) {
                                    setErrors(prev => {
                                      const newErrors = { ...prev };
                                      delete newErrors.emergencyPhone;
                                      return newErrors;
                                    });
                                  }
                                }}
                                placeholder="Emergency Phone (+234 XXX-XXX-XXXX)" 
                                className={cn(
                                  "w-full border-b p-3 outline-none focus:border-wine text-sm transition-colors",
                                  errors.emergencyPhone ? "border-red" : "border-gray-200"
                                )} 
                              />
                              {errors.emergencyPhone && <p className="text-[10px] text-red font-bold mt-1 uppercase tracking-wider">{errors.emergencyPhone}</p>}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 5 && (
                      <motion.div 
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <h3 className="text-xl font-serif text-wine-dark mb-6">Preview Application</h3>
                        
                        <div className="space-y-8 bg-gray-50/50 p-6 md:p-8">
                          {/* Student Section */}
                          <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border-2 border-wine/10">
                              {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                  <Camera size={24} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Full Name</h5>
                                <p className="text-sm font-serif text-wine-dark">{formData.firstName} {formData.surname || '—'}</p>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Gender</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.gender}</p>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Date of Birth</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.dob || '—'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Guardian Section */}
                          <div className="pt-6 border-t border-gray-100">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-wine-dark mb-4">Guardian Details</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Name</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.guardianName || '—'}</p>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Relationship</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.relationship || '—'}</p>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.email || '—'}</p>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Phone</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.phone || '—'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Academic Section */}
                          <div className="pt-6 border-t border-gray-100">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-wine-dark mb-4">Academic History</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                              <div className="col-span-1 sm:col-span-2">
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Previous School</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.previousSchool || '—'}</p>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Last Grade</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.lastGrade || '—'}</p>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">GPA / Average</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.gpa || '—'}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Documents Section */}
                          <div className="pt-6 border-t border-gray-100">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-wine-dark mb-4">Required Documents</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="flex items-center gap-3 p-3 bg-white border border-wine/5">
                                {docs.birthCertificate ? (
                                  <>
                                    <div className="w-10 h-10 bg-wine/5 flex items-center justify-center overflow-hidden">
                                      {docs.birthCertificate.preview ? (
                                        <img src={docs.birthCertificate.preview} className="w-full h-full object-cover" alt="Birth Cert" />
                                      ) : (
                                        <FileText className="text-wine/40" size={20} />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-[10px] font-bold text-wine-dark truncate">{docs.birthCertificate.name}</p>
                                      <p className="text-[9px] text-green-600 font-bold uppercase">Uploaded</p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                                      <X className="text-gray-300" size={16} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Birth Certificate Missing</p>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-white border border-wine/5">
                                {docs.vaccinationRecords ? (
                                  <>
                                    <div className="w-10 h-10 bg-wine/5 flex items-center justify-center overflow-hidden">
                                      {docs.vaccinationRecords.preview ? (
                                        <img src={docs.vaccinationRecords.preview} className="w-full h-full object-cover" alt="Vaccination" />
                                      ) : (
                                        <FileText className="text-wine/40" size={20} />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-[10px] font-bold text-wine-dark truncate">{docs.vaccinationRecords.name}</p>
                                      <p className="text-[9px] text-green-600 font-bold uppercase">Uploaded</p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                                      <X className="text-gray-300" size={16} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Vaccination Records Missing</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Emergency */}
                          <div className="pt-6 border-t border-gray-100">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-wine-dark mb-4">Emergency Contact</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Contact Name</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.emergencyContact || '—'}</p>
                              </div>
                              <div>
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Phone</h5>
                                <p className="text-sm text-[#1a1a1a]">{formData.emergencyPhone || '—'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-4 bg-red/5 border border-red/10 animate-pulse">
                          <CheckCircle2 className="text-red w-4 h-4" />
                          <p className="text-[10px] text-red font-bold uppercase tracking-[0.1em]">By submitting, you agree that all provided information is accurate.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Footer / Nav */}
                  <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                    <button 
                      type="button"
                      onClick={prevStep}
                      className={cn(
                        "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity",
                        currentStep === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                      )}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>

                    {currentStep === totalSteps ? (
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-wine text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-red shadow-lg transition-all flex items-center gap-3"
                      >
                        {isSubmitting ? "Processing..." : "Complete Registration"}
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={nextStep}
                        className="bg-wine text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-red shadow-lg transition-all flex items-center gap-3"
                      >
                        Next Step <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Existing Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif text-wine-dark mb-8">How to Apply</h2>
            <div className="flex flex-col gap-8">
              {[
                { step: "01", title: "Obtain Application Form", desc: "Purchase the form online or at the school's admissions office." },
                { step: "02", title: "Entrance Examination", desc: "Candidates will sit for Math, English, and General Knowledge." },
                { step: "03", title: "Oral Interview", desc: "Successful candidates proceed to an interview with the Principal." },
                { step: "04", title: "Offer of Admission", desc: "Letters are issued to successful applicants upon final review." }
              ].map((item, idx) => (
                <motion.div 
                  key={item.step} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-6"
                >
                  <span className="font-serif text-4xl text-red opacity-80">{item.step}</span>
                  <div>
                    <h3 className="font-serif text-xl text-wine mb-2">{item.title}</h3>
                    <p className="text-gray-dark/80 text-sm font-sans">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-red translate-x-4 translate-y-4 md:translate-x-8 md:translate-y-8 z-0"></div>
            <img 
              src="https://res.cloudinary.com/diiwcoarc/image/upload/v1779776708/kia10_rezxei.jpg" 
              alt="Kingsfold Academy Campus" 
              referrerPolicy="no-referrer"
              className="relative z-10 w-full grayscale h-[500px] object-cover"
            />
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-[800px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-red uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">Information Desk</span>
            <h2 className="text-4xl md:text-5xl font-serif text-wine-dark">Common Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-wine/10 bg-white/50">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span className={cn(
                    "font-serif text-lg md:text-xl transition-colors",
                    openIndex === index ? "text-wine" : "text-wine-dark group-hover:text-wine"
                  )}>
                    {faq.question}
                  </span>
                  <div className="shrink-0 ml-4">
                    {openIndex === index ? (
                      <Minus size={20} className="text-red" />
                    ) : (
                      <Plus size={20} className="text-wine/40 group-hover:text-wine" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 text-gray-500 text-sm md:text-base leading-relaxed font-sans max-w-[90%]">
                        {faq.answer}
                        {faq.link && (
                          <Link 
                            to={faq.link} 
                            className="inline-flex items-center gap-2 text-wine font-bold ml-2 hover:text-red transition-colors"
                          >
                            {faq.linkText} <ChevronRight size={14} />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
