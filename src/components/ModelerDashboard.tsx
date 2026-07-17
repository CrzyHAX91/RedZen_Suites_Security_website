import React, { useState } from 'react';
import { ECO_ECONOMIC_BENEFITS } from '../data';
import { useLanguage } from '../LanguageContext';
import { Sparkles, TrendingUp, DollarSign, Leaf, Zap, HelpCircle, Award, Scale, Check } from 'lucide-react';
import { motion } from 'motion/react';

export default function ModelerDashboard() {
  const { locale, t, tData } = useLanguage();

  // Simulator states
  const [occupancy, setOccupancy] = useState(70); // 10% to 100%
  const [extraHoursRate, setExtraHoursRate] = useState(40); // % of guest who book extra hours
  const [averageArrangementSpent, setAverageArrangementSpent] = useState(35); // € spent on packages
  const [hasSubsidies, setHasSubsidies] = useState(true);

  // Financial baseline formulas derived from Dustin's business plan (Page 2 & 3 of Pitch/OP)
  // Vaste lasten: €5,500/mnd. Variabele kosten: 15% of booking value.
  // Base price 2h: €180. Additional hour: €60. Arrangement options: €25 - €60.
  
  // Total capacity per day: 2 suites * 6 slots of 2h = 12 bookings max per day.
  // 30 days per month * 12 bookings capacity = 360 bookings max capacity.
  const maxMonthlyBookings = 360;
  const currentBookings = Math.round((occupancy / 100) * maxMonthlyBookings);
  
  // Revenue calculations
  const basePriceRevenue = currentBookings * 180;
  const extraHoursRevenue = currentBookings * (extraHoursRate / 100) * 60;
  const upsellRevenue = currentBookings * averageArrangementSpent;
  const grossRevenue = basePriceRevenue + extraHoursRevenue + upsellRevenue;
  
  // Cost calculations
  const variableCostPercent = 15; // 15% as declared in KVK plan
  const variableCosts = grossRevenue * (variableCostPercent / 100);
  const fixedCosts = 5500; // €5,500 per month
  const totalCosts = fixedCosts + variableCosts;
  
  // Government Subsidies ROI impact (MIA, EIA, ISDE amortized monthly over 5 years)
  // Total subsidy estimation: ISDE (~€3,000 for hybrid pump), EIA/MIA tax advantage (~14% of €80,000 investment = €11,200).
  // Total cash subsidy benefits = €14,200. Amortized over 60 months = €236 / month net value.
  const monthlySubsidyBenefit = hasSubsidies ? 236 : 0;
  const netProfit = grossRevenue - totalCosts + monthlySubsidyBenefit;
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  // CO2 offset calculation: 1.2 kg CO2 saved per hour of sauna heated by hybrid pump vs gas.
  // Each booking averages 2.5 hours * 1.2 kg CO2 * total bookings.
  const co2SavedKg = Math.round(currentBookings * 2.5 * 1.2);

  // Regional economic booster: €1 spent at RedZen generates ~€1.35 in local Almere economies
  // (via bio-farms, laundry services, local freelance masseurs, cleaning jobs).
  const localEconomicImpactMultiplier = 1.35;
  const almereEconomicInjection = Math.round(grossRevenue * localEconomicImpactMultiplier);

  // Break-even check
  const isBreakEven = currentBookings >= 30;

  return (
    <section id="modeler" className="py-24 bg-zen-950 border-t border-gold-900/15 text-gold-50 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_left,rgba(220,38,38,0.04),transparent_50%)]" />
      <div className="absolute right-0 top-1/4 w-96 h-96 rounded-full bg-crimson-900/5 blur-[150px] z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-crimson-500">
            <TrendingUp size={14} />
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold">{t('modeler.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
            {t('modeler.heading')}
          </h2>
          <div className="w-12 h-[1px] bg-crimson-600 mx-auto" />
          <p className="font-sans text-xs sm:text-sm text-zen-300 font-light leading-relaxed">
            {t('modeler.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Interactive Parameters Panel (Left) */}
          <div className="lg:col-span-5 bg-zen-900/80 border border-crimson-950/40 rounded-sm p-6 sm:p-8 space-y-8 shadow-2xl relative">
            <div className="absolute -left-1 top-6 w-1 h-12 bg-crimson-600" />
            <h3 className="font-serif text-xl text-white">{t('modeler.console')}</h3>
            <p className="text-xs text-zen-400 font-sans font-light leading-relaxed">
              {t('modeler.console_desc')}
            </p>

            <div className="space-y-6 pt-4 border-t border-zen-800">
              
              {/* Parameter 1: Occupancy Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="font-semibold text-zen-200">{t('modeler.param.occupancy')}</span>
                  <span className="text-crimson-400 font-bold font-display">{occupancy}% ({currentBookings} {t('modeler.param.bookings')})</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="5"
                  value={occupancy}
                  onChange={(e) => setOccupancy(parseInt(e.target.value))}
                  className="w-full accent-crimson-600 cursor-pointer h-1 bg-zen-800 rounded-sm"
                />
                <div className="flex justify-between text-[9px] text-zen-500 font-mono">
                  <span>10% ({Math.round(0.1 * maxMonthlyBookings)} {locale === 'nl' ? 'boekingen' : 'bookings'})</span>
                  <span>70% ({locale === 'nl' ? 'Gem. Doel' : 'Avg. Target'})</span>
                  <span>100% ({maxMonthlyBookings} {locale === 'nl' ? 'boekingen' : 'bookings'})</span>
                </div>
              </div>

              {/* Parameter 2: Extra Hours Option */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="font-semibold text-zen-200">{t('modeler.param.extra_hours')}</span>
                  <span className="text-crimson-400 font-bold font-display">{extraHoursRate}% {locale === 'nl' ? 'van de boekingen' : 'of all bookings'}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={extraHoursRate}
                  onChange={(e) => setExtraHoursRate(parseInt(e.target.value))}
                  className="w-full accent-crimson-600 cursor-pointer h-1 bg-zen-800 rounded-sm"
                />
                <div className="flex justify-between text-[9px] text-zen-500 font-mono">
                  <span>0% ({locale === 'nl' ? 'strikt 2 uur' : 'strictly 2h'})</span>
                  <span>100% (+1 {locale === 'nl' ? 'uur upgrade' : 'hour upgrade'})</span>
                </div>
              </div>

              {/* Parameter 3: Average Arrangement Spend */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-sans">
                  <span className="font-semibold text-zen-200">{t('modeler.param.upsell')}</span>
                  <span className="text-crimson-400 font-bold font-display">€{averageArrangementSpent} {locale === 'nl' ? 'per boeking' : 'per booking'}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="5"
                  value={averageArrangementSpent}
                  onChange={(e) => setAverageArrangementSpent(parseInt(e.target.value))}
                  className="w-full accent-crimson-600 cursor-pointer h-1 bg-zen-800 rounded-sm"
                />
                <div className="flex justify-between text-[9px] text-zen-500 font-mono">
                  <span>€10 ({locale === 'nl' ? 'Kopje thee' : 'Cup of tea'})</span>
                  <span>€100 ({locale === 'nl' ? 'Volledig bio-pakket' : 'Full bio-package'})</span>
                </div>
              </div>

              {/* Parameter 4: Toggle Government Subsidies */}
              <div className="flex items-center justify-between p-3.5 bg-zen-950/60 border border-zen-800 rounded-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-zen-200 block">{t('modeler.param.subsidies')}</span>
                  <span className="text-[10px] text-zen-500 font-sans block leading-none">{locale === 'nl' ? 'MIA, Vamil & EIA belastingvoordelen' : 'MIA, Vamil & EIA tax incentives'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasSubsidies(!hasSubsidies)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 outline-none cursor-pointer ${
                    hasSubsidies ? 'bg-crimson-600' : 'bg-zen-850 border border-zen-700'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    hasSubsidies ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>

            {/* Quick business stats summary */}
            <div className="pt-6 border-t border-zen-800 grid grid-cols-2 gap-4 text-xs font-mono text-zen-400">
              <div>
                <span className="text-[9px] uppercase font-bold text-zen-500 block">{locale === 'nl' ? 'Vereiste Break-even' : 'Required Break-even'}</span>
                <p className="text-white font-semibold mt-1">30 {locale === 'nl' ? 'boekingen / maand' : 'bookings / month'}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-zen-500 block">{locale === 'nl' ? 'Schatting Status' : 'Projection Status'}</span>
                <p className={`font-bold mt-1 flex items-center gap-1 ${isBreakEven ? 'text-emerald-400' : 'text-amber-500'}`}>
                  {isBreakEven ? (locale === 'nl' ? 'Winstgevend' : 'Profit-yielding') : 'Pre-Break-even'}
                </p>
              </div>
            </div>

          </div>

          {/* Business Intelligence Output Dashboard (Right) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Real-time Economic Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Monthly Revenue Card */}
              <div className="bg-zen-900 border border-crimson-950/20 rounded-sm p-5 space-y-2 shadow-lg hover:border-crimson-600/30 transition-all">
                <div className="flex justify-between items-center text-zen-400">
                  <span className="text-[10px] uppercase font-bold font-sans tracking-wider">{t('modeler.metric.revenue')}</span>
                  <DollarSign size={14} className="text-crimson-500" />
                </div>
                <h4 className="font-display font-bold text-2xl text-white tracking-tight">
                  €{grossRevenue.toLocaleString('nl-NL')}
                </h4>
                <p className="text-[10px] text-zen-500 font-sans leading-none">
                  €{basePriceRevenue.toLocaleString('nl-NL')} {locale === 'nl' ? 'basis +' : 'base +'} €{extraHoursRevenue.toLocaleString('nl-NL')} {locale === 'nl' ? 'extra' : 'extra'}
                </p>
              </div>

              {/* Net Profit Card */}
              <div className="bg-zen-900 border border-crimson-950/20 rounded-sm p-5 space-y-2 shadow-lg hover:border-crimson-600/30 transition-all">
                <div className="flex justify-between items-center text-zen-400">
                  <span className="text-[10px] uppercase font-bold font-sans tracking-wider">{t('modeler.metric.profit')}</span>
                  <TrendingUp size={14} className="text-emerald-400" />
                </div>
                <h4 className="font-display font-bold text-2xl text-emerald-400 tracking-tight">
                  €{Math.round(netProfit).toLocaleString('nl-NL')}
                </h4>
                <p className="text-[10px] text-zen-500 font-sans leading-none">
                  {profitMargin > 0 ? `${profitMargin.toFixed(1)}% ${locale === 'nl' ? 'netto winstmarge' : 'net operating margin'}` : (locale === 'nl' ? 'Negatieve marge' : 'Negative margin')}
                </p>
              </div>

              {/* CO2 Emissions Offset */}
              <div className="bg-zen-900 border border-crimson-950/20 rounded-sm p-5 space-y-2 shadow-lg hover:border-crimson-600/30 transition-all">
                <div className="flex justify-between items-center text-zen-400">
                  <span className="text-[10px] uppercase font-bold font-sans tracking-wider">{t('modeler.metric.co2')}</span>
                  <Leaf size={14} className="text-emerald-400" />
                </div>
                <h4 className="font-display font-bold text-2xl text-emerald-400 tracking-tight">
                  {co2SavedKg.toLocaleString('nl-NL')} kg
                </h4>
                <p className="text-[10px] text-zen-500 font-sans leading-none">
                  {locale === 'nl' ? "Vergeleken met gasgestookte sauna's" : "Compared to gas-heated saunas"}
                </p>
              </div>

            </div>

            {/* Micro economic regional injection box */}
            <div className="bg-gradient-to-r from-crimson-950/30 to-zen-900 border border-crimson-900/25 rounded-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
              <div className="space-y-1 max-w-md">
                <span className="text-[9px] uppercase font-bold text-crimson-400 tracking-widest block font-sans">{locale === 'nl' ? 'Almere Economische Booster' : 'Almere Economic Booster'}</span>
                <h4 className="font-serif text-lg text-white font-light">
                  {t('modeler.metric.impact')}
                </h4>
                <p className="text-xs text-zen-400 font-sans leading-relaxed">
                  {t('modeler.metric.impact_desc')}
                </p>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <span className="text-[10px] text-zen-400 uppercase font-bold block">{locale === 'nl' ? 'Jaarlijkse Lokale Impact' : 'Annual Local Impact'}</span>
                <span className="font-display font-bold text-2xl text-white block mt-1">
                  €{(almereEconomicInjection * 12).toLocaleString('nl-NL')}
                </span>
                <span className="text-[9px] text-crimson-400 font-mono">{locale === 'nl' ? '1.35x Economische Multiplier' : '1.35x Economic Multiplier'}</span>
              </div>
            </div>

            {/* Strategic Benefits List (MIA / Vamil / EIA Analysis) */}
            <div className="space-y-4">
              <h4 className="text-xs font-display uppercase font-bold text-zen-300 tracking-widest pl-1">
                {locale === 'nl' ? 'Eco-Economische Voordelen van RedZen' : 'Eco-Economic Advantages of RedZen'}
              </h4>
              
              <div className="grid grid-cols-1 gap-3">
                {(tData(ECO_ECONOMIC_BENEFITS) as any[]).map((benefit, index) => (
                  <div 
                    key={index}
                    className="bg-zen-900/50 border border-zen-900 p-4 rounded-sm flex items-start gap-4 hover:border-crimson-950/40 transition-colors"
                  >
                    <div className="p-2 bg-crimson-950/60 border border-crimson-900/20 text-crimson-400 rounded shrink-0">
                      {index === 0 ? <Award size={16} /> : index === 1 ? <Zap size={16} /> : index === 2 ? <Leaf size={16} /> : index === 3 ? <TrendingUp size={16} /> : <Scale size={16} />}
                    </div>
                    
                    <div className="space-y-1 flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-white">{benefit.title}</span>
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <span className="text-zen-500 line-through">{benefit.current}</span>
                          <span className="text-emerald-400 font-bold">{benefit.optimized}</span>
                        </div>
                      </div>
                      <p className="text-xs text-zen-400 font-sans leading-relaxed font-light">{benefit.description}</p>
                      <div className="text-[9px] tracking-wider uppercase font-bold text-crimson-400 font-sans pt-1">
                        {locale === 'nl' ? 'Verwachte impact: ' : 'Expected impact: '}{benefit.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
