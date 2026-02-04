// types/next-auth.d.ts
import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      image?: string
      organizationId: string
      organizationName?: string
      industry?: string
    } & DefaultSession["user"]
    organizationId: string
    organizationName?: string
    industry?: string
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    image?: string
    organizationId: string
    organizationName?: string
    industry?: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string
    email: string
    role: string
    organizationId: string
    organizationName?: string
    industry?: string
  }
}