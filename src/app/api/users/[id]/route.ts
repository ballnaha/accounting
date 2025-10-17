import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// PUT /api/users/[id] - อัปเดตข้อมูลผู้ใช้
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { name, username, email, password, role } = body;

    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ตรวจสอบว่า username ซ้ำหรือไม่ (ยกเว้นผู้ใช้ปัจจุบัน)
    if (username && username !== existingUser.username) {
      const duplicateUsername = await prisma.user.findUnique({
        where: { username }
      });

      if (duplicateUsername) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        );
      }
    }

    // ตรวจสอบว่า email ซ้ำหรือไม่ (ยกเว้นผู้ใช้ปัจจุบัน)
    if (email && email !== existingUser.email) {
      const duplicateEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (duplicateEmail) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // เตรียมข้อมูลสำหรับอัปเดต
    const updateData: any = {
      name,
      username,
      email: email || null,
      role
    };

    // ถ้ามีรหัสผ่านใหม่
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // อัปเดตผู้ใช้
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        sessions: {
          orderBy: {
            expires: 'desc'
          },
          take: 1,
          select: {
            expires: true
          }
        }
      }
    });

    // แปลงข้อมูลให้ตรงกับ interface
    const formattedUser = {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name || '',
      email: updatedUser.email || '',
      role: updatedUser.role as 'admin' | 'hr' | 'user',
      status: 'active' as const,
      createdAt: updatedUser.createdAt.toISOString(),
      lastLogin: updatedUser.sessions[0]?.expires.toISOString() || undefined
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - ลบผู้ใช้
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ไม่อนุญาตให้ลบตัวเอง
    if (id === (session.user as any).id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // ลบผู้ใช้ (Account และ Session จะถูกลบอัตโนมัติเนื่องจาก onDelete: Cascade)
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}