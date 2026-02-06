// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

console.log("🔐 NextAuth: Initializing with shared authOptions")

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
