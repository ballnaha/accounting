import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, username, email, password } = await request.json()

    // Validate required fields (email is optional)
    if (!name || !username || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, ชื่อผู้ใช้, รหัสผ่าน)' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' },
        { status: 400 }
      )
    }

    // Check if email already exists (only if email is provided)
    if (email) {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUserByEmail) {
        return NextResponse.json(
          { error: 'อีเมลนี้ถูกใช้แล้ว' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with default role as 'user'
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email: email || null, // Email is optional
        password: hashedPassword,
        role: 'user' // Default role
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json(
      { 
        message: 'สมัครสมาชิกสำเร็จ',
        user 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' },
      { status: 500 }
    )
  }
}