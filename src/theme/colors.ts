// สีพื้นฐานตามภาพที่กำหนด
export const cardColors = {
  // การ์ด Web Design - สีม่วง
  webDesign: {
    main: '#8b5cf6',
    light: '#f3f0ff',
    background: 'linear-gradient(135deg, #f3f0ff 0%, #e9d5ff 100%)',
    icon: '#8b5cf6',
    text: '#6b21a8',
  },
  
  // การ์ด Management & Communication - สีฟ้าเขียว
  management: {
    main: '#06b6d4',
    light: '#f0fdfa',
    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
    icon: '#06b6d4',
    text: '#0891b2',
  },
  
  // การ์ด Business Analytic - สีส้ม
  business: {
    main: '#f59e0b',
    light: '#fffbeb',
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    icon: '#f59e0b',
    text: '#d97706',
  },
  
  // การ์ด Photography and Video - สีน้ำเงินม่วง
  photography: {
    main: '#6366f1',
    light: '#eef2ff',
    background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
    icon: '#6366f1',
    text: '#4f46e5',
  },
  
  // การ์ด Video Creating - สีฟ้าเขียว
  video: {
    main: '#06b6d4',
    light: '#f0fdfa',
    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
    icon: '#06b6d4',
    text: '#0891b2',
  },
  
  // การ์ด GitHub - สีแดงส้ม
  github: {
    main: '#ef4444',
    light: '#fef2f2',
    background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
    icon: '#ef4444',
    text: '#dc2626',
  },
  
  // การ์ด Filming & Operating - สีม่วง
  filming: {
    main: '#8b5cf6',
    light: '#f3f0ff',
    background: 'linear-gradient(135deg, #f3f0ff 0%, #e9d5ff 100%)',
    icon: '#8b5cf6',
    text: '#6b21a8',
  },
  
  // การ์ด Bookkeeping & Accountancy - สีฟ้าเขียว
  bookkeeping: {
    main: '#06b6d4',
    light: '#f0fdfa',
    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
    icon: '#06b6d4',
    text: '#0891b2',
  },
};

// สีหลักของระบบ
export const systemColors = {
  primary: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    bg: '#eff6ff',
  },
  
  secondary: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    bg: '#fffbeb',
  },
  
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    bg: '#ecfdf5',
  },
  
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    bg: '#fef2f2',
  },
  
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    bg: '#fffbeb',
  },
  
  info: {
    main: '#06b6d4',
    light: '#22d3ee',
    dark: '#0891b2',
    bg: '#f0fdfa',
  },
  
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

// ฟังก์ชันสำหรับสร้าง gradient
export const createGradient = (color1: string, color2: string, direction = '135deg') => {
  return `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;
};

// ฟังก์ชันสำหรับสร้างสี shadow
export const createShadow = (color: string, opacity = 0.1) => {
  return `0 4px 20px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

export default cardColors;