'use client';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  CircularProgress,
  Popover,
  MenuList,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Bell,
  Search,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

interface HeaderProps {
  onDrawerToggle: () => void;
  onDesktopToggle: () => void;
  desktopCollapsed: boolean;
  drawerWidth: number;
}

export default function Header({ 
  onDrawerToggle, 
  onDesktopToggle, 
  desktopCollapsed, 
  drawerWidth 
}: HeaderProps) {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
    handleClose();
  };

  const getUserInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleName = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'ผู้ดูแลระบบ';
      case 'user':
        return 'ผู้ใช้งาน';
      default:
        return 'ผู้ใช้งาน';
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateZ(0)', // hardware acceleration
        willChange: 'width, margin-left', // optimize performance
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: 0,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ 
        px: { xs: 3, sm: 4 }, 
        py: 1.5, 
        minHeight: '70px !important',
        height: 70,
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Mobile hamburger menu */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ 
            mr: 2, 
            display: { sm: 'none' },
            width: 40,
            height: 40,
            borderRadius: '8px',
            color: '#64748b',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
          }}
        >
          <MenuIcon size={20} />
        </IconButton>

        {/* Desktop hamburger menu */}
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onDesktopToggle}
          sx={{ 
            mr: 3, 
            display: { xs: 'none', sm: 'block' },
            width: 40,
            height: 40,
            borderRadius: '8px',
            color: '#64748b',
            '&:hover': {
              backgroundColor: '#f8fafc',
              color: '#1e293b',
            },
          }}
        >
          <MenuIcon size={20} />
        </IconButton>

        {/* Spacer to push content to right */}
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Icon */}
          <Tooltip title="Search">
            <IconButton 
              color="inherit"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  color: '#1e293b',
                },
              }}
            >
              <Search size={18} />
            </IconButton>
          </Tooltip>

          {/* Notification Icon */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                color: '#64748b',
                position: 'relative',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                  color: '#1e293b',
                },
              }}
            >
              <Bell size={18} />
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  bgcolor: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
              />
            </IconButton>
          </Tooltip>


          {/* User Profile */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
          }}
          onClick={handleClick}
          >
            {status === 'loading' ? (
              <>
                <CircularProgress size={36} />
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    color: '#64748b',
                    lineHeight: 1.2,
                    fontFamily: 'Sarabun',
                  }}>
                    กำลังโหลด...
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {getUserInitials(session?.user?.name)}
                </Avatar>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600, 
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    lineHeight: 1.2,
                    fontFamily: 'Sarabun',
                  }}>
                    {session?.user?.name || 'ผู้ใช้งาน'}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: '#64748b',
                    fontSize: '0.75rem',
                    fontFamily: 'Sarabun',
                  }}>
                    {getRoleName((session?.user as any)?.role)}
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {/* User Menu */}
          <Popover
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 8,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                mt: 0.5,
                minWidth: 200,
                borderRadius: 2,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            disableScrollLock
          >
            <MenuList sx={{ py: 1 }}>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <User size={18} />
                </ListItemIcon>
                <Typography sx={{ fontFamily: 'Sarabun' }}>โปรไฟล์</Typography>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings size={18} />
                </ListItemIcon>
                <Typography sx={{ fontFamily: 'Sarabun' }}>ตั้งค่า</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <LogOut size={18} />
                </ListItemIcon>
                <Typography sx={{ fontFamily: 'Sarabun' }}>ออกจากระบบ</Typography>
              </MenuItem>
            </MenuList>
          </Popover>
        </Box>
      </Toolbar>
    </AppBar>
  );
}