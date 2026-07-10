import { useState } from 'react';
import { Wifi, Radio } from 'lucide-react';
import { Plan, PlanType } from '../types';
import { hotspotPlans, directPlans } from '../data/plans';
import PlanCard from './PlanCard';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onSelectPlan: (plan: Plan) => void;
}

export default function PlansSection({ onSelectPlan }: Props) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<PlanType>('hotspot');

  const plans = activeTab === 'hotspot' ? hotspotPlans : directPlans;

  return (
    <section className="bg-[#0a0e1a] py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-white font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight mb-2 sm:mb-4">
            {t('plans.title')}
          </h2>
          <p className="text-white/50 text-sm sm:text-lg max-w-xl mx-auto hidden sm:block">
            {t('plans.subtitle')}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-6 sm:mb-10">
          <div className="inline-flex bg-[#111827] border border-white/10 rounded-2xl p-1.5 gap-1">
            <button
              onClick={() => setActiveTab('hotspot')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'hotspot'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Wifi size={16} />
              {t('plans.tabHotspot')}
            </button>
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'direct'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Radio size={16} />
              {t('plans.tabDirect')}
            </button>
          </div>
        </div>

        {/* Plan cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={onSelectPlan} />
          ))}
        </div>

        {/* Payment note */}
        <div className="mt-10 flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 max-w-2xl mx-auto">
          <div className="text-cyan-400 mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            {t('plans.note')}
            <span className="text-cyan-400 font-semibold">{t('plans.noteHighlight')}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
