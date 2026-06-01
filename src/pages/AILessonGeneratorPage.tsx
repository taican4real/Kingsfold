import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Brain, Download, Loader2, PlayCircle, Sparkles, Send, LogOut } from 'lucide-react';
import Markdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../components/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface FileFormData {
  topic: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  learningObjectives: string;
  additionalContext: string;
}

export default function AILessonGeneratorPage() {
  const { user, isStaff, kiaCode } = useAuth();

  // Sync the current user state to session storage to detect logout events
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('ai_generator_auth_active', 'true');
    }
  }, [user]);

  // When user transitions from logged-in to logged-out, trigger a reload to access code gate
  useEffect(() => {
    const hadUser = sessionStorage.getItem('ai_generator_auth_active') === 'true';
    if (!user && hadUser) {
      sessionStorage.removeItem('ai_generator_auth_active');
      window.location.reload();
    }
  }, [user]);

  const [formData, setFormData] = useState<FileFormData>({
    topic: '',
    subject: '',
    gradeLevel: 'Year 7',
    duration: '45 mins',
    learningObjectives: '',
    additionalContext: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [error, setError] = useState('');
  
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [isValidated, setIsValidated] = useState(false);
  const [validationCode, setValidationCode] = useState('');
  const [validationError, setValidationError] = useState('');

  const [lessonPlan, setLessonPlan] = useState<any | null>(null);
  const [rawLessonPlanText, setRawLessonPlanText] = useState("");
  const [lessonNote, setLessonNote] = useState<any | null>(null);

  const [activeTab, setActiveTab] = useState<'lesson' | 'questions'>('lesson');
  const [questionFormData, setQuestionFormData] = useState({
    session: '2023/2024',
    classLevel: 'Year 7',
    topics: '',
    numObjective: 40,
    numTheory: 5,
    duration: '2 Hours',
    instruction: 'Answer all questions'
  });
  const [questionsData, setQuestionsData] = useState<any | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [isGeneratingQuestionPDF, setIsGeneratingQuestionPDF] = useState(false);

  const handleValidationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = validationCode.trim().toUpperCase();
    if (!code) {
      setValidationError("Please enter your Staff ID / KIA Code.");
      return;
    }
    
    // Check if format matches KIA-XXX-XXX (e.g. KIA-123-456)
    const isValidFormat = /^KIA-\d{3}-\d{3}$/.test(code);

    if (kiaCode) {
      // If user is logged in, strictly check against their assigned KIA code
      if (code === kiaCode.toUpperCase()) {
        setIsValidated(true);
        setValidationError('');
      } else {
        setValidationError("Invalid Staff ID / KIA Code. It does not match your assigned code.");
      }
    } else if (isValidFormat) {
      // If user is not logged in but format is correct, allow them in for preview purposes
      // Note: In a fully authenticated production app, we would query the database here.
      setIsValidated(true);
      setValidationError('');
    } else {
      setValidationError("Invalid Staff ID / KIA Code format. Expected format: KIA-XXX-XXX");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleQuestionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setQuestionFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.name === 'numObjective' || e.target.name === 'numTheory' 
        ? parseInt(e.target.value) || 0 
        : e.target.value
    }));
  };

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionFormData.topics.trim()) {
      setError("Please fill in the Topics.");
      return;
    }

    setLoadingQuestions(true);
    setError('');
    setQuestionsData(null);

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionFormData)
      });
      
      const data = await response.json();
      if (!response.ok) {
         throw new Error(data.error || "Failed to generate questions");
      }

      let jsonStr = data.content;
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n/g, '').replace(/```\n*$/g, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n/g, '').replace(/```\n*$/g, '');
      }
      
      try {
        const parsed = JSON.parse(jsonStr);
        setQuestionsData(parsed);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError, jsonStr);
        setError("Received an invalid format from the AI. Check console for details.");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim() || !formData.subject.trim()) {
      setError("Please fill in the Topic and Subject.");
      return;
    }

    setLoading(true);
    setError('');
    setLessonPlan(null);
    setLessonNote(null);
    setRawLessonPlanText("");

    try {
      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) {
         throw new Error(data.error || "Failed to generate lesson plan");
      }

      setRawLessonPlanText(data.content);
      
      // Attempt to parse JSON. Gemini might output Markdown blocks.
      let jsonStr = data.content;
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n/g, '').replace(/```\n*$/g, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n/g, '').replace(/```\n*$/g, '');
      }
      
      try {
        const parsed = JSON.parse(jsonStr);
        setLessonPlan(parsed);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError, jsonStr);
        setError("Received an invalid format from the AI. Check console for details.");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNote = async () => {
    if (!lessonPlan) return;
    setLoadingNote(true);
    setError('');

    try {
      const response = await fetch('/api/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonPlan: rawLessonPlanText,
          topic: formData.topic,
          subject: formData.subject,
          gradeLevel: formData.gradeLevel
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
         throw new Error(data.error || "Failed to generate lesson note");
      }

      let jsonStr = data.content;
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n/g, '').replace(/```\n*$/g, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n/g, '').replace(/```\n*$/g, '');
      }
      
      try {
        const parsed = JSON.parse(jsonStr);
        setLessonNote(parsed);
      } catch (parseError) {
        console.error("Failed to parse NOTE JSON:", parseError, jsonStr);
        setError("Failed to parse the generated note.");
      }
      
    } catch (err: any) {
       setError(err.message);
    } finally {
       setLoadingNote(false);
    }
  };

  const downloadPDF = async () => {
    if (!lessonPlan) return;
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Add School Logo
    try {
      const resp = await fetch("/api/proxy-logo");
      const data = await resp.json();
      
      if (data.base64) {
        // Calculate aspect ratio. Since we don't have natural width/height directly without an Image object,
        // we can still create a temporary image just to get the dimensions, or assume a square. 
        // Let's create a quick Image to get dimensions
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // just resolve to use defaults
          img.src = data.base64;
        });

        const imgWidth = 30;
        const imgHeight = (img.height && img.width) ? (img.height * imgWidth) / img.width : 30; // fallback to square
        
        doc.addImage(data.base64, 'PNG', pageWidth / 2 - imgWidth / 2, 10, imgWidth, imgHeight);
        
        let currentY = 10 + imgHeight + 8;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("KINGSFOLD INTERNATIONAL ACADEMY", pageWidth / 2, currentY, { align: "center" });
        
        currentY += 6;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Plot 1, His Glory Avenue, Legina (Bus Stop), Off Itokin Road, Adamo Ikorodu, Lagos.", pageWidth / 2, currentY, { align: "center" });
        
        currentY += 5;
        doc.text("Tel: (+234) 909 598 7223 | info@kingsfoldinternationalacademy.com.ng", pageWidth / 2, currentY, { align: "center" });

        currentY += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("LESSON PLAN", pageWidth / 2, currentY, { align: "center" });

        autoTable(doc, {
          startY: currentY + 5,
          head: [['Field', 'Details']],
          body: [
            ['Subject', lessonPlan.header?.subject || formData.subject],
            ['Term', lessonPlan.header?.term || 'Current Term'],
            ['Session', lessonPlan.header?.session || '2023/2024'],
            ['Year/Grade', lessonPlan.grid?.year || formData.gradeLevel],
            ['Topic', lessonPlan.grid?.topicSubTopics || formData.topic],
            ['Duration', lessonPlan.grid?.duration || formData.duration]
          ],
          theme: 'grid',
          headStyles: { fillColor: [107, 15, 26] },
        });
      } else {
        throw new Error("No base64 data");
      }
    } catch (e) {
      console.warn("Could not load logo for PDF", e);
      // Fallback if image fails to load due to CORS or other issues
      let currentY = 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("KINGSFOLD INTERNATIONAL ACADEMY", pageWidth / 2, currentY, { align: "center" });
      
      currentY += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Plot 1, His Glory Avenue, Legina (Bus Stop), Off Itokin Road, Adamo Ikorodu, Lagos.", pageWidth / 2, currentY, { align: "center" });
      
      currentY += 5;
      doc.text("Tel: (+234) 909 598 7223 | info@kingsfoldinternationalacademy.com.ng", pageWidth / 2, currentY, { align: "center" });

      currentY += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("LESSON PLAN", pageWidth / 2, currentY, { align: "center" });

      autoTable(doc, {
        startY: currentY + 5,
        head: [['Field', 'Details']],
        body: [
          ['Subject', lessonPlan.header?.subject || formData.subject],
          ['Term', lessonPlan.header?.term || 'Current Term'],
          ['Session', lessonPlan.header?.session || '2023/2024'],
          ['Year/Grade', lessonPlan.grid?.year || formData.gradeLevel],
          ['Topic', lessonPlan.grid?.topicSubTopics || formData.topic],
          ['Duration', lessonPlan.grid?.duration || formData.duration]
        ],
        theme: 'grid',
        headStyles: { fillColor: [107, 15, 26] },
      });
    }

    const addSection = (title: string, content: string | string[], startY: number) => {
      doc.setFont("helvetica", "bold");
      doc.text(title, 14, startY);
      doc.setFont("helvetica", "normal");
      
      let textLines = [];
      if (Array.isArray(content)) {
        textLines = content.map((item, i) => `${i + 1}. ${item}`);
      } else {
        textLines = doc.splitTextToSize(content, 180);
      }

      // @ts-ignore
      doc.text(textLines, 14, startY + 7);
      return startY + 7 + (textLines.length * 6);
    };

    let nextY = (doc as any).lastAutoTable.finalY + 15;
    
    if (lessonPlan.learningObjectives) {
      nextY = addSection("Learning Objectives", lessonPlan.learningObjectives, nextY) + 10;
    }
    
    if (lessonPlan.grid?.interactiveSession) {
      nextY = addSection("Interactive Session / Methodology", lessonPlan.grid.interactiveSession, nextY) + 10;
    }

    if (lessonPlan.bibleReference) {
      nextY = addSection("Bible Reference", lessonPlan.bibleReference, nextY) + 10;
    }

    if (lessonPlan.grid?.instructionalMaterials) {
      nextY = addSection("Materials Needed", lessonPlan.grid.instructionalMaterials, nextY) + 10;
    }

    if (lessonPlan.homework) {
      nextY = addSection("Homework / Assignment", lessonPlan.homework, nextY) + 10;
    }

    doc.save(`${formData.topic.replace(/\s+/g, '_')}_Lesson_Plan.pdf`);
    } catch (err) {
      console.error("Error generating PDF", err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadQuestionsPDF = async () => {
    if (!questionsData) return;
    setIsGeneratingQuestionPDF(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      let currentY = 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("KINGSFOLD INTERNATIONAL ACADEMY", pageWidth / 2, currentY, { align: "center" });
      
      currentY += 10;
      doc.setFontSize(12);
      doc.text("ASSESSMENT PAPER", pageWidth / 2, currentY, { align: "center" });

      autoTable(doc, {
        startY: currentY + 5,
        head: [['Field', 'Details']],
        body: [
          ['Session', questionsData.header?.session || questionFormData.session],
          ['Class/Grade', questionsData.header?.classLevel || questionFormData.classLevel],
          ['Duration', questionsData.header?.duration || questionFormData.duration],
          ['Instructions', questionsData.header?.instruction || questionFormData.instruction]
        ],
        theme: 'grid',
        headStyles: { fillColor: [107, 15, 26] },
      });

      let nextY = (doc as any).lastAutoTable.finalY + 15;

      const checkPageBreak = (requiredSpace: number) => {
        if (nextY + requiredSpace > doc.internal.pageSize.height - 20) {
          doc.addPage();
          nextY = 20;
        }
      };

      if (questionsData.multipleChoice && questionsData.multipleChoice.length > 0) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("SECTION A: MULTIPLE CHOICE", 14, nextY);
        nextY += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        questionsData.multipleChoice.forEach((q: any) => {
          const lines = doc.splitTextToSize(`${q.questionNumber}. ${q.question}`, 180);
          checkPageBreak(lines.length * 5 + 25);
          // @ts-ignore
          doc.text(lines, 14, nextY);
          nextY += lines.length * 5;

          const options = q.options || {};
          Object.keys(options).forEach((key) => {
             // @ts-ignore
             doc.text(`${key}. ${options[key]}`, 20, nextY);
             nextY += 5;
          });
          nextY += 5;
        });
      }

      if (questionsData.theory && questionsData.theory.length > 0) {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("SECTION B: THEORY", 14, nextY);
        nextY += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        questionsData.theory.forEach((q: any) => {
          const lines = doc.splitTextToSize(`${q.questionNumber}. ${q.question}`, 180);
          checkPageBreak(lines.length * 5 + 10);
          // @ts-ignore
          doc.text(lines, 14, nextY);
          nextY += lines.length * 5 + 5;
        });
      }

      doc.save(`Assessment_${questionFormData.classLevel.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error generating question PDF:", error);
    } finally {
      setIsGeneratingQuestionPDF(false);
    }
  };

  if (!isValidated) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 shadow-xl border border-wine/10 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-wine/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-wine" />
          </div>
          <h2 className="text-2xl font-serif text-wine mb-2">Staff Verification</h2>
          <p className="text-sm text-gray-500 mb-8">Please enter your Staff ID (KIA Code) to access the AI Lesson Generator.</p>

          <form onSubmit={handleValidationSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter KIA Code (e.g. KIA-...)"
                value={validationCode}
                onChange={(e) => setValidationCode(e.target.value)}
                className="w-full bg-neutral-50 border border-gray-200 p-4 text-center text-sm font-mono focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all uppercase"
              />
            </div>
            {validationError && (
              <p className="text-xs text-red mt-2 text-[#EF4444]">{validationError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-wine text-white p-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
              Verify & Access
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center">
      <div className="w-full bg-wine py-16 px-6 relative overflow-hidden animate-fade-in">
        {user && (
          <button
            onClick={async () => {
              sessionStorage.removeItem('ai_generator_auth_active');
              await signOut(auth);
              window.location.reload();
            }}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white text-white hover:text-wine border border-white/20 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-200 flex items-center gap-1.5 rounded shadow z-20 cursor-pointer"
          >
            <LogOut size={12} /> Secure Sign Out & Lock
          </button>
        )}
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src="https://drive.google.com/thumbnail?id=1BasYzGGbqpXgKglJSsBaQ4hZcGkjZg7L&sz=w1000" 
              alt="Kingsfold Academy Logo"
              className="h-16 w-auto object-contain bg-white/20 p-2 rounded-lg backdrop-blur-sm" 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            AI Lesson <br /> & Note Generator
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Harness the power of Gemini to instantly create comprehensive lesson plans, interactive sessions, and detailed study notes tailored for the Kingsfold curriculum.
          </p>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Form Column */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-100 sticky top-24">
            <div className="flex border-b border-gray-100 mb-6">
              <button
                className={`flex-1 pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'lesson' ? 'border-b-2 border-wine text-wine' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={() => setActiveTab('lesson')}
              >
                Lesson
              </button>
              <button
                className={`flex-1 pb-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'questions' ? 'border-b-2 border-wine text-wine' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={() => setActiveTab('questions')}
              >
                Questions
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <Brain className="w-5 h-5 text-wine" />
              <h2 className="text-lg font-bold text-gray-900 font-serif">Setup {activeTab === 'lesson' ? 'Generator' : 'Assessment'}</h2>
            </div>
            
            {error && (
              <div className="bg-red/5 border border-red/20 text-red text-xs p-4 mb-6 rounded-md">
                {error}
              </div>
            )}

            {activeTab === 'lesson' ? (
              <form onSubmit={handleGeneratePlan} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                    placeholder="e.g. Mathematics, English"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Topic</label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                    placeholder="e.g. Quadratic Equations"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Grade Level</label>
                    <select
                      name="gradeLevel"
                      value={formData.gradeLevel}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                    >
                      {[7,8,9,10,11,12].map(yr => (
                        <option key={yr} value={`Year ${yr}`}>Year {yr}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                      placeholder="e.g. 45 mins"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Learning Objectives (Optional)</label>
                  <textarea
                    name="learningObjectives"
                    value={formData.learningObjectives}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all resize-none"
                    placeholder="Leave blank for AI-generated objectives"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-wine text-white p-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Generate Lesson Plan
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleGenerateQuestions} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Session</label>
                    <input
                      type="text"
                      name="session"
                      value={questionFormData.session}
                      onChange={handleQuestionInputChange}
                      className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                      placeholder="e.g. 2023/2024"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Class Level</label>
                    <input
                      type="text"
                      name="classLevel"
                      value={questionFormData.classLevel}
                      onChange={handleQuestionInputChange}
                      className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                      placeholder="e.g. Year 7"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Topics Covered</label>
                  <textarea
                    name="topics"
                    value={questionFormData.topics}
                    onChange={handleQuestionInputChange}
                    rows={2}
                    className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all resize-none"
                    placeholder="e.g. Algebra, Data Processing"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Multiple Choice Qtns</label>
                    <input
                      type="number"
                      name="numObjective"
                      min={1}
                      max={100}
                      value={questionFormData.numObjective}
                      onChange={handleQuestionInputChange}
                      className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Theory Qtns</label>
                    <input
                      type="number"
                      name="numTheory"
                      min={0}
                      max={20}
                      value={questionFormData.numTheory}
                      onChange={handleQuestionInputChange}
                      className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={questionFormData.duration}
                    onChange={handleQuestionInputChange}
                    className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                    placeholder="e.g. 2 Hours"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Instructions</label>
                  <input
                    type="text"
                    name="instruction"
                    value={questionFormData.instruction}
                    onChange={handleQuestionInputChange}
                    className="w-full bg-neutral-50 border border-gray-200 p-3 text-sm focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                    placeholder="e.g. Answer all questions"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingQuestions}
                  className="w-full bg-wine text-white p-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 group"
                >
                  {loadingQuestions ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Generate Questions
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:w-2/3">
          {activeTab === 'lesson' ? (
            !lessonPlan && !loading ? (
              <div className="bg-white border border-gray-100 p-12 text-center h-[500px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-wine/5 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-wine/40" />
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-2">Ready to Draft Your Lesson?</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Fill out the configuration panel and the AI will generate a structured, ready-to-teach plan.
                </p>
              </div>
            ) : loading && !lessonPlan ? (
               <div className="bg-white border border-gray-100 p-12 text-center h-[500px] flex flex-col items-center justify-center space-y-6">
                  <div className="w-16 h-16 border-4 border-t-wine border-wine/20 rounded-full animate-spin"></div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Crafting curriculum...</h3>
                    <p className="text-sm text-gray-500">Aligning objectives and structuring activities</p>
                  </div>
               </div>
            ) : lessonPlan ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
              {/* LESSON PLAN CARD */}
              <div className="bg-white border border-gray-100 p-6 md:p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={downloadPDF} disabled={isGeneratingPDF} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-wine hover:text-black transition-colors bg-wine/5 hover:bg-wine/10 px-4 py-2 rounded-md disabled:opacity-50">
                     {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                     {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                   </button>
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 border-b-2 border-wine/10 pb-4 inline-block pr-12">
                  Lesson Plan
                </h3>
                
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 text-sm mb-10">
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subject</p>
                      <p className="font-medium text-gray-900">{lessonPlan.header?.subject || formData.subject}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Topic</p>
                      <p className="font-medium text-gray-900">{lessonPlan.grid?.topicSubTopics || formData.topic}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Year / Session</p>
                      <p className="font-medium text-gray-900">{lessonPlan.grid?.year || formData.gradeLevel} &bull; {lessonPlan.header?.session}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                      <p className="font-medium text-gray-900">{lessonPlan.grid?.duration || formData.duration}</p>
                   </div>
                </div>

                <div className="space-y-8">
                  {lessonPlan.learningObjectives?.length > 0 && (
                    <div className="bg-gray-50/50 border border-gray-100 p-6 rounded-lg">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-wine" /> Learning Objectives
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                        {lessonPlan.learningObjectives.map((obj: string, i: number) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {lessonPlan.grid?.interactiveSession?.length > 0 && (
                     <div>
                       <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <PlayCircle className="w-3 h-3 text-wine" /> Interactive Session & Activities
                       </h4>
                       <div className="space-y-4">
                         {lessonPlan.grid.interactiveSession.map((step: string, i: number) => (
                           <div key={i} className="flex gap-4">
                             <div className="shrink-0 w-6 h-6 bg-wine/10 text-wine rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</div>
                             <p className="text-gray-700 text-sm mt-0.5 leading-relaxed">{step}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                  )}

                  {lessonPlan.bibleReference && (
                     <div className="border-l-4 border-golden pl-4 py-1 italic text-gray-600 bg-golden/5 p-4 rounded-r-lg">
                        <p className="text-xs">{lessonPlan.bibleReference}</p>
                     </div>
                  )}

                  <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-8">
                    {lessonPlan.grid?.instructionalMaterials?.length > 0 && (
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Materials Needed</h4>
                        <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
                           {lessonPlan.grid.instructionalMaterials.map((mat: string, i: number) => (
                             <li key={i}>{mat}</li>
                           ))}
                        </ul>
                      </div>
                    )}
                    {lessonPlan.homework && (
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Homework</h4>
                        <p className="text-sm text-gray-600">{lessonPlan.homework}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Generate Note Banner CTA */}
                {!lessonNote && (
                  <div className="mt-12 bg-wine/5 border border-wine/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg">
                     <div>
                       <h4 className="font-bold text-wine mb-1 flex items-center gap-2">
                         <Brain className="w-4 h-4" /> Need the detailed teaching notes?
                       </h4>
                       <p className="text-xs text-gray-600">The AI can expand this plan into comprehensive note.</p>
                     </div>
                     <button
                       onClick={handleGenerateNote}
                       disabled={loadingNote}
                       className="bg-wine text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-md hover:bg-black transition-colors flex items-center gap-2 shrink-0"
                     >
                        {loadingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate Full Note
                     </button>
                  </div>
                )}
              </div>

              {/* DETAILED LESSON NOTE CARD */}
              {lessonNote && (
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white border border-gray-100 p-6 md:p-10 shadow-sm"
                >
                   <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 border-b-2 border-wine/10 pb-4 inline-flex items-center gap-3">
                     Detailed Lesson Note
                   </h3>

                   <div className="markdown-body prose prose-wine max-w-none text-sm text-gray-700 leading-relaxed space-y-6">
                      <p className="text-lg italic text-gray-600 border-l-4 border-gray-200 pl-4">
                        {lessonNote.introduction}
                      </p>

                      <div className="bg-gray-50 p-6 rounded-lg my-8">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Table of Content & Summary</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                           {lessonNote.tableOfContent?.map((toc: any, i: number) => (
                             <div key={i} className="border border-gray-100 bg-white p-3 rounded shadow-sm">
                                <h5 className="font-bold text-wine text-xs mb-1">{toc.heading}</h5>
                                <p className="text-xs text-gray-500">{toc.summary}</p>
                             </div>
                           ))}
                        </div>
                      </div>

                      {lessonNote.detailedSections?.map((section: any, i: number) => (
                         <div key={i} className="mb-10">
                           <h4 className="text-xl font-bold text-gray-900 mb-4">{section.heading}</h4>
                           <div className="text-gray-700 mb-4 whitespace-pre-wrap"><Markdown>{section.content}</Markdown></div>
                           {section.keyTakeaway && (
                             <div className="bg-wine/5 border-l-2 border-wine p-3">
                               <p className="text-xs font-bold text-wine">Key Takeaway: <span className="font-normal text-gray-800">{section.keyTakeaway}</span></p>
                             </div>
                           )}
                         </div>
                      ))}

                      {lessonNote.keyDefinitions?.length > 0 && (
                         <div className="my-10">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Key Definitions</h4>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                              {lessonNote.keyDefinitions.map((def: any, i: number) => (
                                <div key={i} className="bg-gray-50 p-3 rounded border border-gray-100">
                                  <dt className="font-bold text-wine text-sm mb-1">{def.term}</dt>
                                  <dd className="text-xs text-gray-600">{def.definition}</dd>
                                </div>
                              ))}
                            </dl>
                         </div>
                      )}

                      <div className="border-t border-gray-200 mt-12 pt-8">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Summary Conclusion</h4>
                        <p className="text-sm font-medium text-gray-800 bg-neutral-100 p-4 rounded text-center">
                          {lessonNote.summary}
                        </p>
                      </div>

                   </div>
                </motion.div>
              )}
            </motion.div>
          ) : null
        ) : (
          !questionsData && !loadingQuestions ? (
            <div className="bg-white border border-gray-100 p-12 text-center h-[500px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-wine/5 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-wine/40" />
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-2">Ready to Draft Assessment?</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Fill out the configuration panel to generate an automated assessment containing objective and theory questions.
              </p>
            </div>
          ) : loadingQuestions && !questionsData ? (
             <div className="bg-white border border-gray-100 p-12 text-center h-[500px] flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-4 border-t-wine border-wine/20 rounded-full animate-spin"></div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Generating Questions...</h3>
                  <p className="text-sm text-gray-500">Formulating options to align with topics provided.</p>
                </div>
             </div>
          ) : questionsData ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white border border-gray-100 p-6 md:p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={downloadQuestionsPDF} disabled={isGeneratingQuestionPDF} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-wine hover:text-black transition-colors bg-wine/5 hover:bg-wine/10 px-4 py-2 rounded-md disabled:opacity-50">
                     {isGeneratingQuestionPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                     {isGeneratingQuestionPDF ? 'Generating...' : 'Download PDF'}
                   </button>
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 border-b-2 border-wine/10 pb-4 inline-block pr-12">
                  Assessment Paper
                </h3>
                
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 text-sm mb-10">
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Session</p>
                      <p className="font-medium text-gray-900">{questionsData.header?.session || questionFormData.session}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class / Grade Level</p>
                      <p className="font-medium text-gray-900">{questionsData.header?.classLevel || questionFormData.classLevel}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                      <p className="font-medium text-gray-900">{questionsData.header?.duration || questionFormData.duration}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Instructions</p>
                      <p className="font-medium text-gray-900">{questionsData.header?.instruction || questionFormData.instruction}</p>
                   </div>
                </div>

                <div className="space-y-12">
                  {questionsData.multipleChoice && questionsData.multipleChoice.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                         SECTION A: MULTIPLE CHOICE
                      </h4>
                      <div className="space-y-8">
                        {questionsData.multipleChoice.map((q: any, i: number) => (
                          <div key={`mc-${i}`}>
                            <p className="font-medium text-gray-800 text-sm mb-3 leading-relaxed">
                              {q.questionNumber || i + 1}. {q.question}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                              {Object.entries(q.options || {}).map(([key, val]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="font-bold text-wine w-6 shrink-0">{key}.</span>
                                  <span className="text-gray-600 text-sm">{val as string}</span>
                                </div>
                              ))}
                            </div>
                            {q.correctAnswer && (
                              <div className="mt-3 pl-4">
                                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded">
                                  Answer: {q.correctAnswer}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {questionsData.theory && questionsData.theory.length > 0 && (
                    <div className="pt-8">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                         SECTION B: THEORY
                      </h4>
                      <div className="space-y-6">
                        {questionsData.theory.map((q: any, i: number) => (
                          <div key={`theory-${i}`}>
                            <p className="font-medium text-gray-800 text-sm leading-relaxed">
                              {q.questionNumber || i + 1}. {q.question}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          ) : null)}
        </div>
      </div>
    </div>
  );
}
