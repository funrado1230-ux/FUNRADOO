import React, { useState } from 'react';
import { Mail, ArrowRight, KeyRound } from 'lucide-react';
import { Logo } from '../Logo';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordView = () => {
  const [email, setEmail] = useState('');
  const { requestPasswordReset, setAuthStep, isLoading, error, setError } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    requestPasswordReset(email.trim());
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-100/60 p-8 sm:p-10 relative overflow-hidden animate-fade-in my-4">
      
      <div className="flex flex-col items-center text-center mb-6">
        <div className="mb-3">
          <Logo size="lg" />
        </div>

        <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mb-3">
          <KeyRound className="w-6 h-6" />
        </div>

        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-xs text-stone-500 mt-1 font-medium max-w-xs">
          Enter your registered email address and we’ll send you a 6-digit OTP code to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-extrabold text-stone-700 uppercase tracking-wider mb-1">
            Registered Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="name@gmail.com"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border-2 border-stone-200 focus:border-amber-500 focus:bg-white text-stone-900 placeholder:text-stone-400 rounded-xl focus:outline-none font-semibold text-xs transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-extrabold rounded-2xl shadow-lg shadow-amber-700/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-60"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2 text-xs">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending Reset Code...
            </span>
          ) : (
            <>
              <span className="text-xs sm:text-sm tracking-wide">Send Reset OTP</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setAuthStep('login')}
            className="text-xs font-bold text-stone-500 hover:text-stone-900 underline"
          >
            Back to Sign In
          </button>
        </div>
      </form>

    </div>
  );
};
