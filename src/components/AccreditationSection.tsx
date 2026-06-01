import React from 'react';
import { motion } from 'framer-motion';

const accreditationLogos = [
  "https://lh3.googleusercontent.com/d/11tUEzCGnrk7Cfndb4nn8t9HteW0cWGUN",
  "https://lh3.googleusercontent.com/d/12oOuYDnnGdmBFU0hR8GexO2f1KU7teT1",
  "https://lh3.googleusercontent.com/d/1uIkU8Y92w6BWcgVzTFz_EWLhyrFt-2hK",
  "https://lh3.googleusercontent.com/d/18nei9MAaMdEQNXOSQd1cdtdJdV0thf7W",
  "https://lh3.googleusercontent.com/d/1JaGD1TXjTvU8BFqgI7OljDo0mEJT8yW5",
];

interface AccreditationSectionProps {
  title?: string;
  subtitle?: string;
  logos?: string[];
}

export default function AccreditationSection({ 
  title = "Our Affiliate and Accreditation",
  subtitle = "Global Standards",
  logos = accreditationLogos
}: AccreditationSectionProps) {
  return (
    <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 mt-[20px]">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-[1px] bg-red/30"></div>
            <span className="text-gray-400 font-sans text-[10px] font-bold tracking-[0.3em] uppercase">{subtitle}</span>
            <div className="w-8 h-[1px] bg-red/30"></div>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-wine text-center">{title}</h2>
        </div>

        <div className="relative mt-8">
          {/* Gradients to hide the edges for a smooth loop feel */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrolling Container */}
          <div className="flex overflow-hidden group focus-within:pause">
            <motion.div 
              className="flex gap-16 md:gap-32 py-4 items-center shrink-0 group-hover:[animation-play-state:paused]"
              animate={{ 
                x: [0, -100 * logos.length - (32 * logos.length)] 
              }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear"
                }
              }}
            >
              {/* Double the array for infinite scroll effect */}
              {[...logos, ...logos].map((logo, index) => (
                <div 
                  key={index} 
                  className="h-16 md:h-20 w-auto shrink-0 transition-all duration-500 hover:scale-110"
                >
                  <img 
                    src={logo} 
                    alt={`Accreditation and affiliate partner logo ${index % logos.length + 1}`} 
                    className="h-full w-auto object-contain transition-all cursor-default"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
