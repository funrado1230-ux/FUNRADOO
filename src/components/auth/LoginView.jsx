import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, UserPlus, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginView = () => {
  const [loginMode, setLoginMode] = useState('otp'); // 'otp' | 'password'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { 
    loginCustomer, 
    loginWithEmailOtp,
    loginWithGoogle, 
    setAuthStep, 
    skipLogin, 
    isLoading, 
    error, 
    setError 
  } = useAuth();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginMode === 'otp') {
      loginWithEmailOtp(emailInput);
    } else {
      loginCustomer({
        email: emailInput,
        password: passwordInput
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in space-y-6">
      
      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs font-bold animate-shake max-w-md mx-auto">
          <div className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">!</div>
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Tab Switcher: Email OTP vs Account Password */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#121217] border border-stone-800/80 rounded-full max-w-md mx-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => { setLoginMode('otp'); setError(null); }}
          className={`py-2.5 px-4 rounded-full transition-all flex items-center justify-center gap-2 ${
            loginMode === 'otp'
              ? 'bg-white text-stone-950 font-black shadow-md'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email OTP</span>
        </button>

        <button
          type="button"
          onClick={() => { setLoginMode('password'); setError(null); }}
          className={`py-2.5 px-4 rounded-full transition-all flex items-center justify-center gap-2 ${
            loginMode === 'password'
              ? 'bg-white text-stone-950 font-black shadow-md'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>FUNRADO Password</span>
        </button>
      </div>

      {/* Google OAuth Capsule Button */}
      <div className="max-w-md mx-auto">
        <button
          type="button"
          onClick={loginWithGoogle}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-full border border-stone-800 hover:border-stone-600 bg-[#0e0e13]/80 hover:bg-[#16161f] text-white font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-xl group cursor-pointer disabled:opacity-50"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span className="text-sm font-semibold tracking-wide">Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-stone-800/80 w-full" />
          <span className="bg-[#070709] px-4 text-xs font-mono text-stone-500 uppercase tracking-widest absolute">
            or
          </span>
        </div>

        {/* Email Form with Capsule Input & Embedded Arrow */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* Email Input Capsule */}
          <div className="relative w-full flex items-center rounded-full border border-stone-800 focus-within:border-stone-500 bg-[#0e0e13]/80 px-6 py-1.5 transition-all shadow-xl group">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setError(null); }}
              placeholder="info@gmail.com"
              className="w-full bg-transparent border-none text-white placeholder-stone-500 text-sm sm:text-base focus:outline-none py-3 pr-14 font-medium"
              required
            />

            {/* Embedded Arrow Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !emailInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1c1c24] hover:bg-white hover:text-stone-950 text-stone-300 flex items-center justify-center transition-all cursor-pointer font-black shadow-lg active:scale-95 disabled:opacity-40"
              title="Submit Email"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Input (If Password Mode Active) */}
          {loginMode === 'password' && (
            <div className="space-y-2 pt-1 animate-fade-in">
              <div className="relative w-full flex items-center rounded-full border border-stone-800 focus-within:border-stone-500 bg-[#0e0e13]/80 px-6 py-1.5 transition-all shadow-xl">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setError(null); }}
                  placeholder="Enter your FUNRADO password"
                  className="w-full bg-transparent border-none text-white placeholder-stone-500 text-sm focus:outline-none py-3 pr-12 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-stone-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-right px-4">
                <button
                  type="button"
                  onClick={() => setAuthStep('forgot-password')}
                  className="text-xs font-semibold text-stone-400 hover:text-white underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 font-medium pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Never enter your Gmail password. Password is for FUNRADO only.</span>
          </div>

        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={() => setAuthStep('register')}
            className="font-bold text-stone-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Don't have an account? <strong className="underline text-white">Sign up</strong></span>
          </button>

          <button
            type="button"
            onClick={skipLogin}
            className="font-semibold text-stone-500 hover:text-stone-300 transition-colors"
          >
            Explore as Guest
          </button>
        </div>

      </div>

    </div>
  );
};
