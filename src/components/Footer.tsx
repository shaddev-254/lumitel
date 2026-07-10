import { Wifi } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0a0e1a] border-t border-white/10 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <Wifi size={16} className="text-white" />
          </div>
          <div>
            <span className="text-white font-black text-base tracking-tight leading-none block">STARLINK TO CELL</span>
            <span className="text-cyan-400 text-[10px] font-semibold tracking-widest uppercase">BURUNDI</span>
          </div>
        </div>

        <p className="text-white/30 text-sm text-center">
          &copy; {new Date().getFullYear()} {t('footer.copyright')}
        </p>

        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 px-4 py-2 rounded-lg">
          <span className="text-yellow-400 font-black text-sm">Lumi Pay</span>
          <span className="text-white/40 text-xs">{t('footer.secure')}</span>
        </div>
      </div>
    </footer>
  );
}
