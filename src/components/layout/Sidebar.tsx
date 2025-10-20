'use client';

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Toolbar,
  Tooltip,
  Avatar,
  IconButton,
  Chip,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home,
  Truck,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  Users,
  FileText,
  CreditCard,
  Bell,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { performLogout } from '@/utils/auth';
import LogoutConfirmation from '@/components/common/LogoutConfirmation';

interface SidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  desktopCollapsed: boolean;
  drawerWidth: number;
  collapsedWidth: number;
}

interface MenuItem {
  text: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  path?: string;
  active?: boolean;
  badge?: string | number;
  submenu?: MenuItem[];
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: 'MAIN',
    items: [
      { text: 'Dashboard', icon: Home, path: '/' },
    ]
  },

  {
    label: 'OPERATIONS',
    items: [
      { 
        text: 'จัดการข้อมูล', 
        icon: Package, 
        path: '/data',
        submenu: [
          { text: 'ข้อมูลบุคลากร', icon: Users, path: '/data/personnel' },
          { text: 'ข้อมูลอุปกรณ์', icon: Package, path: '/data/equipment' },
          { text: 'ข้อมูลยานพาหนะ', icon: Truck, path: '/data/vehicles' }
        ]
      },
      { text: 'Analytics', icon: BarChart3, path: '/analytics' },
    ]
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { 
        text: 'จัดการผู้ใช้งาน', 
        icon: Users, 
        path: '/users'
      },
      { 
        text: 'รายงาน', 
        icon: FileText, 
        path: '/reports',
        submenu: [
          { text: 'รายงานผู้ใช้งาน', icon: FileText, path: '/reports/users' },
          { text: 'รายงานระบบ', icon: BarChart3, path: '/reports/system' },
          { text: 'รายงานความปลอดภัย', icon: Bell, path: '/reports/security' }
        ]
      },
      { 
        text: 'การตั้งค่า', 
        icon: Settings, 
        path: '/settings',
        submenu: [
          { text: 'ตั้งค่าระบบ', icon: Settings, path: '/settings/system' },
          { text: 'ตั้งค่าความปลอดภัย', icon: Shield, path: '/settings/security' },
          { text: 'ตั้งค่าการแจ้งเตือน', icon: Bell, path: '/settings/notifications' }
        ]
      },
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { text: 'Help', icon: HelpCircle, path: '/help' },
    ]
  }
];

