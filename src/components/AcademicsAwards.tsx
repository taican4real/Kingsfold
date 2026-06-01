import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AcademicsAwards() {
  return (
    <section className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-serif text-wine text-center mb-12 tracking-tight uppercase">
          Recent Awards and Achievements
        </h2>

        <div className="bg-white shadow-2xl overflow-hidden rounded-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side: IGCSE Results */}
            <div className="flex-1 bg-[#6B0F1A] p-8 md:p-12 relative text-white overflow-hidden">
              {/* Scroll Decoration Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full border-[20px] border-white/20 m-4"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-8 bg-wine-dark border border-white/20 flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" alt="UK Flag" className="w-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold tracking-wider">IGCSE JUNE 2021 SERIES</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center lg:items-start">
                  {/* Student Photo with Frame */}
                  <div className="relative shrink-0">
                     <div className="w-48 h-60 bg-cream relative p-1 border-4 border-dashed border-red/30">
                        <img 
                          src="https://images.unsplash.com/photo-1544717297-fa154da09f9d?q=80&w=2940&auto=format&fit=crop" 
                          alt="Praise Akinsola" 
                          className="w-full h-full object-cover grayscale-[20%] sepia-[10%]"
                        />
                     </div>
                     <div className="mt-4 text-center">
                        <p className="font-serif text-lg tracking-widest uppercase">Akinsola, Praise</p>
                     </div>
                  </div>

                  {/* Results Table */}
                  <div className="flex-1 w-full">
                    <div className="bg-cream/10 backdrop-blur-sm border border-white/10 p-6 rounded-sm">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="border-b border-white/20 text-[10px] uppercase tracking-widest font-bold">
                            <th className="pb-3 px-2">Syllabus Title</th>
                            <th className="pb-3 px-2 text-center">Result</th>
                            <th className="pb-3 px-2 text-right">% Mark</th>
                          </tr>
                        </thead>
                        <tbody className="font-medium">
                          {[
                            { subject: "PHYSICS", result: "A*(a*)", mark: "95" },
                            { subject: "CHEMISTRY", result: "A*(a*)", mark: "95" },
                            { subject: "MATHEMATICS", result: "A*(a*)", mark: "93" },
                            { subject: "BIOLOGY", result: "A*(a*)", mark: "92" },
                            { subject: "ENGLISH", result: "B(B)", mark: "72" },
                          ].map((row, i) => (
                            <tr key={i} className="border-b border-white/5 last:border-0">
                              <td className="py-3 px-2 text-white/90">• {row.subject}</td>
                              <td className="py-3 px-2 text-center text-cream">{row.result}</td>
                              <td className="py-3 px-2 text-right text-red font-bold">{row.mark}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-8 flex justify-between items-center opacity-60 grayscale brightness-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-cream/20"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">British Council</span>
                      </div>
                      <div className="text-[8px] uppercase tracking-tighter text-right">
                        University of Cambridge<br />International Examinations
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Cambridge Stats */}
            <div className="lg:w-[400px] bg-white p-8 md:p-10 border-l border-gray-100">
              <div className="space-y-8">
                <div>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">KINGSFOLD INTERNATIONAL ACADEMY | NG002</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">May 2021</p>
                   <h4 className="text-wine font-serif text-lg mt-4 leading-tight">Cambridge Lower Secondary Mathematics overview</h4>
                </div>

                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider mb-4 text-wine/80">Overall results</h5>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2 * 0.73} className="text-green-600" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-serif font-bold text-wine">4.4</span>
                         <span className="text-[8px] text-gray-400 uppercase">17 Learners</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-gray-400">
                       <span className="text-green-600 block mb-1">4.1 International average</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Number", score: 4.7, international: 4.1 },
                    { label: "Algebra", score: 4.4, international: 4.0 },
                    { label: "Geometry & Measure", score: 4.1, international: 4.1 },
                    { label: "Handling data", score: 4.1, international: 4.1 },
                  ].map((strand, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                        <span className="text-gray-500">{strand.label}</span>
                        <span className="text-wine">{strand.score}</span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-sm relative overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(strand.score / 6) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full bg-green-700" 
                        />
                        {/* International marker */}
                        <div 
                          className="absolute top-0 bottom-0 w-[2px] bg-wine z-10" 
                          style={{ left: `${(strand.international / 6) * 100}%` }}
                        >
                           <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white border border-wine rounded-full" />
                        </div>
                      </div>
                      <div className="text-[7px] text-gray-400 mt-1 flex justify-between">
                         <span>0</span>
                         <span>{strand.international} (Intl Avg)</span>
                         <span>6.0</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Captions Below Graphic */}
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50/50">
             <div className="flex-1 p-6 text-center">
                <h5 className="font-serif text-lg text-wine mb-1">Praise Akinsola Cambridge Rating</h5>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Recognition of Praise Akinsola by Cambridge</p>
             </div>
             <div className="flex-1 p-6 text-center">
                <h5 className="font-serif text-lg text-wine mb-1">Cambridge Checkpoint Rating</h5>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Lower Secondary Mathematics Recognition</p>
             </div>
          </div>

          {/* Footer Call to Action */}
          <div className="bg-[#6B0F1A] p-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
             <p className="text-cream text-lg font-serif">
               Celebrate with us on these laudable achievements and awards
             </p>
             <button className="bg-white text-wine px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-cream transition-colors flex items-center gap-2">
                Read More <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}
