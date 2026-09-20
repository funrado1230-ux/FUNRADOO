import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  Fingerprint,
  LogIn,
  Sparkles,
  Unlock,
  ArrowLeft
} from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export const AdminLoginView = ({ onStep1Success, onClose }) => {
  const { login, isLoading, error, isAuthenticated, isLocked } = useAdminAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [touched, setTouched] = useState({});
  const [lockTimer, setLockTimer] = useState(0);
  const [isLockedState, setIsLockedState] = useState(false);

  // Check lock status on mount
  useEffect(() => {
    const locked = localStorage.getItem('isLocked') === 'true';
    setIsLockedState(locked);
    
    if (locked) {
      const attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
      setLockTimer(Math.max(0, 300 - (attempts * 60))); // 5 minutes lock
    }
  }, []);

  // Handle lock timer
  useEffect(() => {
    let interval;
    if (isLockedState && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            localStorage.removeItem('isLocked');
            localStorage.removeItem('loginAttempts');
            setIsLockedState(false);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLockedState, lockTimer]);

  // MANUAL UNLOCK FUNCTION
  const handleUnlock = () => {
    localStorage.removeItem('isLocked');
    localStorage.removeItem('loginAttempts');
    setIsLockedState(false);
    setLockTimer(0);
    setFormData({ email: '', password: '' });
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      if (window.location.hash === '#admin') {
        window.location.hash = '';
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLockedState) {
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setTouched({
        email: true,
        password: true
      });
      return;
    }

    const success = await login(formData.email, formData.password);
    
    if (success) {
      if (onStep1Success) {
        onStep1Success({ success: true, email: formData.email });
      }
    } else {
      // Check if locked after failed attempt
      const locked = localStorage.getItem('isLocked') === 'true';
      if (locked) {
        setIsLockedState(true);
        setLockTimer(300);
      }
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@funrado.com',
      password: 'FunradoAdmin2026!'
    });
  };

  return (
    <div className="w-full max-w-md mx-auto relative overflow-hidden p-1">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full relative z-10"
      >
        {/* Back to Store Header Option */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-extrabold border border-stone-800 transition-all cursor-pointer shadow-xl group"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Store</span>
          </button>
        </div>

        {/* Brand Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 via-amber-600 to-rose-600 rounded-2xl shadow-xl mb-3">
            <Shield className="w-8 h-8 text-stone-950" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admin Panel</h1>
          <p className="text-xs text-stone-400 mt-1 font-medium">Secure access to store control center</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-stone-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-stone-800 p-6 sm:p-8"
        >
          {/* Locked Message with Manual Unlock Button */}
          <AnimatePresence>
            {isLockedState && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-2xl"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-red-300">Account Temporarily Locked</p>
                    <p className="text-[11px] text-red-400 mt-1">
                      Too many failed attempts. Please wait {Math.ceil(lockTimer / 60)} minutes or click the button below to unlock.
                    </p>
                    <div className="mt-2 w-full bg-red-950 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: `${(lockTimer / 300) * 100}%` }}
                        className="bg-red-500 h-1.5 rounded-full transition-all duration-1000"
                      />
                    </div>
                    
                    {/* MANUAL UNLOCK BUTTON */}
                    <button
                      type="button"
                      onClick={handleUnlock}
                      className="mt-3 flex items-center gap-2 px-3.5 py-1.5 bg-red-500/20 border border-red-400/40 text-red-300 rounded-xl hover:bg-red-500/30 transition-all text-xs font-extrabold cursor-pointer"
                    >
                      <Unlock className="w-4 h-4 text-red-300" />
                      <span>Unlock Account Now</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-extrabold text-stone-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative group transition-all duration-300">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-amber-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLockedState}
                  placeholder="Enter your email address"
                  className={`w-full pl-10 pr-4 py-3 bg-stone-800 border-2 rounded-xl focus:outline-none transition-all duration-300 text-xs font-bold text-white placeholder:text-stone-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLockedState
                      ? 'border-stone-800'
                      : 'border-stone-700 focus:border-amber-400 focus:bg-stone-800/90'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-extrabold text-stone-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group transition-all duration-300">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-amber-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLockedState}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 bg-stone-800 border-2 rounded-xl focus:outline-none transition-all duration-300 text-xs font-bold text-white placeholder:text-stone-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLockedState
                      ? 'border-stone-800'
                      : 'border-stone-700 focus:border-amber-400 focus:bg-stone-800/90'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border transition-all duration-300 flex items-center justify-center ${
                    rememberMe
                      ? 'bg-amber-400 border-amber-400'
                      : 'border-stone-600 group-hover:border-amber-400'
                  }`}>
                    {rememberMe && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 text-stone-950"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-stone-400 font-bold group-hover:text-stone-200 transition-colors">
                  Remember me
                </span>
              </label>

              <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                <span>Secure login</span>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && !isLockedState && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-300 text-xs font-bold"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || isLockedState}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3.5 rounded-xl font-black text-xs text-stone-950 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden shadow-lg cursor-pointer ${
                isLoading || isLockedState
                  ? 'bg-stone-700 text-stone-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 shadow-amber-500/20'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-stone-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : isLockedState ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Account Locked</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>

            {/* Demo Credentials */}
            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="px-2 bg-stone-900 text-stone-500">Demo Credentials</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 bg-stone-800/80 hover:bg-stone-800 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-bold border border-stone-700/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Click to auto-fill demo credentials</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 text-center space-y-3">
            <p className="text-[10px] text-stone-500 font-semibold tracking-wider uppercase">
              Secure &bull; Encrypted &bull; Protected
            </p>
            <div className="pt-1 border-t border-stone-800/60">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Store</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default AdminLoginView;
