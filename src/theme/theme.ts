'use client';

import { createTheme } from '@mui/material/styles';
import { systemColors, cardColors } from './colors';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: systemColors.primary,
    secondary: systemColors.secondary,
    error: systemColors.error,
    warning: systemColors.warning,
    info: systemColors.info,
    success: systemColors.success,
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: systemColors.neutral[900],
      secondary: systemColors.neutral[600],
    },
    grey: systemColors.neutral,
  },
  typography: {
    fontFamily: '"Sarabun", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Sarabun", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Sarabun", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Sarabun", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Sarabun", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Sarabun", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Sarabun", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Sarabun", sans-serif',
    },
    subtitle2: {
      fontFamily: '"Sarabun", sans-serif',
    },
    body1: {
      fontFamily: '"Sarabun", sans-serif',
    },
    body2: {
      fontFamily: '"Sarabun", sans-serif',
    },
    caption: {
      fontFamily: '"Sarabun", sans-serif',
    },
    button: {
      fontFamily: '"Sarabun", sans-serif',
      fontWeight: 500,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff', // เปลี่ยนเป็นสีขาว
          borderRight: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          fontFamily: '"Sarabun", sans-serif',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #e2e8f0',
          fontFamily: '"Sarabun", sans-serif',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 12px',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          fontFamily: '"Sarabun", sans-serif',
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontFamily: '"Sarabun", sans-serif',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Sarabun", sans-serif',
          fontSize: '0.875rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Sarabun", sans-serif',
          fontSize: '0.75rem',
          height: 24,
        },
        sizeSmall: {
          fontSize: '0.6875rem',
          height: 20,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeSmall: {
          width: 28,
          height: 28,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          fontFamily: '"Sarabun", sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Sarabun", sans-serif',
          fontWeight: 500,
          textTransform: 'none',
          borderRadius: 8,
          fontSize: '0.875rem',
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.8125rem',
        },
        sizeMedium: {
          padding: '6px 16px',
          fontSize: '0.875rem',
        },
      },
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input': {
            fontFamily: '"Sarabun", sans-serif',
            fontSize: '0.875rem',
          },
          '& textarea': {
            fontFamily: '"Sarabun", sans-serif',
            fontSize: '0.875rem',
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
          },
        },
      },
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Sarabun", sans-serif',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Sarabun", sans-serif',
        },
      },
    },
  },
});

// เพิ่ม custom colors สำหรับการ์ดต่างๆ ตามภาพ
declare module '@mui/material/styles' {
  interface Theme {
    cardColors: {
      webDesign: {
        main: string;
        light: string;
        icon: string;
      };
      management: {
        main: string;
        light: string;
        icon: string;
      };
      business: {
        main: string;
        light: string;
        icon: string;
      };
      photography: {
        main: string;
        light: string;
        icon: string;
      };
      video: {
        main: string;
        light: string;
        icon: string;
      };
      github: {
        main: string;
        light: string;
        icon: string;
      };
      filming: {
        main: string;
        light: string;
        icon: string;
      };
      bookkeeping: {
        main: string;
        light: string;
        icon: string;
      };
    };
  }

  interface ThemeOptions {
    cardColors?: {
      webDesign?: {
        main?: string;
        light?: string;
        icon?: string;
      };
      management?: {
        main?: string;
        light?: string;
        icon?: string;
      };
      business?: {
        main?: string;
        light?: string;
        icon?: string;
      };
      photography?: {
        main?: string;
        light?: string;
        icon?: string;
      };
      video?: {
        main?: string;
        light?: string;
        icon?: string;
      };
      github?: {
        main?: string;
        light?: string;
        icon?: string;
      };
      filming?: {
        main?: string;
        light?: string;
        icon?: string;
      };
      bookkeeping?: {
        main?: string;
        light?: string;
        icon?: string;
      };
    };
  }
}

// อัปเดต theme ให้รวม custom colors
const extendedTheme = createTheme({
  ...theme,
  cardColors: {
    webDesign: {
      main: '#8b5cf6', // สีม่วง
      light: '#f3f0ff',
      icon: '#8b5cf6',
    },
    management: {
      main: '#06b6d4', // สีฟ้าเขียว
      light: '#f0fdfa',
      icon: '#06b6d4',
    },
    business: {
      main: '#f59e0b', // สีส้ม
      light: '#fffbeb',
      icon: '#f59e0b',
    },
    photography: {
      main: '#6366f1', // สีน้ำเงินม่วง
      light: '#eef2ff',
      icon: '#6366f1',
    },
    video: {
      main: '#06b6d4', // สีฟ้าเขียว
      light: '#f0fdfa',
      icon: '#06b6d4',
    },
    github: {
      main: '#ef4444', // สีแดงส้ม
      light: '#fef2f2',
      icon: '#ef4444',
    },
    filming: {
      main: '#8b5cf6', // สีม่วง
      light: '#f3f0ff',
      icon: '#8b5cf6',
    },
    bookkeeping: {
      main: '#06b6d4', // สีฟ้าเขียว
      light: '#f0fdfa',
      icon: '#06b6d4',
    },
  },
});

export default extendedTheme;