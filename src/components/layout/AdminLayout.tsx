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
          transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}