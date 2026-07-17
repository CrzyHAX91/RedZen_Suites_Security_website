import React, { useRef } from 'react';
import { Compass, ShieldCheck, Zap, Leaf } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../LanguageContext';


export default function Hero() {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the hero section for premium parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Calculate subtle parallax translations (Y axis) for distinct visual layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 35]);
  const frameY = useTransform(scrollYProgress, [0, 1], [0, 10]);
  
  // Luxury scroll-linked opacity dissolve
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Luxury staggered entrance variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1] // Custom easeOutExpo for high-end premium timing
      }
    }
  };

  // Architectural Grid Line Variants
  const lineHorizontalVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }
    }
  };

  const lineVerticalVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }
    }
  };

  // Breath glow variant
  const glowVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 2.5, ease: "easeOut" }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center bg-zen-950 pt-20 overflow-hidden text-white"
    >
      
      {/* Background Elements - Crimson glow accents */}
      <motion.div 
        style={{ y: backgroundY }}
        variants={glowVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.06),transparent_50%)] pointer-events-none" 
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 120]) }}
        variants={glowVariants}
        initial="hidden"
        animate="visible"
        className="absolute -left-10 bottom-0 w-96 h-96 rounded-full bg-crimson-900/5 blur-[120px] z-0 pointer-events-none" 
      />
      
      {/* Structural Frame Lines (Animated) */}
      <motion.div 
        variants={lineHorizontalVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-x-0 top-0 h-[1px] bg-crimson-900/10 origin-left" 
      />
      <motion.div 
        variants={lineVerticalVariants}
        initial="hidden"
        animate="visible"
        className="absolute left-1/4 inset-y-0 w-[1px] bg-crimson-900/10 origin-top hidden lg:block pointer-events-none" 
      />
      <motion.div 
        variants={lineVerticalVariants}
        initial="hidden"
        animate="visible"
        className="absolute right-1/4 inset-y-0 w-[1px] bg-crimson-900/10 origin-bottom hidden lg:block pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text block */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: textY, opacity: contentOpacity }}
            className="lg:col-span-7 flex flex-col justify-center space-y-8"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-crimson-950/30 border border-crimson-900/30 rounded-full px-3 py-1 w-fit"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-crimson-500 animate-pulse" />
              <span className="text-[10px] tracking-[0.25em] text-crimson-400 uppercase font-sans font-bold">
                {language === 'nl' ? 'Luxe Wellness • Duurzaam Verschil' : 'Luxury Wellness • Sustainable Impact'}
              </span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                variants={itemVariants}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-light leading-[1.15] tracking-tight"
              >
                {language === 'nl' ? (
                  <>Waar Luxe en <br /><span className="italic font-normal text-crimson-500">Eco-Intelligentie</span> Samenkomen</>
                ) : (
                  <>Where Luxury and <br /><span className="italic font-normal text-crimson-500">Eco-Intelligence</span> Harmonize</>
                )}
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="font-sans text-sm sm:text-base text-zen-300 font-light max-w-xl leading-relaxed"
              >
                {language === 'nl' 
                  ? "RedZen Suites levert hoogwaardige privé-wellnessruimtes aangedreven door 100% groene energie. Ontdek op maat gemaakte Finse sauna's, infrarood thermotherapie en intelligente klimaatbeheersing, ontwikkeld door Dustin Gunzel ter ondersteuning van zowel diep biologisch herstel als de lokale economie."
                  : "RedZen Suites delivers high-end private wellness spaces powered by 100% green energy. Discover bespoke Finnish saunas, infrared thermotherapy, and intelligent climate control, engineered by Dustin Gunzel to support both deep biological recovery and the local economy."}
              </motion.p>
            </div>

            {/* Grid of Micro-benefits */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
            >
              <div className="flex items-start space-x-2 text-xs">
                <Leaf size={14} className="text-emerald-400 mt-0.5" />
                <span className="text-zen-300 font-light">
                  <strong className="text-white font-semibold">
                    {language === 'nl' ? '100% Groene Energie:' : '100% Green Energy:'}
                  </strong>{' '}
                  {language === 'nl' 
                    ? 'Aangedreven door premium zonnepanelen & hybride warmtepompen.' 
                    : 'Powered by premium solar panels & hybrid ambient-air heat pumps.'}
                </span>
              </div>
              <div className="flex items-start space-x-2 text-xs">
                <Zap size={14} className="text-crimson-500 mt-0.5" />
                <span className="text-zen-300 font-light">
                  <strong className="text-white font-semibold">
                    {language === 'nl' ? 'Contactloze Toegang:' : 'Contactless Access:'}
                  </strong>{' '}
                  {language === 'nl' 
                    ? 'Direct geautomatiseerd inchecken en eigen slimme sleutels.' 
                    : 'Instant automated check-in and private smart key codes.'}
                </span>
              </div>
            </motion.div>

            {/* Custom Privacy/Google Drive Selling Point */}
            <motion.div 
              variants={itemVariants}
              className="flex items-start space-x-3 bg-crimson-950/10 border border-crimson-900/10 rounded-sm p-4 max-w-lg shadow-inner"
            >
              <div className="p-2 bg-crimson-950/40 border border-crimson-900/20 rounded text-crimson-400 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-sans font-bold text-crimson-400 tracking-wider uppercase">
                  {language === 'nl' ? 'AVG & Zero-Database Opslag' : 'GDPR & Zero-Database Storage'}
                </h4>
                <p className="text-xs text-zen-400 leading-relaxed mt-1">
                  {language === 'nl'
                    ? 'Koppel uw persoonlijke Google Drive om 100% digitale zeggenschap over uw reisdossiers te claimen. Wij schrijven bestanden rechtstreeks naar uw cloudopslag, waardoor er geen spoor achterblijft op openbare databases.'
                    : 'Connect your personal Google Drive to claim 100% digital sovereignty over your travel records. We write files directly to your cloud storage, leaving zero traces on public databases.'}
                </p>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 items-center"
            >
              <button
                onClick={() => scrollToSection('suites')}
                className="px-6 py-3 border border-crimson-600 bg-crimson-600 text-white text-xs uppercase tracking-widest font-sans font-bold hover:bg-transparent hover:text-crimson-500 transition-all cursor-pointer active:scale-95 flex items-center space-x-2 rounded-sm shadow-md"
              >
                <Compass size={14} />
                <span>{language === 'nl' ? 'Ontdek Privé Suites' : 'Discover Private Suites'}</span>
              </button>
              
              <button
                onClick={() => scrollToSection('modeler')}
                className="px-6 py-3 border border-zen-800 hover:border-crimson-600 text-zen-200 text-xs uppercase tracking-widest font-sans font-semibold transition-all cursor-pointer active:scale-95 rounded-sm"
              >
                {language === 'nl' ? 'Simuleer Economie' : 'Simulate Economy'}
              </button>
            </motion.div>
          </motion.div>

          {/* Right Image Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            style={{ y: imageY, opacity: contentOpacity }}
            className="lg:col-span-5 relative"
          >
            {/* Architectural Border Frame */}
            <motion.div 
              style={{ y: frameY }}
              className="absolute -inset-2 border border-crimson-900/15 rounded-sm pointer-events-none" 
            />
            
            {/* Main Image Container */}
            <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden border border-crimson-950/30 shadow-2xl rounded-sm">
              <img 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000" 
                alt="Sustainable Finnish Eco-Sauna RedZen" 
                className="w-full h-full object-cover transition-all duration-1000 ease-in-out scale-105 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zen-950 via-transparent to-transparent opacity-85" />
              
              {/* Overlay Stat Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-zen-950/95 backdrop-blur-md border border-crimson-950/40 p-5 rounded-sm shadow-xl">
                <p className="text-[10px] tracking-widest text-crimson-500 uppercase font-sans font-bold">
                  {language === 'nl' ? 'Geplande Locatie' : 'Planned Location'}
                </p>
                <h3 className="font-serif text-lg text-white mt-1">Koningsbeltweg 74D</h3>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-crimson-900/10">
                  <span className="text-[10px] text-zen-400 uppercase font-sans">
                    {language === 'nl' ? 'Almere, Nederland' : 'Almere, Netherlands'}
                  </span>
                  <span className="text-xs font-display font-medium text-crimson-400">
                    {language === 'nl' ? '€180 / 2 Uur' : '€180 / 2 Hours'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
