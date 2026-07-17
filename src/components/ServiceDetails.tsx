import React, { useState } from 'react';
import { Service } from '../types';
import { SERVICES } from '../data';
import { useLanguage } from '../LanguageContext';
import { 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Users, 
  Target, 
  Cpu, 
  Clock, 
  Heart, 
  Shield, 
  ArrowRight, 
  BookOpen, 
  Leaf, 
  Activity, 
  Sparkle,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServiceDetailsProps {
  onSelectService: (serviceId: string, serviceTitle: string) => void;
}

export default function ServiceDetails({ onSelectService }: ServiceDetailsProps) {
  const { t, tData } = useLanguage();
  const services = tData(SERVICES);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const selectedService = services.find(s => s.id === selectedServiceId);

  // Return helper icons based on service id for elegant accents
  const getServiceIcon = (id: string) => {
    switch(id) {
      case 'thermal-hydrotherapy':
        return <Activity size={18} className="text-crimson-500" />;
      case 'spa-engineering':
        return <Cpu size={18} className="text-crimson-500" />;
      case 'bio-gastronomy':
        return <Leaf size={18} className="text-crimson-500" />;
      case 'holistic-massages':
        return <Heart size={18} className="text-crimson-500" />;
      default:
        return <Sparkles size={18} className="text-crimson-500" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-zen-950 border-t border-crimson-950/20 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.03),transparent_40%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <AnimatePresence mode="wait">
          {!selectedServiceId ? (
            /* ================= SERVICES INDEX VIEW ================= */
            <motion.div
              key="services-index"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-16"
            >
              {/* Heading */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-center space-x-2 text-crimson-500">
                  <Sparkles size={14} />
                  <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold">{t('services.badge')}</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
                  {t('services.heading')}
                </h2>
                <div className="w-12 h-[1px] bg-crimson-600 mx-auto" />
                <p className="font-sans text-xs sm:text-sm text-zen-300 font-light leading-relaxed">
                  {t('services.desc')}
                </p>
              </div>

              {/* Grid of Service Teasers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.7, delay: index * 0.08 }}
                    onClick={() => setSelectedServiceId(service.id)}
                    className="group flex flex-col bg-zen-900/40 border border-crimson-950/20 hover:border-crimson-600/45 transition-all duration-500 rounded-sm overflow-hidden shadow-xl cursor-pointer"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[16/9] bg-neutral-950 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zen-950/80 via-zen-950/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-zen-950/90 border border-crimson-950/40 px-3 py-1.5 rounded-sm">
                        {getServiceIcon(service.id)}
                        <span className="text-[10px] tracking-widest uppercase font-sans font-bold text-white">
                          {service.priceOrQuote}
                        </span>
                      </div>
                    </div>

                    {/* Text Area */}
                    <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-500 block">
                          {service.subtitle}
                        </span>
                        <h3 className="font-serif text-xl text-white group-hover:text-crimson-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="font-sans text-xs text-zen-300 font-light line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-crimson-900/10 flex items-center justify-between text-xs text-crimson-400 group-hover:text-white transition-colors">
                        <span className="font-sans font-bold uppercase tracking-wider text-[10px]">
                          {t('services.btn.view')}
                        </span>
                        <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ================= DEDICATED DETAIL PAGE VIEW ================= */
            <motion.div
              key="service-detail-page"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              {/* Back Button */}
              <button
                onClick={() => setSelectedServiceId(null)}
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-sans font-bold text-zen-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{t('services.btn.back')}</span>
              </button>

              {selectedService && (
                <div className="space-y-12">
                  
                  {/* Hero Header Area */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                      <div className="flex items-center space-x-2.5">
                        <span className="p-2 bg-crimson-950/40 border border-crimson-900/25 rounded-sm">
                          {getServiceIcon(selectedService.id)}
                        </span>
                        <span className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400">
                          {selectedService.subtitle}
                        </span>
                      </div>
                      
                      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-light leading-tight">
                        {selectedService.title}
                      </h1>

                      <p className="font-sans text-xs sm:text-sm text-zen-200 font-light leading-relaxed">
                        {selectedService.description}
                      </p>

                      <div className="p-4 bg-crimson-950/10 border border-crimson-900/10 rounded-sm flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs font-sans text-zen-300">
                          <Clock size={14} className="text-crimson-500" />
                          <span>{t('services.rates')}</span>
                          <strong className="text-white ml-1">{selectedService.priceOrQuote}</strong>
                        </div>
                        <span className="text-[9px] bg-crimson-600/15 text-crimson-400 font-mono tracking-wider uppercase px-2 py-0.5 rounded-sm">
                          {t('services.secure_delivery')}
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                      <div className="absolute -inset-2 border border-crimson-900/15 rounded-sm pointer-events-none" />
                      <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden border border-crimson-950/30 rounded-sm shadow-2xl">
                        <img 
                          src={selectedService.image} 
                          alt={selectedService.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-6 border-t border-crimson-900/10">
                    
                    {/* Left Column - Scope & Methodology */}
                    <div className="lg:col-span-7 space-y-10">
                      
                      {/* Scope of Service */}
                      <div className="space-y-4">
                        <h3 className="text-xs tracking-widest uppercase font-sans font-bold text-crimson-400 flex items-center gap-2">
                          <BookOpen size={14} />
                          <span>{t('services.scope')}</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedService.scope.map((item, i) => (
                            <div 
                              key={i} 
                              className="bg-zen-900/30 border border-crimson-950/15 p-4 rounded-sm flex items-start gap-3 hover:border-crimson-900/30 transition-colors"
                            >
                              <span className="p-1 bg-crimson-600/10 text-crimson-500 rounded-sm shrink-0 mt-0.5">
                                <Check size={10} />
                              </span>
                              <span className="font-sans text-xs text-zen-200 leading-relaxed font-light">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technical Methodology */}
                      <div className="space-y-4 bg-crimson-950/5 border border-crimson-900/10 p-6 sm:p-8 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-crimson-600/5 rounded-full blur-2xl pointer-events-none" />
                        <h3 className="text-xs tracking-widest uppercase font-sans font-bold text-crimson-400 flex items-center gap-2">
                          <Cpu size={14} />
                          <span>{t('services.methodology')}</span>
                        </h3>
                        <p className="font-sans text-xs sm:text-sm text-zen-300 leading-relaxed font-light">
                          {selectedService.methodology}
                        </p>
                        <div className="pt-2 flex items-center space-x-2 text-[10px] text-emerald-400/80 font-mono">
                          <Leaf size={12} />
                          <span>{t('services.grid_energy')}</span>
                        </div>
                      </div>

                    </div>

                    {/* Right Column - Key Features, Benefits & Target Audience */}
                    <div className="lg:col-span-5 space-y-10">
                      
                      {/* Key Features */}
                      <div className="space-y-4">
                        <h4 className="text-xs tracking-widest uppercase font-sans font-bold text-crimson-400 flex items-center gap-2">
                          <Sparkles size={14} />
                          <span>{t('services.features')}</span>
                        </h4>
                        <div className="space-y-3">
                          {selectedService.keyFeatures.map((feat, i) => (
                            <div key={i} className="p-4 bg-zen-900/40 border border-crimson-950/20 rounded-sm">
                              <h5 className="font-serif text-sm text-white font-medium mb-1 flex items-center gap-2">
                                <Sparkle size={10} className="text-crimson-500 shrink-0" />
                                {feat.title}
                              </h5>
                              <p className="font-sans text-xs text-zen-400 font-light leading-relaxed">
                                {feat.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits & Recovery Impact */}
                      <div className="space-y-4">
                        <h4 className="text-xs tracking-widest uppercase font-sans font-bold text-crimson-400 flex items-center gap-2">
                          <Heart size={14} />
                          <span>{t('services.benefits')}</span>
                        </h4>
                        <ul className="space-y-2.5">
                          {selectedService.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-zen-300 font-light">
                              <span className="w-1.5 h-1.5 bg-crimson-500 rounded-full mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Target Audience */}
                      <div className="space-y-3 border-t border-crimson-900/10 pt-6">
                        <h4 className="text-xs tracking-widest uppercase font-sans font-bold text-crimson-400 flex items-center gap-2">
                          <Target size={14} />
                          <span>{t('services.audience')}</span>
                        </h4>
                        <p className="font-sans text-xs text-zen-300 font-light leading-relaxed bg-zen-900/20 p-4 border border-crimson-950/10 rounded-sm">
                          {selectedService.targetAudience}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Large CTA Banner */}
                  <div className="bg-zen-900/70 border border-crimson-600/30 p-6 sm:p-10 rounded-sm text-center space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-crimson-600/5 via-transparent to-crimson-600/5 pointer-events-none" />
                    <div className="max-w-xl mx-auto space-y-3">
                      <div className="w-12 h-12 border border-crimson-600/30 bg-crimson-950/40 rounded-full flex items-center justify-center mx-auto text-crimson-400">
                        <Calendar size={20} />
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-white font-medium">
                        {t('services.cta.title')}
                      </h3>
                      <p className="font-sans text-xs text-zen-300 font-light leading-relaxed">
                        {t('services.cta.desc')}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        onClick={() => onSelectService(selectedService.id, selectedService.title)}
                        className="w-full sm:w-auto px-8 py-3 bg-crimson-600 hover:bg-crimson-700 text-white text-xs uppercase tracking-widest font-sans font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shadow-lg rounded-sm"
                      >
                        <span>{selectedService.ctaText}</span>
                        <ArrowRight size={12} />
                      </button>
                      <button
                        onClick={() => setSelectedServiceId(null)}
                        className="w-full sm:w-auto px-6 py-3 border border-crimson-900/40 hover:border-crimson-600 text-zen-300 hover:text-white text-xs uppercase tracking-widest font-sans font-bold transition-all rounded-sm cursor-pointer"
                      >
                        {t('services.cta.other')}
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
