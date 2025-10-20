# ระบบจัดการข้อมูลตำแหน่งตำรวจ (Police Position Management System)

## 📋 แนวคิดของระบบ

ระบบนี้เป็น **ระบบจัดการข้อมูลตำแหน่ง** ไม่ใช่ระบบจัดการข้อมูลบุคคล

### ความแตกต่าง:
- **ตำแหน่งที่มีคนดำรง** = มีข้อมูลตำแหน่ง + ข้อมูลบุคคล (ชื่อ-สกุล, เลขบัตรประชาชน)
- **ตำแหน่งว่าง** = มีข้อมูลตำแหน่งเท่านั้น (ไม่มีชื่อคน)

## 🗂️ โครงสร้างข้อมูล

### ข้อมูลที่จำเป็น (Required):
- `personnelId` (ID) - รหัสตำแหน่ง (ต้องไม่ซ้ำ)
- ข้อมูลตำแหน่งอย่างน้อย 1 ฟิลด์: `position`, `positionNumber`, หรือ `posCode`

### ข้อมูลตำแหน่ง (Position Information):
- `posCode` - POSCODE
- `position` - ชื่อตำแหน่ง
- `positionNumber` - เลขตำแหน่ง
- `unit` - หน่วย
- `actingAs` - ทำหน้าที่

### ข้อมูลบุคคลที่ดำรงตำแหน่ง (Person Information - Optional):
- `firstName` - ชื่อ (ถ้ามีต้องมีทั้งชื่อและสกุล)
- `lastName` - นามสกุล (ถ้ามีต้องมีทั้งชื่อและสกุล)
- `rank` - ยศ
- `seniority` - อาวุโส
- `nationalId` - เลขบัตรประชาชน 13 หลัก
- `birthDate` - วันเกิด
- `age` - อายุ
- `education` - คุณวุฒิ

### ข้อมูลการแต่งตั้ง (Appointment Information):
- `lastAppointment` - วันแต่งตั้งครั้งสุดท้าย
- `currentRankSince` - ระดับนี้เมื่อ
- `enrollmentDate` - วันบรรจุ
- `retirementDate` - วันเกษียณ
- `yearsOfService` - จำนวนปีราชการ

### ข้อมูลการฝึกอบรม (Training Information):
- `trainingLocation` - ตท. (ตำแหน่งการฝึกอบรม)
- `trainingCourse` - นรต. (นายร้อยตำรวจ)

## 📊 API Endpoints

### GET `/api/personnel`
ดึงข้อมูลตำแหน่งทั้งหมด (ทั้งที่มีคนดำรงและตำแหน่งว่าง)

**Response:**
```json
[
  {
    "id": "clx...",
    "personnelId": "POS-001",
    "position": "ผู้บังคับการ",
    "firstName": "สมชาย",
    "lastName": "ใจดี",
    ...
  },
  {
    "id": "cly...",
    "personnelId": "POS-002",
    "position": "รองผู้บังคับการ",
    "firstName": null,
    "lastName": null,
    ... // ตำแหน่งว่าง
  }
]
```

### POST `/api/personnel`
สร้างข้อมูลตำแหน่งใหม่

**Validation Rules:**
1. ต้องมี `personnelId` (ไม่ซ้ำ)
2. ต้องมีข้อมูลตำแหน่งอย่างน้อย 1 ฟิลด์
3. ถ้ามี `firstName` ต้องมี `lastName` ด้วย (และในทางกลับกัน)
4. ถ้ามี `nationalId` ต้องไม่ซ้ำในระบบ

**Request Body (ตำแหน่งที่มีคนดำรง):**
```json
{
  "personnelId": "POS-001",
  "position": "ผู้บังคับการ",
  "positionNumber": "001/2560",
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "rank": "พ.ต.อ.",
  "nationalId": "1234567890123",
  "unit": "กองกำลัง 1"
}
```

**Request Body (ตำแหน่งว่าง):**
```json
{
  "personnelId": "POS-002",
  "position": "รองผู้บังคับการ",
  "positionNumber": "002/2560",
  "unit": "กองกำลัง 1"
}
```

### PUT `/api/personnel/[id]`
แก้ไขข้อมูลตำแหน่ง

### DELETE `/api/personnel/[id]`
ลบข้อมูลตำแหน่ง

## 📥 การนำเข้าข้อมูลจาก Excel

### Template Format:
Download template ได้จากหน้า `/personnel/import`

**Columns:**
```
ID | อาวุโส | ยศ | ชื่อ | สกุล | POSCODE | ตำแหน่ง | เลขตำแหน่ง | ...
```

### ตัวอย่างข้อมูล:

#### 1. ตำแหน่งที่มีคนดำรง:
```
POS-001 | 1 | พ.ต.อ. | สมชาย | ใจดี | POS001 | ผู้บังคับการ | 001/2560 | ...
```

