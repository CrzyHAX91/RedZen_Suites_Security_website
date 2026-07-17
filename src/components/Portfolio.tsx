import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data';
import { useLanguage } from '../LanguageContext';
import { Sparkles, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Portfolio() {
  const { locale, t, tData } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = [
    { id: 'All', label: t('portfolio.cat.all') },
    { id: 'Interior', label: t('portfolio.cat.interior') },
    { id: 'Technology', label: t('portfolio.cat.tech') },
    { id: 'Wellness', label: t('portfolio.cat.wellness') },
    { id: 'Zen', label: t('portfolio.cat.zen') }
  ];

  const galleryList = tData(GALLERY_ITEMS) as any[];
  
  const filteredItems = activeCategory === 'All' 
    ? galleryList 
    : galleryList.filter(item => item.category === activeCategory);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'Interior': return t('portfolio.cat.interior');
      case 'Technology': return t('portfolio.cat.tech');
      case 'Wellness': return t('portfolio.cat.wellness');
      case 'Zen': return t('portfolio.cat.zen');
      default: return cat;
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-zen-950 border-t border-crimson-950/20 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.02),transparent_40%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-crimson-500">
            <Sparkles size={14} />
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold">{t('portfolio.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
            {t('portfolio.heading')}
          </h2>
          <div className="w-12 h-[1px] bg-crimson-600 mx-auto" />
          <p className="font-sans text-xs sm:text-sm text-zen-300 font-light leading-relaxed">
            {t('portfolio.desc')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-sans font-bold border rounded-sm transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-crimson-600 text-white border-crimson-600'
                  : 'bg-transparent text-zen-400 border-crimson-950/25 hover:text-white hover:border-crimson-900/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Bento-Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="group relative aspect-square bg-neutral-900 overflow-hidden border border-crimson-950/15 rounded-sm shadow-lg hover:border-crimson-600/30 transition-colors"
              >
                {/* Background image */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                />

                {/* Elegant overlay card on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-zen-950 via-zen-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6">
                  <span className="text-[9px] font-sans font-bold text-crimson-500 uppercase tracking-widest">
                    {item.location}
                  </span>
                  <h4 className="font-serif text-lg text-white mt-1">
                    {item.title}
                  </h4>
                  <div className="w-8 h-[1px] bg-crimson-600 my-2" />
                  <p className="text-[10px] font-sans text-zen-400 uppercase tracking-wider">
                    {t('portfolio.prefix_cat')}{getCategoryLabel(item.category)}
                  </p>
                </div>

                {/* Corner quick view pill */}
                <div className="absolute top-3 right-3 p-1.5 bg-zen-950/80 border border-crimson-950/20 rounded-full text-crimson-400 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye size={12} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
