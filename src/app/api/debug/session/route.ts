import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      session: session,
      user: session?.user,
      hasSession: !!session,
      userRole: session?.user ? (session.user as any).role : null,
      isAdmin: session?.user ? (session.user as any).role === 'admin' : false
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({
      error: 'Session debug error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}