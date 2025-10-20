// Utility functions for importing and exporting police personnel data

export interface PersonnelCSVRow {
  อาวุโส?: string;
  ยศ?: string;
  ชื่อ: string;
  สกุล: string;
  ID: string;
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
}

/**
 * แปลงข้อมูล CSV เป็น JSON
 */
export function parseCSVToPersonnel(csvText: string): PersonnelCSVRow[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const data: PersonnelCSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return data;
}

/**
 * แปลงข้อมูล personnel เป็น CSV
 */
export function personnelToCSV(personnel: any[]): string {
  const headers = [
    'อาวุโส',
    'ยศ',
    'ชื่อ',
    'สกุล',
    'ID',
    'POSCODE',
    'ตำแหน่ง',
    'เลขตำแหน่ง',
    'ทำหน้าที่',
    'แต่งตั้งครั้งสุดท้าย',
    'ระดับนี้เมื่อ',
    'บรรจุ',
    'วันเกิด',
    'คุณวุฒิ',
    'เลขประจำตัวประชาชน',
    'หน่วย',
    'เกษียณ',
    'จำนวนปี',
    'อายุ',
    'ตท.',
    'นรต.',
    'หมายเหตุ/เงื่อนไข',
  ];

  const rows = personnel.map(p => [
    p.seniority || '',
    p.rank || '',
    p.firstName || '',
    p.lastName || '',
    p.personnelId || '',
    p.posCode || '',
    p.position || '',
    p.positionNumber || '',
    p.actingAs || '',
    formatDate(p.lastAppointment),
    formatDate(p.currentRankSince),
    formatDate(p.enrollmentDate),
    formatDate(p.birthDate),
    p.education || '',
    p.nationalId || '',
    p.unit || '',
    formatDate(p.retirementDate),
    p.yearsOfService || '',
    p.age || '',
    p.trainingLocation || '',
    p.trainingCourse || '',
    p.notes || '',
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * แปลงวันที่เป็น string สำหรับ CSV
 */
function formatDate(date?: string | Date): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('th-TH');
  } catch {
    return '';
  }
}

/**
 * ดาวน์โหลดไฟล์ CSV
 */
export function downloadCSV(csvContent: string, filename: string = 'personnel.csv') {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * แปลงข้อมูล CSV row เป็น personnel object
 */
export function csvRowToPersonnel(row: PersonnelCSVRow): any {
  return {
    seniority: row.อาวุโส ? parseInt(row.อาวุโส) : undefined,
    rank: row.ยศ,
    firstName: row.ชื่อ,
    lastName: row.สกุล,
    personnelId: row.ID,
    posCode: row.POSCODE,
    position: row.ตำแหน่ง,
    positionNumber: row.เลขตำแหน่ง,
    actingAs: row.ทำหน้าที่,
    lastAppointment: parseThaiDate(row.แต่งตั้งครั้งสุดท้าย),
    currentRankSince: parseThaiDate(row.ระดับนี้เมื่อ),
    enrollmentDate: parseThaiDate(row.บรรจุ),
    birthDate: parseThaiDate(row.วันเกิด),
    education: row.คุณวุฒิ,
    nationalId: row.เลขประจำตัวประชาชน,
    unit: row.หน่วย,
    retirementDate: parseThaiDate(row.เกษียณ),
    yearsOfService: row.จำนวนปี ? parseInt(row.จำนวนปี) : undefined,
    age: row.อายุ ? parseInt(row.อายุ) : undefined,
    trainingLocation: row['ตท.'],
    trainingCourse: row['นรต.'],
    notes: row['หมายเหตุ/เงื่อนไข'],
  };
}

/**
 * แปลง Thai date string เป็น ISO date
 */
function parseThaiDate(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  
  try {
    // ถ้าเป็น format dd/mm/yyyy (Thai year)
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      let year = parseInt(parts[2]);
      
      // แปลง พ.ศ. เป็น ค.ศ.
      if (year > 2400) {
        year -= 543;
      }
      
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    
    return dateStr;
  } catch {
    return undefined;
  }
}
