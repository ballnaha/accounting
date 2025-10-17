'use client';

import { useState, useCallback } from 'react';
import { AlertColor } from '@mui/material';

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
}

export interface UseSnackbarReturn {
  snackbar: SnackbarState;
  showSnackbar: (message: string, severity: AlertColor, autoHideDuration?: number) => void;
  showSuccess: (message: string, autoHideDuration?: number) => void;
  showError: (message: string, autoHideDuration?: number) => void;
  showWarning: (message: string, autoHideDuration?: number) => void;
  showInfo: (message: string, autoHideDuration?: number) => void;
  hideSnackbar: () => void;
}

export function useSnackbar(): UseSnackbarReturn {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000,
  });

  const showSnackbar = useCallback((
    message: string, 
    severity: AlertColor, 
    autoHideDuration: number = 6000
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
      autoHideDuration,
    });
  }, []);

  const showSuccess = useCallback((message: string, autoHideDuration?: number) => {
    showSnackbar(message, 'success', autoHideDuration);
  }, [showSnackbar]);

  const showError = useCallback((message: string, autoHideDuration?: number) => {
    showSnackbar(message, 'error', autoHideDuration);
  }, [showSnackbar]);

  const showWarning = useCallback((message: string, autoHideDuration?: number) => {
    showSnackbar(message, 'warning', autoHideDuration);
  }, [showSnackbar]);

  const showInfo = useCallback((message: string, autoHideDuration?: number) => {
    showSnackbar(message, 'info', autoHideDuration);
  }, [showSnackbar]);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  return {
    snackbar,
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideSnackbar,
  };
}