'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Download,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

interface ImportPersonnel {
  อาวุโส?: string;
  ยศ?: string;
  'ชื่อ-สกุล'?: string; // เปลี่ยนเป็นฟิลด์เดียว
  POSCODE?: string;
  ตำแหน่ง?: string;
  เลขตำแหน่ง?: string;
  ทำหน้าที่?: string;
  แต่งตั้งครั้งสุดท้าย?: string;
  ระดับนี้เมื่อ?: string;
  บรรจุ?: string;
  วันเกิด?: string;
  คุณวุฒิ?: string;
  เลขประจำตัวประชาชน?: string;
  หน่วย?: string;
  เกษียณ?: string;
  จำนวนปี?: string;
  อายุ?: string;
  'ตท.'?: string;
  'นรต.'?: string;
  'หมายเหตุ/เงื่อนไข'?: string;
  _error?: string;
  _status?: 'valid' | 'invalid';
}

const steps = ['อัพโหลดไฟล์', 'ตรวจสอบข้อมูล', 'นำเข้าข้อมูล'];

export default function ImportPersonnelClient() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ImportPersonnel[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const parseDate = (dateStr?: string): string | undefined => {
    if (!dateStr) return undefined;
    
    try {
      // ถ้าเป็นตัวเลข Excel serial date
      if (typeof dateStr === 'number') {
        const date = XLSX.SSF.parse_date_code(dateStr);
        let year = date.y;
        // แปลง พ.ศ. เป็น ค.ศ. ถ้าจำเป็น
        if (year > 2400) year -= 543;
        return `${year}-${date.m.toString().padStart(2, '0')}-${date.d.toString().padStart(2, '0')}`;
      }
      
      // ถ้าเป็น string
      const str = dateStr.toString().trim();
      
      // Format: dd/mm/yyyy
      const parts = str.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        let year = parseInt(parts[2]);
        
        // แปลง พ.ศ. เป็น ค.ศ.
        if (year > 2400) year -= 543;
        
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }
      
      return str;
    } catch (e) {
      return undefined;
    }
  };

  const validateRow = (row: ImportPersonnel): string | null => {
    // ต้องมีข้อมูลตำแหน่งอย่างน้อย
    if (!row.ตำแหน่ง && !row.เลขตำแหน่ง && !row.POSCODE) {
      return 'ต้องมีข้อมูลตำแหน่ง (ตำแหน่ง, เลขตำแหน่ง หรือ POSCODE)';
    }
    
    // ตรวจสอบเลขบัตรประชาชน (ถ้ามี)
    if (row.เลขประจำตัวประชาชน && row.เลขประจำตัวประชาชน.trim() !== '') {
      const cleanId = row.เลขประจำตัวประชาชน.replace(/\s|-/g, '');
      if (cleanId.length !== 13) {
        return 'เลขบัตรประชาชนต้องมี 13 หลัก';
      }
    }
    
    return null;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('กรุณาเลือกไฟล์');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<ImportPersonnel>(worksheet);

      // Debug: ดูชื่อ columns และ sample data
      if (jsonData.length > 0) {
        console.log('📋 Excel Columns:', Object.keys(jsonData[0]));
        console.log('📄 First Row Sample:', jsonData[0]);
      }

      // Validate และเพิ่ม status
      const validatedData = jsonData.map((row) => {
        const error = validateRow(row);
        return {
          ...row,
          _error: error || undefined,
          _status: error ? 'invalid' : 'valid',
        } as ImportPersonnel;
      });

      setData(validatedData);
      setActiveStep(1);
      
      const validCount = validatedData.filter(r => r._status === 'valid').length;
      const invalidCount = validatedData.filter(r => r._status === 'invalid').length;
      
      setSuccess(`อ่านข้อมูลสำเร็จ: ${validCount} รายการถูกต้อง, ${invalidCount} รายการผิดพลาด`);
    } catch (err) {
      setError('ไม่สามารถอ่านไฟล์ได้ กรุณาตรวจสอบรูปแบบไฟล์');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    const validData = data.filter(row => row._status === 'valid');
    
    if (validData.length === 0) {
      setError('ไม่มีข้อมูลที่ถูกต้องสำหรับนำเข้า');
      return;
    }

    setImporting(true);
    setError('');

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const row of validData) {
      try {
        const personnelData = {
          seniority: row.อาวุโส ? parseInt(String(row.อาวุโส)) : undefined,
          rank: row.ยศ ? String(row.ยศ).trim() : undefined,
          fullName: row['ชื่อ-สกุล'] ? String(row['ชื่อ-สกุล']).trim() : undefined,
          posCodeId: row.POSCODE ? parseInt(String(row.POSCODE)) : undefined,
          position: row.ตำแหน่ง ? String(row.ตำแหน่ง).trim() : undefined,
          positionNumber: row.เลขตำแหน่ง ? String(row.เลขตำแหน่ง).trim() : undefined,
          actingAs: row.ทำหน้าที่ ? String(row.ทำหน้าที่).trim() : undefined,
          lastAppointment: parseDate(row.แต่งตั้งครั้งสุดท้าย),
          currentRankSince: parseDate(row.ระดับนี้เมื่อ),
          enrollmentDate: parseDate(row.บรรจุ),
          birthDate: parseDate(row.วันเกิด),
          education: row.คุณวุฒิ ? String(row.คุณวุฒิ).trim() : undefined,
          nationalId: row.เลขประจำตัวประชาชน ? String(row.เลขประจำตัวประชาชน).replace(/\s|-/g, '') : undefined,
          unit: row.หน่วย ? String(row.หน่วย).trim() : undefined,
          retirementDate: parseDate(row.เกษียณ),
          yearsOfService: row.จำนวนปี ? parseInt(String(row.จำนวนปี)) : undefined,
          age: row.อายุ ? parseInt(String(row.อายุ)) : undefined,
          trainingLocation: row['ตท.'] ? String(row['ตท.']).trim() : undefined,
          trainingCourse: row['นรต.'] ? String(row['นรต.']).trim() : undefined,
          notes: row['หมายเหตุ/เงื่อนไข'] ? String(row['หมายเหตุ/เงื่อนไข']).trim() : undefined,
        };

        console.log('🔍 Excel Row:', row);
        console.log('📤 Sending personnelData:', personnelData);
        console.log('fullName value:', row['ชื่อ-สกุล'], '→', personnelData.fullName);

        const response = await fetch('/api/personnel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(personnelData),
        });

        if (response.ok) {
          results.success++;
        } else {
          results.failed++;
          const errorData = await response.json();
          const errorMsg = errorData.error || 'Unknown error';
          const rowId = row['ชื่อ-สกุล'] || row.ตำแหน่ง || 'Unknown';
          results.errors.push(`${rowId}: ${errorMsg}`);
          console.error('Import failed for row:', row, 'Error:', errorData);
        }
      } catch (err) {
        results.failed++;
        const rowId = row['ชื่อ-สกุล'] || row.ตำแหน่ง || 'Unknown';
        results.errors.push(`${rowId}: ${String(err)}`);
        console.error('Import exception for row:', row, 'Error:', err);
      }
    }

    setImportResult(results);
    setImporting(false);
    setActiveStep(2);
  };

  const handleDownloadTemplate = () => {
    const template = [
      // ตัวอย่างตำแหน่งที่มีคนดำรง
      {
        'อาวุโส': '1',
        'ยศ': 'พ.ต.อ.',
        'ชื่อ-สกุล': 'สมชาย ใจดี',
        'POSCODE': '8',
        'ตำแหน่ง': 'ผู้บังคับการ',
        'เลขตำแหน่ง': '001/2560',
        'ทำหน้าที่': 'ผู้บังคับการกองกำลัง',
        'แต่งตั้งครั้งสุดท้าย': '01/10/2565',
        'ระดับนี้เมื่อ': '01/04/2563',
        'บรรจุ': '15/05/2540',
        'วันเกิด': '20/03/2520',
        'คุณวุฒิ': 'ปริญญาตรี',
        'เลขประจำตัวประชาชน': '1234567890123',
        'หน่วย': 'กองกำลัง 1',
        'เกษียณ': '20/03/2580',
        'จำนวนปี': '23',
        'อายุ': '55',
        'ตท.': '',
        'นรต.': '56',
        'หมายเหตุ/เงื่อนไข': 'ตัวอย่างตำแหน่งที่มีคนดำรง',
      },
      // ตัวอย่างตำแหน่งว่าง (ไม่มีชื่อคน)
      {
        'อาวุโส': '',
        'ยศ': '',
        'ชื่อ-สกุล': '',
        'POSCODE': '7',
        'ตำแหน่ง': 'รองผู้บังคับการ',
        'เลขตำแหน่ง': '002/2560',
        'ทำหน้าที่': '',
        'แต่งตั้งครั้งสุดท้าย': '',
        'ระดับนี้เมื่อ': '',
        'บรรจุ': '',
        'วันเกิด': '',
        'คุณวุฒิ': '',
        'เลขประจำตัวประชาชน': '',
        'หน่วย': 'กองกำลัง 1',
        'เกษียณ': '',
        'จำนวนปี': '',
        'อายุ': '',
        'ตท.': '',
        'นรต.': '',
        'หมายเหตุ/เงื่อนไข': 'ตัวอย่างตำแหน่งว่าง',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'template_personnel.xlsx');
  };

  const handleRemoveRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setActiveStep(0);
    setFile(null);
    setData([]);
    setError('');
    setSuccess('');
    setImportResult(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => router.push('/personnel')}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            นำเข้าข้อมูลบุคลากร
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            นำเข้าข้อมูลจากไฟล์ Excel
          </Typography>
        </Box>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

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

      {/* Step 0: Upload File */}
      {activeStep === 0 && (
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
            <FileSpreadsheet size={64} color="#3b82f6" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              เลือกไฟล์ Excel เพื่อนำเข้า
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              รองรับไฟล์ .xlsx, .xls
            </Typography>

            <Box sx={{ mb: 3 }}>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Upload size={18} />}
                  sx={{ mr: 2 }}
                >
                  เลือกไฟล์
                </Button>
              </label>
              <Button
                variant="text"
                startIcon={<Download size={18} />}
                onClick={handleDownloadTemplate}
              >
                ดาวน์โหลด Template
              </Button>
            </Box>

            {file && (
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={<FileSpreadsheet size={16} />}
                  label={file.name}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleUpload}
              disabled={!file || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Upload size={20} />}
            >
              {loading ? 'กำลังอ่านไฟล์...' : 'อัพโหลดและตรวจสอบ'}
            </Button>

            {/* Instructions */}
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                คำแนะนำ:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  ไฟล์ Excel ต้องมีคอลัมน์ตามที่กำหนดใน Template
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>คอลัมน์ที่ต้องมี:</strong> ตำแหน่ง, เลขตำแหน่ง หรือ POSCODE (อย่างน้อย 1 ค่า)
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>POSCODE:</strong> ใช้เลข 1-12 ตามตารางตำแหน่ง (เช่น 8=ผกก., 7=รอง ผกก.)
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>ตำแหน่งว่าง:</strong> ไม่ต้องกรอก ชื่อ, สกุล, เลขบัตรประชาชน
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>ยศ:</strong> ใส่ในคอลัมน์ "ยศ" เช่น พ.ต.อ., พ.ต.ท.
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>ชื่อ-สกุล:</strong> ใส่ในคอลัมน์เดียว เช่น "สมชาย ใจดี"
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  วันที่ใช้รูปแบบ dd/mm/yyyy (เช่น 01/01/2565)
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  เลขบัตรประชาชนต้องมี 13 หลัก (สามารถใส่เครื่องหมาย - หรือช่องว่างได้)
                </Typography>
                <Typography component="li" variant="body2">
                  ระบบจะตรวจสอบข้อมูลก่อนนำเข้าและแสดงรายการที่ผิดพลาด
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Step 1: Review Data */}
      {activeStep === 1 && (
        <Paper>
          <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">ตรวจสอบข้อมูล</Typography>
                <Typography variant="body2" color="text.secondary">
                  ทั้งหมด {data.length} รายการ (
                  <span style={{ color: '#10b981' }}>
                    {data.filter(r => r._status === 'valid').length} ถูกต้อง
                  </span>
                  , 
                  <span style={{ color: '#ef4444' }}>
                    {data.filter(r => r._status === 'invalid').length} ผิดพลาด
                  </span>
                  )
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={handleReset}>
                  ยกเลิก
                </Button>
                <Button
                  variant="contained"
                  onClick={handleImport}
                  disabled={data.filter(r => r._status === 'valid').length === 0 || importing}
                  startIcon={importing ? <CircularProgress size={20} /> : <CheckCircle size={20} />}
                >
                  {importing ? 'กำลังนำเข้า...' : 'นำเข้าข้อมูล'}
                </Button>
              </Box>
            </Box>
          </Box>

          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>สถานะ</TableCell>
                  <TableCell>ยศ</TableCell>
                  <TableCell>ชื่อ-สกุล</TableCell>
                  
                  <TableCell>ตำแหน่ง</TableCell>
                  <TableCell>หน่วย</TableCell>
                  <TableCell>ข้อผิดพลาด</TableCell>
                  <TableCell align="center">ลบ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} sx={{ bgcolor: row._status === 'invalid' ? '#fef2f2' : 'transparent' }}>
                    <TableCell>
                      {row._status === 'valid' ? (
                        <CheckCircle size={20} color="#10b981" />
                      ) : (
                        <XCircle size={20} color="#ef4444" />
                      )}
                    </TableCell>
                    <TableCell>{row.ยศ || '-'}</TableCell>
                    <TableCell>{row['ชื่อ-สกุล'] || '-'}</TableCell>
                    <TableCell>{row.ตำแหน่ง || '-'}</TableCell>
                    <TableCell>{row.หน่วย || '-'}</TableCell>
                    <TableCell>
                      {row._error && (
                        <Typography variant="caption" color="error">
                          {row._error}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="ลบ">
                        <IconButton size="small" onClick={() => handleRemoveRow(index)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Step 2: Import Result */}
      {activeStep === 2 && importResult && (
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
            <CheckCircle size={64} color="#10b981" style={{ marginBottom: 16 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              นำเข้าข้อมูลเสร็จสิ้น
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
                <Box>
                  <Typography variant="h3" color="success.main">
                    {importResult.success}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    สำเร็จ
                  </Typography>
                </Box>
                {importResult.failed > 0 && (
                  <Box>
                    <Typography variant="h3" color="error.main">
                      {importResult.failed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ล้มเหลว
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {importResult.errors.length > 0 && (
              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  รายการที่ล้มเหลว:
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto', p: 2, bgcolor: '#fef2f2', borderRadius: 1 }}>
                  {importResult.errors.map((err, idx) => (
                    <Typography key={idx} variant="caption" color="error" sx={{ display: 'block', mb: 0.5 }}>
                      • {err}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" onClick={handleReset}>
                นำเข้าใหม่
              </Button>
              <Button variant="contained" onClick={() => router.push('/personnel')}>
                ไปยังหน้ารายการ
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
