const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding PosCodeMaster...');

  // Seed PosCodeMaster
  const posCodeData = [
    { id: 1, name: 'รอง ผบ.ตร.' },
    { id: 2, name: 'ผู้ช่วย' },
    { id: 3, name: 'ผบช.' },
    { id: 4, name: 'รอง ผบช.' },
    { id: 6, name: 'ผบก.' },
    { id: 7, name: 'รอง ผบก.' },
    { id: 8, name: 'ผกก.' },
    { id: 9, name: 'รอง ผกก.' },
    { id: 11, name: 'สว.' },
    { id: 12, name: 'รอง สว.' },
  ];

  for (const posCode of posCodeData) {
    await prisma.posCodeMaster.create({
      data: posCode,
    });
    console.log(`✅ Created: ${posCode.id} - ${posCode.name}`);
  }

  console.log('\n🌱 Restoring Personnel data...');
  
  // Restore personnel data from backup
  const fs = require('fs');
  if (fs.existsSync('backup_personnel.json')) {
    const backup = JSON.parse(fs.readFileSync('backup_personnel.json', 'utf8'));
    
    for (let i = 0; i < backup.length; i++) {
      const p = backup[i];
      const personnelId = `POS-${String(i + 1).padStart(4, '0')}`;
      
      try {
        await prisma.policePersonnel.create({
          data: {
            personnelId: personnelId,
            posCodeId: p.posCode ? parseInt(p.posCode) : null,
            position: p.position || null,
            positionNumber: p.positionNumber || null,
            rank: p.rank || null,
            firstName: p.firstName || null,
            lastName: p.lastName || null,
            nationalId: p.nationalId || null,
            unit: p.unit || null,
            seniority: p.seniority || null,
            age: p.age || null,
            birthDate: p.birthDate ? new Date(p.birthDate) : null,
            education: p.education || null,
            actingAs: p.actingAs || null,
            lastAppointment: p.lastAppointment ? new Date(p.lastAppointment) : null,
            currentRankSince: p.currentRankSince ? new Date(p.currentRankSince) : null,
            enrollmentDate: p.enrollmentDate ? new Date(p.enrollmentDate) : null,
            retirementDate: p.retirementDate ? new Date(p.retirementDate) : null,
            yearsOfService: p.yearsOfService || null,
            trainingLocation: p.trainingLocation || null,
            trainingCourse: p.trainingCourse || null,
            notes: p.notes || null,
            createdBy: p.createdBy || null,
          },
        });
        console.log(`✅ Restored: ${personnelId}`);
      } catch (error) {
        console.error(`❌ Failed to restore ${personnelId}:`, error.message);
      }
    }
  } else {
    console.log('⚠️  No backup file found. Skipping personnel restoration.');
  }

  console.log('\n✨ Seed completed!');
}

seed()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
