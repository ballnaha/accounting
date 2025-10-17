'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Divider,
  Stack
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Badge,
  MoreVert
} from '@mui/icons-material';
import AdminLayout from '@/components/layout/AdminLayout';
import RoleGuard from '@/components/common/RoleGuard';
import CustomSnackbar from '@/components/common/CustomSnackbar';
import BreadcrumbsNav from '@/components/common/BreadcrumbsNav';
import { useSnackbar } from '@/hooks/useSnackbar';
import { systemColors } from '@/theme/colors';
import {
  sketchTextFieldStyle,
  sketchInputLabelProps,
  sketchButtonStyle,
  sketchPaperStyle,
  sketchPaperNoBorderStyle,
  sketchIconButtonStyle,
  sketchIconButton,
  sketchTitleStyle,
  sketchSelectStyle,
  sketchMenuProps,
  sketchButton,
  sketchChip
} from '@/theme/sketchTheme';

interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

const roleLabels = {
  admin: 'ผู้ดูแลระบบ',
  user: 'ผู้ใช้งาน'
};

const statusLabels = {
  active: 'ใช้งาน',
  inactive: 'ไม่ใช้งาน'
};

export default function UsersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    status: 'active' as 'active' | 'inactive'
  });

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  // Validation functions
  const validateName = (value: string): string => {
    if (!value.trim()) return 'กรุณากรอกชื่อ-นามสกุล';
    if (value.trim().length < 2) return 'ชื่อ-นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร';
    return '';
  };

  const validateUsername = (value: string): string => {
    if (!value.trim()) return 'กรุณากรอก Username';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username ต้องเป็นภาษาอังกฤษและตัวเลขเท่านั้น';
    if (value.length < 3) return 'Username ต้องมีอย่างน้อย 3 ตัวอักษร';
    return '';
  };

  const validateEmail = (value: string): string => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    return '';
  };

  const validatePassword = (value: string): string => {
    if (!selectedUser && !value) return 'กรุณากรอกรหัสผ่าน';
    if (value && value.length < 6) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: validateName(formData.name),
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // ดึงข้อมูลผู้ใช้จาก API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        // Get error details from response
        let errorMessage = 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้';
        try {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response');
        }
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้ กรุณาตรวจสอบการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term, role, and status
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(filtered);
    setPage(0);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email || '',
        password: '',
        role: user.role,
        status: user.status
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
      });
    }
    // Reset errors
    setErrors({
      name: '',
      username: '',
      email: '',
      password: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setShowPassword(false);
  };

  const handleSave = async () => {
    // Validate form
    if (!validateForm()) {
      showError('กรุณาตรวจสอบข้อมูลที่กรอก');
      return;
    }

    setSaving(true);
    try {
      if (selectedUser) {
        // Update existing user
        const response = await fetch(`/api/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUsers(prev => prev.map(user => 
            user.id === selectedUser.id ? updatedUser : user
          ));
          showSuccess('อัปเดตข้อมูลผู้ใช้สำเร็จ');
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update user');
        }
      } else {
        // Add new user
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newUser = await response.json();
          setUsers(prev => [...prev, newUser]);
          showSuccess('เพิ่มผู้ใช้ใหม่สำเร็จ');
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create user');
        }
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
      showError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        showSuccess('ลบผู้ใช้สำเร็จ');
        setDeleteDialog({ open: false, user: null });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบผู้ใช้');
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenDeleteDialog = (user: User) => {
    setDeleteDialog({ open: true, user });
  };

  const handleCloseDeleteDialog = () => {
    if (!deleting) {
      setDeleteDialog({ open: false, user: null });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return systemColors.error.main;
      case 'user': return systemColors.info.main;
      default: return systemColors.neutral[500];
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? systemColors.success.main : systemColors.neutral[400];
  };

  // MUI Design Mobile Card Component
  const UserCard = ({ user }: { user: User }) => (
    <Card 
      elevation={0}
      sx={{ 
        ...sketchPaperStyle,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ 
        flex: 1,
        p: { xs: 2, sm: 2.5 },
        '&:last-child': {
          pb: { xs: 2, sm: 2.5 }
        }
      }}>
        <Stack spacing={2}>
          {/* User Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 0.5,
                  color: 'text.primary',
                  fontSize: { xs: '0.95rem', sm: '1rem' }
                }}
              >
                {user.name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {user.username}
              </Typography>
              {user.email && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    mt: 0.5,
                    fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                    wordBreak: 'break-word'
                  }}
                >
                  {user.email}
                </Typography>
              )}
            </Box>
            
            {/* Action Buttons */}
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="แก้ไข" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(user)}
                  sx={{ 
                    ...sketchIconButton.blue,
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                  }}
                >
                  <Edit sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="ลบ" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDeleteDialog(user)}
                  sx={{ 
                    ...sketchIconButton.red,
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                  }}
                >
                  <Delete sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
          
          {/* Badges */}
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
            <Chip
              label={roleLabels[user.role]}
              size="small"
              sx={{
                ...sketchChip[user.role === 'admin' ? 'red' : 'blue'],
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            />
            <Chip
              label={statusLabels[user.status]}
              size="small"
              sx={{
                ...sketchChip[user.status === 'active' ? 'green' : 'gray'],
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            />
          </Stack>
          
          {/* Last Login */}
          {user.lastLogin && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              เข้าใช้ล่าสุด: {new Date(user.lastLogin).toLocaleDateString('th-TH')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <RoleGuard requiredRole="admin">
      <AdminLayout>
        <Box sx={{ 
          maxWidth: { xs: '100%', xl: '100%' },
          mx: 'auto',
          width: '100%'
        }}>
          {/* Breadcrumbs */}
          <BreadcrumbsNav
            items={[
              { label: 'หน้าแรก', href: '/' },
              { label: 'จัดการผู้ใช้งาน' }
            ]}
          />

          {/* MUI Design Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
            mt: 3
          }}>
            <Box>
              <Typography 
                variant="h5" 
                sx={{
                  ...sketchTitleStyle,
                  mb: 0.5
                }}
              >
                จัดการผู้ใช้งาน
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
              >
                จัดการข้อมูลและสิทธิ์การเข้าถึงของผู้ใช้ในระบบ
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                ...sketchButton.blue('small'),
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              เพิ่มผู้ใช้ใหม่
            </Button>
          </Box>

          {/* MUI Filter Section */}
          <Paper elevation={0} sx={{ 
            ...sketchPaperNoBorderStyle,
            p: { xs: 2, sm: 2.5, md: 3 }, 
            mb: 3,
          }}>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: '1fr 1fr', 
                md: '2fr 1fr 1fr',
                lg: '2fr 1fr 1fr'
              },
              gap: { xs: 1.5, sm: 2 },
              alignItems: 'end'
            }}>
              <TextField
                placeholder="ค้นหาชื่อ, ชื่อผู้ใช้, หรืออีเมล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
                InputLabelProps={sketchInputLabelProps}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#333', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ...sketchTextFieldStyle,
                  gridColumn: { xs: '1', sm: '1 / -1', md: '1' },
                }}
              />
              
              <FormControl size="small" fullWidth sx={sketchSelectStyle}>
                <InputLabel shrink sx={sketchInputLabelProps.sx}>สิทธิ์</InputLabel>
                <Select
                  value={roleFilter}
                  label="สิทธิ์"
                  onChange={(e) => setRoleFilter(e.target.value)}
                  MenuProps={sketchMenuProps}
                >
                  <MenuItem value="all">ทั้งหมด</MenuItem>
                  <MenuItem value="admin">ผู้ดูแลระบบ</MenuItem>                 
                  <MenuItem value="user">ผู้ใช้งาน</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" fullWidth sx={sketchSelectStyle}>
                <InputLabel shrink sx={sketchInputLabelProps.sx}>สถานะ</InputLabel>
                <Select
                  value={statusFilter}
                  label="สถานะ"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  MenuProps={sketchMenuProps}
                >
                  <MenuItem value="all">ทั้งหมด</MenuItem>
                  <MenuItem value="active">ใช้งาน</MenuItem>
                  <MenuItem value="inactive">ไม่ใช้งาน</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* MUI Table/Cards Container */}
          <Paper elevation={0} sx={{ 
            ...sketchPaperNoBorderStyle,
            overflow: 'hidden',
          }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Mobile & Tablet Card View */}
                {(isMobile || isTablet) ? (
                  <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '1fr 1fr'
                      },
                      gap: { xs: 2, sm: 2.5 }
                    }}>
                      {filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((user) => (
                          <UserCard key={user.id} user={user} />
                        ))}
                    </Box>
                    {filteredUsers.length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography sx={{ color: 'text.secondary', fontFamily: 'Sarabun' }}>
                          ไม่พบข้อมูลผู้ใช้
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  /* Desktop Table View */
                  <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                      <TableHead>
                        <TableRow sx={{ 
                          backgroundColor: '#f9fafb',
                          borderBottom: '2px solid #e5e7eb'
                        }}>
                          <TableCell sx={{ 
                            fontWeight: 600,
                            color: '#374151',
                            py: 2.5,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            ชื่อ-นามสกุล
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600,
                            color: '#374151',
                            py: 2.5,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            ชื่อผู้ใช้
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600,
                            color: '#374151',
                            py: 2.5,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            อีเมล
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600,
                            color: '#374151',
                            py: 2.5,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            สิทธิ์
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600,
                            color: '#374151',
                            py: 2.5,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            สถานะ
                          </TableCell>
                          <TableCell sx={{ 
                            fontWeight: 600,
                            color: '#374151',
                            py: 2.5,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            เข้าใช้ล่าสุด
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{ 
                              fontWeight: 600,
                              color: '#374151',
                              py: 2.5,
                              width: 120,
                              fontSize: '0.875rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            จัดการ
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((user, index) => (
                          <TableRow 
                            key={user.id}
                            hover
                            sx={{
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: '#f9fafb',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                              },
                              '&:last-child td': {
                                borderBottom: 0
                              }
                            }}
                          >
                            <TableCell sx={{ 
                              color: 'text.primary',
                              fontWeight: 500,
                              py: 2
                            }}>
                              {user.name}
                            </TableCell>
                            <TableCell sx={{ 
                              color: 'text.secondary',
                              py: 2
                            }}>
                              {user.username}
                            </TableCell>
                            <TableCell sx={{ 
                              color: 'text.secondary',
                              py: 2
                            }}>
                              {user.email || '-'}
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Chip
                                label={roleLabels[user.role]}
                                size="medium"
                                sx={sketchChip[user.role === 'admin' ? 'red' : 'blue']}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Chip
                                label={statusLabels[user.status]}
                                size="medium"
                                sx={sketchChip[user.status === 'active' ? 'green' : 'gray']}
                              />
                            </TableCell>
                            <TableCell sx={{ 
                              color: 'text.secondary',
                              py: 2
                            }}>
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('th-TH') : '-'}
                            </TableCell>
                            <TableCell align="center" sx={{ width: 120 }}>
                              <Stack direction="row" spacing={1.5} justifyContent="center">
                                <Tooltip title="แก้ไข" arrow placement="top">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDialog(user)}
                                    sx={sketchIconButton.blue}
                                  >
                                    <Edit sx={{ fontSize: 20 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="ลบ" arrow placement="top">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDeleteDialog(user)}
                                    sx={sketchIconButton.red}
                                  >
                                    <Delete sx={{ fontSize: 20 }} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* MUI Pagination */}
                <TablePagination
                  component="div"
                  count={filteredUsers.length}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="แสดงต่อหน้า:"
                  labelDisplayedRows={({ from, to, count }) => 
                    `${from}-${to} จาก ${count !== -1 ? count : `มากกว่า ${to}`}`
                  }
                  sx={{
                    borderTop: 1,
                    borderColor: 'divider',
                    '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                      mt: { xs: 1.5, sm: 2 },
                      mb: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    },
                    '.MuiTablePagination-select': {
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    },
                    '.MuiTablePagination-actions': {
                      ml: { xs: 1, sm: 2 }
                    }
                  }}
                />
              </>
            )}
          </Paper>

          {/* Minimal Professional Dialog */}
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            fullScreen={isMobile && !isTablet}
            PaperProps={{
              elevation: 8,
              sx: {
                borderRadius: { xs: 0, sm: 2 },
                m: { xs: 0, sm: 2 }
              }
            }}
          >
            <DialogTitle sx={{ 
              fontWeight: 600,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              pb: 2,
              pt: { xs: 2.5, sm: 3 },
              px: { xs: 2.5, sm: 3 },
              borderBottom: 1,
              borderColor: 'divider',
              background: '#fff',
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <Box sx={{
                width: 44,
                height: 44,
                borderRadius: 1.5,
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary'
              }}>
                {selectedUser ? <Edit /> : <Add />}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem', color: 'text.primary' }}>
                  {selectedUser ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  {selectedUser ? 'อัปเดตข้อมูลและสิทธิ์การใช้งาน' : 'กรอกข้อมูลผู้ใช้ใหม่ในระบบ'}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ 
              pt: { xs: 2.5, sm: 3 }, 
              pb: { xs: 2.5, sm: 3 }, 
              px: { xs: 2.5, sm: 3 } 
            }}>
              <Stack spacing={{ xs: 2.5, sm: 3 }} sx={{ mt: { xs: 2.5, sm: 3 } }}>
                <TextField
                  fullWidth
                  label="ชื่อ-นามสกุล"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, name: value }));
                    setErrors(prev => ({ ...prev, name: validateName(value) }));
                  }}
                  onBlur={() => setErrors(prev => ({ ...prev, name: validateName(formData.name) }))}
                  size="medium"
                  required
                  disabled={saving}
                  error={!!errors.name}
                  helperText={errors.name || "กรอกชื่อและนามสกุลของผู้ใช้"}
                  InputLabelProps={sketchInputLabelProps}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: '#333' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={sketchTextFieldStyle}
                />
                
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, username: value }));
                    setErrors(prev => ({ ...prev, username: validateUsername(value) }));
                  }}
                  onBlur={() => setErrors(prev => ({ ...prev, username: validateUsername(formData.username) }))}
                  required
                  size="medium"
                  disabled={saving || !!selectedUser}
                  error={!!errors.username}
                  helperText={
                    selectedUser 
                      ? "ไม่สามารถแก้ไขชื่อผู้ใช้ได้" 
                      : (errors.username || "ชื่อผู้ใช้สำหรับเข้าสู่ระบบ (ภาษาอังกฤษและตัวเลขเท่านั้น)")
                  }
                  InputLabelProps={sketchInputLabelProps}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#333' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={sketchTextFieldStyle}
                />
                
                <TextField
                  fullWidth
                  label="อีเมล"
                  type="email"
                  size="medium"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, email: value }));
                    setErrors(prev => ({ ...prev, email: validateEmail(value) }));
                  }}
                  onBlur={() => setErrors(prev => ({ ...prev, email: validateEmail(formData.email) }))}
                  disabled={saving}
                  error={!!errors.email}
                  helperText={errors.email || "อีเมลสำหรับติดต่อ (ไม่บังคับ)"}
                  InputLabelProps={sketchInputLabelProps}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#333' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={sketchTextFieldStyle}
                />
                
                <TextField
                  fullWidth
                  label={selectedUser ? "รหัสผ่านใหม่" : "รหัสผ่าน"}
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, password: value }));
                    setErrors(prev => ({ ...prev, password: validatePassword(value) }));
                  }}
                  onBlur={() => setErrors(prev => ({ ...prev, password: validatePassword(formData.password) }))}
                  required={!selectedUser}
                  size="medium"
                  disabled={saving}
                  error={!!errors.password}
                  helperText={errors.password || (selectedUser ? "เว้นว่างหากไม่ต้องการเปลี่ยนรหัสผ่าน" : "รหัสผ่านสำหรับเข้าสู่ระบบ (อย่างน้อย 6 ตัวอักษร)")}
                  InputLabelProps={sketchInputLabelProps}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={saving}
                          sx={sketchIconButtonStyle}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={sketchTextFieldStyle}
                />
                
                <FormControl fullWidth sx={sketchSelectStyle}>
                  <InputLabel shrink sx={sketchInputLabelProps.sx}>สิทธิ์การใช้งาน</InputLabel>
                  <Select
                    value={formData.role}
                    label="สิทธิ์การใช้งาน"
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                    disabled={saving}
                    MenuProps={sketchMenuProps}
                    size="medium"
                  >
                    <MenuItem value="user">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Person fontSize="small" color="primary" />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>ผู้ใช้งานทั่วไป</Typography>
                          <Typography variant="caption" color="text.secondary">สามารถใช้งานระบบพื้นฐาน</Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="admin">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Badge fontSize="small" color="error" />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>ผู้ดูแลระบบ</Typography>
                          <Typography variant="caption" color="text.secondary">เข้าถึงและจัดการระบบได้ทั้งหมด</Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ 
              px: { xs: 2.5, sm: 3 },
              py: { xs: 2, sm: 2.5 },
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'grey.50',
              gap: { xs: 1, sm: 1.5 },
              flexDirection: { xs: 'column-reverse', sm: 'row' }
            }}>
              <Button 
                onClick={handleCloseDialog}
                disabled={saving}
                fullWidth={isMobile && !isTablet}
                sx={sketchButton.gray('small')}
              >
                ยกเลิก
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                fullWidth={isMobile && !isTablet}
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
                sx={sketchButton.blue('small')}
              >
                {saving ? 'กำลังบันทึก...' : (selectedUser ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มผู้ใช้')}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog.open}
            onClose={handleCloseDeleteDialog}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: { xs: 2, sm: 3 },
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                m: { xs: 2, sm: 3 }
              }
            }}
          >
            <DialogTitle sx={{ 
              pb: 2,
              pt: { xs: 2.5, sm: 3 },
              px: { xs: 2.5, sm: 3 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Delete sx={{ color: '#dc2626', fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1, mt: 0.5 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600,
                    color: '#111827',
                    mb: 0.5
                  }}>
                    ยืนยันการลบผู้ใช้
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#6b7280',
                    lineHeight: 1.6
                  }}>
                    คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ 
              px: { xs: 2.5, sm: 3 }, 
              pb: { xs: 2, sm: 2 } 
            }}>
              {deleteDialog.user && (
                <Box
                  sx={{
                    bgcolor: '#f9fafb',
                    borderRadius: 2,
                    p: { xs: 1.5, sm: 2 },
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 18, color: '#6b7280' }} />
                      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
                        {deleteDialog.user.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge sx={{ fontSize: 18, color: '#6b7280' }} />
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {deleteDialog.user.username}
                      </Typography>
                    </Box>
                    {deleteDialog.user.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ fontSize: 18, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {deleteDialog.user.email}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              )}
              
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  mt: 2,
                  color: '#ef4444',
                  fontWeight: 500
                }}
              >
                ⚠️ การดำเนินการนี้ไม่สามารถย้อนกลับได้
              </Typography>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ 
              px: { xs: 2.5, sm: 3 }, 
              py: { xs: 1.5, sm: 2 },
              gap: { xs: 1, sm: 1.5 },
              flexDirection: { xs: 'column-reverse', sm: 'row' }
            }}>
              <Button
                onClick={handleCloseDeleteDialog}
                disabled={deleting}
                fullWidth={isMobile && !isTablet}
                sx={sketchButton.gray('small')}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={() => deleteDialog.user && handleDelete(deleteDialog.user.id)}
                disabled={deleting}
                fullWidth={isMobile && !isTablet}
                startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <Delete />}
                sx={sketchButton.red('small')}
              >
                {deleting ? 'กำลังลบ...' : 'ลบผู้ใช้'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Custom Snackbar */}
          <CustomSnackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            autoHideDuration={snackbar.autoHideDuration}
            onClose={hideSnackbar}
          />
        </Box>
      </AdminLayout>
    </RoleGuard>
  );
}