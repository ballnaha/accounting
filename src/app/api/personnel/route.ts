import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - ดึงข้อมูลบุคลากรทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const personnel = await (prisma.policePersonnel as any).findMany({
      include: {
        posCodeMaster: true, // Include ข้อมูล PosCodeMaster
      },
      orderBy: [
        { seniority: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(personnel);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personnel' },
      { status: 500 }
    );
  }
}

// POST - เพิ่มข้อมูลบุคลากรใหม่
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ตรวจสอบสิทธิ์ (เฉพาะ admin และ hr เท่านั้น)
    const userRole = (session.user as any)?.role;
    if (userRole !== 'admin' && userRole !== 'hr') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    
    console.log('📥 Received personnel data:', JSON.stringify(data, null, 2));

    // Validate required fields - ต้องมีข้อมูลตำแหน่งอย่างน้อย
    // ชื่อ-สกุลอาจว่างได้ถ้าเป็นตำแหน่งว่าง
    if (!data.position && !data.positionNumber && !data.posCodeId) {
      return NextResponse.json(
        { error: 'Position information is required (position, positionNumber, or posCodeId)' },
        { status: 400 }
      );
    }

    // ถ้ามีเลขบัตรประชาชน ตรวจสอบว่าซ้ำหรือไม่ (เฉพาะกรณีที่ไม่ใช่ตำแหน่งว่าง)
    if (data.nationalId) {
      const existing = await prisma.policePersonnel.findFirst({
        where: { nationalId: data.nationalId }
      });

      if (existing) {
        return NextResponse.json(
          { error: 'National ID already exists' },
          { status: 400 }
        );
      }
    }

    // แปลงและทำความสะอาดข้อมูล
    const processedData = {
      ...data,
      // แปลง string/number เป็น Int สำหรับ posCodeId
      posCodeId: data.posCodeId ? parseInt(String(data.posCodeId)) : null,
      
      // แปลง number เป็น string สำหรับฟิลด์ที่เป็น String
      fullName: data.fullName ? String(data.fullName).trim() : null,
      positionNumber: data.positionNumber ? String(data.positionNumber) : null,
      nationalId: data.nationalId ? String(data.nationalId) : null,
      
      // แปลง string เป็น Int
      seniority: data.seniority ? parseInt(String(data.seniority)) : null,
      yearsOfService: data.yearsOfService ? parseInt(String(data.yearsOfService)) : null,
      age: data.age ? parseInt(String(data.age)) : null,
      trainingCourse: data.trainingCourse ? String(data.trainingCourse) : null,
      
      // แปลง string เป็น Date สำหรับฟิลด์วันที่
      lastAppointment: data.lastAppointment ? new Date(data.lastAppointment) : null,
      currentRankSince: data.currentRankSince ? new Date(data.currentRankSince) : null,
      enrollmentDate: data.enrollmentDate ? new Date(data.enrollmentDate) : null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      retirementDate: data.retirementDate ? new Date(data.retirementDate) : null,
      
      createdBy: (session.user as any)?.id,
    };

    console.log('💾 Processed data to save:', JSON.stringify(processedData, null, 2));

    const personnel = await prisma.policePersonnel.create({
      data: processedData,
    });

    console.log('✅ Saved personnel:', JSON.stringify(personnel, null, 2));

    return NextResponse.json(personnel, { status: 201 });
  } catch (error) {
    console.error('Error creating personnel:', error);
    return NextResponse.json(
      { error: 'Failed to create personnel' },
      { status: 500 }
    );
  }
}
