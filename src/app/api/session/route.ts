import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      session,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({
      error: "Session error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}