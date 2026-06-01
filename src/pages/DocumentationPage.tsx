import React from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Server, Layout, Database, Mail, Terminal, FileText, ChevronRight, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const DocumentationPage = () => {
  const sections = [
    {
      title: "Project Overview",
      icon: Layout,
      content: "Kingsfold International Academy portal is a high-performance, responsive web application built with React, TypeScript, and Tailwind CSS. It features a custom Express backend for handling student registrations via secure email notifications."
    },
    {
      title: "Tech Stack",
      icon: Code,
      items: [
        "Frontend: React 18, Vite, Framer Motion, Tailwind CSS",
        "Backend: Node.js, Express, Nodemailer",
        "Language: TypeScript (Strict)",
        "Build: Esbuild (Server-side compilation)"
      ]
    },
    {
      title: "Core Architecture",
      icon: Server,
      content: "The application uses a hybrid architecture. The frontend is a Single Page Application (SPA) served via Vite, while the backend is an Express server configured with middleware for static file serving and custom API endpoints."
    },
    {
      title: "Student Enrollment System",
      icon: Mail,
      content: "Potential students register via a multi-step form. On submission, the data is validated and securely transmitted using SMTP (Nodemailer) to 'taican4real@gmail.com'.",
      action: "Requires SMTP configuration in .env"
    },
    {
      title: "AI Lesson Planner",
      icon: Sparkles,
      content: "A dedicated tool for educators to generate high-quality lesson plans and session notes using the Gemini 1.5 Flash model. Supports Markdown rendering, PDF export, and printing.",
      action: "Requires GEMINI_API_KEY in .env"
    }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-cream/20">
      <SEO 
        title="Project Documentation" 
        description="Technical documentation for the Kingsfold International Academy web portal." 
      />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-wine text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-red text-xs font-bold uppercase tracking-[0.5em] mb-4 block">Information Center</span>
            <h1 className="text-5xl md:text-7xl font-serif mb-6">Technical <span className="italic">Documentation</span></h1>
            <p className="text-lg text-cream/70 max-w-2xl leading-relaxed font-light">
              A comprehensive guide to the architecture, features, and configuration of the Kingsfold Academy portal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 border-r border-wine/5 pr-12 hidden lg:block">
              <div className="sticky top-40 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-wine/40">Quick Links</h3>
                  {sections.map((s) => (
                    <a key={s.title} href={`#${s.title.toLowerCase().replace(/ /g, '-')}`} className="flex items-center gap-2 text-sm text-wine-dark hover:text-red transition-all group">
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {s.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Docs Content */}
            <div className="lg:col-span-3 space-y-24">
              {sections.map((section, idx) => (
                <motion.div 
                  key={section.title}
                  id={section.title.toLowerCase().replace(/ /g, '-')}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-10 md:p-16 border border-wine/5 shadow-sm"
                >
                  <div className="w-14 h-14 bg-wine/5 text-wine flex items-center justify-center rounded-none mb-8">
                    <section.icon size={28} />
                  </div>
                  <h2 className="text-3xl font-serif text-wine mb-6">{section.title}</h2>
                  {section.content && <p className="text-gray-600 leading-relaxed text-lg mb-8">{section.content}</p>}
                  {section.items && (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                          <div className="w-1.5 h-1.5 bg-red"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.action && (
                    <div className="mt-8 p-4 bg-cream/30 border-l-4 border-red text-[11px] font-bold uppercase tracking-widest text-wine flex items-center gap-3">
                      <Terminal size={16} /> {section.action}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Directory Structure */}
              <motion.div 
                id="directory-structure"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-wine-dark p-10 md:p-16 text-white overflow-x-auto"
              >
                <div className="flex items-center gap-4 mb-8">
                  <FileText className="text-red" />
                  <h2 className="text-3xl font-serif">Directory Structure</h2>
                </div>
                <pre className="text-xs md:text-sm font-mono text-cream/70 leading-relaxed whitespace-pre">
                  {`├── src
│   ├── components      # Reusable UI components
│   ├── pages           # Main page views
│   ├── lib             # Utilities & shared logic
│   ├── App.tsx         # Routing & state
│   └── main.tsx        # Entry point
├── public              # Static assets
├── server.ts           # Express server logic
├── README.md           # Project documentation
├── package.json        # Dependencies & scripts
└── .env.example        # Environment template`}
                </pre>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-cream text-center border-t border-wine/5">
        <h3 className="text-wine font-serif text-3xl mb-4">Questions or Contributions?</h3>
        <p className="text-gray-500 mb-8">Contact the technical administrator by mailing 'taican4real@gmail.com'</p>
      </section>
    </div>
  );
};

export default DocumentationPage;
