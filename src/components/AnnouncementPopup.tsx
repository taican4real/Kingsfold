import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function AnnouncementPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenGlobalPopup');
    
    if (!hasSeenPopup) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenGlobalPopup', 'true');
  };

  // Cloudinary link for embedding
  const imageUrl = "https://res.cloudinary.com/diiwcoarc/image/upload/v1779880778/www_zidm8s.jpg";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-wine-dark/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white max-w-2xl w-full shadow-2xl overflow-hidden rounded-lg group"
          >
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X size={20} />
            </button>
            
            <Link 
              to="/admissions" 
              onClick={closePopup}
              className="block relative cursor-pointer overflow-hidden"
            >
              <div className="flex items-center justify-center bg-gray-100 min-h-[300px]">
                <img 
                  src={imageUrl} 
                  alt="Announcement" 
                  className="w-full h-auto max-h-[80vh] object-contain block transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1000";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-wine/0 group-hover:bg-wine/5 transition-colors duration-300" />
            </Link>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
