/**
 * Isometric Police Theme Utilities
 * สำหรับสร้าง UI components ตาม style ในภาพ
 */

import { SxProps, Theme } from '@mui/material';
import { cardColors, systemColors, isometricColors } from './colors';

// ===============================
// ISOMETRIC CARD STYLES
// ===============================

export const createPoliceCard = (cardType: keyof typeof cardColors) => {
  const colors = cardColors[cardType];
  return {
    background: colors.background,
    border: `2px solid ${colors.main}20`,
    borderRadius: '16px',
    boxShadow: `0 8px 32px ${colors.shadow || colors.main + '15'}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: `0 12px 48px ${colors.shadow || colors.main + '25'}`,
      borderColor: `${colors.main}40`,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: `linear-gradient(90deg, ${colors.main}, ${colors.icon})`,
      borderRadius: '16px 16px 0 0',
    },
  } as SxProps<Theme>;
};

// ===============================
// POLICE BUILDING STYLE
// ===============================

export const policeBuildingStyle = {
  background: 'linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%)',
  border: '3px solid #1976d2',
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(25, 118, 210, 0.2)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20px',
    background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
    borderRadius: '8px 8px 0 0',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '60px',
    background: 'linear-gradient(145deg, #1565c0 0%, #1976d2 100%)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
  },
} as SxProps<Theme>;

// ===============================
// CHARACTER AVATARS
// ===============================

export const policeCharacterStyle = (size: 'small' | 'medium' | 'large' = 'medium') => {
  const sizes = {
    small: { width: 32, height: 48 },
    medium: { width: 40, height: 60 },
    large: { width: 48, height: 72 },
  };
  
  const currentSize = sizes[size];
  
  return {
    width: currentSize.width,
    height: currentSize.height,
    background: 'linear-gradient(145deg, #1565c0 0%, #1976d2 100%)',
    borderRadius: '8px 8px 16px 16px',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: currentSize.width * 0.6,
      height: currentSize.width * 0.6,
      background: '#0d47a1',
      borderRadius: '50%',
      border: '2px solid #ffd54f',
    },
  } as SxProps<Theme>;
};

// ===============================
// VEHICLE STYLES
// ===============================

export const policeVehicleStyle = (type: 'car' | 'motorcycle' | 'truck' = 'car') => {
  const baseStyle = {
    background: 'linear-gradient(145deg, #1976d2 0%, #1565c0 100%)',
    position: 'relative',
    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
    overflow: 'hidden',
  };
  
  const typeStyles = {
    car: {
      ...baseStyle,
      borderRadius: '20px 20px 8px 8px',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '20%',
        left: '10%',
        right: '10%',
        height: '40%',
        background: 'rgba(129, 212, 250, 0.8)',
        borderRadius: '4px',
        border: '1px solid #42a5f5',
      },
    },
    motorcycle: {
      ...baseStyle,
      borderRadius: '50% 50% 20px 20px',
    },
    truck: {
      ...baseStyle,
      borderRadius: '12px',
    },
  };
  
  return typeStyles[type] as SxProps<Theme>;
};

// ===============================
// EMERGENCY EFFECTS
// ===============================

export const emergencyLightStyle = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  animation: 'emergency-flash 1s ease-in-out infinite alternate',
  '@keyframes emergency-flash': {
    from: {
      backgroundColor: '#f44336',
      boxShadow: '0 0 20px rgba(244, 67, 54, 0.8)',
    },
    to: {
      backgroundColor: '#2196f3',
      boxShadow: '0 0 20px rgba(33, 150, 243, 0.8)',
    },
  },
} as SxProps<Theme>;

// ===============================
// INTERFACE SCREEN STYLE
// ===============================

export const interfaceScreenStyle = {
  background: 'linear-gradient(145deg, #e8eaf6 0%, #c5cae9 100%)',
  border: '2px solid #3f51b5',
  borderRadius: '8px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    animation: 'screen-gloss 2s ease-in-out infinite',
  },
  '@keyframes screen-gloss': {
    '0%': { left: '-100%' },
    '50%': { left: '100%' },
    '100%': { left: '100%' },
  },
} as SxProps<Theme>;

// ===============================
// 3D DEPTH EFFECTS
// ===============================

export const create3DDepth = (level: 1 | 2 | 3 = 1) => {
  const shadows = {
    1: '0 2px 8px rgba(0, 0, 0, 0.1)',
    2: '0 2px 8px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.05)',
    3: '0 2px 8px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.05), 0 16px 48px rgba(0, 0, 0, 0.03)',
  };
  
  return {
    boxShadow: shadows[level],
    transform: `translateZ(${level * 10}px)`,
  } as SxProps<Theme>;
};

// ===============================
// HOVER ANIMATIONS
// ===============================

export const hoverLiftEffect = {
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
  },
} as SxProps<Theme>;

export const hoverGlowEffect = (color: string = systemColors.primary.main) => ({
  transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: `0 0 40px ${color}30`,
  },
} as SxProps<Theme>);

// ===============================
// STATUS INDICATORS
// ===============================

export const createStatusIndicator = (
  status: 'online' | 'offline' | 'busy' | 'away' | 'emergency'
) => {
  const statusColors = {
    online: systemColors.success.main,
    offline: systemColors.neutral[400],
    busy: systemColors.error.main,
    away: systemColors.warning.main,
    emergency: '#ff1744',
  };
  
  return {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: statusColors[status],
    border: '2px solid white',
    boxShadow: `0 0 12px ${statusColors[status]}40`,
    animation: status === 'emergency' ? 'pulse 1s ease-in-out infinite' : 'none',
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(1)',
        opacity: 1,
      },
      '50%': {
        transform: 'scale(1.2)',
        opacity: 0.8,
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 1,
      },
    },
  } as SxProps<Theme>;
};

export default {
  createPoliceCard,
  policeBuildingStyle,
  policeCharacterStyle,
  policeVehicleStyle,
  emergencyLightStyle,
  interfaceScreenStyle,
  create3DDepth,
  hoverLiftEffect,
  hoverGlowEffect,
  createStatusIndicator,
};