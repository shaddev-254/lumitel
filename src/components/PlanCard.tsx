import { CheckCircle, Rocket, TrendingUp, Zap, Star, ArrowRight } from 'lucide-react';
import { Plan } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}

const icons = {
  rocket: Rocket,
  'trending-up': TrendingUp,
  zap: Zap,
  star: Star,
};

export default function PlanCard({ plan, onSelect }: Props) {
  const { t } = useLanguage();
  const Icon = icons[plan.icon as keyof typeof icons] || Rocket;
  const isPopular = plan.badgeKey === 'plan.badge.popular';

  return (
    <div
      className={`relative flex flex-col bg-[#111827] border-2 ${plan.borderColor} rounded-2xl p-3.5 sm:p-5 lg:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl group ${
        isPopular ? 'ring-2 ring-cyan-500/40' : ''
      }`}
      style={{ boxShadow: isPopular ? '0 0 40px -10px rgba(6,182,212,0.3)' : undefined }}
    >
      {/* Badge */}
      <div className="mb-2.5 sm:mb-4">
        <span className={`inline-block ${plan.badgeColor} text-white text-[9px] sm:text-xs font-black tracking-wider uppercase px-2 sm:px-3 py-0.5 sm:py-1 rounded-full`}>
          {t(plan.badgeKey)}
        </span>
      </div>

      {/* Icon + Data row — compact on mobile */}
      <div className="flex items-center gap-2 mb-2 sm:block">
        <div className={`w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full ${plan.badgeColor} flex items-center justify-center flex-shrink-0 shadow-md sm:mb-3`}>
          <Icon size={16} className="text-white sm:hidden" />
          <Icon size={20} className="text-white hidden sm:block" />
        </div>
        {/* Data visible inline on mobile */}
        <div className="sm:hidden">
          <span className={`text-white font-black leading-none block ${plan.data.length > 6 ? 'text-base' : 'text-2xl'}`}>
            {plan.data}
          </span>
        </div>
      </div>

      {/* Data — desktop only (shown inline on mobile above) */}
      <div className="hidden sm:block mb-0.5">
        <span className={`text-white font-black leading-none ${plan.data.length > 6 ? 'text-2xl' : 'text-4xl'}`}>{plan.data}</span>
      </div>

      <div className={`${plan.accentColor} font-bold text-[10px] sm:text-sm uppercase tracking-wider mb-2.5 sm:mb-4 leading-tight`}>
        {t(plan.nameKey)}<span className="hidden sm:inline"> · {plan.duration}</span>
        <span className="sm:hidden block text-white/40 text-[9px] normal-case tracking-normal font-semibold">{plan.duration}</span>
      </div>

      {/* Features — show only on larger screens; hide on mobile to save space */}
      <ul className="hidden sm:flex flex-col space-y-2 mb-4 sm:mb-6 flex-1">
        {plan.features.map((_, i) => (
          <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
            <CheckCircle size={14} className={plan.accentColor} />
            {t(plan.featureKeys[i])}
          </li>
        ))}
      </ul>

      {/* Features compact — mobile only: just icons */}
      <div className="flex sm:hidden flex-wrap gap-1 mb-2.5">
        {plan.featureKeys.map((fk, i) => (
          <span key={i} className="flex items-center gap-1 text-white/60 text-[9px] font-medium">
            <CheckCircle size={9} className={plan.accentColor} />
            {t(fk)}
          </span>
        ))}
      </div>

      {/* Price */}
      <div className="mb-2.5 sm:mb-5">
        <span className={`${plan.accentColor} font-black text-xl sm:text-3xl`}>
          {plan.price.toLocaleString()}
        </span>
        <span className="text-white/50 font-semibold text-xs sm:text-sm ml-1">BIF</span>
      </div>

      {/* CTA */}
      <button
        onClick={() => onSelect(plan)}
        className={`w-full flex items-center justify-center gap-1.5 ${plan.badgeColor} hover:opacity-90 text-white font-bold py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wide transition-all duration-200`}
      >
        {t('plans.select')}
        <ArrowRight size={13} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}
