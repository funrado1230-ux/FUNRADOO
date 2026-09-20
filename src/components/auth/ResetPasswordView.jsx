import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { Logo } from '../Logo';
import { useAuth } from '../../context/AuthContext';

export const ResetPasswordView = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { resetPassword, isLoading, error, setError } = useAuth();

  const passwordCriteria = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(newPassword) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(newPassword) },
    { label: 'One number (0-9)', met: /[0-9]/.test(newPassword) },
    { label: 'One special character (!@#$%^&*)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword(newPassword, confirmPassword);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-100/60 p-8 sm:p-10 relative overflow-hidden animate-fade-in my-4">
      
      <div className="flex flex-col items-center text-center mb-6">
        <div className="mb-3">
          <Logo size="lg" />
        </div>

        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Create New Password
        </h2>
        <p className="text-xs text-stone-500 mt-1 font-medium max-w-xs">
          Your OTP was verified! Enter a new password for your FUNRADO account.
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
            New FUNRADO Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setError(null); }}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border-2 border-stone-200 focus:border-amber-500 focus:bg-white text-stone-900 placeholder:text-stone-400 rounded-xl focus:outline-none font-semibold text-xs transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {newPassword && (
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 text-[11px]">
            <span className="font-extrabold text-stone-700 block mb-1">Password Requirements:</span>
            {passwordCriteria.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 font-medium">
                {item.met ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                ) : (
                  <X className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span className={item.met ? 'text-emerald-700 font-bold' : 'text-stone-500'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-[11px] font-extrabold text-stone-700 uppercase tracking-wider mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
              placeholder="••••••••"
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
              Updating Password...
            </span>
          ) : (
            <>
              <span className="text-xs sm:text-sm tracking-wide">Reset Password & Login</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50/80 p-2 rounded-xl border border-emerald-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>New password must not be your Gmail password.</span>
        </div>
      </form>

    </div>
  );
};
