// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { queryOne } from "@/lib/db"
import { verifyPassword } from "@/lib/auth/server"

console.log("🔐 NextAuth: Initializing on PORT 3001")
console.log("🔐 NextAuth: NEXTAUTH_URL =", process.env.NEXTAUTH_URL)

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "PostgreSQL Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("=".repeat(60))
        console.log("🔐 NextAuth: Authorization attempt started")
        console.log("📧 Received email:", credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials - email or password empty")
          throw new Error("Email and password are required")
        }

        try {
          // Test database connection first
          console.log("🔗 Testing database connection...")

          // Fetch user from PostgreSQL database
          console.log("🔍 Querying database for user:", credentials.email)
          const user = await queryOne(
            `SELECT 
              id, 
              email, 
              first_name, 
              last_name, 
              role, 
              organization_id,
              password_hash,
              is_active,
              is_verified,
              created_at
             FROM users 
             WHERE email = $1 
               AND deleted_at IS NULL`,
            [credentials.email.toLowerCase().trim()]
          )

          if (!user) {
            console.log(`❌ User not found: ${credentials.email}`)
            throw new Error("Invalid credentials - user not found")
          }

          console.log(`✅ User found: ${user.email} (${user.role})`)
          console.log(`   Org ID: ${user.organization_id}`)
          console.log(`   Active: ${user.is_active}, Verified: ${user.is_verified}`)
          console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`)

          if (!user.is_active) {
            console.log("❌ User account is not active")
            throw new Error("Account is disabled")
          }

          // Verify password with BCrypt
          console.log("🔐 Verifying password...")

          const isValid = await verifyPassword(credentials.password, user.password_hash)

          if (!isValid) {
            console.log("❌ Password verification failed")
            throw new Error("Invalid credentials - password incorrect")
          }

          console.log("✅ PostgreSQL authentication SUCCESSFUL!")

          // Return user object for JWT token
          const userObj = {
            id: user.id.toString(),
            email: user.email,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0],
            role: user.role,
            organizationId: user.organization_id || '',
            image: undefined
          }

          console.log("✅ Returning user object:", userObj)
          console.log("=".repeat(60))
          return userObj

        } catch (error: any) {
          console.error("❌ Authentication error:", error.message)
          if (error.code) console.error("   Error code:", error.code)
          throw new Error(error.message || "Authentication failed")
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log("🔄 JWT callback triggered")
      console.log("   User:", user?.email)
      console.log("   Trigger:", trigger)

      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.organizationId = (user as any).organizationId
        console.log("   Updated token with user data including organizationId")
      }

      // Handle session update
      if (trigger === "update" && session) {
        token.name = session.user.name
        token.email = session.user.email
        token.role = session.user.role
        token.organizationId = session.user.organizationId
        console.log("   Updated token from session")
      }

      return token
    },
    async session({ session, token }) {
      console.log("🔄 Session callback triggered")
      console.log("   Token email:", token.email)

      if (session?.user && token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
        session.user.organizationId = token.organizationId as string

        console.log("   Session updated with user data")
      }

      return session
    },
    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirect callback")
      console.log("   URL:", url)
      console.log("   Base URL:", baseUrl)

      // Default redirect for empty or base URL
      if (!url || url === baseUrl) {
        // We don't have user role here easily without session, 
        // but NextAuth usually handles this by redirecting to callbackUrl
        return baseUrl
      }

      // Allow relative URLs
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`
        console.log("   Redirecting relative URL:", redirectUrl)
        return redirectUrl
      }

      // Allow same origin URLs
      if (url.startsWith(baseUrl)) {
        console.log("   Redirecting absolute URL:", url)
        return url
      }

      // Fallback to base URL
      console.log("   Redirecting to fallback:", baseUrl)
      return baseUrl
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour - update session every hour
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
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 hours
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log("🎉 User signed in:", user.email)
    },
    async signOut({ token }) {
      console.log("👋 User signed out:", token.email)
    },
    async createUser({ user }) {
      console.log("👤 User created:", user.email)
    },
    async updateUser({ user }) {
      console.log("📝 User updated:", user.email)
    },
    async linkAccount({ user, account }) {
      console.log("🔗 Account linked:", user.email)
    },
    async session({ session, token }) {
      console.log("📋 Session active for:", session.user.email)
    }
  }
})

export { handler as GET, handler as POST }