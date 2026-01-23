import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  const cookies = request.cookies.getAll()
  
  return NextResponse.json({
    success: true,
    hasToken: !!token,
    token: token,
    cookies: cookies.map(c => ({ name: c.name, value: c.value.substring(0, 50) + "..." })),
    headers: {
      authorization: request.headers.get("authorization"),
      cookie: request.headers.get("cookie")
    }
  })
}