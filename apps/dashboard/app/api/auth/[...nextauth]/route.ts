import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { queryOne } from "@/lib/db"
import { verifyPassword } from "@/lib/auth"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 NextAuth: Authorization attempt for:", credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ NextAuth: Missing credentials")
          throw new Error("Email and password are required")
        }

        try {
          // Fetch user from PostgreSQL database
          const user = await queryOne(
            `SELECT 
              id, 
              email, 
              first_name, 
              last_name, 
              role, 
              password_hash,
              is_active,
              is_verified
             FROM users 
             WHERE email = $1 
               AND deleted_at IS NULL
               AND is_active = true`,
            [credentials.email.toLowerCase().trim()]
          )

          if (!user) {
            console.log(`❌ NextAuth: User not found: ${credentials.email}`)
            throw new Error("Invalid credentials")
          }

          console.log(`📊 NextAuth: Found user: ${user.email} (${user.role})`)

          // Verify password with BCrypt
          const isValid = await verifyPassword(credentials.password, user.password_hash)
          
          if (!isValid) {
            console.log("❌ NextAuth: Invalid password")
            throw new Error("Invalid credentials")
          }

          console.log("✅ NextAuth: PostgreSQL authentication successful")
          
          // Return user object for JWT token
          return {
            id: user.id.toString(), // Convert UUID to string
            email: user.email,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0],
            role: user.role
          }
          
        } catch (error) {
          console.error("❌ NextAuth: Database error:", error)
          throw new Error("Authentication failed")
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔄 NextAuth: JWT callback - user:", user?.email)
      
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      
      return token
    },
    async session({ session, token }) {
      console.log("🔄 NextAuth: Session callback - token email:", token.email)
      
      if (session?.user && token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log("🔄 NextAuth: Redirect callback - url:", url, "baseUrl:", baseUrl)
      
      // Default redirect for empty or base URL
      if (!url || url === baseUrl || url === `${baseUrl}/`) {
        const redirectUrl = `${baseUrl}/super-admin`
        console.log("🔄 Redirecting to default:", redirectUrl)
        return redirectUrl
      }
      
      // Handle relative URLs
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`
        console.log("🔄 Redirecting relative URL:", redirectUrl)
        return redirectUrl
      }
      
      // Handle absolute URLs
      if (url.startsWith(baseUrl)) {
        console.log("🔄 Redirecting absolute URL:", url)
        return url
      }
      
      // Fallback
      console.log("🔄 Redirecting to fallback:", `${baseUrl}/super-admin`)
      return `${baseUrl}/super-admin`
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false,
      }
    }
  }
})

export { handler as GET, handler as POST }