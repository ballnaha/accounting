import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/users - ดึงรายการผู้ใช้ทั้งหมด
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session in users API:', session);
    console.log('User role:', session?.user ? (session.user as any).role : 'No session');
    
    if (!session || !session.user) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: 'ไม่มีการเข้าสู่ระบบ',
          debug: 'No session found'
        },
        { status: 401 }
      );
    }
    
    if ((session.user as any).role !== 'admin') {
      return NextResponse.json(
        { 
          error: 'Forbidden',
          message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลผู้ใช้',
          debug: `User role: ${(session.user as any).role}, required: admin`
        },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // แปลงข้อมูลให้ตรงกับ interface
    const formattedUsers = users.map((user: any) => ({
      id: user.id,
      username: user.username,
      name: user.name || '',
      email: user.email || '',
      role: user.role as 'admin' | 'hr' | 'user',
      status: 'active' as const, // TODO: เพิ่ม field status ใน database ในอนาคต
      createdAt: user.createdAt.toISOString(),
      lastLogin: user.updatedAt.toISOString() // ใช้ updatedAt แทน lastLogin ชั่วคราว
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - สร้างผู้ใช้ใหม่
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, username, email, password, role } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !username || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า email ซ้ำหรือไม่ (ถ้ามี)
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 12);

    // สร้างผู้ใช้ใหม่
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email: email || null,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // แปลงข้อมูลให้ตรงกับ interface
    const formattedUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name || '',
      email: newUser.email || '',
      role: newUser.role as 'admin' | 'hr' | 'user',
      status: 'active' as const,
      createdAt: newUser.createdAt.toISOString(),
      lastLogin: undefined
    };

    return NextResponse.json(formattedUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}