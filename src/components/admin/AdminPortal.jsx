import React, { useState, useEffect } from 'react';
import { getActiveAdminSession, logoutAdmin } from '../../services/authService';
import { AdminLoginView } from './AdminLoginView';
import { AdminOtpView } from './AdminOtpView';
import { AdminDashboard } from './AdminDashboard';

export const AdminPortal = ({ isOpen, onClose }) => {
  const [adminStep, setAdminStep] = useState('login'); // 'login' | 'dashboard'
  const [step1Data, setStep1Data] = useState(null);

  useEffect(() => {
    const session = getActiveAdminSession();
    if (session) {
      setAdminStep('dashboard');
    } else {
      setAdminStep('login');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStep1Success = (data) => {
    const adminSession = {
      adminId: 'user_super_admin_1',
      name: 'Super Admin',
      email: data?.email || 'admin@funrado.com',
      role: 'superAdmin',
      token: `jwt_admin_token_${Date.now()}`
    };
    localStorage.setItem('funrado_admin_session_v1', JSON.stringify(adminSession));
    setAdminStep('dashboard');
  };

  const handleAdminLoginSuccess = () => {
    setAdminStep('dashboard');
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdminStep('login');
    setStep1Data(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      
      {/* If logged in -> Full Admin Dashboard */}
      {adminStep === 'dashboard' ? (
        <div className="w-full h-full min-h-screen">
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={onClose}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-extrabold px-3 py-1.5 rounded-xl border border-stone-700 transition-colors"
            >
              Close Admin Portal ✕
            </button>
          </div>
          <AdminDashboard onLogout={handleLogout} />
        </div>
      ) : (
        /* Direct Login Container (OTP Removed) */
        <div className="relative w-full max-w-md my-auto">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-stone-400 hover:text-white text-xs font-bold bg-stone-900 px-3 py-1 rounded-full border border-stone-800"
          >
            Return to Store ✕
          </button>

          <AdminLoginView onStep1Success={handleStep1Success} onClose={onClose} />
        </div>
      )}

    </div>
  );
};
