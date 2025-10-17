'use client';

import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import {
  Users,
  Shield,
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { CardGrid } from '../index';
import { useSnackbar } from '../../hooks/useSnackbar';

const statsCards = [
  {
    title: 'Total Personnel',
    value: '1,247',
    change: '+12%',
    color: '#1976d2',
    icon: Users,
  },
  {
    title: 'Active Cases',
    value: '89',
    change: '+5%',
    color: '#dc004e',
    icon: Shield,
  },
  {
    title: 'Reports Filed',
    value: '456',
    change: '+8%',
    color: '#2e7d32',
    icon: FileText,
  },
  {
    title: 'Alerts',
    value: '23',
    change: '-3%',
    color: '#f57c00',
    icon: AlertTriangle,
  },
];

const recentActivities = [
  {
    id: 1,
    title: 'New incident reported',
    description: 'Traffic accident on Main Street',
    time: '2 minutes ago',
    status: 'urgent',
  },
  {
    id: 2,
    title: 'Officer training completed',
    description: 'John Doe completed firearms training',
    time: '1 hour ago',
    status: 'completed',
  },
  {
    id: 3,
    title: 'Equipment maintenance',
    description: 'Vehicle #1234 scheduled for maintenance',
    time: '3 hours ago',
    status: 'pending',
  },
];

export default function DashboardContent() {
  const { showSuccess, showInfo } = useSnackbar();

  const handleCardClick = (cardId: string) => {
    showInfo(`Clicked on ${cardId} card`);
  };

  return (
    <Box sx={{ 
      flexGrow: 1,
      maxWidth: '100%',
      '& > *': { mb: { xs: 3, md: 4 } },
      '& > *:last-child': { mb: 0 }
    }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: { xs: 3, md: 4 }, 
          fontWeight: 700,
          color: 'text.primary',
          fontSize: { xs: '1.75rem', md: '2.125rem' },
        }}
      >
        Dashboard Overview
      </Typography>

      {/* Service Cards with New Design */}
      <Box sx={{ mb: { xs: 4, md: 5 } }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            mb: { xs: 2, md: 3 }, 
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Services & Tools
        </Typography>
        <CardGrid onCardClick={handleCardClick} />
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        },
        gap: { xs: 2, md: 3 },
        mb: { xs: 4, md: 5 }
      }}>
        {statsCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card elevation={2} key={card.title}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${card.color}15`,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComponent size={24} color={card.color} />
                  </Box>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    fontSize="0.875rem"
                    fontWeight={500}
                  >
                    {card.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 800,
                    color: 'text.primary',
                    fontSize: '2rem',
                  }}
                >
                  {card.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp size={16} color={card.change.startsWith('+') ? '#2e7d32' : '#d32f2f'} />
                  <Typography
                    variant="body2"
                    color={card.change.startsWith('+') ? 'success.main' : 'error.main'}
                    sx={{ ml: 0.5 }}
                  >
                    {card.change}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    vs last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Recent Activities */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          md: '2fr 1fr' 
        },
        gap: { xs: 3, md: 4 }
      }}>
        <Paper elevation={2} sx={{ 
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              mb: { xs: 2, md: 3 }, 
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Recent Activities
          </Typography>
          {recentActivities.map((activity) => (
            <Box
              key={activity.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                borderBottom: '1px solid #e0e0e0',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.5,
                  }}
                >
                  {activity.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {activity.description}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {activity.time}
                </Typography>
              </Box>
              <Chip
                label={activity.status}
                size="small"
                color={
                  activity.status === 'urgent' ? 'error' :
                  activity.status === 'completed' ? 'success' : 'default'
                }
              />
            </Box>
          ))}
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
          <Paper elevation={2} sx={{ 
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: { xs: 2, md: 3 }, 
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
              <Button 
                variant="contained" 
                startIcon={<Shield size={18} />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                New Incident
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<FileText size={18} />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Generate Report
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Calendar size={18} />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Schedule Training
              </Button>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mb: 3, 
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              System Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Database</Typography>
                <Chip label="Online" size="small" color="success" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Communication</Typography>
                <Chip label="Online" size="small" color="success" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Backup System</Typography>
                <Chip label="Active" size="small" color="success" />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}