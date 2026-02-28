import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import insforge from '../lib/insforgeClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data, error } = await insforge.auth.getCurrentSession();
        if (data?.session?.user) {
          setUser(data.session.user);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signUp = useCallback(async (email, password, name = '') => {
    const { data, error } = await insforge.auth.signUp({
      email,
      password,
      name,
    });

    if (error) {
      return { error };
    }

    // If email verification is not required, set user immediately
    if (data?.accessToken && data?.user) {
      setUser(data.user);
    }

    return { data, error: null };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await insforge.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    if (data?.user) {
      setUser(data.user);
    }

    return { data, error: null };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await insforge.auth.signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  }, []);

  const verifyEmail = useCallback(async (email, code) => {
    const { data, error } = await insforge.auth.verifyEmail({
      email,
      code,
    });

    if (error) {
      return { error };
    }

    if (data?.user) {
      setUser(data.user);
    }

    return { data, error: null };
  }, []);

  const resendVerificationEmail = useCallback(async (email) => {
    const { data, error } = await insforge.auth.resendVerificationEmail({
      email,
    });

    return { data, error };
  }, []);

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    verifyEmail,
    resendVerificationEmail,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
