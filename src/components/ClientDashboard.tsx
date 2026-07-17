import React, { useState, useEffect } from 'react';
import { Inquiry } from '../types';
import { listInquiryFiles, deleteInquiryFile } from '../googleDrive';
import { useLanguage } from '../LanguageContext';
import { LayoutDashboard, Calendar, Users, Trash2, RefreshCw, CloudAlert, CloudLightning, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClientDashboardProps {
  accessToken: string | null;
  refreshTrigger: number;
  onRefresh: () => void;
}

export default function ClientDashboard({ accessToken, refreshTrigger, onRefresh }: ClientDashboardProps) {
  const { locale, t } = useLanguage();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom delete confirmation state
  const [itemToDelete, setItemToDelete] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (accessToken) {
      loadInquiries();
    }
  }, [accessToken, refreshTrigger]);

  const loadInquiries = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await listInquiryFiles(accessToken);
      setInquiries(data);
    } catch (err: any) {
      setError(locale === 'nl' 
        ? "Niet gelukt om gegevens uit uw Google Drive op te halen. Vernieuw de pagina of controleer de verbindingstoezeggingen." 
        : "Failed to fetch data from your Google Drive. Please refresh the page or check connection authorization."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (inquiry: Inquiry) => {
    setItemToDelete(inquiry);
  };

  const confirmDelete = async () => {
    if (!accessToken || !itemToDelete || !itemToDelete.id) return;
    setIsDeleting(true);
    try {
      await deleteInquiryFile(accessToken, itemToDelete.id);
      setInquiries(prev => prev.filter(item => item.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (err) {
      alert(locale === 'nl' 
        ? "Niet gelukt om het bestand uit Google Drive te verwijderen. Probeer het opnieuw." 
        : "Failed to delete the file from Google Drive. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!accessToken) return null;

  return (
    <section id="dashboard" className="py-24 bg-zen-950 border-t border-crimson-950/20 text-white relative">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_right,rgba(220,38,38,0.02),transparent_40%)]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center space-x-2 text-crimson-400 mb-2">
              <LayoutDashboard size={14} />
              <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold">{t('dash.badge')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
              {t('dash.heading')}
            </h2>
            <p className="font-sans text-xs text-zen-400 mt-1">
              {t('dash.desc')}
            </p>
          </div>

          <button
            onClick={loadInquiries}
            disabled={isLoading}
            className="px-4 py-2 border border-crimson-900/30 hover:border-crimson-600 text-crimson-400 hover:text-white text-[10px] uppercase tracking-widest font-sans font-bold transition-all flex items-center gap-2 w-fit cursor-pointer active:scale-95 disabled:opacity-50 rounded-sm bg-crimson-950/10"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? (locale === 'nl' ? 'Synchroniseren...' : 'Syncing...') : (locale === 'nl' ? 'Synchroniseer met Drive' : 'Sync with Drive')}</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-950/20 border border-red-500/30 text-red-200 rounded-sm text-xs flex items-center gap-3">
            <CloudAlert size={16} className="text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-zen-900/40 border border-crimson-950/15 p-6 sm:p-8 rounded-sm space-y-6 shadow-md animate-pulse"
              >
                <div className="space-y-4">
                  {/* Card top skeleton */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 w-2/3">
                      <div className="h-2.5 bg-crimson-600/20 rounded w-1/4" />
                      <div className="h-5 bg-white/10 rounded w-11/12" />
                    </div>
                    <div className="h-5 bg-crimson-600/20 rounded w-16" />
                  </div>

                  {/* Booking details skeleton (split columns) */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-crimson-950/10">
                    <div className="space-y-2">
                      <div className="h-2 bg-crimson-600/15 rounded w-1/3" />
                      <div className="h-3.5 bg-white/5 rounded w-4/5" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-crimson-600/15 rounded w-1/3" />
                      <div className="h-3.5 bg-white/5 rounded w-3/5" />
                    </div>
                  </div>

                  {/* Customer details skeleton */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex gap-2 items-center">
                      <div className="h-2 bg-crimson-600/15 rounded w-12" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="h-2 bg-crimson-600/15 rounded w-12" />
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                    </div>
                  </div>

                  {/* Special request area placeholder */}
                  <div className="p-3 bg-zen-950/40 border border-crimson-900/5 rounded-sm space-y-1.5">
                    <div className="h-2 bg-white/5 rounded w-full" />
                    <div className="h-2 bg-white/5 rounded w-4/5" />
                  </div>
                </div>

                {/* Footer and Deletion skeleton */}
                <div className="pt-4 border-t border-crimson-900/10 flex items-center justify-between">
                  <div className="h-2 bg-crimson-600/10 rounded w-20" />
                  <div className="h-7 bg-crimson-600/10 rounded w-24 border border-crimson-900/5" />
                </div>
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          /* Empty State */
          <div className="text-center p-12 border border-dashed border-crimson-900/20 bg-zen-900/40 rounded-sm max-w-xl mx-auto space-y-4">
            <CloudLightning size={32} className="text-crimson-500/40 mx-auto" />
            <h3 className="font-serif text-lg text-white">{t('dash.no_records')}</h3>
            <p className="font-sans text-xs text-zen-400 leading-relaxed font-light">
              {t('dash.no_records_desc')}
            </p>
          </div>
        ) : (
          /* Inquiries Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {inquiries.map((inquiry) => (
              <motion.div
                key={inquiry.id}
                layout
                className="bg-zen-900/50 border border-crimson-950/25 hover:border-crimson-600/30 p-6 sm:p-8 rounded-sm space-y-6 shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card top */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] tracking-widest font-sans font-bold text-crimson-500 uppercase">
                        {inquiry.checkIn ? `${locale === 'nl' ? 'Dossier' : 'Dossier'} #${inquiry.id?.substring(0, 8)}` : 'Dossier'}
                      </span>
                      <h3 className="font-serif text-lg text-white leading-tight mt-0.5">
                        {inquiry.suiteName}
                      </h3>
                    </div>
                    <span className="bg-crimson-600/10 text-crimson-400 border border-crimson-600/20 px-2 py-0.5 text-[9px] font-sans uppercase font-bold">
                      {inquiry.status === 'Pending' ? (locale === 'nl' ? 'In Behandeling' : 'Pending') : (inquiry.status || (locale === 'nl' ? 'In Behandeling' : 'Pending'))}
                    </span>
                  </div>

                  {/* Booking details */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-crimson-950/10 text-xs font-sans text-zen-300">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-crimson-500/50">{locale === 'nl' ? 'Datums' : 'Dates'}</span>
                      <p className="flex items-center gap-1.5 font-light text-[11px]">
                        <Calendar size={12} className="text-crimson-400/60" />
                        <span>{inquiry.checkIn} — {inquiry.checkOut}</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-crimson-500/50">{locale === 'nl' ? 'Bezetting' : 'Guests'}</span>
                      <p className="flex items-center gap-1.5 font-light text-[11px]">
                        <Users size={12} className="text-crimson-400/60" />
                        <span>{inquiry.guests} {inquiry.guests > 1 ? (locale === 'nl' ? 'Gasten' : 'Guests') : (locale === 'nl' ? 'Gast' : 'Guest')}</span>
                      </p>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="space-y-2 text-xs font-sans font-light text-zen-300">
                    <p><span className="font-bold text-crimson-500/50 uppercase text-[9px] inline-block w-16">Contact:</span> {inquiry.name}</p>
                    <p><span className="font-bold text-crimson-500/50 uppercase text-[9px] inline-block w-16">{locale === 'nl' ? 'E-mail:' : 'Email:'}</span> {inquiry.email}</p>
                    {inquiry.phone && (
                      <p><span className="font-bold text-crimson-500/50 uppercase text-[9px] inline-block w-16">{locale === 'nl' ? 'Telefoon:' : 'Phone:'}</span> {inquiry.phone}</p>
                    )}
                  </div>

                  {/* Custom Message */}
                  {inquiry.message && (
                    <div className="p-3 bg-zen-950/50 border border-crimson-950/10 text-[11px] font-sans font-light italic leading-relaxed text-zen-400">
                      "{inquiry.message}"
                    </div>
                  )}
                </div>

                {/* Footer and Deletion */}
                <div className="pt-4 border-t border-crimson-950/10 flex items-center justify-between text-[10px] font-sans">
                  <span className="text-zen-500">
                    {locale === 'nl' ? 'Opgeslagen:' : 'Saved:'} {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US') : 'N/V'}
                  </span>
                  
                  <button
                    onClick={() => handleDeleteClick(inquiry)}
                    className="flex items-center gap-1.5 text-crimson-400 hover:text-white cursor-pointer py-1.5 px-3 border border-crimson-950/20 hover:border-red-600 hover:bg-red-950/10 transition-all rounded-sm font-bold uppercase tracking-wider"
                  >
                    <Trash2 size={12} />
                    <span>{locale === 'nl' ? 'Verwijder Dossier' : 'Delete Dossier'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Custom Confirmation Modal */}
        <AnimatePresence>
          {itemToDelete && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                onClick={() => setItemToDelete(null)}
                className="absolute inset-0 bg-black"
              />

              {/* Dialog Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-zen-950 border border-crimson-600 rounded-sm p-6 max-w-md w-full relative z-10 shadow-2xl space-y-6"
              >
                <div className="flex items-start gap-4 text-white">
                  <div className="p-3 bg-red-950/40 text-red-500 border border-red-500/30 rounded-full shrink-0">
                    <ShieldAlert size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-white font-medium">{locale === 'nl' ? 'Controleer Verwijderingsverzoek' : 'Confirm Deletion'}</h3>
                    <p className="font-sans text-xs text-zen-300 leading-relaxed font-light">
                      {locale === 'nl' ? <>Weet u zeker dat u het boekingsdossier voor <strong className="text-crimson-400">{itemToDelete.suiteName}</strong> wilt verwijderen?</> : <>Are you sure you want to delete the booking dossier for <strong className="text-crimson-400">{itemToDelete.suiteName}</strong>?</>}
                    </p>
                    <p className="font-sans text-xs text-red-400 font-semibold leading-relaxed">
                      {locale === 'nl' 
                        ? "Deze actie zal het JSON-bestand permanent verwijderen uit uw Google Drive. RedZen Suites kan dit niet herstellen." 
                        : "This action will permanently delete the JSON file from your Google Drive. RedZen Suites cannot recover it."
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setItemToDelete(null)}
                    disabled={isDeleting}
                    className="px-4 py-2 border border-crimson-900/30 text-zen-300 text-xs font-semibold uppercase tracking-widest font-sans hover:bg-zen-900 transition-colors rounded-sm cursor-pointer disabled:opacity-40"
                  >
                    {locale === 'nl' ? 'Annuleren' : 'Cancel'}
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest font-sans transition-colors rounded-sm cursor-pointer disabled:opacity-40 flex items-center gap-2"
                  >
                    <span>{isDeleting ? (locale === 'nl' ? 'Verwijderen...' : 'Deleting...') : (locale === 'nl' ? 'Bevestig Verwijdering' : 'Confirm Deletion')}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
