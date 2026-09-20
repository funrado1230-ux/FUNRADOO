import React from 'react';
import { Sparkles, ShieldCheck, X, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../Logo';
import { RegisterView } from './RegisterView';
import { LoginView } from './LoginView';
import { OtpVerificationView } from './OtpVerificationView';
import { ForgotPasswordView } from './ForgotPasswordView';
import { ResetPasswordView } from './ResetPasswordView';
import { AccountModal } from './AccountModal';

export const AuthOverlay = () => {
  const { authStep, setAuthStep, isAuthOverlayOpen, closeAuthOverlay, authReasonMessage } = useAuth();

  return (
    <>
      {/* Customer Account Details Modal */}
      <AccountModal />

      {/* Show Auth Overlay ONLY when triggered (e.g., when buying a product or clicking sign-in) */}
      {isAuthOverlayOpen ? (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-[#060608] text-white flex flex-col items-center justify-between p-4 sm:p-8 select-none animate-fade-in"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.14) 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px'
          }}
        >
          {/* Close Button to return to store */}
          <button
            onClick={closeAuthOverlay}
            className="fixed top-6 right-6 z-50 p-3 bg-[#121217] hover:bg-[#1a1a22] text-stone-400 hover:text-white rounded-full border border-stone-800 transition-all shadow-xl flex items-center gap-2 px-4"
            title="Close and return to store"
          >
            <ArrowLeft className="w-4 h-4 text-stone-300" />
            <span className="text-xs font-bold text-stone-300 hidden sm:inline">Back to Store</span>
            <X className="w-4 h-4" />
          </button>

          {/* TOP CAPSULE NAVIGATION BAR */}
          <header className="w-full max-w-4xl bg-[#111116]/90 border border-stone-800/90 backdrop-blur-xl rounded-full px-6 py-3.5 flex items-center justify-between shadow-2xl relative z-20 my-2">
            
            {/* Left Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <Logo light size="sm" />
            </div>

            {/* Center Navigation Items */}
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-stone-300">
              <span className="hover:text-white cursor-pointer transition-colors">Manifesto</span>
              <span className="hover:text-white cursor-pointer transition-colors">Careers</span>
              <span className="hover:text-white cursor-pointer transition-colors">Discover</span>
            </div>

            {/* Right Login / Signup Pill Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAuthStep('login')}
                className={`px-5 py-2 rounded-full border text-xs font-bold transition-all ${
                  authStep === 'login' 
                    ? 'border-white text-white bg-white/10' 
                    : 'border-stone-700 hover:border-stone-500 text-stone-300'
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setAuthStep('register')}
                className={`px-6 py-2 rounded-full text-xs font-black transition-all transform hover:scale-105 ${
                  authStep === 'register'
                    ? 'bg-white text-stone-950 shadow-[0_0_30px_rgba(255,255,255,0.8)]'
                    : 'bg-white/90 text-stone-950 hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]'
                }`}
              >
                Signup
              </button>
            </div>

          </header>

          {/* MAIN HERO & FORM CONTAINER */}
          <main className="w-full max-w-2xl mx-auto my-auto flex flex-col items-center justify-center text-center py-6 px-4 relative z-10">
            
            {/* Custom Prompt Banner (e.g., "Please Sign In to buy this product") */}
            {authReasonMessage && (
              <div className="mb-6 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center gap-2.5 text-amber-300 text-xs font-bold animate-bounce-short">
                <ShoppingBag className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{authReasonMessage}</span>
              </div>
            )}

            {/* HERO HEADING */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-3">
              {authStep === 'login' ? 'Welcome Parent' : 
               authStep === 'register' ? 'Create FUNRADO Account' : 
               authStep === 'otp' ? 'Security Verification' : 
               'Reset Password'}
            </h1>

            <p className="text-lg sm:text-2xl text-stone-400 font-extralight tracking-normal mb-8">
              {authStep === 'login' ? 'Your sign in component' : 
               authStep === 'register' ? 'Join FUNRADO for luxury parent benefits' : 
               'Enter the 6-digit OTP sent to your email'}
            </p>

            {/* ACTIVE FORM VIEW */}
            <div className="w-full">
              {authStep === 'register' && <RegisterView />}
              {authStep === 'login' && <LoginView />}
              {authStep === 'otp' && <OtpVerificationView />}
              {authStep === 'forgot-password' && <ForgotPasswordView />}
              {authStep === 'reset-password' && <ResetPasswordView />}
            </div>

          </main>

          {/* FOOTER ASSURANCE */}
          <footer className="w-full max-w-4xl py-4 border-t border-stone-800/40 flex items-center justify-between text-xs text-stone-500 font-medium z-10">
            <span>© {new Date().getFullYear()} FUNRADO Inc.</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-stone-300 cursor-pointer">Privacy</span>
              <span className="hover:text-stone-300 cursor-pointer">Terms</span>
              <span className="hover:text-stone-300 cursor-pointer">Security</span>
            </div>
          </footer>

        </div>
      ) : null}
    </>
  );
};
