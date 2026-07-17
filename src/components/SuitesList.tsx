import React from 'react';
import { Suite } from '../types';
import { SUITES } from '../data';
import { ArrowRight, BedDouble, Maximize, Users, MapPin, Sparkles, Clock, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';


interface SuitesListProps {
  onSelectSuite: (suiteId: string) => void;
}

export default function SuitesList({ onSelectSuite }: SuitesListProps) {
  const { t, tData } = useLanguage();
  const suites = tData(SUITES);

  return (
    <section id="suites" className="py-24 bg-zen-950 border-t border-crimson-950/20 text-white relative">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.03),transparent_40%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-crimson-500">
            <Sparkles size={14} />
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold">{t('suites.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
            {t('suites.heading')}
          </h2>
          <div className="w-12 h-[1px] bg-crimson-600 mx-auto" />
          <p className="font-sans text-xs sm:text-sm text-zen-300 font-light leading-relaxed">
            {t('suites.desc')}
          </p>
        </div>

        {/* Suites Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {suites.map((suite, index) => (
            <motion.div
              key={suite.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group flex flex-col bg-zen-900/40 border border-crimson-950/20 hover:border-crimson-600/30 transition-all duration-500 rounded-sm overflow-hidden shadow-xl"
            >
              
              {/* Image Container with Hover Zoom */}
              <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden">
                <img 
                  src={suite.image} 
                  alt={suite.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Location Tag */}
                <div className="absolute top-4 left-4 bg-zen-950/90 border border-crimson-950/40 px-3 py-1 text-[10px] tracking-widest uppercase font-sans font-semibold flex items-center space-x-1 text-crimson-400">
                  <MapPin size={10} className="text-crimson-500" />
                  <span>{suite.tagline.split('•')[0].trim()}</span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 bg-crimson-600 text-white font-display font-bold text-xs tracking-wider px-3 py-1.5 shadow-lg">
                  {suite.price} {t('suites.duration')}
                </div>
              </div>

              {/* Content Panel */}
              <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase font-sans font-bold text-crimson-500">
                        {suite.tagline.split('•')[1]?.trim() || 'Private Suite'}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-crimson-400 transition-colors mt-1">
                        {suite.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 bg-crimson-950/30 border border-crimson-900/10 rounded-sm px-2 py-0.5 text-[9px] text-crimson-400 font-mono">
                      <Clock size={10} />
                      <span>{t('suites.self_service')}</span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-zen-300 font-light leading-relaxed">
                    {suite.description}
                  </p>

                  {/* Core specs list */}
                  <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-crimson-900/10 text-[11px] font-sans text-zen-200 font-medium">
                    <div className="flex items-center space-x-2">
                      <Maximize size={12} className="text-crimson-500" />
                      <span>{suite.size} Suite</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={12} className="text-crimson-500" />
                      <span>{t('suites.guests').replace('{guests}', suite.guests.toString())}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BedDouble size={12} className="text-crimson-500" />
                      <span className="truncate">{suite.bed}</span>
                    </div>
                  </div>

                  {/* Amenities Pills */}
                  <div className="space-y-2">
                    <span className="text-[9px] tracking-widest uppercase font-sans font-bold text-crimson-400/50">{t('suites.amenities_header')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {suite.amenities.map((amenity, i) => (
                        <span 
                          key={i} 
                          className="bg-crimson-950/10 border border-crimson-900/10 text-zen-300 text-[9px] font-sans px-2.5 py-1 rounded-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* View Detail & Call to Action */}
                <div className="pt-4 border-t border-crimson-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-[10px] font-sans">
                    <span className="text-crimson-400/40 uppercase font-bold block">{t('suites.view')}</span>
                    <span className="text-zen-400 font-light italic mt-0.5 block">{suite.view}</span>
                  </div>

                  <button
                    onClick={() => onSelectSuite(suite.id)}
                    className="sm:w-auto w-full px-5 py-2.5 border border-crimson-600 hover:border-crimson-500 hover:bg-crimson-600/10 text-crimson-400 hover:text-white text-xs uppercase tracking-widest font-sans font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 rounded-sm"
                  >
                    <span>{t('suites.cta')}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
