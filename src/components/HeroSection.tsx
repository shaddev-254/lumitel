import { Satellite } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="plans" className="relative pt-20 pb-4 sm:pb-8 px-4 sm:px-6 bg-gradient-to-b from-[#0a0e1a] to-[#0d1225]">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full px-3 sm:px-4 py-1.5 mb-3 sm:mb-4">
          <Satellite size={13} className="text-cyan-400" />
          <span className="text-cyan-400 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">{t('hero.badge')}</span>
        </div>

        <h1 className="font-black text-white text-2xl sm:text-4xl lg:text-5xl tracking-tight mb-2">
          {t('hero.title')}
        </h1>

        <p className="text-white/50 text-xs sm:text-base max-w-xl mx-auto hidden sm:block">
          {t('hero.subtitle')}
        </p>
      </div>
    </section>
  );
}
