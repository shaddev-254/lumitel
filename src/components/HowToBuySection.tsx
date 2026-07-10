import { Package, Smartphone, Lock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const steps = [
  { Icon: Package,     titleKey: 'htb.step1.title', descKey: 'htb.step1.desc', color: 'text-cyan-400',   bg: 'bg-cyan-400/15',   border: 'border-cyan-400/30',   num: '01' },
  { Icon: Smartphone,  titleKey: 'htb.step2.title', descKey: 'htb.step2.desc', color: 'text-blue-400',   bg: 'bg-blue-400/15',   border: 'border-blue-400/30',   num: '02' },
  { Icon: Lock,        titleKey: 'htb.step3.title', descKey: 'htb.step3.desc', color: 'text-yellow-400', bg: 'bg-yellow-400/15', border: 'border-yellow-400/30', num: '03' },
  { Icon: ShieldCheck, titleKey: 'htb.step4.title', descKey: 'htb.step4.desc', color: 'text-green-400',  bg: 'bg-green-400/15',  border: 'border-green-400/30',  num: '04' },
];

export default function HowToBuySection() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#0a0e1a] py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-white font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight">
            {t('htb.title')}
          </h2>
          <div className="mt-2 mx-auto w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-400/30 via-yellow-400/30 to-green-400/30" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map(({ Icon, titleKey, descKey, color, bg, border, num }) => (
              <div
                key={num}
                className={`relative flex flex-col items-center text-center bg-[#111827] border ${border} rounded-2xl p-5 sm:p-6`}
              >
                {/* Number badge */}
                <span className={`absolute -top-3 left-4 text-[10px] font-black tracking-widest ${color} bg-[#111827] px-2`}>
                  {num}
                </span>

                {/* Icon circle */}
                <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mb-4 border ${border}`}>
                  <Icon size={28} className={color} />
                </div>

                <p className={`${color} font-black text-sm uppercase tracking-wide mb-2`}>
                  {t(titleKey)}
                </p>
                <p className="text-white/50 text-xs leading-relaxed">
                  {t(descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
