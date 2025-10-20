// สีพื้นฐานตาม Police Theme - Modern Isometric Style
export const cardColors = {
  // การ์ด Police Administration - สีน้ำเงินเข้ม (Primary Police Blue)
  administration: {
    main: '#1e40af',
    light: '#dbeafe',
    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    icon: '#1e40af',
    text: '#1e3a8a',
    shadow: 'rgba(30, 64, 175, 0.15)',
  },
  
  // การ์ด Investigation - สีเทาน้ำเงิน (Detective Blue)
  investigation: {
    main: '#475569',
    light: '#f1f5f9',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    icon: '#475569',
    text: '#334155',
    shadow: 'rgba(71, 85, 105, 0.15)',
  },
  
  // การ์ด Emergency - สีแดงสด (Emergency Red)
  emergency: {
    main: '#dc2626',
    light: '#fef2f2',
    background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
    icon: '#dc2626',
    text: '#991b1b',
    shadow: 'rgba(220, 38, 38, 0.15)',
  },
  
  // การ์ด Traffic - สีเหลืองส้ม (Traffic Warning)
  traffic: {
    main: '#f59e0b',
    light: '#fffbeb',
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    icon: '#f59e0b',
    text: '#d97706',
    shadow: 'rgba(245, 158, 11, 0.15)',
  },
  
  // การ์ด Community - สีเขียวธรรมชาติ (Community Green)
  community: {
    main: '#059669',
    light: '#ecfdf5',
    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    icon: '#059669',
    text: '#047857',
    shadow: 'rgba(5, 150, 105, 0.15)',
  },
  
  // การ์ด Technology - สีฟ้าไซเบอร์ (Cyber Blue)
  technology: {
    main: '#0891b2',
    light: '#f0fdfa',
    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
    icon: '#0891b2',
    text: '#0e7490',
    shadow: 'rgba(8, 145, 178, 0.15)',
  },
  
  // การ์ด Training - สีม่วงไลแลค (Training Purple)
  training: {
    main: '#7c3aed',
    light: '#f3f0ff',
    background: 'linear-gradient(135deg, #f3f0ff 0%, #e9d5ff 100%)',
    icon: '#7c3aed',
    text: '#6b21a8',
    shadow: 'rgba(124, 58, 237, 0.15)',
  },
  
  // การ์ด Analytics - สีฟ้าเทา (Analytics Blue)
  analytics: {
    main: '#6366f1',
    light: '#eef2ff',
    background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
    icon: '#6366f1',
    text: '#4f46e5',
    shadow: 'rgba(99, 102, 241, 0.15)',
  },
};

// สีหลักของระบบ - Police Theme
export const systemColors = {
  primary: {
    main: '#1976d2', // Police Blue
    light: '#42a5f5',
    dark: '#1565c0',
    bg: '#e3f2fd',
    contrast: '#ffffff',
  },
  
  secondary: {
    main: '#f57c00', // Authority Orange
    light: '#ffb74d',
    dark: '#ef6c00',
    bg: '#fff3e0',
    contrast: '#ffffff',
  },
  
  success: {
    main: '#2e7d32', // Safety Green
    light: '#4caf50',
    dark: '#1b5e20',
    bg: '#e8f5e8',
    contrast: '#ffffff',
  },
  
  error: {
    main: '#d32f2f', // Emergency Red
    light: '#f44336',
    dark: '#c62828',
    bg: '#ffebee',
    contrast: '#ffffff',
  },
  
  warning: {
    main: '#f57c00', // Alert Orange
    light: '#ff9800',
    dark: '#ef6c00',
    bg: '#fff3e0',
    contrast: '#000000',
  },
  
  info: {
    main: '#0288d1', // Information Blue
    light: '#03a9f4',
    dark: '#0277bd',
    bg: '#e1f5fe',
    contrast: '#ffffff',
  },
  
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // เพิ่มสีเฉพาะสำหรับ Police Theme
  police: {
    navy: '#1a237e',      // Navy Blue
    lightBlue: '#81d4fa',  // Light Blue
    silver: '#b0bec5',     // Silver Badge
    gold: '#ffd54f',       // Gold Badge
    uniform: '#263238',    // Uniform Dark
  },
};

// Isometric Style Colors - ตามภาพ 3D
export const isometricColors = {
  // สีหลักสำหรับ 3D Elements
  depths: {
    light: '#ffffff',      // Top surface
    medium: '#f8fafc',     // Middle surface  
    dark: '#e2e8f0',       // Bottom/shadow surface
    accent: '#1976d2',     // Police accent
  },
  
  // สีสำหรับ Building/Structure
  building: {
    main: '#e3f2fd',       // Main building color
    roof: '#1976d2',       // Roof color
    windows: '#42a5f5',    // Window color
    door: '#1565c0',       // Door color
    shadow: '#bbdefb',     // Building shadow
  },
  
  // สีสำหรับ Characters/Police
  characters: {
    uniform: '#1565c0',    // Police uniform
    hat: '#0d47a1',        // Police hat
    badge: '#ffd54f',      // Police badge
    skin: '#ffccbc',       // Skin tone
    equipment: '#37474f',  // Equipment color
  },
  
  // สีสำหรับ Vehicles
  vehicles: {
    police: '#1976d2',     // Police car main
    emergency: '#f44336',  // Emergency lights
    windows: '#81d4fa',    // Car windows
    tires: '#424242',      // Tires
    chrome: '#eceff1',     // Chrome details
  },
  
  // สีสำหรับ UI Elements ในภาพ
  interface: {
    screen: '#e8eaf6',     // Screen background
    button: '#3f51b5',     // Button color
    text: '#1a237e',       // Text color
    border: '#c5cae9',     // Border color
    highlight: '#ff5722',  // Highlight color
  },
};

// ฟังก์ชันสำหรับสร้าง gradient แบบ 3D
export const createIsometricGradient = (
  topColor: string, 
  bottomColor: string, 
  direction = '145deg'
) => {
  return `linear-gradient(${direction}, ${topColor} 0%, ${bottomColor} 100%)`;
};

// ฟังก์ชันสำหรับสร้าง 3D shadow effect
export const create3DShadow = (
  color: string, 
  intensity = 0.15,
  blur = 20,
  spread = 0
) => {
  const alpha = Math.round(intensity * 255).toString(16).padStart(2, '0');
  const alphaValue = parseInt(alpha, 16);
  const secondaryAlpha = Math.round(alphaValue / 3).toString(16).padStart(2, '0');
  return `0 ${blur/4}px ${blur}px ${spread}px ${color}${alpha}, 0 ${blur/2}px ${blur*2}px ${spread}px ${color}${secondaryAlpha}`;
};

// ฟังก์ชันสำหรับสร้าง isometric card style
export const createIsometricCard = (mainColor: string, lightColor: string) => ({
  background: createIsometricGradient(lightColor, '#ffffff'),
  border: `2px solid ${mainColor}20`,
  borderRadius: '16px',
  boxShadow: create3DShadow(mainColor, 0.1),
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: create3DShadow(mainColor, 0.2, 24),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
});

// ฟังก์ชันสำหรับสร้าง gradient
export const createGradient = (color1: string, color2: string, direction = '135deg') => {
  return `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;
};

// ฟังก์ชันสำหรับสร้างสี shadow
export const createShadow = (color: string, opacity = 0.1) => {
  return `0 4px 20px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

export default cardColors;