#### 2. ตำแหน่งว่าง:
```
POS-002 | | | | | POS002 | รองผู้บังคับการ | 002/2560 | ...
```

### Validation Rules:
1. ✅ **ต้องมี**: ข้อมูลตำแหน่ง (ตำแหน่ง, เลขตำแหน่ง หรือ POSCODE)
2. ✅ **ถ้ามีชื่อหรือสกุล**: ต้องมีทั้งคู่
3. ✅ **เลขบัตรประชาชน**: ต้องมี 13 หลัก (ถ้ามี)
4. ✅ **วันที่**: รูปแบบ dd/mm/yyyy เช่น 01/01/2565

### Import Process:
1. **Upload** - เลือกไฟล์ Excel
2. **Review** - ตรวจสอบข้อมูลและความถูกต้อง
3. **Import** - นำเข้าข้อมูลเข้าระบบ

## 🔐 Authorization

### Role-based Access:
- **Admin** - เข้าถึงทุกอย่าง (CRUD)
- **HR** - เข้าถึงทุกอย่าง (CRUD)
- **User** - อ่านได้อย่างเดียว (Read-only)

### Protected Routes:
- `/personnel` - ทุก role
- `/personnel/import` - admin, hr เท่านั้น
- API POST/PUT/DELETE - admin, hr เท่านั้น

## 🎯 Use Cases

### 1. บันทึกตำแหน่งใหม่ที่มีคนดำรง
```typescript
await fetch('/api/personnel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    personnelId: 'POS-001',
    position: 'ผู้บังคับการ',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    rank: 'พ.ต.อ.',
    nationalId: '1234567890123'
  })
});
```

### 2. บันทึกตำแหน่งว่าง
```typescript
await fetch('/api/personnel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    personnelId: 'POS-002',
    position: 'รองผู้บังคับการ',
    positionNumber: '002/2560',
    unit: 'กองกำลัง 1'
  })
});
```

### 3. แต่งตั้งคนเข้าตำแหน่งว่าง
```typescript
// GET position data first
const position = await fetch('/api/personnel/[id]').then(r => r.json());

// UPDATE with person information
await fetch('/api/personnel/[id]', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...position,
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    rank: 'พ.ต.อ.',
    nationalId: '1234567890123',
    lastAppointment: '2024-01-01'
  })
});
```

### 4. ปล่อยตำแหน่งว่าง (ย้ายหรือเกษียณ)
```typescript
await fetch('/api/personnel/[id]', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...position,
    firstName: null,
    lastName: null,
    rank: null,
    nationalId: null,
    birthDate: null,
    // เก็บข้อมูลตำแหน่งไว้
    notes: 'ว่างเนื่องจากเกษียณ 01/10/2567'
  })
});
```

## 📁 File Structure

```
src/
├── app/
│   ├── personnel/
│   │   ├── layout.tsx              # Personnel layout with AdminLayout
│   │   ├── page.tsx                # Personnel list page
│   │   └── import/
│   │       ├── page.tsx            # Import page wrapper
│   │       └── ImportPersonnelClient.tsx  # Import wizard
│   └── api/
│       └── personnel/
│           ├── route.ts            # GET, POST
│           └── [id]/
│               └── route.ts        # GET, PUT, DELETE
├── components/
│   └── layout/
│       ├── AdminLayout.tsx         # Main admin layout
│       ├── Header.tsx              # Top navigation
│       └── Sidebar.tsx             # Side navigation with menu
└── prisma/
    └── schema.prisma               # Database schema
```

## 🚀 Getting Started

1. **Setup Database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```

3. **Access Pages:**
   - Personnel List: http://localhost:3000/personnel
   - Import Data: http://localhost:3000/personnel/import

4. **Download Template:**
   - Click "ดาวน์โหลด Template" on import page
   - Fill in data (both occupied and vacant positions)
   - Upload and review

## ⚠️ Important Notes

1. **personnelId** คือรหัสตำแหน่ง ไม่ใช่เลขบัตรประชาชน
2. **nationalId** ต้องไม่ซ้ำในระบบ (สำหรับบุคคล)
3. ตำแหน่งว่างไม่จำเป็นต้องมีข้อมูลบุคคล
4. ถ้าแก้ไขให้คนออกจากตำแหน่ง ให้ set firstName, lastName เป็น null
5. ข้อมูลตำแหน่งควรเก็บไว้เสมอ (position, positionNumber)

## 🔄 Migration Path

ถ้ามีข้อมูลเก่าที่เป็น "personnel" อยู่:
1. Export ข้อมูลเดิมออกมาเป็น Excel
2. เพิ่ม column `ID` (รหัสตำแหน่ง)
3. ปรับข้อมูลให้มีทั้งตำแหน่งที่มีคนและตำแหน่งว่าง
4. Import ใหม่ผ่านระบบ

---

**Version:** 1.0  
**Last Updated:** 2025-10-20  
**System Type:** Position Management System (not Personnel Database)
