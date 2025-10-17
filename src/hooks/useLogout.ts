'use client';

import { useState, useCallback } from 'react';
import { performLogout } from '@/utils/auth';

export interface UseLogoutReturn {
  isLoggingOut: boolean;
  logout: (redirectUrl?: string) => Promise<void>;
  confirmLogout: (redirectUrl?: string) => Promise<void>;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
}

export function useLogout(): UseLogoutReturn {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const logout = useCallback(async (redirectUrl: string = '/login') => {
    setIsLoggingOut(true);
    try {
      await performLogout(redirectUrl);
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  const confirmLogout = useCallback(async (redirectUrl: string = '/login') => {
    setShowConfirmation(false);
    await logout(redirectUrl);
  }, [logout]);

  return {
    isLoggingOut,
    logout,
    confirmLogout,
    showConfirmation,
    setShowConfirmation,
  };
}