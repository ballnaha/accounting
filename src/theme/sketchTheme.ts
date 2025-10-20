/**
 * Material Design Theme - Modern Material UI style
 * ใช้สำหรับสร้าง UI ที่มีลักษณะแบบ Material Design
 */

import { SxProps, Theme } from '@mui/material';

// สีหลักสำหรับ Police Theme - Modern Isometric Style
export const sketchColors = {
  primary: '#1976d2',        // Police Blue
  secondary: '#f57c00',      // Authority Orange
  success: '#2e7d32',        // Safety Green
  error: '#d32f2f',          // Emergency Red
  warning: '#f57c00',        // Alert Orange
  info: '#0288d1',           // Information Blue
  background: {
    main: '#ffffff',
    hover: '#f5f7fa',        // Soft police hover
    isometric: '#e3f2fd',    // Isometric background
  },
  border: {
    main: 'rgba(25, 118, 210, 0.23)',  // Police blue border
    error: '#d32f2f',
    focus: '#1976d2',
  },
  shadow: {
    main: 'rgba(25, 118, 210, 0.1)',   // Police blue shadow
    hover: 'rgba(25, 118, 210, 0.15)',
    focused: 'rgba(25, 118, 210, 0.2)',
    isometric: 'rgba(25, 118, 210, 0.08)',
  },
  icon: '#64748b',           // Modern icon color
};

/**
 * Material TextField Style
 * ใช้กับ TextField ทั่วไปเพื่อให้มี Material Design style
 */
export const sketchTextFieldStyle = {
  mb: 1.5,
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'Sarabun',
    background: sketchColors.background.main,
    '& fieldset': {
      borderColor: sketchColors.border.main,
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.87)',
    },
    '&.Mui-focused fieldset': {
      borderColor: sketchColors.primary,
      borderWidth: '2px',
    },
  },
} as const;

/**
 * Material Input Label Props
 * ใช้กับ InputLabelProps ของ TextField
 */
export const sketchInputLabelProps = {
  sx: {
    fontFamily: 'Sarabun',
    fontSize: '1rem',
    fontWeight: 500,
    '&.Mui-focused': {
      color: sketchColors.primary,
    },
  },
} as const;

/**
 * Material Button Style
 * ใช้กับ Button ทั่วไปเพื่อให้มี Material Design style
 * @param color - สีของปุ่ม (เช่น '#1976d2', '#4CAF50', '#2196F3', '#ef4444')
 * @param size - ขนาดของปุ่ม 'small' | 'medium' | 'large'
 */
export const sketchButtonStyle = (color: string = '#1976d2', size: 'small' | 'medium' | 'large' = 'medium') => {
  // กำหนดสีข้อความตามสีพื้นหลัง
  const getTextColor = (bgColor: string) => {
    const whiteTextColors = ['#4CAF50', '#2196F3', '#ef4444', '#1976d2', '#9c27b0'];
    return whiteTextColors.includes(bgColor) ? '#FFF' : '#333';
  };

  // กำหนดสี hover ตามสีหลัก - Police Theme
  const getHoverColor = (bgColor: string) => {
    const hoverMap: { [key: string]: string } = {
      '#1976d2': '#1565c0',  // Police blue hover
      '#f57c00': '#ef6c00',  // Authority orange hover
      '#2e7d32': '#1b5e20',  // Safety green hover
      '#d32f2f': '#c62828',  // Emergency red hover
      '#0288d1': '#0277bd',  // Info blue hover
      '#4CAF50': '#66BB6A',  // Legacy green
      '#2196F3': '#42A5F5',  // Legacy blue
      '#ef4444': '#f87171',  // Legacy red
      '#E0E0E0': '#BDBDBD',  // Neutral
    };
    return hoverMap[bgColor] || bgColor;
  };

  // กำหนดขนาด
  const sizeStyles = {
    small: { py: 0.75, px: 2.5, fontSize: '0.875rem' },
    medium: { py: 1, px: 3.5, fontSize: '0.9375rem' },
    large: { py: 1.25, px: 4, fontSize: '1rem' },
  };

  const currentSize = sizeStyles[size];

  return {
    py: currentSize.py,
    px: currentSize.px,
    fontSize: currentSize.fontSize,
    fontFamily: 'Sarabun',
    fontWeight: 500,
    borderRadius: '4px',
    background: color,
    color: getTextColor(color),
    textTransform: 'none' as const,
    boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      background: getHoverColor(color),
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    },
    '&:active': {
      boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    },
    '&:disabled': {
      background: 'rgba(0, 0, 0, 0.12)',
      color: 'rgba(0, 0, 0, 0.26)',
      boxShadow: 'none',
    },
  };
};

