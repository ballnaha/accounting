'use client';

import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const drawerWidth = 250;
const collapsedWidth = 60;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopToggle = () => {
    setDesktopCollapsed(!desktopCollapsed);
  };

  const currentDrawerWidth = desktopCollapsed ? collapsedWidth : drawerWidth;

  return (
    <Box sx={{ display: 'flex' }}>
      <Header 
        onDrawerToggle={handleDrawerToggle} 
        onDesktopToggle={handleDesktopToggle}
        desktopCollapsed={desktopCollapsed}
        drawerWidth={currentDrawerWidth}
      />
      
      <Sidebar 
        mobileOpen={mobileOpen} 
        onDrawerToggle={handleDrawerToggle}
        desktopCollapsed={desktopCollapsed}
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          marginLeft: { sm: 0 },
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: 1000,
          WebkitFontSmoothing: 'antialiased',
          position: 'relative',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}