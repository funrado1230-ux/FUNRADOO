import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Clock, RefreshCw, Edit2, CheckCircle, Lock, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OtpVerificationView = () => {
  const {
    targetEmail,
    otpCodePreview,
    htmlEmailPreview,
    secondsRemaining,
    resendCooldown,
    otpAttemptsLeft,
    isLoading,
    error,
    successMsg,
    verifyOtp,
    resendOtp,
    setAuthStep,
    skipLogin
  } = useAuth();

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      verifyOtp(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
      verifyOtp(pastedData);
    }
  };

  const handleCopyCode = () => {
    if (otpCodePreview) {
      navigator.clipboard.writeText(otpCodePreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      const digits = otpCodePreview.split('');
      setOtpDigits(digits);
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const fullCode = otpDigits.join('');
    verifyOtp(fullCode);
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in space-y-5 text-left">
      
      {/* Target Email Box */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-[#0e0e13] px-4 py-2 rounded-full border border-stone-800">
          <span className="text-xs font-bold text-stone-300 truncate max-w-[220px]">
            {targetEmail}
          </span>
          <button
            onClick={() => setAuthStep('login')}
            className="text-[11px] font-extrabold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
      </div>

      {/* Generated OTP Code Display Banner */}
      {otpCodePreview && (
        <div className="p-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl text-center shadow-lg border border-amber-500 max-w-md mx-auto">
          <p className="text-[10px] uppercase tracking-widest font-black text-amber-100">
            FUNRADO 6-Digit OTP Security Code
          </p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="font-black text-2xl tracking-widest bg-black/30 px-4 py-1 rounded-xl select-all font-mono">
              {otpCodePreview}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-2 bg-black/30 hover:bg-black/50 rounded-xl transition-colors text-white"
              title="Copy and Auto-fill OTP"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowEmailPreview(!showEmailPreview)}
            className="mt-2 text-[11px] font-bold text-stone-900 hover:text-white underline flex items-center justify-center gap-1 mx-auto"
          >
            {showEmailPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showEmailPreview ? 'Hide HTML Email Template' : 'View Official FUNRADO HTML Email'}</span>
          </button>
        </div>
      )}

      {/* HTML Email Template Preview */}
      {showEmailPreview && htmlEmailPreview && (
        <div className="p-3 bg-[#0e0e13] border border-stone-800 rounded-2xl max-h-56 overflow-y-auto">
          <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Official Email Template Output:</p>
          <iframe
            srcDoc={htmlEmailPreview}
            title="Email Preview"
            className="w-full h-44 border border-stone-800 rounded-xl bg-white"
          />
        </div>
      )}

      {/* Notifications */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-bold animate-bounce-short">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-rose-300 text-xs font-bold animate-shake">
          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* 6-Digit OTP Form */}
      <form onSubmit={handleVerifySubmit} className="space-y-4 max-w-md mx-auto">
        
        <div>
          <label className="block text-center text-xs font-extrabold text-stone-400 uppercase tracking-wider mb-3">
            Enter 6-Digit Verification Code
          </label>
          <div className="flex justify-between gap-2 sm:gap-2.5" onPaste={handlePaste}>
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
                disabled={isLoading || secondsRemaining <= 0 || otpAttemptsLeft <= 0}
                className={`w-11 sm:w-12 h-13 text-center text-xl font-black rounded-2xl border transition-all focus:outline-none ${
                  digit 
                    ? 'bg-white/10 border-white text-white shadow-md' 
                    : 'bg-[#0e0e13] border-stone-800 focus:border-stone-500 text-white'
                } disabled:opacity-50`}
              />
            ))}
          </div>
        </div>

        {/* 5-Min Timer & Attempt Counter */}
        <div className="flex items-center justify-between text-xs font-bold text-stone-400 bg-[#0e0e13] p-3 rounded-2xl border border-stone-800">
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${secondsRemaining < 60 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <span>Expires in:</span>
            <span className={`font-extrabold font-mono text-sm ${secondsRemaining < 60 ? 'text-rose-400' : 'text-white'}`}>
              {formatTimer(secondsRemaining)}
            </span>
          </div>

          <div className="text-[11px] font-semibold text-stone-400">
            {otpAttemptsLeft > 0 ? (
              <span>{otpAttemptsLeft} attempts left</span>
            ) : (
              <span className="text-rose-400 font-extrabold">0 attempts left</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <button
            type="submit"
            disabled={isLoading || otpDigits.join('').length !== 6 || secondsRemaining <= 0 || otpAttemptsLeft <= 0}
            className="w-full py-3.5 px-6 rounded-full bg-white text-stone-950 hover:bg-stone-200 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2 text-xs">
                <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                Verifying Code...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span className="tracking-wide">Verify Code & Access FUNRADO</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={resendOtp}
              disabled={resendCooldown > 0 || isLoading}
              className="font-bold text-amber-400 hover:text-amber-300 disabled:text-stone-600 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAuthStep('login')}
              className="font-bold text-stone-400 hover:text-white underline transition-colors"
            >
              Change Email
            </button>
          </div>
        </div>

      </form>

      {/* Skip Option */}
      <div className="pt-4 border-t border-stone-800/60 text-center">
        <button
          type="button"
          onClick={skipLogin}
          className="text-xs font-semibold text-stone-500 hover:text-stone-300 transition-colors"
        >
          Skip & Browse as Guest
        </button>
      </div>

    </div>
  );
};