/**
 * Material Paper/Card Style
 * ใช้กับ Paper, Card หรือ Container
 */
export const sketchPaperStyle = {
  borderRadius: '4px',
  background: '#FFFFFF',
  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  '&:hover': {
    boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  },
} as const;

/**
 * Material Paper/Card Style (ไม่มี Border)
 * ใช้กับ Paper, Card ที่ต้องการเฉพาะเงา
 */
export const sketchPaperNoBorderStyle = {
  borderRadius: '4px',
  background: '#FFFFFF',
  border: 'none',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  '&:hover': {
    boxShadow: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
  },
} as const;

/**
 * Material Icon Button Style
 * ใช้กับ IconButton
 */
export const sketchIconButtonStyle = {
  color: sketchColors.icon,
  transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.04)',
  },
} as const;

/**
 * Material Icon Button with Color
 * ใช้กับ IconButton ที่ต้องการสี
 */
export const sketchIconButton = {
  // Icon button สีฟ้า (Edit/Info)
  blue: {
    color: '#2196F3',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      background: 'rgba(33, 150, 243, 0.04)',
    },
  },
  
  // Icon button สีแดง (Delete/Danger)
  red: {
    color: '#ef4444',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      background: 'rgba(239, 68, 68, 0.04)',
    },
  },
  
  // Icon button สีเขียว (Success/Confirm)
  green: {
    color: '#4CAF50',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      background: 'rgba(76, 175, 80, 0.04)',
    },
  },
  
  // Icon button สีเทา (Default/Neutral)
  gray: {
    color: '#757575',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.04)',
    },
  },
} as const;

/**
 * Sketch Chip Styles (Pill Shape)
 * ใช้กับ Chip component - ตามภาพอ้างอิง
 */
export const sketchChip = {
  // Chip สีฟ้า (Primary/Info)
  blue: {
    fontFamily: 'Sarabun',
    fontWeight: 500,
    fontSize: '0.875rem',
    border: '1.5px solid #2196F3',
    backgroundColor: 'transparent',
    color: '#2196F3',
    borderRadius: '16px',
    height: 32,
    '& .MuiChip-label': {
      px: 2,
    },
  },
  
  // Chip สีแดง (Error/Admin)
  red: {
    fontFamily: 'Sarabun',
    fontWeight: 500,
    fontSize: '0.875rem',
    border: '1.5px solid #E91E63',
    backgroundColor: 'transparent',
    color: '#E91E63',
    borderRadius: '16px',
    height: 32,
    '& .MuiChip-label': {
      px: 2,
    },
  },
  
  // Chip สีเขียว (Success/Active)
  green: {
    fontFamily: 'Sarabun',
    fontWeight: 500,
    fontSize: '0.875rem',
    border: '1.5px solid #4CAF50',
    backgroundColor: 'transparent',
    color: '#4CAF50',
    borderRadius: '16px',
    height: 32,
    '& .MuiChip-label': {
      px: 2,
    },
  },
  
  // Chip สีเทา (Default/Inactive)
  gray: {
    fontFamily: 'Sarabun',
    fontWeight: 500,
    fontSize: '0.875rem',
    border: '1.5px solid #9E9E9E',
    backgroundColor: 'transparent',
    color: '#757575',
    borderRadius: '16px',
    height: 32,
    '& .MuiChip-label': {
      px: 2,
    },
  },
  
  // Chip สีเหลือง (Warning)
  yellow: {
    fontFamily: 'Sarabun',
    fontWeight: 500,
    fontSize: '0.875rem',
    border: '1.5px solid #FF9800',
    backgroundColor: 'transparent',
    color: '#F57C00',
    borderRadius: '16px',
    height: 32,
    '& .MuiChip-label': {
      px: 2,
    },
  },
} as const;

