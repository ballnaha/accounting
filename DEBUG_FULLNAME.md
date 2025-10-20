# Debug fullName Import Issue

## สิ่งที่แก้ไขแล้ว ✅

### 1. Prisma Schema
```prisma
fullName String? @map("full_name")  // ✅ ถูกต้อง
```

### 2. API Routes
#### POST `/api/personnel/route.ts`
```typescript
fullName: data.fullName ? String(data.fullName).trim() : null,  // ✅ เพิ่มแล้ว
console.log('📥 Received personnel data:', ...)  // ✅ มี debug log
console.log('💾 Processed data to save:', ...)
console.log('✅ Saved personnel:', ...)
```

#### PUT `/api/personnel/[id]/route.ts`
```typescript
fullName: data.fullName ? String(data.fullName).trim() : null,  // ✅ เพิ่มแล้ว
// Validation เปลี่ยนเป็น position-based แล้ว (ไม่ต้องมีชื่อก็ได้)
```

### 3. Import Client
```typescript
// Interface
interface ImportPersonnel {
  'ชื่อ-สกุล'?: string;  // ✅ ถูกต้อง
}

// Mapping
fullName: row['ชื่อ-สกุล'] ? String(row['ชื่อ-สกุล']).trim() : undefined,  // ✅ ถูกต้อง

// Debug logs เพิ่มแล้ว
console.log('📋 Excel Columns:', Object.keys(jsonData[0]));
console.log('📄 First Row Sample:', jsonData[0]);
console.log('🔍 Excel Row:', row);
console.log('📤 Sending personnelData:', personnelData);
console.log('fullName value:', row['ชื่อ-สกุล'], '→', personnelData.fullName);
```

### 4. Excel Template
```javascript
{
  'ชื่อ-สกุล': 'สมชาย ใจดี',  // ✅ ถูกต้อง
}
```

### 5. Frontend Page (page.tsx)
```typescript
// Interface
interface PolicePersonnel {
  fullName?: string;  // ✅ ไม่มี firstName/lastName แล้ว
}

// Display
{person.fullName || '-'}  // ✅ ถูกต้อง
```

---

## วิธี Debug

### ขั้นตอนที่ 1: ดาวน์โหลด Template Excel
1. เข้า `/personnel/import`
2. กด "ดาวน์โหลด Template Excel"
3. เปิดไฟล์ ตรวจสอบว่ามี column **'ชื่อ-สกุล'** (ไม่ใช่ 'ชื่อ' และ 'สกุล' แยกกัน)

### ขั้นตอนที่ 2: ทดสอบ Import
1. กรอกข้อมูลใน Excel Template (อย่าลืมคอลัมน์ 'ชื่อ-สกุล')
2. Upload ไฟล์
3. **เปิด Browser Console (F12)** ดู logs:
   ```
   📋 Excel Columns: ['อาวุโส', 'ยศ', 'ชื่อ-สกุล', ...]
   📄 First Row Sample: { ยศ: 'พ.ต.อ.', 'ชื่อ-สกุล': 'สมชาย ใจดี', ... }
   ```

4. ตรวจสอบ Preview Table - ต้องแสดงชื่อในคอลัมน์ 'ชื่อ-สกุล'

5. กด "เริ่มนำเข้าข้อมูล"

6. **ดู Browser Console** ต่อ:
   ```
   🔍 Excel Row: { 'ชื่อ-สกุล': 'สมชาย ใจดี', ... }
   📤 Sending personnelData: { fullName: 'สมชาย ใจดี', ... }
   fullName value: สมชาย ใจดี → สมชาย ใจดี
   ```

7. **ดู Terminal Console** (npm run dev):
   ```
   📥 Received personnel data: { "fullName": "สมชาย ใจดี", ... }
   💾 Processed data to save: { "fullName": "สมชาย ใจดี", ... }
   ✅ Saved personnel: { "id": "clx...", "fullName": "สมชาย ใจดี", ... }
   ```

---

## ปัญหาที่อาจพบ

### ❌ Excel Columns ไม่มี 'ชื่อ-สกุล'
**สาเหตุ:** ใช้ไฟล์ Excel แบบเก่า (ชื่อ, สกุล แยกกัน)
**แก้ไข:** Download template ใหม่จากระบบ

### ❌ fullName เป็น undefined
**สาเหตุ:** Excel มีช่องว่างหรือชื่อคอลัมน์ผิด
**ตรวจสอบ:** ดู `📋 Excel Columns` ใน console ว่ามีชื่อคอลัมน์อะไรบ้าง

### ❌ API ไม่ได้รับ fullName
**สาเหตุ:** personnelData ไม่ส่ง fullName ไป
**ตรวจสอบ:** ดู `📤 Sending personnelData` ใน console

### ❌ Database ไม่บันทึก fullName
**สาเหตุ:** Prisma Client ยังไม่ regenerate หรือ column mapping ผิด
**แก้ไข:** 
```powershell
npx prisma generate
npx prisma db push
```

---

## เช็คสุดท้าย

### Database
```sql
-- ตรวจสอบ column
DESCRIBE police_personnel;

-- ดูข้อมูลล่าสุด
SELECT id, full_name, rank, position FROM police_personnel ORDER BY created_at DESC LIMIT 5;
```

### Prisma Client
```typescript
// ตรวจสอบว่า type มี fullName
const person = await prisma.policePersonnel.findFirst();
console.log(person?.fullName);  // ต้องไม่ error
```

---

## สรุป

✅ **ทุกอย่างแก้ไขเสร็จแล้ว** - fullName ควรเข้า database ถูกต้อง

🔍 **ถ้ายังไม่เข้า** - ใช้ debug logs ข้างบนหาจุดที่ fullName หายไป

📝 **ตรวจสอบลำดับ:**
1. Excel มี column 'ชื่อ-สกุล' ✓
2. Browser รับได้ ✓
3. Import Client ส่งไป API ✓
4. API route รับและ process ✓
5. Database บันทึกได้ ✓
