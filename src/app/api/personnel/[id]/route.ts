import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - ดึงข้อมูลบุคลากรตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const personnel = await prisma.policePersonnel.findUnique({
      where: { id: params.id },
    });

    if (!personnel) {
      return NextResponse.json(
        { error: 'Personnel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(personnel);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personnel' },
      { status: 500 }
    );
  }
}

// PUT - แก้ไขข้อมูลบุคลากร
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ตรวจสอบสิทธิ์
    const userRole = (session.user as any)?.role;
    if (userRole !== 'admin' && userRole !== 'hr') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields - ต้องมีข้อมูลตำแหน่งอย่างน้อย
    if (!data.position && !data.positionNumber && !data.posCodeId) {
      return NextResponse.json(
        { error: 'Position information is required (position, positionNumber, or posCodeId)' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่
    const existing = await prisma.policePersonnel.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Personnel not found' },
        { status: 404 }
      );
    }

    // ตรวจสอบว่า nationalId ซ้ำกับคนอื่นหรือไม่ (เฉพาะถ้ามีการระบุ)
    if (data.nationalId && data.nationalId !== existing.nationalId) {
      const duplicate = await prisma.policePersonnel.findFirst({
        where: { 
          nationalId: data.nationalId,
          id: { not: params.id }
        }
      });

      if (duplicate) {
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
      updatedBy: (session.user as any)?.id,
    };

    const personnel = await prisma.policePersonnel.update({
      where: { id: params.id },
      data: processedData,
    });

    return NextResponse.json(personnel);
  } catch (error) {
    console.error('Error updating personnel:', error);
    return NextResponse.json(
      { error: 'Failed to update personnel' },
      { status: 500 }
    );
  }
}

// DELETE - ลบข้อมูลบุคลากร
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ตรวจสอบสิทธิ์ (เฉพาะ admin เท่านั้น)
    const userRole = (session.user as any)?.role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่
    const existing = await prisma.policePersonnel.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Personnel not found' },
        { status: 404 }
      );
    }

    await prisma.policePersonnel.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Personnel deleted successfully' });
  } catch (error) {
    console.error('Error deleting personnel:', error);
    return NextResponse.json(
      { error: 'Failed to delete personnel' },
      { status: 500 }
    );
  }
}
