import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'nl' | 'en';

interface TranslationDict {
  [key: string]: {
    nl: string;
    en: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tData: <T>(obj: { nl: T; en: T }) => T;
}

const TRANSLATIONS: TranslationDict = {
  // Navigation / Header
  'nav.suites': { nl: 'Suites', en: 'Suites' },
  'nav.services': { nl: 'Diensten', en: 'Services' },
  'nav.insights': { nl: 'Insights', en: 'Insights' },
  'nav.modeler': { nl: 'Eco-Economisch Model', en: 'Eco-Economic Modeler' },
  'nav.portfolio': { nl: 'Duurzame Tech', en: 'Sustainable Tech' },
  'nav.inquiry': { nl: 'Privé Boeking', en: 'Private Booking' },
  'nav.dashboard': { nl: 'Gastenboek', en: 'Guest Ledger' },
  'brand.subtitle': { nl: 'Suites & Residences', en: 'Suites & Residences' },
  'auth.connecting': { nl: 'Verbinden...', en: 'Connecting...' },
  'auth.login': { nl: 'Inloggen met Google', en: 'Login with Google' },
  'auth.synced': { nl: 'Google Drive Gesynchroniseerd', en: 'Google Drive Synced' },
  'auth.client': { nl: 'Klant', en: 'Client' },
  'auth.signout': { nl: 'Uitloggen', en: 'Sign Out' },

  // Hero Section
  'hero.badge.top': { nl: 'ULTRA-LUXE PRIVATE WELLNESS SUITES', en: 'ULTRA-LUXURY PRIVATE WELLNESS SUITES' },
  'hero.badge.bottom': { nl: 'UITSLUITEND OP AFSPRAAK', en: 'BY APPOINTMENT ONLY' },
  'hero.heading': { nl: 'Eco-Luxe Herbestemming in Absolute Privacy', en: 'Eco-Luxury Restoration in Absolute Privacy' },
  'hero.description': { nl: 'Duurzame Finse sauna\'s, koudwatertherapie en biologische polder-gastronomie in Almere. Geheel database-vrij met volledige digitale soevereiniteit.', en: 'Sustainable Finnish saunas, cold-water therapy, and organic polder gastronomy in Almere. Completely database-free with complete digital sovereignty.' },
  'hero.box.title': { nl: 'Privé Soevereiniteit', en: 'Private Sovereignty' },
  'hero.box.desc': { nl: 'Geen databases. Uw boekingen en herstel-dossiers worden direct opgeslagen als gecodeerde JSON-bestanden in uw eigen Google Drive.', en: 'No databases. Your bookings and recovery dossiers are stored directly as encrypted JSON files in your own Google Drive.' },
  'hero.cta.discover': { nl: 'Ontdek Privé Suites', en: 'Discover Private Suites' },
  'hero.cta.consult': { nl: 'Plan Eco-Spa Consult', en: 'Plan Eco-Spa Consult' },
  'hero.stat.location': { nl: 'Geplande Locatie', en: 'Planned Location' },
  'hero.stat.status': { nl: 'Status', en: 'Status' },
  'hero.stat.status_val': { nl: 'Ontwerpfase', en: 'Design Phase' },
  'hero.stat.opening': { nl: 'Opening', en: 'Opening' },
  'hero.stat.opening_val': { nl: 'Eind 2026', en: 'Late 2026' },

  // Suites Section
  'suites.badge': { nl: 'Portefeuille van Residenties', en: 'Portfolio of Residences' },
  'suites.heading': { nl: 'Geselecteerde Wellness Suites', en: 'Selected Wellness Suites' },
  'suites.desc': { nl: 'Ontdek onze twee ultra-private, zeer gespecialiseerde eco-suites gepland in Almere. Ervaar geavanceerde sauna\'s, jacuzzisystemen en op maat gemaakte thermische therapieën in absoluut comfort.', en: 'Discover our two ultra-private, highly specialized eco-suites planned in Almere. Experience advanced saunas, jacuzzi systems, and bespoke thermal therapies in absolute comfort.' },
  'suites.duration': { nl: '/ 2 Uur', en: '/ 2 Hours' },
  'suites.self_service': { nl: 'Selfservice', en: 'Self-service' },
  'suites.guests': { nl: 'Tot {guests} Gasten', en: 'Up to {guests} Guests' },
  'suites.view': { nl: 'Exclusief Uitzicht', en: 'Exclusive View' },
  'suites.amenities_header': { nl: 'Eco-Chique Voorzieningen', en: 'Eco-Chic Amenities' },
  'suites.cta': { nl: 'Boeking Aanvragen', en: 'Request Booking' },

  // Services Section
  'services.badge': { nl: 'Exclusieve Diensten', en: 'Exclusive Services' },
  'services.heading': { nl: 'Onze Gespecialiseerde Diensten', en: 'Our Specialized Services' },
  'services.desc': { nl: 'RedZen Suites levert hoogwaardige privé-wellnessdiensten die zijn ontworpen voor herstel, luxe en ecologische balans. Selecteer een dienst om de omvang, methodologie en kenmerken te ontdekken.', en: 'RedZen Suites delivers high-end private wellness services designed for recovery, luxury, and ecological balance. Select a service to discover its scope, methodology, and features.' },
  'services.btn.view': { nl: 'Bekijk Dienstarchitectuur', en: 'View Service Architecture' },
  'services.btn.back': { nl: 'Terug naar Diensten', en: 'Back to Services' },
  'services.rates': { nl: 'Geschatte Tarieven:', en: 'Estimated Rates:' },
  'services.secure_delivery': { nl: 'Beveiligde Levering', en: 'Secure Delivery' },
  'services.scope': { nl: 'Omvang van de Dienst', en: 'Scope of Service' },
  'services.grid_energy': { nl: 'Geïntegreerd met Almere Smart Energy Grid', en: 'Integrated with Almere Smart Energy Grid' },
  'services.methodology': { nl: 'Thermodynamische & Technische Methodologie', en: 'Thermodynamic & Technical Methodology' },
  'services.features': { nl: 'Belangrijkste Kenmerken', en: 'Key Features' },
  'services.benefits': { nl: 'Voordelen & Hersteleffect', en: 'Benefits & Recovery Impact' },
  'services.audience': { nl: 'Doelgroep', en: 'Target Audience' },
  'services.cta.title': { nl: 'Boeking of Consultatie Aanvragen', en: 'Request Booking or Consultation' },
  'services.cta.desc': { nl: 'Vul onze beveiligde boekingsaanvraag in om deze gespecialiseerde dienst vast te leggen. Aanvragen worden direct als gecodeerde bonnen in uw persoonlijke Google Drive-omgeving opgeslagen, waardoor uw gegevens volledig soeverein blijven.', en: 'Fill out our secure booking request to secure this specialized service. Requests are saved directly as encrypted vouchers in your personal Google Drive environment, keeping your data entirely sovereign.' },
  'services.cta.other': { nl: 'Blader door Andere Diensten', en: 'Browse Other Services' },

  // Insights (Blog) Section
  'insights.badge': { nl: 'Insights & Engineering', en: 'Insights & Engineering' },
  'insights.heading': { nl: 'RedZen Journal', en: 'RedZen Journal' },
  'insights.desc': { nl: 'Verken de thermodynamica van wellness, autonome luxe en het regionale polder-ecosysteem in Almere.', en: 'Exploring the thermodynamics of wellness, autonomous luxury, and the regional polder ecosystem in Almere.' },
  'insights.publish': { nl: 'Publish Insight', en: 'Publish Insight' },
  'insights.search_placeholder': { nl: 'Zoek in technische logs...', en: 'Search engineering logs...' },
  'insights.filter_category': { nl: 'Categorie:', en: 'Category:' },
  'insights.filtered_tag': { nl: 'Gefilterd op tag:', en: 'Filtered by tag:' },
  'insights.clear': { nl: '(Wissen)', en: '(Clear)' },
  'insights.not_found_title': { nl: 'Geen inzichten gevonden', en: 'No Insights Found' },
  'insights.not_found_desc': { nl: 'Geen artikelen komen overeen met uw huidige zoekopdracht. Wis filters of maak een nieuw bericht aan.', en: 'No articles match your current query. Try clearing filters or creating a new post.' },
  'insights.read_time': { nl: 'min leestijd', en: 'min read' },
  'insights.explore': { nl: 'Verkennen', en: 'Explore' },
  'insights.back': { nl: 'Terug naar Journal', en: 'Return to Journal' },
  'insights.technical_ledger': { nl: 'Technische Ledger', en: 'Technical Ledger' },
  'insights.about_author': { nl: 'Over de Auteur:', en: 'About the Author:' },
  'insights.author_bio': { nl: 'Dustin Gunzel is een Nederlandse thermodynamische ingenieur en eco-architect gespecialiseerd in duurzame thermische lussen op hoge temperatuur. Hij adviseert wereldwijd vanuit de RedZen onderzoeks-suites in Almere, Flevoland.', en: 'Dustin Gunzel is a Dutch thermodynamic engineer and eco-architect specialized in sustainable high-temperature thermal loops. He consults globally from the RedZen research suites in Almere, Flevoland.' },
  'insights.tags': { nl: 'Tags:', en: 'Tags:' },

  // Blog CMS / Editor Modal
  'editor.modify_title': { nl: 'Inzicht log wijzigen', en: 'Modify Insight Log' },
  'editor.new_title': { nl: 'Nieuw technisch inzicht publiceren', en: 'Publish New Technical Insight' },
  'editor.subtitle': { nl: 'Documenteer thermodynamische ontdekkingen, biologische opstellingen of architectuurstudies.', en: 'Document thermodynamic discoveries, organic setups, or architectural studies.' },
  'editor.tab.edit': { nl: 'Document bewerken', en: 'Edit Document' },
  'editor.tab.preview': { nl: 'Live Preview', en: 'Live Preview' },
  'editor.field.title': { nl: 'Titel van artikel', en: 'Article Title' },
  'editor.field.category': { nl: 'Categorie', en: 'Category' },
  'editor.field.excerpt': { nl: 'Kort uittreksel', en: 'Short Excerpt' },
  'editor.field.excerpt_placeholder': { nl: 'Een scannbare samenvatting van 1 of 2 zinnen.', en: 'A scannable 1-to-2 sentence summary of this insight.' },
  'editor.field.tags': { nl: 'Tags (komma-gescheiden)', en: 'Tags (comma-separated)' },
  'editor.field.author_name': { nl: 'Naam auteur', en: 'Author Name' },
  'editor.field.author_role': { nl: 'Rol auteur', en: 'Author Role' },
  'editor.field.cover': { nl: 'Uitgelichte omslagafbeelding', en: 'Featured Cover Image' },
  'editor.field.custom_cover': { nl: 'Of plak een aangepaste hoge-resolutie omslag URL:', en: 'Or paste custom high-resolution cover image URL:' },
  'editor.field.content': { nl: 'Inhoud van het artikel (Markdown)', en: 'Article Document Content' },
  'editor.field.content_placeholder': { nl: '## Subkop hier...\n\nUw diepgaande paragrafen gaan hier.', en: '## Subheading title here...\n\nYour deep article paragraphs go here.' },
  'editor.btn.discard': { nl: 'Weggooien', en: 'Discard' },
  'editor.btn.publish': { nl: 'Document publiceren', en: 'Publish Document' },
  'editor.btn.save': { nl: 'Wijziging opslaan', en: 'Save Modification' },
  'editor.alert.fields': { nl: 'Vul alstublieft alle verplichte velden in.', en: 'Please fill out all required fields.' },
  'editor.alert.confirm_delete': { nl: 'Weet u zeker dat u dit inzicht permanent wilt verwijderen?', en: 'Are you sure you want to permanently delete this insight?' },

  // Modeler (Simulator) Section
  'modeler.badge': { nl: 'Eco-Economische Optimalisatiesimulator', en: 'Eco-Economic Optimization Simulator' },
  'modeler.heading': { nl: 'De Lokale & Groene Economie Versterken', en: 'Empowering the Local & Green Economy' },
  'modeler.desc': { nl: 'RedZen Suites bewijst dat ultra-luxe, hoge winstmarges en CO₂-vrije wellness perfect op elkaar aansluiten. Simuleer onze financiële en ecologische prestaties live om onze duurzaamheid te ontdekken.', en: 'RedZen Suites proves that ultra-luxury, high profit margins, and CO₂-free wellness align perfectly. Simulate our financial and ecological performance live to discover our sustainability.' },
  'modeler.console': { nl: 'Simulatieconsole', en: 'Simulation Console' },
  'modeler.console_desc': { nl: 'Pas de bezettingsgraad en upgrades van gasten aan om live wijzigingen in Nederlandse subsidies, lokale economische multipliers en ecologische impact te zien.', en: 'Adjust occupancy rates and guest upgrades to view live changes in Dutch subsidies, local economic multipliers, and ecological impact.' },
  'modeler.param.occupancy': { nl: 'Bezettingsgraad van Suites', en: 'Suites Occupancy Rate' },
  'modeler.param.bookings': { nl: 'boekingen/mnd', en: 'bookings/month' },
  'modeler.param.extra_hours': { nl: 'Gasten die extra uren boeken', en: 'Guests Booking Extra Hours' },
  'modeler.param.upsell': { nl: 'Gemiddelde besteding aan bio-pakketten', en: 'Average Spend on Bio-Packages' },
  'modeler.param.subsidies': { nl: 'Nederlandse ISDE / EIA Milieusubsidies actief', en: 'Dutch ISDE / EIA Eco-Subsidies Active' },
  'modeler.metrics': { nl: 'Geprojecteerde Statisieken (Maandelijks)', en: 'Projected Metrics (Monthly)' },
  'modeler.metric.revenue': { nl: 'Bruto Omzet', en: 'Gross Revenue' },
  'modeler.metric.co2': { nl: 'CO₂ Bespaard vs Gas', en: 'CO₂ Saved vs Gas' },
  'modeler.metric.co2_unit': { nl: 'kg CO₂ / Maand', en: 'kg CO₂ / Month' },
  'modeler.metric.profit': { nl: 'Netto Bedrijfswinst', en: 'Net Operating Profit' },
  'modeler.metric.profit_desc': { nl: 'Inclusief subsidies & vaste lasten (€5.500)', en: 'Includes subsidies & fixed costs (€5,500)' },
  'modeler.metric.impact': { nl: 'Lokale Economische Injectie', en: 'Local Economic Injection' },
  'modeler.metric.impact_desc': { nl: 'In Almere biologische landbouw & therapeuten', en: 'In Almere organic farming & therapists' },
  'modeler.subsidies_title': { nl: 'Nederlandse Eco-Subsidie Voordelen', en: 'Dutch Eco-Subsidy Advantages' },
  'modeler.subsidies_desc': { nl: 'Onze thermodynamische setup is volledig afgestemd op de Nederlandse regelgeving voor belastingvermindering, wat de terugverdientijd drastisch verkort:', en: 'Our thermodynamic setup is fully aligned with Dutch tax deduction regulations, drastically shortening the payback period:' },
  'modeler.subsidies.bullet1': { nl: 'EIA (Energie-investeringsaftrek): Trek 40% van de aanschafkosten van de hybride warmtepomp af van de belasting.', en: 'EIA (Energy Investment Allowance): Deduct 40% of the hybrid heat pump acquisition costs from taxable profits.' },
  'modeler.subsidies.bullet2': { nl: 'MIA/Vamil: Tot 45% milieu-investeringsaftrek en 75% willekeurige afschrijving op circulaire wellness-materialen.', en: 'MIA/Vamil: Up to 45% environmental investment deduction and 75% arbitrary depreciation on circular wellness materials.' },
  'modeler.subsidies.bullet3': { nl: 'ISDE Subsidie: Directe cashback van het RVO voor warmtepompinstallaties op locatie.', en: 'ISDE Subsidy: Direct cash back from the RVO (Netherlands Enterprise Agency) for onsite heat pump installations.' },

  // Portfolio Section
  'portfolio.badge': { nl: 'Esthetiek & Herkomst', en: 'Aesthetics & Origin' },
  'portfolio.heading': { nl: 'Eco-Design & Technologie', en: 'Eco-Design & Technology' },
  'portfolio.desc': { nl: 'Neem een visuele wandeling door onze geplande premium materialen en eco-installaties. Wij geloven in high-tech automatisering, CO₂-reductie en regionaal Nederlands vakmanschap.', en: 'Take a visual stroll through our planned premium materials and eco-installations. We believe in high-tech automation, CO₂ reduction, and regional Dutch craftsmanship.' },
  'portfolio.cat.all': { nl: 'Alles', en: 'All' },
  'portfolio.cat.interior': { nl: 'Interieur', en: 'Interior' },
  'portfolio.cat.tech': { nl: 'Technologie', en: 'Technology' },
  'portfolio.cat.wellness': { nl: 'Wellness', en: 'Wellness' },
  'portfolio.cat.zen': { nl: 'Zen', en: 'Zen' },
  'portfolio.prefix_cat': { nl: 'Categorie: ', en: 'Category: ' },

  // Inquiry Form
  'inquiry.badge': { nl: 'Autonome Toegang', en: 'Autonomous Access' },
  'inquiry.heading': { nl: 'Vraag een Privé Boeking of Consultatie aan', en: 'Request a Private Booking or Consultation' },
  'inquiry.desc': { nl: 'Vul de details hieronder in om een reservering aan te vragen voor onze geplande suites in Almere of een spa-adviesgesprek in te plannen. Uw gegevens worden direct opgeslagen in uw eigen Google Drive-account.', en: 'Enter details below to request a reservation for our planned suites in Almere or schedule a spa consulting session. Your data is stored directly in your own Google Drive account.' },
  'inquiry.login_banner': { nl: 'Google Drive-verbinding vereist', en: 'Google Drive Connection Required' },
  'inquiry.login_banner_desc': { nl: 'Om uw privacy te garanderen, slaat dit systeem geen gegevens op in een database. In plaats daarvan creëert het boekingsbonnen als gecodeerde bestanden rechtstreeks in uw eigen Google Drive. Log in met Google om door te gaan.', en: 'To guarantee your privacy, this system does not store data in any database. Instead, it creates booking vouchers as encrypted files directly inside your own Google Drive. Sign in with Google to continue.' },
  'inquiry.login_btn': { nl: 'Verbind Google Drive', en: 'Connect Google Drive' },
  'inquiry.form.suite_label': { nl: 'Selecteer Gewenste Suite of Dienst', en: 'Select Desired Suite or Service' },
  'inquiry.form.suite_placeholder': { nl: '-- Kies een Suite of Dienst --', en: '-- Choose a Suite or Service --' },
  'inquiry.form.suite_only': { nl: 'Alleen Eco-Spa Consult (Geen Suite)', en: 'Eco-Spa Consulting Only (No Suite)' },
  'inquiry.form.contact_header': { nl: 'Contactgegevens', en: 'Contact Information' },
  'inquiry.form.name_label': { nl: 'Volledige Naam', en: 'Full Name' },
  'inquiry.form.name_placeholder': { nl: 'Dustin Gunzel', en: 'Dustin Gunzel' },
  'inquiry.form.email_label': { nl: 'E-mailadres', en: 'Email Address' },
  'inquiry.form.email_placeholder': { nl: 'dustin@redzen.nl', en: 'dustin@redzen.nl' },
  'inquiry.form.phone_label': { nl: 'Telefoonnummer', en: 'Phone Number' },
  'inquiry.form.phone_placeholder': { nl: '+31 6 12345678', en: '+31 6 12345678' },
  'inquiry.form.dates_header': { nl: 'Gewenste Datums', en: 'Desired Dates' },
  'inquiry.form.checkin_label': { nl: 'Incheckdatum & Tijd', en: 'Check-In Date & Time' },
  'inquiry.form.checkout_label': { nl: 'Uitcheckdatum & Tijd', en: 'Check-Out Date & Time' },
  'inquiry.form.guests_label': { nl: 'Aantal Gasten', en: 'Number of Guests' },
  'inquiry.form.guests_unit': { nl: 'Gasten', en: 'Guests' },
  'inquiry.form.msg_label': { nl: 'Aanvullende opmerkingen of specifieke wellness-eisen', en: 'Additional notes or specific wellness requirements' },
  'inquiry.form.msg_placeholder': { nl: 'Laat ons weten of u specifieke biologische arrangementen, therapeutische massages, allergieën of specifieke temperatuurwensen voor uw sauna heeft...', en: 'Let us know if you require specific organic packages, therapeutic massages, have allergies, or specific temperature preferences for your sauna...' },
  'inquiry.form.active_preselect': { nl: 'Actieve voorselectie:', en: 'Active preselection:' },
  'inquiry.form.clear_preselect': { nl: 'Wissen', en: 'Clear' },
  'inquiry.form.secure_note': { nl: 'Boekingsbonnen worden opgeslagen in een beveiligde map op uw Google Drive.', en: 'Booking vouchers are stored in a secure folder on your Google Drive.' },
  'inquiry.form.submitting': { nl: 'Boeking Verzenden...', en: 'Sending Booking...' },
  'inquiry.form.submit_btn': { nl: 'Verzend Boekingsaanvraag', en: 'Send Booking Request' },
  'inquiry.success.title': { nl: 'Boekingsaanvraag Succesvol Gemaakt!', en: 'Booking Request Successfully Created!' },
  'inquiry.success.desc': { nl: 'Uw aanvraag is veilig verwerkt. Er is een gecodeerde boekingsbon gegenereerd en direct opgeslagen in uw persoonlijke Google Drive-account.', en: 'Your request has been securely processed. An encrypted booking voucher has been generated and saved directly inside your personal Google Drive account.' },
  'inquiry.success.file_id': { nl: 'Google Drive Bestand ID:', en: 'Google Drive File ID:' },
  'inquiry.success.next_desc': { nl: 'U kunt uw boekingsstatus, bestandsdetails en volledige transactiehistorie hieronder inzien in het real-time Gastenboek ledger.', en: 'You can inspect your booking status, file details, and full transaction history below in the real-time Guest Ledger.' },
  'inquiry.success.new_btn': { nl: 'Nieuwe Boeking Aanmaken', en: 'Create New Booking' },

  // Client Dashboard (Gastenboek)
  'dash.badge': { nl: 'Persoonlijke Ledger', en: 'Personal Ledger' },
  'dash.heading': { nl: 'Uw Gastenboek & Boekingshistorie', en: 'Your Guest Book & Booking History' },
  'dash.desc': { nl: 'Rechtstreeks gesynchroniseerd met uw Google Drive. Dit zijn uw soevereine wellness-dossiers. Geen enkele RedZen-database slaat deze gegevens op.', en: 'Synchronized directly with your Google Drive. These are your sovereign wellness dossiers. No RedZen database stores this information.' },
  'dash.syncing': { nl: 'Laden van Google Drive bestanden...', en: 'Loading Google Drive files...' },
  'dash.refresh': { nl: 'Synchroniseren', en: 'Sync' },
  'dash.no_records': { nl: 'Geen boekingsrecords gevonden', en: 'No booking records found' },
  'dash.no_records_desc': { nl: 'U heeft nog geen boekingsaanvragen ingediend vanaf dit Google-account. Gebruik het formulier hierboven om uw eerste soevereine wellness-dossier te creëren!', en: 'You have not submitted any booking requests from this Google account yet. Use the form above to create your first sovereign wellness dossier!' },
  'dash.card.suite': { nl: 'Suite:', en: 'Suite:' },
  'dash.card.guests': { nl: 'Gasten:', en: 'Guests:' },
  'dash.card.dates': { nl: 'Datums:', en: 'Dates:' },
  'dash.card.created': { nl: 'Gemaakt op:', en: 'Created on:' },
  'dash.card.file_id': { nl: 'Drive Bestand:', en: 'Drive File:' },
  'dash.status.pending': { nl: 'In behandeling', en: 'Pending' },
  'dash.status.confirmed': { nl: 'Bevestigd', en: 'Confirmed' },
  'dash.status.cancelled': { nl: 'Geannuleerd', en: 'Cancelled' },

  // Footer & Brand details
  'footer.desc': { nl: 'Emissievrije eco-spa thermodynamica, contactloze selfservice en absolute gastenprivacy gecombineerd in Almere.', en: 'Zero-emission eco-spa thermodynamics, contactless self-service, and absolute guest privacy combined in Almere.' },
  'footer.links.header': { nl: 'Navigatie', en: 'Navigation' },
  'footer.contact.header': { nl: 'Direct Contact', en: 'Direct Contact' },
  'footer.legal.header': { nl: 'Informatie & Licenties', en: 'Information & Licenses' },
  'footer.legal.privacy': { nl: 'Garantie van Privacy', en: 'Privacy Guarantee' },
  'footer.legal.terms': { nl: 'Algemene Voorwaarden', en: 'Terms of Service' },
  'footer.legal.disclaimer': { nl: 'Let op: RedZen Almere is momenteel in de geplande ontwikkelingsfase. Alle suites en diensten weerspiegelen technische ontwerpen en geplande lanceringen voor 2026.', en: 'Please note: RedZen Almere is currently in the planned development phase. All suites and services reflect engineering designs and scheduled launches for 2026.' },
  'footer.copyright': { nl: 'Alle rechten voorbehouden. Ontworpen door Dustin Gunzel.', en: 'All rights reserved. Designed by Dustin Gunzel.' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('redzen_locale');
    if (saved === 'en' || saved === 'nl') {
      return saved;
    }
    return 'nl'; // Default to Dutch
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('redzen_locale', lang);
  };

  const t = (key: string): string => {
    const translation = TRANSLATIONS[key];
    if (!translation) {
      // Return key itself if not found
      return key;
    }
    return translation[language] || translation['nl'] || key;
  };

  const tData = <T,>(obj: { nl: T; en: T }): T => {
    return obj[language] || obj['nl'];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tData }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
