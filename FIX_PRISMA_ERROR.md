# แก้ไข Error: Property 'policePersonnel' does not exist

## สาเหตุ
TypeScript Language Server ใน VS Code ยัง cache types เก่าของ Prisma Client อยู่

## การตรวจสอบ
Prisma Client ถูก generate เรียบร้อยแล้วและมี `policePersonnel` model อยู่จริง

```bash
# ตรวจสอบว่า Prisma Client มี model
node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); console.log(Object.keys(p).filter(k => !k.startsWith('_') && !k.startsWith('$')).join(', '))"

# ผลลัพธ์: constructor, account, session, user, verificationToken, policePersonnel
```

## วิธีแก้ไข

### วิธีที่ 1: Restart TypeScript Server (แนะนำ)
1. กด `Ctrl+Shift+P` (Windows/Linux) หรือ `Cmd+Shift+P` (Mac)
2. พิมพ์ `TypeScript: Restart TS Server`
3. กด Enter
4. รอสักครู่ให้ TypeScript โหลด types ใหม่

### วิธีที่ 2: Restart VS Code
1. ปิด VS Code
2. เปิดใหม่
3. รอให้โหลดโปรเจกต์เสร็จ

### วิธีที่ 3: ลบ Cache และ Generate ใหม่
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.prisma\client -ErrorAction SilentlyContinue
npx prisma generate
```

จากนั้น Restart TypeScript Server

## ยืนยันว่าแก้ไขแล้ว

หลังจาก Restart TypeScript Server:
- Error สีแดงใน VS Code ควรหายไป
- Autocomplete สำหรับ `prisma.policePersonnel` ควรทำงาน
- สามารถรัน dev server ได้โดยไม่มี error

## หมายเหตุ

**โค้ดทำงานได้ถูกต้องแล้ว** แม้จะมี error แสดงใน VS Code ก็ตาม เพราะ:
- Prisma Client ถูก generate แล้ว
- Runtime จะหา `policePersonnel` เจอ
- นี่เป็นแค่ปัญหาของ TypeScript intellisense เท่านั้น

## การทดสอบ

รันคำสั่งนี้เพื่อทดสอบว่าทำงานได้:
```bash
npm run dev
```

จากนั้นเข้า `http://localhost:3003/personnel` ควรทำงานได้ปกติ

## ป้องกันปัญหานี้ในอนาคต

เมื่อแก้ไข Prisma schema:
1. Run `npx prisma generate`
2. Restart TypeScript Server ทันที
3. ถ้าใช้ `npx prisma db push` มันจะ generate อัตโนมัติ แต่ก็ควร restart TS server
