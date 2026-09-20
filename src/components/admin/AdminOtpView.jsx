import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Clock, RefreshCw, Lock, Eye, EyeOff, Copy, Check, ShieldCheck } from 'lucide-react';
import { Logo } from '../Logo';
import { verifyAdminOtp } from '../../services/authService';

export const AdminOtpView = ({ step1Data, onAdminLoginSuccess, onBackToLogin }) => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // 5-minute timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 60s cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleCopyCode = () => {
    if (step1Data?.otpCodePreview) {
      navigator.clipboard.writeText(step1Data.otpCodePreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setOtpDigits(step1Data.otpCodePreview.split(''));
      handleVerify(step1Data.otpCodePreview);
    }
  };

  const handleVerify = async (codeStr) => {
    setError(null);
    if (secondsRemaining <= 0) {
      setError('This verification code has expired. Please request a new code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyAdminOtp(codeStr);
      if (res.success) {
        onAdminLoginSuccess(res.adminSession);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-stone-900 text-white rounded-3xl shadow-2xl border border-stone-800 p-8 sm:p-10 relative overflow-hidden animate-fade-in my-4">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="mb-3">
          <Logo light size="lg" />
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Admin 2-Step OTP Verification
        </h2>
        
        <p className="text-xs text-stone-400 mt-1 font-medium">
          6-Digit security code dispatched to admin account:
        </p>
        
        <div className="mt-2 inline-flex items-center gap-2 bg-stone-800 px-3 py-1.5 rounded-full border border-stone-700">
          <span className="text-xs font-bold text-amber-400 truncate max-w-[220px]">
            admin@funrado.com
          </span>
        </div>
      </div>

      {/* Admin OTP Banner */}
      {step1Data?.otpCodePreview && (
        <div className="mb-4 p-3 bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 rounded-2xl text-center shadow-md border border-amber-500">
          <p className="text-[10px] uppercase tracking-widest font-black text-amber-100">
            Admin Security OTP Code
          </p>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="font-black text-2xl tracking-widest bg-stone-900/40 text-amber-300 px-3 py-1 rounded-xl select-all font-mono">
              {step1Data.otpCodePreview}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-2 bg-stone-900/40 hover:bg-stone-900/60 text-white rounded-xl transition-colors"
              title="Copy & Auto-verify"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowEmailPreview(!showEmailPreview)}
            className="mt-2 text-[11px] font-bold text-stone-900 hover:text-white underline flex items-center justify-center gap-1 mx-auto"
          >
            {showEmailPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showEmailPreview ? 'Hide HTML Email Template' : 'View Official Admin HTML Email'}</span>
          </button>
        </div>
      )}

      {/* Email Template Preview */}
      {showEmailPreview && step1Data?.htmlEmailPreview && (
        <div className="mb-5 p-3 bg-stone-800 border border-stone-700 rounded-2xl max-h-56 overflow-y-auto">
          <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">HTML Email Template:</p>
          <iframe
            srcDoc={step1Data.htmlEmailPreview}
            title="Admin Email Preview"
            className="w-full h-44 border border-stone-700 rounded-xl bg-white"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs font-bold animate-shake">
          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* 6 Input Boxes */}
      <form onSubmit={(e) => { e.preventDefault(); handleVerify(otpDigits.join('')); }} className="space-y-6">
        <div>
          <label className="block text-center text-xs font-extrabold text-stone-300 uppercase tracking-wider mb-3">
            Enter 6-Digit Admin Security Code
          </label>
          <div className="flex justify-between gap-2 sm:gap-2.5">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isLoading || secondsRemaining <= 0}
                className={`w-11 sm:w-12 h-13 text-center text-xl font-black rounded-2xl border-2 transition-all focus:outline-none ${
                  digit 
                    ? 'bg-amber-500/10 border-amber-400 text-white shadow-sm' 
                    : 'bg-stone-800 border-stone-700 focus:border-amber-400 text-white'
                } disabled:opacity-50`}
              />
            ))}
          </div>
        </div>

        {/* Expiry Timer */}
        <div className="flex items-center justify-between text-xs font-bold text-stone-400 bg-stone-800 p-3 rounded-2xl border border-stone-700">
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${secondsRemaining < 60 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <span>Expires in:</span>
            <span className={`font-extrabold font-mono text-sm ${secondsRemaining < 60 ? 'text-rose-400' : 'text-white'}`}>
              {formatTimer(secondsRemaining)}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading || otpDigits.join('').length !== 6 || secondsRemaining <= 0}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2 text-xs">
                <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                Verifying Admin Code...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span className="text-xs sm:text-sm tracking-wide">Verify & Access Dashboard</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={onBackToLogin}
              className="font-bold text-stone-400 hover:text-white underline transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
