import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Check, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterView = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { 
    registerCustomer, 
    loginWithGoogle, 
    setAuthStep, 
    skipLogin, 
    isLoading, 
    error, 
    setError 
  } = useAuth();

  const passwordCriteria = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'One uppercase (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'One lowercase (a-z)', met: /[a-z]/.test(password) },
    { label: 'One number (0-9)', met: /[0-9]/.test(password) },
    { label: 'One special char (!@#$%)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    registerCustomer({
      fullName,
      email,
      mobile,
      password,
      confirmPassword
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in space-y-4 text-left">
      
      {/* Error Banner */}
      {error && (
        <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs font-bold animate-shake">
          <div className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">!</div>
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Google OAuth Capsule */}
      <button
        type="button"
        onClick={loginWithGoogle}
        disabled={isLoading}
        className="w-full py-3.5 px-6 rounded-full border border-stone-800 hover:border-stone-600 bg-[#0e0e13]/80 hover:bg-[#16161f] text-white font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer disabled:opacity-50"
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span className="text-xs sm:text-sm font-semibold">Sign up with Google</span>
      </button>

      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-stone-800/80 w-full" />
        <span className="bg-[#060608] px-4 text-xs font-mono text-stone-500 uppercase tracking-widest absolute">
          or fill details
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        
        {/* Full Name Capsule */}
        <div className="relative flex items-center rounded-full border border-stone-800 focus-within:border-stone-500 bg-[#0e0e13]/80 px-5 py-1 transition-all">
          <User className="w-4 h-4 text-stone-500 flex-shrink-0" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); setError(null); }}
            placeholder="Full Name"
            className="w-full bg-transparent border-none text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none py-2.5 px-3 font-medium"
            required
          />
        </div>

        {/* Email Capsule */}
        <div className="relative flex items-center rounded-full border border-stone-800 focus-within:border-stone-500 bg-[#0e0e13]/80 px-5 py-1 transition-all">
          <Mail className="w-4 h-4 text-stone-500 flex-shrink-0" />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="Email Address (info@gmail.com)"
            className="w-full bg-transparent border-none text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none py-2.5 px-3 font-medium"
            required
          />
        </div>

        {/* Mobile Capsule */}
        <div className="relative flex items-center rounded-full border border-stone-800 focus-within:border-stone-500 bg-[#0e0e13]/80 px-5 py-1 transition-all">
          <Phone className="w-4 h-4 text-stone-500 flex-shrink-0" />
          <input
            type="tel"
            value={mobile}
            onChange={(e) => { setMobile(e.target.value); setError(null); }}
            placeholder="10-Digit Mobile Number"
            maxLength={10}
            className="w-full bg-transparent border-none text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none py-2.5 px-3 font-medium"
            required
          />
        </div>

        {/* Password Capsule */}
        <div className="relative flex items-center rounded-full border border-stone-800 focus-within:border-stone-500 bg-[#0e0e13]/80 px-5 py-1 transition-all">
          <Lock className="w-4 h-4 text-stone-500 flex-shrink-0" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            placeholder="Create Password"
            className="w-full bg-transparent border-none text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none py-2.5 px-3 font-medium"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-stone-400 hover:text-white pr-2"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Rules checklist */}
        {password && (
          <div className="p-3 bg-[#0e0e13] border border-stone-800 rounded-2xl space-y-1 text-[11px]">
            <span className="font-bold text-stone-400 block mb-1">Password Requirements:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {passwordCriteria.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 font-medium">
                  {item.met ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-stone-600" />
                  )}
                  <span className={item.met ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirm Password Capsule */}
        <div className="relative flex items-center rounded-full border border-stone-800 focus-within:border-stone-500 bg-[#0e0e13]/80 px-5 py-1 transition-all">
          <Lock className="w-4 h-4 text-stone-500 flex-shrink-0" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
            placeholder="Confirm Password"
            className="w-full bg-transparent border-none text-white placeholder-stone-500 text-xs sm:text-sm focus:outline-none py-2.5 px-3 font-medium"
            required
          />
        </div>

        {/* Submit Capsule Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-full bg-white text-stone-950 hover:bg-stone-200 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-98 disabled:opacity-50 mt-3"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2 text-xs">
              <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              Creating Account...
            </span>
          ) : (
            <>
              <span>Register & Send 6-Digit OTP</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Nav */}
      <div className="pt-4 border-t border-stone-800/60 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setAuthStep('login')}
          className="font-bold text-stone-300 hover:text-white underline"
        >
          Already registered? Sign In
        </button>

        <button
          type="button"
          onClick={skipLogin}
          className="font-semibold text-stone-500 hover:text-stone-300"
        >
          Skip (Guest)
        </button>
      </div>

    </div>
  );
};
