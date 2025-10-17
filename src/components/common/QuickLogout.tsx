'use client';

import { useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { LogOut } from 'lucide-react';
import LogoutConfirmation from '@/components/common/LogoutConfirmation';
import { performLogout } from '@/utils/auth';

interface QuickLogoutProps {
  variant?: 'button' | 'icon';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  redirectUrl?: string;
}

export default function QuickLogout({ 
  variant = 'button',
  size = 'medium',
  showText = true,
  redirectUrl = '/login'
}: QuickLogoutProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    await performLogout(redirectUrl);
    setIsLoading(false);
    setConfirmOpen(false);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  if (variant === 'icon') {
    return (
      <>
        <Tooltip title="ออกจากระบบ">
          <IconButton
            onClick={handleLogoutClick}
            size={size}
            sx={{
              color: '#64748b',
              '&:hover': {
                backgroundColor: '#fef2f2',
                color: '#dc2626',
              }
            }}
          >
            <LogOut size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
          </IconButton>
        </Tooltip>
        
        <LogoutConfirmation
          open={confirmOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={handleLogoutClick}
        startIcon={<LogOut size={16} />}
        variant="outlined"
        size={size}
        sx={{
          fontFamily: 'Sarabun',
          textTransform: 'none',
          borderColor: '#dc2626',
          color: '#dc2626',
          '&:hover': {
            backgroundColor: '#fef2f2',
            borderColor: '#b91c1c',
          }
        }}
      >
        {showText && 'ออกจากระบบ'}
      </Button>
      
      <LogoutConfirmation
        open={confirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </>
  );
}