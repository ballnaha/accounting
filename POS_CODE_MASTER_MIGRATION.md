# POS Code Master System

## 📋 ภาพรวม

สร้าง Master Table สำหรับรหัสตำแหน่ง (POSCODE) และเชื่อมโยงกับ PolicePersonnel

## 🗂️ Database Schema

### Table: `pos_code_master`
| Column | Type | Description |
|--------|------|-------------|
| pos_code_id | Int (PK) | รหัสตำแหน่ง |
| pos_code_name | String | ชื่อตำแหน่ง |
| created_at | DateTime | วันที่สร้าง |
| updated_at | DateTime | วันที่แก้ไข |

### ข้อมูล Master:
```
1  - รอง ผบ.ตร.
2  - ผู้ช่วย
3  - ผบช.
4  - รอง ผบช.
6  - ผบก.
7  - รอง ผบก.
8  - ผกก.
9  - รอง ผกก.
11 - สว.
12 - รอง สว.
```

### Table: `police_personnel`
**การเปลี่ยนแปลง:**
- ❌ `pos_code` (String) → **ลบ**
- ✅ `pos_code` (Int, FK) → **เพิ่ม** เชื่อมโยงกับ `pos_code_master.pos_code_id`

### Relation:
```prisma
model PosCodeMaster {
  id        Int       @id @map("pos_code_id")
  name      String    @map("pos_code_name")
  personnel PolicePersonnel[]  // One-to-Many
}

model PolicePersonnel {
  posCodeId     Int?           @map("pos_code")
  posCodeMaster PosCodeMaster? @relation(fields: [posCodeId], references: [id])
}
```

## 🔄 Migration Process

### 1. Backup ข้อมูลเดิม
```bash
node backup-personnel.js
```
✅ Saved to: `backup_personnel.json`

### 2. Reset Database
```bash
npx prisma db push --force-reset
```

### 3. Seed Data
```bash
node prisma/seed.js
```
- ✅ สร้างข้อมูล PosCodeMaster (10 รายการ)
- ✅ Restore ข้อมูล Personnel (8 รายการ)

### 4. Generate Prisma Client
```bash
npx prisma generate
```

## 📡 API Changes

### GET `/api/personnel`
**Response เดิม:**
```json
{
  "posCode": "8"  // String
}
```

**Response ใหม่:**
```json
{
  "posCodeId": 8,  // Int
  "posCodeMaster": {
    "id": 8,
    "name": "ผกก."
  }
}
```

### POST `/api/personnel`
**Request Body เดิม:**
```json
{
  "posCode": "8"  // String
}
```

**Request Body ใหม่:**
```json
{
  "posCodeId": 8  // Int (1-12)
}
```

### GET `/api/pos-code` (ใหม่!)
ดึงข้อมูล PosCodeMaster ทั้งหมด

**Response:**
```json
[
  { "id": 1, "name": "รอง ผบ.ตร." },
  { "id": 2, "name": "ผู้ช่วย" },
  ...
]
```

## 🔧 Code Changes

### 1. API Route (`/api/personnel/route.ts`)
```typescript
// เปลี่ยนจาก
posCode: data.posCode ? String(data.posCode) : null

// เป็น
posCodeId: data.posCodeId ? parseInt(String(data.posCodeId)) : null
```

### 2. Import Client (`ImportPersonnelClient.tsx`)
```typescript
// เปลี่ยนจาก
posCode: row.POSCODE ? String(row.POSCODE).trim() : undefined

// เป็น
posCodeId: row.POSCODE ? parseInt(String(row.POSCODE)) : undefined
```

### 3. Personnel GET API
```typescript
const personnel = await prisma.policePersonnel.findMany({
  include: {
    posCodeMaster: true, // ดึงข้อมูล PosCodeMaster มาด้วย
  }
});
```

## 📊 Excel Import Format

**Column: POSCODE**
- ค่าที่ใช้ได้: `1, 2, 3, 4, 6, 7, 8, 9, 11, 12`
- Type: Number or String (จะแปลงเป็น Int อัตโนมัติ)

**ตัวอย่าง:**
| ID | POSCODE | ตำแหน่ง | ชื่อ | สกุล |
|----|---------|---------|------|------|
| POS-001 | 8 | ผกก.ฝอ.1 | สมชาย | ใจดี |
| POS-002 | 7 | รอง ผกก. | | |

## 🎯 Benefits

### 1. **Data Integrity**
- ✅ ป้องกันการพิมพ์ผิด (1-12 เท่านั้น)
- ✅ Referential Integrity ด้วย Foreign Key

### 2. **Easy Maintenance**
- ✅ แก้ไขชื่อตำแหน่งที่เดียว (Master Table)
- ✅ เพิ่ม/ลบตำแหน่งใหม่ได้ง่าย

### 3. **Query Performance**
- ✅ Join กับ Master Table ได้เลย
- ✅ Index บน posCodeId

### 4. **Dropdown Support**
- ✅ ดึง `/api/pos-code` มาใส่ dropdown
- ✅ แสดงชื่อตำแหน่งแทนเลข

## 📝 Frontend Integration

### ใช้ Dropdown แทน Text Input:
```typescript
const [posCodeOptions, setPosCodeOptions] = useState([]);

useEffect(() => {
  fetch('/api/pos-code')
    .then(r => r.json())
    .then(data => setPosCodeOptions(data));
}, []);

// ใน Form
<Select
  label="ตำแหน่ง"
  value={formData.posCodeId}
  onChange={(e) => setFormData({...formData, posCodeId: e.target.value})}
>
  {posCodeOptions.map(opt => (
    <MenuItem key={opt.id} value={opt.id}>
      {opt.name}
    </MenuItem>
  ))}
</Select>
```

## 🚀 Next Steps

1. **Update Frontend**
   - [ ] แก้ไข Personnel List Page ให้แสดง `posCodeMaster.name`
   - [ ] เพิ่ม Dropdown ใน Add/Edit Form
   - [ ] Update Template Excel ให้มีคำแนะนำ POSCODE (1-12)

2. **Add Validation**
   - [ ] Validate POSCODE ต้องอยู่ใน range 1-12
   - [ ] แสดง error message ถ้าใส่ POSCODE ไม่ถูกต้อง

3. **Improve Import**
   - [ ] แสดง validation error สำหรับ POSCODE ที่ไม่มีใน Master
   - [ ] Auto-complete POSCODE จากชื่อตำแหน่ง

## 📁 Files Created/Modified

### สร้างใหม่:
- `prisma/seed.js` - Seed script
- `backup-personnel.js` - Backup script
- `backup_personnel.json` - Backup data
- `src/app/api/pos-code/route.ts` - POS Code Master API

### แก้ไข:
- `prisma/schema.prisma` - เพิ่ม PosCodeMaster model
- `src/app/api/personnel/route.ts` - เปลี่ยน posCode → posCodeId
- `src/app/personnel/import/ImportPersonnelClient.tsx` - เปลี่ยน posCode → posCodeId

---

**Version:** 2.0  
**Date:** 2025-10-20  
**Status:** ✅ Completed & Tested
