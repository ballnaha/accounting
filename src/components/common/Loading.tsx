'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { systemColors } from '../../theme/colors';

interface LoadingProps {
  message?: string;
  size?: number;
  minHeight?: string;
  background?: string;
  variant?: 'default' | 'glass' | 'simple';
}

export default function Loading({ 
  message = "กำลังโหลด...",
  size = 48,
  minHeight = "60vh",
  background,
  variant = 'default'
}: LoadingProps) {
  
  if (variant === 'simple') {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight={minHeight}
        flexDirection="column"
        gap={2}
        sx={{
          backgroundColor: background || '#fafafa'
        }}
      >
        <CircularProgress 
          size={size || 32} 
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
          {message}
        </Typography>
      </Box>
    );
  }

  const defaultBackground = variant === 'glass' 
    ? `linear-gradient(135deg, ${systemColors.primary.bg} 0%, ${systemColors.info.bg} 100%)`
    : 'transparent';

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight={minHeight}
      flexDirection="column"
      gap={3}
      sx={{
        background: background || defaultBackground,
      }}
    >
      <Box
        sx={{
          p: variant === 'glass' ? 4 : 3,
          borderRadius: variant === 'glass' ? 3 : 2,
          background: variant === 'glass' 
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: variant === 'glass' ? 'blur(10px)' : 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: variant === 'glass'
            ? `0 8px 32px rgba(59, 130, 246, 0.15)`
            : `0 4px 16px rgba(0, 0, 0, 0.1)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          minWidth: variant === 'glass' ? 300 : 250
        }}
      >
        <CircularProgress 
          size={size} 
          sx={{ color: systemColors.primary.main }}
          thickness={4}
        />
        <Typography 
          variant={variant === 'glass' ? 'h6' : 'body1'}
          sx={{ 
            color: systemColors.primary.main,
            fontWeight: variant === 'glass' ? 600 : 500,
            fontFamily: 'Sarabun',
            textAlign: 'center'
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
}