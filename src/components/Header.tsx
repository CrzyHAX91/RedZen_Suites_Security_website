import React from 'react';
import { User } from 'firebase/auth';
import { LogOut, Cloud, Compass, FileText, LayoutDashboard, Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';


interface HeaderProps {
  user: User | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  isLoggingIn: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Header({
  user,
  onSignIn,
  onSignOut,
  isLoggingIn,
  activeSection,
  setActiveSection
}: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'suites', label: t('nav.suites'), icon: Compass },
    { id: 'services', label: t('nav.services'), icon: Compass },
    { id: 'insights', label: t('nav.insights'), icon: FileText },
    { id: 'modeler', label: t('nav.modeler'), icon: Compass },
    { id: 'portfolio', label: t('nav.portfolio'), icon: FileText },
    { id: 'inquiry', label: t('nav.inquiry'), icon: FileText },
    ...(user ? [{ id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard }] : [])
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zen-950/85 backdrop-blur-md border-b border-crimson-950/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 border border-crimson-600 flex items-center justify-center bg-zen-950">
              <span className="font-display font-bold text-lg text-crimson-500 tracking-widest">R</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-sm tracking-[0.3em] text-white uppercase leading-none">
                RedZen
              </h1>
              <span className="text-[10px] tracking-[0.25em] text-crimson-500 uppercase font-semibold">
                Suites & Residences
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs uppercase tracking-widest font-sans font-medium transition-all relative py-2 cursor-pointer ${
                  activeSection === item.id 
                    ? 'text-crimson-500' 
                    : 'text-zen-300 hover:text-white'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-crimson-600"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Auth Button & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            
            {/* Language Toggle Switch */}
            <div className="flex items-center space-x-1 border border-crimson-950/20 bg-zen-900/60 rounded-full p-0.5" id="lang-switch">
              <button
                onClick={() => setLanguage('nl')}
                className={`text-[10px] tracking-widest font-sans font-bold px-2 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'nl'
                    ? 'bg-crimson-600 text-white shadow-md'
                    : 'text-zen-400 hover:text-white'
                }`}
              >
                NL
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`text-[10px] tracking-widest font-sans font-bold px-2 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-crimson-600 text-white shadow-md'
                    : 'text-zen-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Desktop Auth Status */}
            <div className="hidden sm:block">
              {user ? (
                <div className="flex items-center space-x-3 bg-gold-950/40 border border-gold-900/30 rounded-full py-1.5 pl-2 pr-4">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Client'} 
                      className="w-7 h-7 rounded-full object-cover border border-gold-400/40"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-xs font-bold text-zen-950">
                      {user.displayName ? user.displayName[0] : 'C'}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-[10px] font-sans font-semibold text-gold-100 line-clamp-1 max-w-[100px]">
                      {user.displayName || t('auth.client')}
                    </p>
                    <p className="text-[9px] text-emerald-400 font-sans flex items-center gap-1">
                      <Cloud size={10} /> {t('auth.synced')}
                    </p>
                  </div>
                  <button 
                    onClick={onSignOut}
                    className="ml-2 text-gold-400 hover:text-red-400 transition-colors p-1"
                    title={t('auth.signout')}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onSignIn}
                  disabled={isLoggingIn}
                  className="gsi-material-button hover:bg-gold-50 transition-all border border-gold-400/30 cursor-pointer shadow-sm shadow-gold-950/10 active:scale-95"
                >
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents text-xs tracking-wider text-slate-800">
                      {isLoggingIn ? t('auth.connecting') : t('auth.login')}
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gold-100 hover:text-gold-300 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zen-950 border-b border-gold-900/20 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left text-xs uppercase tracking-widest font-sans font-medium py-2 transition-colors ${
                      activeSection === item.id ? 'text-gold-300 pl-2 border-l border-gold-400' : 'text-gold-100/60'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-between pt-2 pb-1 border-t border-crimson-900/10">
                <span className="text-[10px] tracking-widest font-sans font-medium text-zen-400 uppercase">
                  Language / Taal
                </span>
                <div className="flex items-center space-x-1 border border-crimson-950/20 bg-zen-905/60 rounded-full p-0.5">
                  <button
                    onClick={() => setLanguage('nl')}
                    className={`text-[10px] tracking-widest font-sans font-bold px-3 py-1 rounded-full transition-all cursor-pointer ${
                      language === 'nl'
                        ? 'bg-crimson-600 text-white shadow-md'
                        : 'text-zen-400 hover:text-white'
                    }`}
                  >
                    NL
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`text-[10px] tracking-widest font-sans font-bold px-3 py-1 rounded-full transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-crimson-600 text-white shadow-md'
                        : 'text-zen-400 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Mobile Auth button */}
              <div className="pt-4 border-t border-gold-900/20">
                {user ? (
                  <div className="flex items-center justify-between bg-gold-950/40 border border-gold-900/30 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'Client'} 
                          className="w-9 h-9 rounded-full object-cover border border-gold-400/40"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center text-sm font-bold text-zen-950">
                          {user.displayName ? user.displayName[0] : 'C'}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-gold-100">
                          {user.displayName || t('auth.client')}
                        </p>
                        <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <Cloud size={10} /> {t('auth.synced')}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={onSignOut}
                      className="text-gold-400 hover:text-red-400 transition-colors p-2 border border-gold-900/20 rounded-md"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={onSignIn}
                    disabled={isLoggingIn}
                    className="gsi-material-button w-full border border-gold-400/30"
                  >
                    <div className="gsi-material-button-content-wrapper">
                      <div className="gsi-material-button-icon">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        </svg>
                      </div>
                      <span className="gsi-material-button-contents text-xs text-slate-800">
                        {isLoggingIn ? t('auth.connecting') : t('auth.login')}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
