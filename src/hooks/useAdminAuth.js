import { useState, useEffect } from 'react';
import { getActiveAdminSession, authenticateAdminCredentials, logoutAdmin } from '../services/authService';

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Check authentication status on mount & reset lock status
  useEffect(() => {
    const session = getActiveAdminSession();
    
    // RESET LOCK ON MOUNT
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('isLocked');
    setIsLocked(false);
    setLoginAttempts(0);
    
    if (session) {
      setIsAuthenticated(true);
      setUser(session);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await authenticateAdminCredentials(email, password);
      
      if (res.success) {
        localStorage.removeItem('loginAttempts'); // Reset attempts on success
        localStorage.removeItem('isLocked'); // Remove lock on success
        setIsLocked(false);
        setLoginAttempts(0);
        
        setIsAuthenticated(true);
        setUser(res.adminSession || { name: 'Super Admin', email });
        setIsLoading(false);
        return true;
      } else {
        // Track failed attempts
        const attempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
        localStorage.setItem('loginAttempts', attempts.toString());
        setLoginAttempts(attempts);
        
        if (attempts >= 5) {
          localStorage.setItem('isLocked', 'true');
          setIsLocked(true);
          throw new Error('Account locked due to multiple failed attempts. Please try again in 5 minutes.');
        }
        
        throw new Error(res.message || `Invalid credentials. ${5 - attempts} attempts remaining.`);
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    logoutAdmin();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('isLocked');
    setIsAuthenticated(false);
    setUser(null);
    setIsLocked(false);
  };

  const verifyToken = async () => {
    const session = getActiveAdminSession();
    if (!session) {
      setIsAuthenticated(false);
      return false;
    }
    return true;
  };

  return {
    login,
    logout,
    verifyToken,
    isLoading,
    error,
    isAuthenticated,
    user,
    isLocked,
    loginAttempts
  };
};
