'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  AlertTriangle,
  MoreVertical,
  ArrowUpRight,
  Activity,
  Clock,
  CheckCircle,
} from 'lucide-react';

// Mock data for dashboard
const dashboardStats = [
  {
    title: 'จำนวนเจ้าหน้าที่',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    title: 'คดีที่ดำเนินการ',
    value: '1,234',
    change: '+8.2%', 
    trend: 'up',
    icon: FileText,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    title: 'เหตุการณ์ฉุกเฉิน',
    value: '89',
    change: '-15.3%',
    trend: 'down',
    icon: AlertTriangle,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    title: 'ประสิทธิภาพ',
    value: '94.2%',
    change: '+2.1%',
    trend: 'up',
    icon: Activity,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  }
];

const recentActivities = [
  {
    id: '1',
    title: 'เคสโจรกรรมรถยนต์ อ.เมือง',
    status: 'กำลังดำเนินการ',
    officer: 'พ.ต.อ. สมชาย ใจดี',
    time: '2 ชั่วโมงที่แล้ว',
    priority: 'high'
  },
  {
    id: '2', 
    title: 'รายงานการตรวจตรา เขต 1',
    status: 'เสร็จสิ้น',
    officer: 'ร.ต.ท. สมหญิง ซื่อสัตย์',
    time: '4 ชั่วโมงที่แล้ว',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'เหตุอุบัติเหตุ ถ.พหลโยธิน',
    status: 'ระงับเหตุแล้ว',
    officer: 'พ.ต.ต. สมศักดิ์ กล้าหาญ',
    time: '6 ชั่วโมงที่แล้ว', 
    priority: 'high'
  },
  {
    id: '4',
    title: 'การฝึกอบรมเจ้าหน้าที่ใหม่',
    status: 'กำลังดำเนินการ',
    officer: 'ผบ.สน. สมเกียรติ มั่นคง',
    time: '1 วันที่แล้ว',
    priority: 'low'
  }
];

const performanceData = [
  { department: 'งานสืบสวน', efficiency: 87 },
  { department: 'งานป้องกันปราบปราม', efficiency: 94 },
  { department: 'งานจราจร', efficiency: 78 },
  { department: 'งานบริการประชาชน', efficiency: 92 },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
};

const getStatusIcon = (status: string) => {
  if (status.includes('เสร็จสิ้น') || status.includes('ระงับเหตุ')) {
    return <CheckCircle size={16} color="#10b981" />;
  } else if (status.includes('กำลังดำเนินการ')) {
    return <Clock size={16} color="#f59e0b" />;
  }
  return <Activity size={16} color="#6b7280" />;
};

export default function ProfessionalDashboard() {
  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: '#1e293b',
            fontFamily: 'Sarabun',
            mb: 1 
          }}
        >
          แดชบอร์ดระบบจัดการบัญชี
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#64748b',
            fontFamily: 'Sarabun' 
          }}
        >
          ภาพรวมการดำเนินงานและสถิติประจำวัน
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        }, 
        gap: 3, 
        mb: 4 
      }}>
        {dashboardStats.map((stat, index) => (
          <Card 
            key={index}
            elevation={0}
            sx={{ 
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box 
                  sx={{ 
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <stat.icon size={24} color={stat.color} />
                </Box>
                <IconButton size="small">
                  <MoreVertical size={16} />
                </IconButton>
              </Box>

              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#1e293b',
                  fontFamily: 'Sarabun',
                  mb: 1 
                }}
              >
                {stat.value}
              </Typography>

              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#64748b',
                  fontFamily: 'Sarabun',
                  mb: 2 
                }}
              >
                {stat.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {stat.trend === 'up' ? (
                  <TrendingUp size={16} color="#10b981" />
                ) : (
                  <TrendingDown size={16} color="#ef4444" />
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: stat.trend === 'up' ? '#10b981' : '#ef4444',
                    fontWeight: 600,
                    fontFamily: 'Sarabun'
                  }}
                >
                  {stat.change}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#64748b',
                    fontFamily: 'Sarabun' 
                  }}
                >
                  จากเดือนที่แล้ว
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          lg: '2fr 1fr' 
        }, 
        gap: 3 
      }}>
        {/* Recent Activities */}
        <Card 
          elevation={0}
          sx={{ 
            border: '1px solid #e2e8f0',
            borderRadius: '12px'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: '#1e293b',
                  fontFamily: 'Sarabun' 
                }}
              >
                กิจกรรมล่าสุด
              </Typography>
              <Button 
                endIcon={<ArrowUpRight size={16} />}
                sx={{ 
                  textTransform: 'none',
                  fontFamily: 'Sarabun',
                  color: '#6366f1'
                }}
              >
                ดูทั้งหมด
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: 'Sarabun', fontWeight: 600 }}>กิจกรรม</TableCell>
                    <TableCell sx={{ fontFamily: 'Sarabun', fontWeight: 600 }}>สถานะ</TableCell>
                    <TableCell sx={{ fontFamily: 'Sarabun', fontWeight: 600 }}>เจ้าหน้าที่</TableCell>
                    <TableCell sx={{ fontFamily: 'Sarabun', fontWeight: 600 }}>เวลา</TableCell>
                    <TableCell sx={{ fontFamily: 'Sarabun', fontWeight: 600 }}>ความสำคัญ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {getStatusIcon(activity.status)}
                          <Typography sx={{ fontFamily: 'Sarabun', fontWeight: 500 }}>
                            {activity.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={activity.status}
                          size="small"
                          sx={{ 
                            fontFamily: 'Sarabun',
                            fontSize: '0.75rem'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Sarabun' }}>
                        {activity.officer}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Sarabun', color: '#64748b' }}>
                        {activity.time}
                      </TableCell>
                      <TableCell>
                        <Box 
                          sx={{ 
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: getPriorityColor(activity.priority)
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card 
          elevation={0}
          sx={{ 
            border: '1px solid #e2e8f0',
            borderRadius: '12px'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#1e293b',
                fontFamily: 'Sarabun',
                mb: 3 
              }}
            >
              ประสิทธิภาพตามแผนก
            </Typography>

            {performanceData.map((dept, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Sarabun',
                      fontWeight: 500,
                      color: '#1e293b'
                    }}
                  >
                    {dept.department}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Sarabun',
                      fontWeight: 600,
                      color: '#10b981'
                    }}
                  >
                    {dept.efficiency}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={dept.efficiency} 
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#f1f5f9',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: dept.efficiency >= 90 ? '#10b981' : 
                                     dept.efficiency >= 80 ? '#f59e0b' : '#ef4444'
                    }
                  }}
                />
              </Box>
            ))}

            <Box sx={{ 
              mt: 3, 
              p: 2, 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'Sarabun',
                  color: '#64748b',
                  textAlign: 'center'
                }}
              >
                ประสิทธิภาพรวม
              </Typography>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontFamily: 'Sarabun',
                  fontWeight: 700,
                  color: '#10b981',
                  textAlign: 'center',
                  mt: 1
                }}
              >
                87.8%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}