import { useState, useRef, useEffect } from 'react';
import { Wifi, CreditCard, Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, Language } from '../i18n/translations';

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Wifi size={18} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0a0e1a] animate-pulse" />
            </div>
            <div>
              <span className="text-white font-black text-lg tracking-tight leading-none block">
                {t('header.brand')}
              </span>
              <span className="text-cyan-400 text-[10px] font-semibold tracking-widest uppercase leading-none">
                {t('header.tagline')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language selector */}
            <div className="relative" ref={ref}>
              <button
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 sm:px-3 py-2 transition-colors"
              >
                <Globe size={15} className="text-cyan-400" />
                <span className="text-base leading-none">{current.flag}</span>
                <span className="text-white/80 text-xs font-semibold hidden sm:inline">{current.nativeLabel}</span>
                <ChevronDown size={13} className={`text-white/50 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#111827] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code as Language); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5 ${
                        lang === l.code ? 'bg-cyan-500/10' : ''
                      }`}
                    >
                      <span className="text-lg leading-none">{l.flag}</span>
                      <div className="flex-1">
                        <span className="text-white text-sm font-semibold block leading-tight">{l.nativeLabel}</span>
                        <span className="text-white/40 text-[10px] leading-tight">{l.label}</span>
                      </div>
                      {lang === l.code && <Check size={15} className="text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#plans"
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-[#0a0e1a] font-bold text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-yellow-400/20"
            >
              <CreditCard size={15} />
              <span className="hidden md:inline">{t('header.payBtnPrefix')}</span>
              <span className="font-black">Lumi Pay</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
