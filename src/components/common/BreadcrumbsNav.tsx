'use client';

import { Box, Typography, Breadcrumbs, Link, Chip } from '@mui/material';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  badge?: string | number;
}

interface BreadcrumbsNavProps {
  items?: BreadcrumbItem[];
  showAutoPath?: boolean;
}

export default function BreadcrumbsNav({ items, showAutoPath = false }: BreadcrumbsNavProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Auto-generate breadcrumbs from pathname if no items provided
  const getAutoBreadcrumbs = (): BreadcrumbItem[] => {
    if (!isClient) return [];
    
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', icon: Home }
    ];
    
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      if (index === segments.length - 1) {
        breadcrumbs.push({ label });
      } else {
        breadcrumbs.push({ label, href: currentPath });
      }
    });
    
    return breadcrumbs;
  };

  const breadcrumbItems = items || (showAutoPath ? getAutoBreadcrumbs() : []);

  if (!isClient && showAutoPath && !items) {
    return (
      <Box sx={{ 
        mb: 2, 
        px: 0, 
        py: 2,
        bgcolor: 'transparent',
      }}>
        {/* Loading placeholder */}
        <Box sx={{ height: 24 }} />
      </Box>
    );
  }

  if (breadcrumbItems.length === 0) return null;

  return (
    <Box sx={{ 
      mb: 2, 
      px: 0, 
      py: 2,
      bgcolor: 'transparent',
    }}>
      <Breadcrumbs
        separator={<ChevronRight size={14} color="#94a3b8" />}
        sx={{
          '& .MuiBreadcrumbs-ol': {
            alignItems: 'center',
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const IconComponent = item.icon;
          
          return isLast ? (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {IconComponent && (
                <IconComponent size={16} color="#3b82f6" />
              )}
              <Typography
                sx={{
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {item.label}
              </Typography>
              {item.badge && (
                <Chip 
                  label={item.badge} 
                  size="small" 
                  sx={{ 
                    height: 18, 
                    fontSize: '0.75rem',
                    bgcolor: '#3b82f6',
                    color: 'white',
                  }} 
                />
              )}
            </Box>
          ) : (
            <Link
              key={item.label}
              href={item.href || '#'}
              underline="hover"
              sx={{
                color: '#64748b',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': {
                  color: '#3b82f6',
                },
              }}
            >
              {IconComponent && (
                <IconComponent size={16} />
              )}
              {item.label}
              {item.badge && (
                <Chip 
                  label={item.badge} 
                  size="small" 
                  sx={{ 
                    height: 16, 
                    fontSize: '0.7rem',
                    bgcolor: '#e5e7eb',
                    color: '#374151',
                    ml: 0.5,
                  }} 
                />
              )}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}