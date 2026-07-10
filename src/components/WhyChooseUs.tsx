import { Gauge, Shield, CreditCard, ThumbsUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const reasons = [
  { Icon: Gauge, color: 'text-green-400', bg: 'bg-green-400/10', titleKey: 'why.speedTitle', descKey: 'why.speedDesc' },
  { Icon: Shield, color: 'text-cyan-400', bg: 'bg-cyan-400/10', titleKey: 'why.reliabilityTitle', descKey: 'why.reliabilityDesc' },
  { Icon: CreditCard, color: 'text-yellow-400', bg: 'bg-yellow-400/10', titleKey: 'why.paymentTitle', descKey: 'why.paymentDesc' },
  { Icon: ThumbsUp, color: 'text-blue-400', bg: 'bg-blue-400/10', titleKey: 'why.satisfactionTitle', descKey: 'why.satisfactionDesc' },
];

export default function WhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section id="why" className="bg-[#0d1220] py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 sm:p-12">
          <h2 className="text-white font-black text-2xl sm:text-3xl tracking-tight mb-8">
            {t('why.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reasons.map(({ Icon, color, bg, titleKey, descKey }) => (
              <div key={titleKey} className="flex items-start gap-4">
                <div className={`${bg} rounded-xl p-3 flex-shrink-0`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <p className={`${color} font-black text-sm tracking-wider mb-1`}>{t(titleKey)}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{t(descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111827] border border-white/10 rounded-2xl px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">{t('why.helpTitle')}</p>
              <p className="text-white/50 text-xs">{t('why.helpDesc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 px-5 py-2.5 rounded-xl shadow-lg shadow-yellow-400/20">
            <CreditCard size={16} className="text-[#0a0e1a]" />
            <span className="text-[#0a0e1a] font-black text-sm">Lumi Pay</span>
          </div>
        </div>
      </div>
    </section>
  );
}
