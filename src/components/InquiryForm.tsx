import React, { useState, useEffect } from 'react';
import { Suite, Inquiry } from '../types';
import { SUITES } from '../data';
import { useLanguage } from '../LanguageContext';
import { Calendar, User as UserIcon, Mail, Phone, MessageSquare, Users, Cloud, Sparkles, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';

interface InquiryFormProps {
  user: User | null;
  accessToken: string | null;
  onSignIn: () => Promise<void>;
  onSubmitInquiry: (inquiry: Omit<Inquiry, 'createdAt' | 'status'>) => Promise<string>;
  preselectedSuiteId?: string;
  onClearPreselectedSuite: () => void;
  preselectedMessage?: string;
  onClearPreselectedMessage?: () => void;
}

export default function InquiryForm({
  user,
  accessToken,
  onSignIn,
  onSubmitInquiry,
  preselectedSuiteId = '',
  onClearPreselectedSuite,
  preselectedMessage = '',
  onClearPreselectedMessage
}: InquiryFormProps) {
  const { locale, t, tData } = useLanguage();
  const suites = tData(SUITES) as Suite[];

  const [suiteId, setSuiteId] = useState(preselectedSuiteId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successFileId, setSuccessFileId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedSuiteId) {
      setSuiteId(preselectedSuiteId);
    }
  }, [preselectedSuiteId]);

  useEffect(() => {
    if (preselectedMessage) {
      setMessage(preselectedMessage);
    }
  }, [preselectedMessage]);

  // Autofill if user is logged in
  useEffect(() => {
    if (user) {
      if (user.displayName) setName(user.displayName);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const selectedSuiteObj = suites.find(s => s.id === suiteId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accessToken) {
      setErrorMessage(locale === 'nl' 
        ? "U moet inloggen met Google om boekingsbonnen rechtstreeks in uw Drive op te slaan." 
        : "You must log in with Google to save booking vouchers directly to your Drive."
      );
      return;
    }

    if (!suiteId) {
      setErrorMessage(locale === 'nl' ? "Selecteer een suite of dienst." : "Please select a suite or service.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const suiteName = selectedSuiteObj?.name || (locale === 'nl' ? 'Onbekende Suite' : 'Unknown Suite');
      const fileId = await onSubmitInquiry({
        name,
        email,
        phone,
        suiteId,
        suiteName,
        checkIn,
        checkOut,
        guests,
        message
      });
      
      setSuccessFileId(fileId);
      // Reset form fields except contact info
      setCheckIn('');
      setCheckOut('');
      setGuests(2);
      setMessage('');
      onClearPreselectedSuite();
      onClearPreselectedMessage?.();
    } catch (error: any) {
      setErrorMessage(error.message || (locale === 'nl' ? "Niet gelukt om de aanvraag naar Google Drive te sturen." : "Failed to send the request to Google Drive."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="py-24 bg-zen-950 border-t border-crimson-950/20 text-white relative">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_right,rgba(220,38,38,0.03),transparent_50%)]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-crimson-500">
            <Sparkles size={14} />
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold">{t('inquiry.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
            {t('inquiry.heading')}
          </h2>
          <div className="w-12 h-[1px] bg-crimson-600 mx-auto" />
          <p className="font-sans text-xs sm:text-sm text-zen-300 font-light leading-relaxed">
            {t('inquiry.desc')}
          </p>
        </div>

        {/* Success Card */}
        <AnimatePresence>
          {successFileId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-12 p-6 sm:p-8 bg-crimson-950/20 border-2 border-crimson-600 rounded-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-crimson-600/5 blur-2xl" />
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 bg-crimson-600/10 text-crimson-400 border border-crimson-500/20 rounded-full shrink-0">
                  <CheckCircle size={28} />
                </div>
                <div className="space-y-3 flex-grow">
                  <h3 className="font-serif text-xl text-white">
                    {t('inquiry.success.title')}
                  </h3>
                  <p className="font-sans text-xs text-zen-300 leading-relaxed">
                    {t('inquiry.success.desc')}
                  </p>
                  <div className="p-4 bg-zen-950/90 border border-crimson-900/15 rounded-sm space-y-2 text-xs font-mono">
                    <p className="flex justify-between text-crimson-400">
                      <span>{t('inquiry.success.file_id')}</span>
                      <span className="text-white truncate max-w-[200px] sm:max-w-xs">{successFileId}</span>
                    </p>
                    <p className="flex justify-between text-crimson-400">
                      <span>Payload Schema:</span>
                      <span className="text-white">RedZen-v1.0.json</span>
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button 
                      onClick={() => {
                        setSuccessFileId(null);
                        const element = document.getElementById('dashboard');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="px-4 py-2 bg-crimson-600 hover:bg-crimson-700 text-white text-[10px] uppercase tracking-widest font-sans font-bold transition-colors rounded-sm cursor-pointer"
                    >
                      {locale === 'nl' ? 'Bekijk in Gastenboek' : 'View in Guest Book'}
                    </button>
                    <button 
                      onClick={() => setSuccessFileId(null)}
                      className="px-4 py-2 border border-crimson-900/40 hover:border-crimson-600 text-zen-200 text-[10px] uppercase tracking-widest font-sans font-bold transition-all rounded-sm cursor-pointer"
                    >
                      {t('inquiry.success.new_btn')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Notification */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mb-8 p-4 bg-red-950/40 border border-red-500/30 rounded-sm text-red-200 text-xs flex items-center gap-3"
            >
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Required Cover */}
        {!user || !accessToken ? (
          <div className="bg-zen-900/80 border border-crimson-950/30 rounded-sm p-8 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 border border-crimson-600/20 bg-crimson-950/40 rounded-full flex items-center justify-center mx-auto text-crimson-500">
              <Cloud size={30} />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-serif text-xl text-white font-medium">{t('inquiry.login_banner')}</h3>
              <p className="font-sans text-xs text-zen-300 font-light leading-relaxed">
                {t('inquiry.login_banner_desc')}
              </p>
            </div>
            <button 
              onClick={onSignIn}
              className="gsi-material-button mx-auto hover:bg-neutral-100 transition-all border border-crimson-600/30 cursor-pointer shadow-md active:scale-95"
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
                  {t('inquiry.login_btn')}
                </span>
              </div>
            </button>
          </div>
        ) : (
          /* Main Form */
          <form onSubmit={handleSubmit} className="bg-zen-900/60 border border-crimson-950/20 rounded-sm p-6 sm:p-10 space-y-8 shadow-xl">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400 block">{t('inquiry.form.name_label')}</label>
                <div className="relative">
                  <UserIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-crimson-500/40" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('inquiry.form.name_placeholder')}
                    className="w-full bg-zen-950 border border-crimson-900/10 focus:border-crimson-600 px-10 py-3 text-xs font-sans text-white rounded-sm outline-none transition-all placeholder:text-zen-600"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400 block">{t('inquiry.form.email_label')}</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-crimson-500/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('inquiry.form.email_placeholder')}
                    className="w-full bg-zen-950 border border-crimson-900/10 focus:border-crimson-600 px-10 py-3 text-xs font-sans text-white rounded-sm outline-none transition-all placeholder:text-zen-600"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400 block">{t('inquiry.form.phone_label')}</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-crimson-500/40" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('inquiry.form.phone_placeholder')}
                    className="w-full bg-zen-950 border border-crimson-900/10 focus:border-crimson-600 px-10 py-3 text-xs font-sans text-white rounded-sm outline-none transition-all placeholder:text-zen-600"
                  />
                </div>
              </div>

              {/* Residence Selection */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400 block">{t('inquiry.form.suite_label')}</label>
                <select
                  required
                  value={suiteId}
                  onChange={(e) => setSuiteId(e.target.value)}
                  className="w-full bg-zen-950 border border-crimson-900/10 focus:border-crimson-600 px-4 py-3 text-xs font-sans text-white rounded-sm outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled className="bg-zen-950 text-zen-500">{t('inquiry.form.suite_placeholder')}</option>
                  {suites.map((suite) => (
                    <option key={suite.id} value={suite.id} className="bg-zen-950 text-white">
                      {suite.name} ({suite.price} / {locale === 'nl' ? '2u' : '2h'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Check In */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400 block">{t('inquiry.form.checkin_label')}</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-crimson-500/40 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-zen-950 border border-crimson-900/10 focus:border-crimson-600 px-10 py-3 text-xs font-sans text-white rounded-sm outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Check Out */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400 block">{t('inquiry.form.checkout_label')}</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-crimson-500/40 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-zen-950 border border-crimson-900/10 focus:border-crimson-600 px-10 py-3 text-xs font-sans text-white rounded-sm outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Guest Count */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400 flex items-center justify-between">
                  <span>{t('inquiry.form.guests_label')}</span>
                  <span className="text-crimson-400 font-bold">{guests} {t('inquiry.form.guests_unit')}</span>
                </label>
                <div className="flex items-center space-x-4 bg-zen-950 border border-crimson-900/10 px-4 py-1.5 rounded-sm">
                  <Users size={14} className="text-crimson-500/40" />
                  <input
                    type="range"
                    min="1"
                    max={selectedSuiteObj ? selectedSuiteObj.guests : 2}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full accent-crimson-600 cursor-pointer h-1"
                  />
                  <span className="text-xs text-zen-400 font-sans font-bold shrink-0">Max {selectedSuiteObj ? selectedSuiteObj.guests : 2}</span>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] tracking-widest uppercase font-sans font-bold text-crimson-400 block">{t('inquiry.form.msg_label')}</label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3.5 top-4 text-crimson-500/40" />
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('inquiry.form.msg_placeholder')}
                    className="w-full bg-zen-950 border border-crimson-900/10 focus:border-crimson-600 px-10 py-3 text-xs font-sans text-white rounded-sm outline-none transition-all placeholder:text-zen-600 resize-none"
                  />
                </div>
              </div>

            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-crimson-900/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-[11px] font-sans flex items-center space-x-2 text-emerald-400/80">
                <Cloud size={14} />
                <span>{t('inquiry.form.secure_note')}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-crimson-600 hover:bg-crimson-700 text-white text-xs uppercase tracking-widest font-sans font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50 rounded-sm"
              >
                <span>{isSubmitting ? t('inquiry.form.submitting') : t('inquiry.form.submit_btn')}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
}
