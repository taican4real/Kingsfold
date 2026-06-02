import React, { useState } from 'react';
import { Maximize2, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, getDirectDriveLink } from '../lib/utils';
import { useCMS } from '../hooks/useCMS';
import SEO from '../components/SEO';

const CATEGORIES = ['All', 'Campus', 'Academics', 'Sports', 'Events'];

const DEFAULT_GALLERYPAGE = {
  heroTitle: "Media Gallery",
  heroSubtitle: "Visual highlights from Kingsfold International Academy.",
};

const IMAGES = [
  { id: 1, category: 'Campus', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop' },
  { id: 2, category: 'Academics', url: 'https://images.unsplash.com/photo-1577896850162-817ab06b1eac?q=80&w=1000&auto=format&fit=crop' },
  { id: 3, category: 'Sports', url: 'https://lh3.googleusercontent.com/d/1s35EKkkymSNk9VJDoImgxzWvmorPlNQf' },
  { id: 4, category: 'Events', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop' },
  { id: 5, category: 'Campus', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000&auto=format&fit=crop' },
  { id: 6, category: 'Academics', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop' },
  { id: 7, category: 'Sports', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000&auto=format&fit=crop' },
  { id: 8, category: 'Events', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop' },
];

export default function GalleryPage() {
  const { data: gallery, loading } = useCMS('gallery', DEFAULT_GALLERYPAGE);
  const [activeTab, setActiveTab] = useState('All');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream"><Loader className="animate-spin text-wine" size={40} /></div>;
  }

  const filtered = activeTab === 'All' ? IMAGES : IMAGES.filter(img => img.category === activeTab);

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Kingsfold International Academy Media Gallery",
    "description": gallery.heroSubtitle || "A photographic showcase of academic life, campus facilities, sporting events, and student achievements at Kingsfold International Academy.",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Kingsfold International Academy",
      "logo": "https://lh3.googleusercontent.com/d/1iUPYl60tbSKCWv3GSBhjpTyD24GYerhE"
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <SEO 
        title={`${gallery.heroTitle} | Kingsfold Academy`}
        description={gallery.heroSubtitle}
        keywords="school gallery, school photos, Kingsfold campus images, student life boarding photos, Lagos school environment"
        schema={gallerySchema}
      />
      <div className="py-24 bg-wine-dark text-center px-4">
        <h1 className="text-5xl md:text-6xl font-serif text-cream mb-4 uppercase">{gallery.heroTitle}</h1>
        <p className="text-cream/80 max-w-2xl mx-auto">{gallery.heroSubtitle}</p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-20 w-full">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "relative px-6 py-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 overflow-hidden",
                activeTab === cat ? "text-white" : "text-wine-dark hover:text-wine bg-transparent"
              )}
            >
              {activeTab === cat && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-wine -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Masonry Grid Simulation */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((img) => (
              <motion.div 
                layout
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative group overflow-hidden aspect-square sm:aspect-auto sm:h-64 cursor-pointer bg-gray-200"
              >
                <img src={getDirectDriveLink(img.url) || null} alt={img.category} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-wine-dark/0 group-hover:bg-wine-dark/40 transition-colors flex items-center justify-center">
                  <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300" size={32} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
