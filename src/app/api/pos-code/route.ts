import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - ดึงข้อมูล POS Code Master ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore - Prisma client type not yet updated
    const posCodeMaster = await prisma.posCodeMaster.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    return NextResponse.json(posCodeMaster);
  } catch (error) {
    console.error('Error fetching POS code master:', error);
    return NextResponse.json(
      { error: 'Failed to fetch POS code master' },
      { status: 500 }
    );
  }
}
