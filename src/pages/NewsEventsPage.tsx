import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ArrowRight, Clock, MapPin, ChevronLeft, ChevronRight, Link as LinkIcon, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getDirectDriveLink } from '../lib/utils';
import { useCMS } from '../hooks/useCMS';
import SEO from '../components/SEO';

export const DEFAULT_NEWSEVENTSPAGE = {
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

export default function NewsEventsPage() {
  const { data: newsEvents, loading } = useCMS('newsevents', DEFAULT_NEWSEVENTSPAGE);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5)); // June 2026

  const news = (newsEvents && newsEvents.news) || DEFAULT_NEWSEVENTSPAGE.news;
  const events = (newsEvents && newsEvents.events) || DEFAULT_NEWSEVENTSPAGE.events;

  const daysLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const startOffset = firstDayOfMonth;
  
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const currentMonthStrLong = currentMonth.toLocaleString('default', { month: 'long' });
  const currentMonthStrShort = monthNames[month];

  // Dynamically select the first available event of the displayed month when data completes loading or the month is changed
  useEffect(() => {
    if (events && events.length > 0) {
      const firstEvent = events.find((e: any) => 
        e && String(e.month || '').trim().toUpperCase() === currentMonthStrShort.toUpperCase()
      );
      if (firstEvent) {
        setSelectedDate(Number(firstEvent.date));
      } else {
        setSelectedDate(null);
      }
    }
  }, [events, currentMonthStrShort]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream"><Loader className="animate-spin text-wine" size={40} /></div>;
  }

  const selectedEvent = events.find((e: any) => 
    e && 
    Number(e.date) === Number(selectedDate) && 
    String(e.month || '').trim().toUpperCase() === currentMonthStrShort.toUpperCase()
  );

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Kingsfold Academy News & Campus Blog",
    "description": "Stay updated with recent news, educational insights, athletic events, and calendar announcements from Kingsfold International Academy, Lagos.",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Kingsfold International Academy"
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <SEO 
        title={newsEvents.heroTitle || "News & Events"}
        description={newsEvents.heroSubtitle || "Keep up-to-date with current news feed, terms calendar, educational blogs, and announcements at Kingsfold International Academy."}
        keywords="school news, Kingsfold events, educational blog Lagos, Ikorodu boarding press"
        schema={newsSchema}
      />
      <div className="py-24 bg-wine text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif text-white mb-6 uppercase"
        >
          {newsEvents.heroTitle}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-cream/70 max-w-2xl mx-auto uppercase tracking-widest font-bold text-[11px]"
        >
          {newsEvents.heroSubtitle}
        </motion.p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-20 w-full">
        {/* Events & Calendar Section */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <span className="text-[#C1121F] font-sans text-xs font-bold tracking-[0.3em] uppercase block mb-4">Official Calendar</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[#6B0F1A]">Upcoming Engagements</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#6B0F1A] border-b border-[#6B0F1A] pb-1">
                Academic Year 2025/26
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Calendar UI */}
            <div className="lg:col-span-5 bg-white p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-serif text-2xl text-[#6B0F1A]">{currentMonthStrLong} {year}</h3>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 hover:bg-gray-50 transition-colors"><ChevronLeft size={20} /></button>
                  <button onClick={nextMonth} className="p-2 hover:bg-gray-50 transition-colors"><ChevronRight size={20} /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {daysLabels.map(day => (
                  <div key={day} className="text-center text-[10px] uppercase font-bold text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {/* Offset for start of month */}
                {Array.from({ length: startOffset }).map((_, i) => (
                  <div key={`offset-${i}`} className="aspect-square"></div>
                ))}
                
                {calendarDays.map(day => {
                  const matchesDateAndMonth = (e: any) => 
                    e && 
                    Number(e.date) === Number(day) && 
                    String(e.month || '').trim().toUpperCase() === currentMonthStrShort.toUpperCase();

                  const hasEvent = events.some((e: any) => 
                    matchesDateAndMonth(e) && 
                    (!e.year || Number(e.year) === year || Number(year) === 2026)
                  );
                  const mappedEvent = events.some(matchesDateAndMonth);
                  const isSelected = selectedDate === day;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      disabled={!mappedEvent}
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center text-sm relative transition-all duration-300",
                        mappedEvent ? "font-bold text-wine" : "text-gray-300 cursor-default",
                        isSelected ? "bg-wine text-white" : mappedEvent ? "hover:bg-cream" : "",
                      )}
                    >
                      {day}
                      {mappedEvent && !isSelected && (
                        <span className="absolute bottom-2 w-1 h-1 bg-[#C1121F] rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 ">
                    <div className="w-2 h-2 bg-[#C1121F] rounded-full"></div>
                    <span className="text-gray-500">School Event</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {selectedEvent ? (
                  <motion.div
                    key={selectedEvent.date}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-10 border border-gray-100 shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <span className="bg-red/10 text-red px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
                        {selectedEvent.type}
                      </span>
                      <div className="text-right">
                        <div className="text-4xl font-serif text-[#6B0F1A]">{selectedEvent.date}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedEvent.month} 2026</div>
                      </div>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-serif text-[#6B0F1A] mb-8 leading-tight">
                      {selectedEvent.title}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-wine">
                          <Clock size={20} />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Time</div>
                          <div className="text-sm font-medium">{selectedEvent.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-wine">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Venue</div>
                          <div className="text-sm font-medium">{selectedEvent.location}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 bg-[#6B0F1A] text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C1121F] transition-all flex items-center justify-center gap-3">
                        Register for Event <LinkIcon size={14} />
                      </button>
                      <button className="flex-1 bg-transparent border border-gray-200 text-[#1a1a1a] py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                        Add to Calendar
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-white/50 border border-dashed border-gray-200 p-20 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                    <CalendarIcon className="w-16 h-16 text-gray-200 mb-6" />
                    <h3 className="text-xl font-serif text-gray-400">Select a date to view events</h3>
                    <p className="text-gray-400 text-sm mt-2">Active event days are marked with a red dot.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section>
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[#C1121F] font-sans text-xs font-bold tracking-[0.3em] uppercase block mb-4">Inside the Academy</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#6B0F1A]">Latest News</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white group cursor-pointer border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-wine/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img src={getDirectDriveLink(item.img) || null} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-wine">
                      {item.date}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-serif text-2xl text-[#1a1a1a] mb-4 leading-tight group-hover:text-red transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed font-sans">{item.excerpt}</p>
                  <div className="flex items-center gap-3 text-red text-[10px] font-bold uppercase tracking-widest">
                    Read Full Story <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
