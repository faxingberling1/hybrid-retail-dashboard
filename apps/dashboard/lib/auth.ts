// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from './server-auth-utils'
import { queryOne } from './db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          const user = await queryOne(
            `SELECT 
              u.*, 
              o.id as organization_id,
              o.name as organization_name,
              o.status as organization_status
            FROM users u
            LEFT JOIN organizations o ON u.organization_id = o.id
            WHERE u.email = $1 AND u.is_active = true`,
            [credentials.email]
          )

          if (!user) {
            console.log('❌ User not found:', credentials.email)
            return null
          }

          // === MAINTENANCE MODE LOGIN BLOCK ===
          const maintenanceSetting = await queryOne("SELECT value FROM system_settings WHERE key = 'maintenance_mode'")
          const isMaintenanceActive = maintenanceSetting?.value === true || maintenanceSetting?.value === 'true'

          if (isMaintenanceActive && user.role !== 'SUPER_ADMIN') {
            console.warn(`🚧 Login blocked for ${user.email}: Maintenance mode active`)
            throw new Error("MAINTENANCE_ACTIVE")
          }

          // Use the auth-utils verifyPassword function
          const isValid = await verifyPassword(credentials.password, user.password_hash)

          if (!isValid) {
            console.log('❌ Invalid password for:', credentials.email)
            return null
          }

          console.log('✅ Login successful for:', credentials.email)

          return {
            id: user.id,
            email: user.email,
            name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            role: user.role,
            image: user.avatar_url,
            organizationId: user.organization_id,
            organizationName: user.organization_name
          }
        } catch (error) {
          console.error('❌ Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.email = user.email
        token.organizationId = user.organizationId
        token.organizationName = user.organizationName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.organizationId = token.organizationId as string
        session.user.organizationName = token.organizationName as string

        session.organizationId = token.organizationId as string
        session.organizationName = token.organizationName as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default authOptions