'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSnackbar, UseSnackbarReturn } from '@/hooks/useSnackbar';
import CustomSnackbar from '@/components/common/CustomSnackbar';

interface SnackbarProviderProps {
  children: ReactNode;
}

const SnackbarContext = createContext<UseSnackbarReturn | undefined>(undefined);

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const snackbarHook = useSnackbar();

  return (
    <SnackbarContext.Provider value={snackbarHook}>
      {children}
      <CustomSnackbar
        open={snackbarHook.snackbar.open}
        message={snackbarHook.snackbar.message}
        severity={snackbarHook.snackbar.severity}
        autoHideDuration={snackbarHook.snackbar.autoHideDuration}
        onClose={snackbarHook.hideSnackbar}
      />
    </SnackbarContext.Provider>
  );
}

export function useSnackbarContext(): UseSnackbarReturn {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbarContext must be used within a SnackbarProvider');
  }
  return context;
}