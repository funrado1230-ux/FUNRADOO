import React from 'react';
import { User, Mail, Phone, ShieldCheck, LogOut, X, Sparkles, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccountModal = () => {
  const { user, logout, isAccountModalOpen, setIsAccountModalOpen, setAuthStep } = useAuth();

  if (!isAccountModalOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-100 p-6 sm:p-8 relative overflow-hidden">
        
        {/* Top Header Actions (Back & Close) */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-extrabold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
          
          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="text-stone-400 hover:text-stone-800 p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-amber-700/20">
            {user.fullName ? user.fullName[0].toUpperCase() : 'K'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-stone-900">
                {user.fullName || 'FUNRADO Customer'}
              </h2>
              {user.isVerified && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full" title="Verified Customer">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {user.isGuest ? 'Guest Customer' : 'Official FUNRADO Member'}
            </p>
          </div>
        </div>

        {/* Customer Account Details Card */}
        <div className="py-6 space-y-4">
          
          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-amber-700" />
              <div>
                <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Full Name</p>
                <p className="text-xs font-bold text-stone-900">{user.fullName || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-700" />
              <div>
                <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Email Address</p>
                <p className="text-xs font-bold text-stone-900">{user.email || 'N/A'}</p>
              </div>
            </div>
            {user.isVerified ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">Unverified</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-amber-700" />
              <div>
                <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Mobile Number</p>
                <p className="text-xs font-bold text-stone-900">{user.mobile || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Security Status Box */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Password Security Status</p>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                {user.isGuest 
                  ? 'Browsing as Guest. Register an account for full benefits.' 
                  : 'Your FUNRADO account password is stored securely using SHA-256 salted encryption. Plain-text Gmail passwords are never collected or stored.'}
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setIsAccountModalOpen(false)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-stone-500" />
            <span>Back to Store</span>
          </button>

          {user.isGuest ? (
            <button
              onClick={() => {
                setIsAccountModalOpen(false);
                setAuthStep('register');
              }}
              className="w-full sm:w-auto flex-1 py-3 px-4 bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all text-center cursor-pointer"
            >
              Create Account / Sign In
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of FUNRADO</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
