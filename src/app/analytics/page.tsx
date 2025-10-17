'use client';

import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp,
  Users,
  Activity,
  Shield,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import RoleGuard from '@/components/common/RoleGuard';
import { systemColors } from '@/theme/colors';

const statsData = [
  {
    title: 'ผู้ใช้งานทั้งหมด',
    value: '1,247',
    change: '+12%',
    icon: Users,
    color: systemColors.primary.main,
  },
  {
    title: 'การเข้าใช้งานวันนี้',
    value: '89',
    change: '+5%',
    icon: Activity,
    color: systemColors.success.main,
  },
  {
    title: 'ข้อมูลความปลอดภัย',
    value: '100%',
    change: '0%',
    icon: Shield,
    color: systemColors.info.main,
  },
  {
    title: 'ประสิทธิภาพระบบ',
    value: '98.5%',
    change: '+2%',
    icon: TrendingUp,
    color: systemColors.warning.main,
  },
];

export default function AnalyticsPage() {
  return (
    <RoleGuard requiredRole="admin">
      <AdminLayout>
        <Box sx={{ maxWidth: '100%' }}>
          {/* Header */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              fontFamily: 'Sarabun',
              mb: 4
            }}
          >
            Analytics Dashboard
          </Typography>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsData.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      height: '100%'
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: `${stat.color}15`,
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconComponent size={24} color={stat.color} />
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontFamily: 'Sarabun', fontWeight: 500 }}
                        >
                          {stat.title}
                        </Typography>
                      </Box>
                      
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 800,
                          color: 'text.primary',
                          mb: 1,
                          fontFamily: 'Sarabun'
                        }}
                      >
                        {stat.value}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        sx={{
                          color: stat.change.startsWith('+') ? systemColors.success.main : systemColors.error.main,
                          fontFamily: 'Sarabun',
                          fontWeight: 500
                        }}
                      >
                        {stat.change} จากเดือนที่แล้ว
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Coming Soon */}
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
                fontFamily: 'Sarabun'
              }}
            >
              กำลังพัฒนา
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontFamily: 'Sarabun' }}
            >
              ระบบ Analytics แบบละเอียดกำลังอยู่ในระหว่างการพัฒนา
              <br />
              จะเปิดให้ใช้งานในเร็วๆ นี้
            </Typography>
          </Paper>
        </Box>
      </AdminLayout>
    </RoleGuard>
  );
}