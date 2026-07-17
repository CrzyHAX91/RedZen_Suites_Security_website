import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from './firebase';
import { createInquiryFile } from './googleDrive';
import { Inquiry } from './types';
import { useLanguage } from './LanguageContext';

// Component Imports
import Header from './components/Header';
import Hero from './components/Hero';
import SuitesList from './components/SuitesList';
import ServiceDetails from './components/ServiceDetails';
import BlogJournal from './components/BlogJournal';
import ModelerDashboard from './components/ModelerDashboard';
import Portfolio from './components/Portfolio';
import InquiryForm from './components/InquiryForm';
import ClientDashboard from './components/ClientDashboard';

// Icon and Animation Imports
import { Compass, Shield, ArrowUp, Calendar, Heart, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { language, t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeSection, setActiveSection] = useState('suites');
  const [preselectedSuiteId, setPreselectedSuiteId] = useState<string>('');
  const [preselectedMessage, setPreselectedMessage] = useState<string>('');
  
  // Trigger to force reloading Google Drive inquiries after new form submission
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize Auth state on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Monitor window scroll to show "back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err) {
      console.error('Sign in process failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
    } catch (err) {
      console.error('Sign out process failed:', err);
    }
  };

  const handleSelectSuite = (suiteId: string) => {
    setPreselectedSuiteId(suiteId);
    setActiveSection('inquiry');
    
    // Smooth scroll to inquiry form
    const formElement = document.getElementById('inquiry');
    if (formElement) {
      const headerOffset = 80;
      const elementPosition = formElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSelectService = (serviceId: string, serviceTitle: string) => {
    if (serviceId === 'thermal-hydrotherapy') {
      setPreselectedSuiteId('crimson-zen-almere');
    } else {
      setPreselectedSuiteId('');
    }
    
    setPreselectedMessage(
      language === 'nl'
        ? `Aanvraag voor gespecialiseerde service: "${serviceTitle}".\n\nIk ben geïnteresseerd in meer informatie over de omvang, methodologie en beschikbaarheid voor deze premium service.`
        : `Request for specialized service: "${serviceTitle}".\n\nI am interested in receiving more information regarding the scope, methodology, and availability of this premium service.`
    );
    
    setActiveSection('inquiry');
    
    // Smooth scroll to inquiry form
    const formElement = document.getElementById('inquiry');
    if (formElement) {
      const headerOffset = 80;
      const elementPosition = formElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleInquirySubmit = async (inquiryData: Omit<Inquiry, 'createdAt' | 'status'>): Promise<string> => {
    if (!accessToken) {
      throw new Error(language === 'nl' ? "Autorisatietoken ontbreekt. Log opnieuw in." : "Authorization token missing. Please sign in again.");
    }

    const fullInquiry: Inquiry = {
      ...inquiryData,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Save file to Google Drive
    const fileId = await createInquiryFile(accessToken, fullInquiry);
    
    // Trigger dashboard refresh to instantly display the newly added item
    setRefreshTrigger(prev => prev + 1);

    return fileId;
  };

  return (
    <div className="min-h-screen bg-zen-950 text-white font-sans selection:bg-crimson-600 selection:text-white overflow-x-hidden antialiased">
      
      {/* Header Navigation */}
      <Header 
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        isLoggingIn={isLoggingIn}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Sections */}
      <main className="pb-16">
        
        {/* Luxury Hero Banner */}
        <Hero />

        {/* Suites Catalog */}
        <SuitesList onSelectSuite={handleSelectSuite} />

        {/* Specialized Service Details */}
        <ServiceDetails onSelectService={handleSelectService} />

        {/* Blog & Insights Journal */}
        <BlogJournal />

        {/* Eco-Economic Modeler Dashboard */}
        <ModelerDashboard />

        {/* Sustainable Tech Portfolio Showcase */}
        <Portfolio />

        {/* Booking & Inquiry Form */}
        <InquiryForm 
          user={user}
          accessToken={accessToken}
          onSignIn={handleSignIn}
          onSubmitInquiry={handleInquirySubmit}
          preselectedSuiteId={preselectedSuiteId}
          onClearPreselectedSuite={() => setPreselectedSuiteId('')}
          preselectedMessage={preselectedMessage}
          onClearPreselectedMessage={() => setPreselectedMessage('')}
        />

        {/* Client Portal (Google Drive Synced Guest History) */}
        {user && accessToken && (
          <ClientDashboard 
            accessToken={accessToken}
            refreshTrigger={refreshTrigger}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
          />
        )}

      </main>

      {/* Luxury Brand Footer */}
      <footer className="bg-zen-950 border-t border-crimson-950/20 text-zen-400 py-16 relative z-10 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom,rgba(220,38,38,0.01),transparent_30%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-crimson-900/10 pb-12 mb-12">
            
            {/* Branding Column */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border border-crimson-600 flex items-center justify-center bg-zen-950">
                  <span className="font-display font-bold text-sm text-crimson-500 tracking-widest">R</span>
                </div>
                <div>
                  <h2 className="font-display font-bold text-xs tracking-[0.3em] text-white uppercase">
                    RedZen
                  </h2>
                  <span className="text-[9px] tracking-[0.25em] text-crimson-500 uppercase font-semibold">
                    {t('brand.subtitle')}
                  </span>
                </div>
              </div>
              <p className="text-xs text-zen-400 leading-relaxed font-light max-w-sm">
                {t('footer.desc')}
              </p>
            </div>

            {/* Dutch Subsidies & Benefits */}
            <div className="space-y-4">
              <h3 className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400 flex items-center gap-1">
                <Leaf size={12} className="text-emerald-400" />
                <span>{language === 'nl' ? 'Nederlandse Subsidies' : 'Dutch Subsidies'}</span>
              </h3>
              <ul className="text-xs space-y-2.5 text-zen-400 font-light">
                <li>{language === 'nl' ? '• MIA / Vamil Milieu-investeringsaftrek' : '• MIA / Vamil Environmental Deductions'}</li>
                <li>{language === 'nl' ? '• EIA Energie-investeringsaftrek' : '• EIA Energy Investment Allowance'}</li>
                <li>{language === 'nl' ? '• ISDE Subsidie voor warmtepompen' : '• ISDE Hybrid Heat Pump Subsidy'}</li>
                <li>{language === 'nl' ? '• 100% Circulaire Bio-Economische partners' : '• 100% Circular Bio-Economic Partners'}</li>
              </ul>
            </div>

            {/* Privacy Shield */}
            <div className="space-y-4">
              <h3 className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400 flex items-center gap-1.5">
                <Shield size={12} className="text-crimson-500" />
                <span>{language === 'nl' ? 'Ultieme Privacy' : 'Ultimate Privacy'}</span>
              </h3>
              <p className="text-xs text-zen-400 font-light leading-relaxed">
                {language === 'nl' 
                  ? 'Ons databasevrije boekingssysteem garandeert volledige digitale soevereiniteit. Gekoppelde Google Drive-opslag zorgt ervoor dat uw reisgegevens volledig in uw eigen beheer blijven.' 
                  : 'Our database-free booking system guarantees full digital sovereignty. Connected Google Drive storage ensures your travel records remain entirely under your control.'}
              </p>
            </div>

          </div>

          {/* Footer Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-sans text-zen-500">
            <p>© {new Date().getFullYear()} RedZen Suites Co. (Dustin Christiaan Gunzel). {language === 'nl' ? 'Alle rechten voorbehouden.' : 'All rights reserved.'}</p>
            <div className="flex space-x-6">
              <a href="#suites" className="hover:text-white transition-colors">{t('nav.suites')}</a>
              <a href="#modeler" className="hover:text-white transition-colors">{language === 'nl' ? 'Economische Simulator' : 'Economic Simulator'}</a>
              <a href="#portfolio" className="hover:text-white transition-colors">{language === 'nl' ? 'Duurzame Tech' : 'Sustainable Tech'}</a>
              <a href="#inquiry" className="hover:text-white transition-colors">{t('nav.inquiry')}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Quick Link */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 p-3 bg-crimson-600 hover:bg-crimson-700 text-white rounded-full shadow-lg border border-crimson-500/20 cursor-pointer active:scale-95 transition-colors"
            title="Scroll to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
