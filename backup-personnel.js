const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function backup() {
  try {
    const personnel = await prisma.policePersonnel.findMany();
    console.log(`Found ${personnel.length} records`);
    
    // Save to JSON file
    fs.writeFileSync(
      'backup_personnel.json',
      JSON.stringify(personnel, null, 2)
    );
    
    console.log('✅ Backup saved to backup_personnel.json');
    
    // Generate migration script
    const migration = personnel.map((p, idx) => {
      const personnelId = `POS-${String(idx + 1).padStart(4, '0')}`;
      return `
  await prisma.policePersonnel.create({
    data: {
      personnelId: "${personnelId}",
      posCodeId: ${p.posCode || 'null'},
      position: ${p.position ? `"${p.position}"` : 'null'},
      positionNumber: ${p.positionNumber ? `"${p.positionNumber}"` : 'null'},
      rank: ${p.rank ? `"${p.rank}"` : 'null'},
      firstName: ${p.firstName ? `"${p.firstName}"` : 'null'},
      lastName: ${p.lastName ? `"${p.lastName}"` : 'null'},
      nationalId: ${p.nationalId ? `"${p.nationalId}"` : 'null'},
      unit: ${p.unit ? `"${p.unit}"` : 'null'},
      seniority: ${p.seniority || 'null'},
      age: ${p.age || 'null'},
      // ... other fields
    }
  });`;
    }).join('\n');
    
    console.log('\n📋 Migration script preview:');
    console.log(migration.substring(0, 500) + '...');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backup();
