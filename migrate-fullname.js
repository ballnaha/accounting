const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateToFullName() {
  console.log('🔄 Migrating firstName + lastName to fullName...');

  try {
    const personnel = await prisma.policePersonnel.findMany();
    
    console.log(`Found ${personnel.length} records to migrate`);

    for (const person of personnel) {
      // ข้อมูลเดิมมีแค่ firstName ที่เป็นยศ และ lastName ที่เป็นชื่อเต็ม
      // ดังนั้นต้องใช้ lastName เป็น fullName
      const fullName = person.lastName || null;
      
      await prisma.policePersonnel.update({
        where: { id: person.id },
        data: { fullName: fullName }
      });
      
      console.log(`✅ Updated: ${person.id} -> ${fullName}`);
    }

    console.log('\n✨ Migration completed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateToFullName();
