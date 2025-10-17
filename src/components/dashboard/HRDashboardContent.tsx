'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  AvatarGroup,
  CircularProgress,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  MoreHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  Video,
  MessageSquare,
  Search,
} from 'lucide-react';

export default function HRDashboardContent() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Main Grid - 3 columns on top */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        
        {/* Time Off Card */}
        <Card sx={{ p: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#fbbf24' 
              }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Time Off
              </Typography>
            </Box>
            <Button 
              size="small" 
              endIcon={<ChevronRight size={16} />}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              See All
            </Button>
          </Box>
          
          {/* Circular Progress */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={80}
                size={120}
                thickness={6}
                sx={{ 
                  color: '#8b5cf6',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  16
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  OUT OF 20
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Status List */}
          <Box>
            {[
              { date: 'July 15, 2019', type: 'Sick', status: 'Pending', color: '#fbbf24' },
              { date: 'July 15, 2019', type: 'Annual', status: 'Confirmed', color: '#10b981' },
              { date: 'July 15, 2019', type: 'Casual', status: 'Rejected', color: '#ef4444' },
            ].map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    mr: 2
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {item.date} ({item.type})
                  </Typography>
                </Box>
                <Chip
                  label={item.status}
                  size="small"
                  sx={{
                    backgroundColor: `${item.color}20`,
                    color: item.color,
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              </Box>
            ))}
          </Box>
        </Card>

        {/* Current Project Card */}
        <Card sx={{ p: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#f97316' 
              }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Current Project
              </Typography>
            </Box>
            <Button 
              size="small" 
              endIcon={<ChevronRight size={16} />}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              See All
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Project Name
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'black', mr: 1, fontSize: '12px' }}>
                A
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Apple Store
              </Typography>
              <Chip 
                label="In Progress" 
                size="small" 
                sx={{ 
                  ml: 1, 
                  bgcolor: '#dcfce7', 
                  color: '#16a34a',
                  fontSize: '0.75rem',
                  height: 20
                }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Project Manager
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>L</Avatar>
              <Typography variant="body2" sx={{ mr: 2 }}>Laura P.</Typography>
              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>A</Avatar>
              <Typography variant="body2">Arthur G.</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Team
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AvatarGroup max={6} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                {['1','2','3','4','5','6'].map(i => (
                  <Avatar key={i}>{i}</Avatar>
                ))}
              </AvatarGroup>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                +4 people
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Timeline
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon size={16} color="#64748b" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                12/10/2022 - 01/04/2023
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Description
            </Typography>
            <Typography variant="body2">
              Updating guidelines in a detailed scale.
            </Typography>
          </Box>
        </Card>

        {/* Schedule Card */}
        <Card sx={{ p: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#3b82f6' 
              }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Schedule
              </Typography>
            </Box>
            <Button 
              size="small" 
              endIcon={<ChevronRight size={16} />}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              See All
            </Button>
          </Box>

          {/* Mini Calendar Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <IconButton size="small">
              <ChevronLeft size={16} />
            </IconButton>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              April, 2023
            </Typography>
            <IconButton size="small">
              <ChevronRight size={16} />
            </IconButton>
          </Box>

          {/* Calendar Days Header */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: 1,
            textAlign: 'center',
            mb: 1
          }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <Typography key={day} variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                {day}
              </Typography>
            ))}
          </Box>

          {/* Calendar Days */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: 1,
            textAlign: 'center',
            mb: 3
          }}>
            {['31', '01', '02', '03', '04'].map((date, index) => (
              <Box 
                key={date}
                sx={{ 
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: index === 2 ? '#6366f1' : 'transparent',
                  color: index === 2 ? 'white' : 'text.primary',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: index === 2 ? '#6366f1' : '#f1f5f9'
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{date}</Typography>
              </Box>
            ))}
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: '#f8fafc',
              borderRadius: 1,
              px: 2,
              py: 1
            }}>
              <Search size={16} color="#64748b" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Search by name or day...
              </Typography>
            </Box>
          </Box>

          {/* Tab Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button 
              size="small" 
              variant="contained" 
              sx={{ 
                textTransform: 'none',
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              Meetings
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              sx={{ 
                textTransform: 'none',
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              Events
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              sx={{ 
                textTransform: 'none',
                fontSize: '0.75rem',
                py: 0.5
              }}
            >
              Holidays
            </Button>
          </Box>

          {/* Meetings List */}
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {[
              {
                title: 'Meeting with James Brown',
                time: '8:00 AM - 9:00 AM (UTC)',
                attendees: 3,
                platform: 'Zoom',
                type: 'Marketing',
                color: '#fef3c7'
              },
              {
                title: 'Meeting with Laura Perez',
                time: '8:00 AM - 9:00 AM (UTC)',
                attendees: 3,
                platform: 'Google Meet',
                type: 'Product Manager',
                color: '#dbeafe'
              },
              {
                title: 'Meeting with Arthur Gauthier',
                time: '8:00 AM - 9:00 AM (UTC)',
                attendees: 6,
                platform: 'Slack',
                type: 'Partnership',
                color: '#e0e7ff'
              },
            ].map((meeting, index) => (
              <Card 
                key={index} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  backgroundColor: meeting.color,
                  border: 'none',
                  boxShadow: 'none',
                  borderRadius: 2
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {meeting.title}
                  </Typography>
                  <IconButton size="small">
                    <MoreHorizontal size={16} />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  {meeting.time}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 20, height: 20, fontSize: '0.6rem' } }}>
                      {Array.from({length: Math.min(meeting.attendees, 3)}).map((_, i) => (
                        <Avatar key={i}>{i + 1}</Avatar>
                      ))}
                    </AvatarGroup>
                    {meeting.attendees > 3 && (
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        +{meeting.attendees - 3}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption">on {meeting.platform}</Typography>
                    <Chip 
                      label={meeting.type} 
                      size="small" 
                      sx={{ 
                        fontSize: '0.6rem',
                        height: 18
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Card>
      </Box>

      {/* Bottom Section - 2 columns */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3
      }}>
        
        {/* Status Tracker */}
        <Card sx={{ p: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#10b981' 
              }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Status Tracker
              </Typography>
            </Box>
            <Button 
              size="small" 
              endIcon={<ChevronRight size={16} />}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              See All
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Absent
          </Typography>

          <Box>
            {[
              { name: 'James Brown', replacement: 'Laura Perez', avatar: 'JB', status: 'Absent' },
            ].map((person, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: '#6366f1' }}>
                  {person.avatar}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {person.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Replaced by {person.replacement}
                  </Typography>
                </Box>
                <Chip 
                  label={person.status}
                  size="small"
                  sx={{
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    fontWeight: 500
                  }}
                />
              </Box>
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Away
          </Typography>

          <Box>
            {[
              { name: 'Sophia Williams', company: 'Horizon Shift', avatar: 'SW', time: '25m', status: 'Away' },
              { name: 'Arthur Gauthier', company: 'Google UX Course', avatar: 'AG', time: '12m', status: 'Available' },
              { name: 'Emma Wright', company: 'Phoenix', avatar: 'EW', time: '8m', status: 'Available' },
            ].map((person, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#94a3b8' }}>
                  <Typography variant="caption">{person.avatar}</Typography>
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {person.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {person.company}
                  </Typography>
                </Box>
                <Chip 
                  label={person.status}
                  size="small"
                  sx={{
                    backgroundColor: person.status === 'Away' ? '#fef3c7' : '#dcfce7',
                    color: person.status === 'Away' ? '#d97706' : '#16a34a',
                    fontSize: '0.75rem',
                    mr: 1
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {person.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>

        {/* Notes */}
        <Card sx={{ p: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#8b5cf6' 
              }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Notes
              </Typography>
            </Box>
            <Button 
              size="small" 
              endIcon={<ChevronRight size={16} />}
              sx={{ color: 'text.secondary', textTransform: 'none' }}
            >
              See All
            </Button>
          </Box>

          <Box>
            <Box sx={{ mb: 3, p: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Phoenix footer section.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Adding google play buttons.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label="Today" 
                  size="small" 
                  sx={{ fontSize: '0.75rem', bgcolor: '#f1f5f9' }}
                />
                <Chip 
                  label="Writing Feedback" 
                  size="small" 
                  sx={{ fontSize: '0.75rem', bgcolor: '#fbbf24', color: 'white' }}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 3, p: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Phoenix header section.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Researching for master to understand its function.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label="Today" 
                  size="small" 
                  sx={{ fontSize: '0.75rem', bgcolor: '#f1f5f9' }}
                />
                <Chip 
                  label="Writing Feedback" 
                  size="small" 
                  sx={{ fontSize: '0.75rem', bgcolor: '#fbbf24', color: 'white' }}
                />
              </Box>
            </Box>

            <Button 
              startIcon={<Plus size={16} />}
              sx={{ 
                textTransform: 'none',
                color: 'text.secondary',
                border: '1px dashed #d1d5db',
                borderRadius: 2,
                p: 1.5,
                width: '100%',
                justifyContent: 'flex-start'
              }}
            >
              New Note
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}