/**
 * Material Select/Dropdown Style
 * ใช้กับ Select, FormControl
 */
export const sketchSelectStyle = {
  mb: 1.5,
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'Sarabun',
    background: sketchColors.background.main,
    '& fieldset': {
      borderColor: sketchColors.border.main,
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.87)',
    },
    '&.Mui-focused fieldset': {
      borderColor: sketchColors.primary,
      borderWidth: '2px',
    },
  },
  '& .MuiSelect-icon': {
    color: sketchColors.icon,
  },
} as const;

/**
 * Material Menu Props สำหรับ Select Dropdown
 */
export const sketchMenuProps = {
  disableScrollLock: true,
  PaperProps: {
    elevation: 8,
    sx: {
      borderRadius: '4px',
      mt: 0.5,
      maxHeight: 300,
      '& .MuiMenuItem-root': {
        fontFamily: 'Sarabun',
        fontSize: '1rem',
        py: 1,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(25, 118, 210, 0.08)',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
          },
        },
      },
    },
  },
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'left' as const,
  },
} as const;

/**
 * Sketch Icon Style (สำหรับ StartAdornment/EndAdornment)
 */
export const getSketchIconStyle = (isError: boolean = false, errorColor: string = '#f44336') => ({
  color: isError ? errorColor : sketchColors.icon,
  fontSize: '1.3rem',
});

/**
 * Background Gradient สำหรับหน้า Login/Form
 */
export const sketchBackgroundStyle = {
  minHeight: '100vh',
  backgroundColor: '#FFFFFF',
  
} as const;

/**
 * Material Typography Style สำหรับหัวข้อ
 */
export const sketchTitleStyle = {
  fontWeight: 500,
  fontFamily: 'Sarabun',
  fontSize: '1.5rem',
  color: 'rgba(0, 0, 0, 0.87)',
  letterSpacing: '0.0075em',
} as const;

/**
 * Helper function สำหรับสร้าง TextField Props แบบ Sketch
 */
export const createSketchTextField = (fieldError?: boolean, errorColor?: string) => ({
  InputLabelProps: sketchInputLabelProps,
  sx: sketchTextFieldStyle,
});

/**
 * Helper functions สำหรับปุ่ม Sketch แต่ละสี
 */
export const sketchButton = {
  // ปุ่มสีเหลือง (เริ่มต้น)
  yellow: (size: 'small' | 'medium' | 'large' = 'medium') => sketchButtonStyle('#FFC107', size),
  
  // ปุ่มสีเขียว (Success/Save)
  green: (size: 'small' | 'medium' | 'large' = 'medium') => sketchButtonStyle('#4CAF50', size),
  
  // ปุ่มสีฟ้า (Primary/Info)
  blue: (size: 'small' | 'medium' | 'large' = 'medium') => sketchButtonStyle('#2196F3', size),
  
  // ปุ่มสีแดง (Danger/Delete)
  red: (size: 'small' | 'medium' | 'large' = 'medium') => sketchButtonStyle('#ef4444', size),
  
  // ปุ่มสีเทา (Cancel/Secondary)
  gray: (size: 'small' | 'medium' | 'large' = 'medium') => sketchButtonStyle('#E0E0E0', size),
  
  // ปุ่มสีม่วง (Special)
  purple: (size: 'small' | 'medium' | 'large' = 'medium') => sketchButtonStyle('#9c27b0', size),
};

/**
 * SnackBar Sketch Style
 */
export const sketchSnackbarStyle = (severity: 'success' | 'error' | 'warning' | 'info') => {
  const colorMap = {
    success: { bg: '#F1F8E9', color: '#2E7D32', icon: '#4CAF50' },
    error: { bg: '#FFEBEE', color: '#C62828', icon: '#F44336' },
    warning: { bg: '#FFF9C4', color: '#F57C00', icon: '#FFC107' },
    info: { bg: '#E3F2FD', color: '#1565C0', icon: '#2196F3' },
  };

  return {
    borderRadius: '10px',
    border: '2px solid #333',
    backgroundColor: colorMap[severity].bg,
    color: colorMap[severity].color,
    boxShadow: '5px 5px 0px rgba(0, 0, 0, 0.15)',
    iconColor: colorMap[severity].icon,
  };
};