export default function Sidebar({ 
  mobileOpen, 
  onDrawerToggle, 
  desktopCollapsed, 
  drawerWidth, 
  collapsedWidth 
}: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    await performLogout('/login');
    setIsLoggingOut(false);
    setLogoutDialogOpen(false);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

    const toggleSubmenu = (menuText: string) => {
      // ใน mobile view ให้ submenu ทำงานได้ปกติ
      if (desktopCollapsed && !isMobile) return;
      setExpandedMenus(prev => ({
        ...prev,
        [menuText]: !prev[menuText]
      }));
    };  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const IconComponent = item.icon;
    // ใน mobile view ไม่ต้องใช้ collapsed state
    const isCollapsed = desktopCollapsed && !isMobile;
    const isActive = pathname === item.path;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.text];
    const isSubmenuItem = level > 0;

    const handleClick = () => {
      if (hasSubmenu) {
        toggleSubmenu(item.text);
      } else if (item.path) {
        router.push(item.path);
      }
    };

    const listItem = (
      <ListItem key={item.text} disablePadding>
        <ListItemButton
          onClick={handleClick}
          sx={{
            mx: isSubmenuItem ? 2 : 1,
            my: 0.25,
            minHeight: isSubmenuItem ? 36 : 42,
            justifyContent: isCollapsed ? 'center' : 'initial',
            px: isCollapsed ? 1 : (isSubmenuItem ? 2 : 1.5),
            pl: isSubmenuItem ? 3 : (isCollapsed ? 1 : 1.5),
            backgroundColor: isActive ? '#1e40af' : 'transparent',
            borderRadius: isActive ? 1.5 : 0,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isActive ? '#1d4ed8' : 'rgba(59, 130, 246, 0.08)',
              borderRadius: 1.5,
            },
          }}
        >
          <ListItemIcon 
            sx={{
              minWidth: 0,
              mr: isCollapsed ? 'auto' : 1.5,
              justifyContent: 'center',
              transition: 'margin-right 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <IconComponent 
              size={isSubmenuItem ? 16 : 20} 
              color={isActive ? '#ffffff' : '#9ca3af'} 
            />
          </ListItemIcon>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              opacity: isCollapsed ? 0 : 1,
              transform: isCollapsed ? 'translateX(-20px)' : 'translateX(0)',
              transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              width: isCollapsed ? 0 : 'auto',
            }}
          >
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: isSubmenuItem ? '0.85rem' : '0.85rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : '#e5e7eb',
                fontFamily: 'Sarabun',
                whiteSpace: 'nowrap',
              }}
            />
            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.7rem',
                  backgroundColor: isActive ? '#ffffff' : '#374151',
                  color: isActive ? '#1e40af' : '#9ca3af',
                  mr: hasSubmenu ? 1 : 0,
                  ml: 1,
                }}
              />
            )}
            {hasSubmenu && (
              <Box sx={{ ml: 1 }}>
                {isExpanded ? (
                  <ChevronDown size={14} color={isActive ? "#ffffff" : "#9ca3af"} />
                ) : (
                  <ChevronRight size={14} color={isActive ? "#ffffff" : "#9ca3af"} />
                )}
              </Box>
            )}
          </Box>
        </ListItemButton>
      </ListItem>
    );

    return (
      <Box key={item.text}>
        {isCollapsed && !isMobile ? (
          <Tooltip title={item.text} placement="right">
            {listItem}
          </Tooltip>
        ) : (
          listItem
        )}
        {/* Render submenu items */}
        {hasSubmenu && (
          <Collapse 
            in={isExpanded && !(isCollapsed && !isMobile)} 
            timeout={600}
            easing={{
              enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
              exit: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <List sx={{ 
              py: 0,
              backgroundColor: 'rgb(44,44,44)',
              // Ensure submenu maintains sidebar background
              '& .MuiListItem-root': {
                backgroundColor: 'transparent',
              },
            }}>
              {item.submenu!.map((subItem) => renderMenuItem(subItem, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };
  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: 'rgb(44,44,44)',
      // Custom scrollbar styles
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgb(44,44,44)',
        borderRadius: '3px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#6b7280',
        borderRadius: '3px',
        '&:hover': {
          backgroundColor: '#9ca3af',
        },
      },
      // Firefox scrollbar
      scrollbarWidth: 'thin',
      scrollbarColor: '#6b7280 rgb(44,44,44)',
    }}>
      <Toolbar sx={{ 
        px: 2, 
        minHeight: '70px !important',
        height: 70,
        display: 'flex',
        alignItems: 'center',
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: (desktopCollapsed && !isMobile) ? 0 : 1.5,
          justifyContent: (desktopCollapsed && !isMobile) ? 'center' : 'flex-start',
          width: '100%',
          height: '100%',
          transition: 'gap 0.6s cubic-bezier(0.4, 0, 0.2, 1), justify-content 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Logo Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: '#ffffff',
              fontSize: '1.2rem',
              fontWeight: 700,
              flexShrink: 0,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            P
          </Box>
          
          {/* Logo Text */}
          <Box
            sx={{
              opacity: (desktopCollapsed && !isMobile) ? 0 : 1,
              transform: (desktopCollapsed && !isMobile) ? 'translateX(-20px)' : 'translateX(0)',
              transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              width: (desktopCollapsed && !isMobile) ? 0 : 'auto',
            }}
          >
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.1rem',
                whiteSpace: 'nowrap',
                fontFamily: 'Sarabun',
              }}
            >
              Police Position
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: '#374151', mx: 2 }} />

      {/* Menu Groups */}
      <Box sx={{ 
        flexGrow: 1, 
        py: 0.5, 
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: 'rgb(44,44,44)',
        // Custom scrollbar styles for menu area
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgb(44,44,44)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#6b7280',
          borderRadius: '3px',
          '&:hover': {
            backgroundColor: '#9ca3af',
          },
        },
        // Firefox scrollbar
        scrollbarWidth: 'thin',
        scrollbarColor: '#6b7280 rgb(44,44,44)',
      }}>
        {menuGroups.map((group) => (
          <Box key={group.label}>
            {/* Group Label */}
            <Box 
              sx={{ 
                px: 1.5, 
                mb: 0.5, 
                mt: group.label === 'MAIN' ? 0 : 2,
                opacity: (desktopCollapsed && !isMobile) ? 0 : 1,
                transform: (desktopCollapsed && !isMobile) ? 'translateX(-20px)' : 'translateX(0)',
                transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                height: (desktopCollapsed && !isMobile) ? 0 : 'auto',
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '0.7rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {group.label}
              </Typography>
            </Box>
            
            {/* Group Items */}
            <List sx={{ 
              py: 0,
              backgroundColor: 'rgb(44,44,44)',
              // Ensure all list items maintain sidebar background
              '& .MuiListItem-root': {
                backgroundColor: 'transparent',
              },
            }}>
              {group.items.map((item) => renderMenuItem(item))}
            </List>
          </Box>
        ))}
      </Box>
      
      {/* Footer Section */}
      <Box sx={{ 
        mt: 'auto', 
        p: 1,
        backgroundColor: 'rgb(44,44,44)',
      }}>
        <Divider sx={{ mb: 1, borderColor: '#374151' }} />
        
        {/* Logout Button */}
        {(desktopCollapsed && !isMobile) ? (
          <Tooltip title="Logout" placement="right">
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogoutClick}
                sx={{
                  mx: 1,
                  my: 0.25,
                  minHeight: 36,
                  justifyContent: 'center',
                  px: 1,
                  borderRadius: 0,
                  transition: 'background-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  '& .MuiListItemIcon-root': {
                    transition: 'color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    '& .MuiListItemIcon-root': {
                      color: '#ef4444',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0,
                  justifyContent: 'center',
                  color: '#9ca3af' 
                }}>
                  <LogOut size={18} />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ) : (
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogoutClick}
              sx={{
                mx: 1,
                my: 0.25,
                minHeight: 36,
                justifyContent: 'initial',
                px: 1.5,
                borderRadius: 0,
                transition: 'background-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                '& .MuiListItemIcon-root': {
                  transition: 'color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                },
                '& .MuiListItemText-primary': {
                  transition: 'color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                },
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  '& .MuiListItemIcon-root': {
                    color: '#ef4444',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#ef4444',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 0,
                mr: 1.5,
                justifyContent: 'center',
                color: '#9ca3af' 
              }}>
                <LogOut size={18} />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: '#9ca3af',
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: desktopCollapsed ? collapsedWidth : drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        transitionDuration={{
          enter: 400,
          exit: 300,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRadius: 0,
            backgroundColor: 'rgb(44,44,44)',
            // Custom scrollbar for mobile
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgb(44,44,44)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#6b7280',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: '#9ca3af',
              },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#6b7280 rgb(44,44,44)',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: desktopCollapsed ? collapsedWidth : drawerWidth,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 0,
            overflowX: 'hidden',
            backgroundColor: 'rgb(44,44,44)',
            // Custom scrollbar for desktop
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgb(44,44,44)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#6b7280',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: '#9ca3af',
              },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#6b7280 rgb(44,44,44)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        open={logoutDialogOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        isLoading={isLoggingOut}
      />
    </Box>
  );
}