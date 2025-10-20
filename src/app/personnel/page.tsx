'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Tooltip,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  Filter,
  X,
  Eye,
  Calendar,
  User,
  Shield,
  MapPin,
  Award,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import * as XLSX from 'xlsx';

interface PolicePersonnel {
  id: string;
  seniority?: number;
  rank?: string;
  fullName?: string;
  posCode?: string;
  position?: string;
  positionNumber?: string;
  actingAs?: string;
  lastAppointment?: string;
  currentRankSince?: string;
  enrollmentDate?: string;
  birthDate?: string;
  education?: string;
  nationalId?: string;
  unit?: string;
  retirementDate?: string;
  yearsOfService?: number;
  age?: number;
  trainingLocation?: string;
  trainingCourse?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ยศตำรวจไทย
const policeRanks = [
  'ผบ.ตร.',
  'พล.ต.อ.',
  'พล.ต.ท.',
  'พล.ต.ต.',
  'พ.ต.อ.',
  'พ.ต.ท.',
  'พ.ต.ต.',
  'ร.ต.อ.',
  'ร.ต.ท.',
  'ร.ต.ต.',
  'ด.ต.',
  'จ.ส.ต.',
  'ส.ต.อ.',
  'ส.ต.ท.',
  'ส.ต.ต.',
];

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<PolicePersonnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<PolicePersonnel | null>(null);
  const [formData, setFormData] = useState<Partial<PolicePersonnel>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [filterUnit, setFilterUnit] = useState('');

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/personnel');
      if (response.ok) {
        const data = await response.json();
        setPersonnel(data);
      }
    } catch (error) {
      console.error('Error fetching personnel:', error);
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (person?: PolicePersonnel) => {
    if (person) {
      setFormData(person);
      setSelectedPersonnel(person);
    } else {
      setFormData({});
      setSelectedPersonnel(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
    setSelectedPersonnel(null);
    setError('');
  };

  const handleViewDetails = (person: PolicePersonnel) => {
    setSelectedPersonnel(person);
    setOpenViewDialog(true);
  };

  const handleSubmit = async () => {
    try {
      const url = selectedPersonnel 
        ? `/api/personnel/${selectedPersonnel.id}`
        : '/api/personnel';
      
      const method = selectedPersonnel ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(selectedPersonnel ? 'แก้ไขข้อมูลสำเร็จ' : 'เพิ่มข้อมูลสำเร็จ');
        handleCloseDialog();
        fetchPersonnel();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      setError('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบข้อมูลนี้ใช่หรือไม่?')) return;

    try {
      const response = await fetch(`/api/personnel/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('ลบข้อมูลสำเร็จ');
        fetchPersonnel();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('ไม่สามารถลบข้อมูลได้');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาด');
    }
  };

  const filteredPersonnel = personnel.filter((person) => {
    const matchSearch = 
      person.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.nationalId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      '';
    
    const matchRank = !filterRank || person.rank === filterRank;
    const matchUnit = !filterUnit || person.unit?.includes(filterUnit);

    return matchSearch && matchRank && matchUnit;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: th });
    } catch {
      return '-';
    }
  };

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return '-';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleExport = () => {
    // แปลงข้อมูลเป็น Excel format
    const exportData = filteredPersonnel.map(p => ({
      'อาวุโส': p.seniority || '',
      'ยศ': p.rank || '',
      'ชื่อ-สกุล': p.fullName || '',
      'POSCODE': p.posCode || '',
      'ตำแหน่ง': p.position || '',
      'เลขตำแหน่ง': p.positionNumber || '',
      'ทำหน้าที่': p.actingAs || '',
      'แต่งตั้งครั้งสุดท้าย': formatDate(p.lastAppointment),
      'ระดับนี้เมื่อ': formatDate(p.currentRankSince),
      'บรรจุ': formatDate(p.enrollmentDate),
      'วันเกิด': formatDate(p.birthDate),
      'คุณวุฒิ': p.education || '',
      'เลขประจำตัวประชาชน': p.nationalId || '',
      'หน่วย': p.unit || '',
      'เกษียณ': formatDate(p.retirementDate),
      'จำนวนปี': p.yearsOfService || '',
      'อายุ': calculateAge(p.birthDate),
      'ตท.': p.trainingLocation || '',
      'นรต.': p.trainingCourse || '',
      'หมายเหตุ/เงื่อนไข': p.notes || '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Personnel');
    
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `personnel_${date}.xlsx`);
    
    setSuccess('ส่งออกข้อมูลสำเร็จ');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          ข้อมูลบุคลากร ตำรวจ
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          จัดการข้อมูลบุคลากรตำรวจทั้งหมด
        </Typography>
      </Box>

      {/* Alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filters and Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2,
            alignItems: 'center'
          }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 auto' }, minWidth: { xs: '100%', md: 300 } }}>
              <TextField
                fullWidth
                placeholder="ค้นหาด้วย ชื่อ, ID, เลขบัตรประชาชน"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ flex: { xs: '1 1 calc(50% - 8px)', sm: '0 0 150px' }, minWidth: 150 }}>
              <FormControl fullWidth>
                <InputLabel>ยศ</InputLabel>
                <Select
                  value={filterRank}
                  label="ยศ"
                  onChange={(e) => setFilterRank(e.target.value)}
                >
                  <MenuItem value="">ทั้งหมด</MenuItem>
                  {policeRanks.map((rank) => (
                    <MenuItem key={rank} value={rank}>{rank}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: '1 1 calc(50% - 8px)', sm: '0 0 150px' }, minWidth: 150 }}>
              <TextField
                fullWidth
                label="หน่วย"
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
              />
            </Box>
            <Box sx={{ 
              flex: { xs: '1 1 100%', md: '0 0 auto' },
              display: 'flex', 
              gap: 1, 
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              flexWrap: 'wrap'
            }}>
              <Button
                variant="outlined"
                startIcon={<Upload size={18} />}
                onClick={() => window.location.href = '/personnel/import'}
              >
                นำเข้า
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download size={18} />}
                onClick={handleExport}
              >
                ส่งออก
              </Button>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => handleOpenDialog()}
              >
                เพิ่มข้อมูล
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell>อาวุโส</TableCell>
                <TableCell>ยศ</TableCell>
                <TableCell>ชื่อ-สกุล</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>ตำแหน่ง</TableCell>
                <TableCell>หน่วย</TableCell>
                <TableCell>อายุ</TableCell>
                <TableCell>เกษียณ</TableCell>
                <TableCell align="center">จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredPersonnel.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">ไม่พบข้อมูล</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPersonnel
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((person) => (
                    <TableRow key={person.id} hover>
                      <TableCell>{person.seniority || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={person.rank || '-'} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {person.fullName || '-'}
                      </TableCell>
                      <TableCell>{person.nationalId || '-'}</TableCell>
                      <TableCell>{person.position || '-'}</TableCell>
                      <TableCell>{person.unit || '-'}</TableCell>
                      <TableCell>{calculateAge(person.birthDate)} ปี</TableCell>
                      <TableCell>{formatDate(person.retirementDate)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Tooltip title="ดูรายละเอียด">
                            <IconButton size="small" onClick={() => handleViewDetails(person)}>
                              <Eye size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="แก้ไข">
                            <IconButton size="small" onClick={() => handleOpenDialog(person)}>
                              <Edit2 size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="ลบ">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDelete(person.id)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredPersonnel.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="แสดงต่อหน้า:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPersonnel ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มข้อมูลบุคลากร'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 100%', minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="ชื่อ-สกุล *"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="เลขบัตรประชาชน"
                  value={formData.nationalId || ''}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="เลขบัตรประชาชน"
                  value={formData.nationalId || ''}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel>ยศ</InputLabel>
                  <Select
                    value={formData.rank || ''}
                    label="ยศ"
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  >
                    {policeRanks.map((rank) => (
                      <MenuItem key={rank} value={rank}>{rank}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="อาวุโส"
                  value={formData.seniority || ''}
                  onChange={(e) => setFormData({ ...formData, seniority: parseInt(e.target.value) })}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="ตำแหน่ง"
                  value={formData.position || ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="เลขตำแหน่ง"
                  value={formData.positionNumber || ''}
                  onChange={(e) => setFormData({ ...formData, positionNumber: e.target.value })}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="POSCODE"
                  value={formData.posCode || ''}
                  onChange={(e) => setFormData({ ...formData, posCode: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="หน่วย"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="วันเกิด"
                  value={formData.birthDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="วันบรรจุ"
                  value={formData.enrollmentDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="วันเกษียณ"
                  value={formData.retirementDate?.split('T')[0] || ''}
                  onChange={(e) => setFormData({ ...formData, retirementDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="คุณวุฒิ"
                  value={formData.education || ''}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                />
              </Box>
            </Box>
            
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="หมายเหตุ/เงื่อนไข"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.fullName}
          >
            {selectedPersonnel ? 'บันทึก' : 'เพิ่ม'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          รายละเอียดบุคลากร
        </DialogTitle>
        <DialogContent>
          {selectedPersonnel && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Shield size={48} color="#3b82f6" />
                <Box>
                  <Typography variant="h6">
                    {selectedPersonnel.rank} {selectedPersonnel.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPersonnel.position || 'ไม่ระบุตำแหน่ง'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">เลขบัตรประชาชน</Typography>
                    <Typography>{selectedPersonnel.nationalId || '-'}</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">วันเกิด</Typography>
                    <Typography>{formatDate(selectedPersonnel.birthDate)}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">หน่วย</Typography>
                    <Typography>{selectedPersonnel.unit || '-'}</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">อาวุโส</Typography>
                    <Typography>{selectedPersonnel.seniority || '-'}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">วันเกิด</Typography>
                    <Typography>{formatDate(selectedPersonnel.birthDate)}</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">อายุ</Typography>
                    <Typography>{calculateAge(selectedPersonnel.birthDate)} ปี</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">วันบรรจุ</Typography>
                    <Typography>{formatDate(selectedPersonnel.enrollmentDate)}</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">วันเกษียณ</Typography>
                    <Typography>{formatDate(selectedPersonnel.retirementDate)}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">คุณวุฒิ</Typography>
                    <Typography>{selectedPersonnel.education || '-'}</Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                    <Typography variant="caption" color="text.secondary">จำนวนปีการรับราชการ</Typography>
                    <Typography>{selectedPersonnel.yearsOfService || '-'} ปี</Typography>
                  </Box>
                </Box>
                
                {selectedPersonnel.notes && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">หมายเหตุ</Typography>
                    <Typography>{selectedPersonnel.notes}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
