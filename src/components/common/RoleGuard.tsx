'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { systemColors } from '../../theme/colors';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'hr' | 'user';
  fallback?: React.ReactNode;
}

export default function RoleGuard({ 
  children, 
  requiredRole = 'admin',
  fallback 
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    setIsChecking(true);

    if (!session) {
      setRedirecting(true);
      setTimeout(() => {
        router.push('/login');
      }, 1000);
      return;
    }

    const userRole = (session.user as any)?.role;
    
    // Check role hierarchy: admin > hr > user
    const roleHierarchy = { admin: 3, hr: 2, user: 1 };
    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole];

    console.log('Role check:', { userRole, userLevel, requiredRole, requiredLevel });

    if (userLevel >= requiredLevel) {
      setIsAuthorized(true);
      setIsChecking(false);
    } else {
      setRedirecting(true);
      // Redirect to no-access page
      setTimeout(() => {
        router.push('/no-access');
      }, 1000);
    }
  }, [session, status, router, requiredRole]);

  // Show loading while checking authentication
  if (status === 'loading' || isChecking) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          backgroundColor: '#fafafa',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress 
            size={32} 
            sx={{ 
              color: systemColors.primary.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
            thickness={3}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: systemColors.neutral[600],
              fontWeight: 400,
              fontFamily: 'Sarabun',
              fontSize: '0.875rem'
            }}
          >
            กำลังตรวจสอบสิทธิ์...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show redirecting message
  if (redirecting) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          backgroundColor: '#fafafa',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress 
            size={32} 
            sx={{ 
              color: systemColors.warning.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
            thickness={3}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: systemColors.neutral[600],
              fontWeight: 400,
              fontFamily: 'Sarabun',
              fontSize: '0.875rem'
            }}
          >
            กำลังเปลี่ยนเส้นทาง...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show unauthorized message (shouldn't happen with proper redirects)
  if (!session || !isAuthorized) {
    return fallback || (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          backgroundColor: '#fafafa',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: systemColors.neutral[600],
              fontWeight: 400,
              fontFamily: 'Sarabun',
              fontSize: '0.875rem'
            }}
          >
            กำลังตรวจสอบสิทธิ์...
          </Typography>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
}