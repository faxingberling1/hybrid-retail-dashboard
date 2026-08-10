import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: string
  name: string
  email: string
  points: number
  joinedDate: string
  avatarUrl?: string
}

export interface Order {
  id: string
  date: string
  total: number
  status: string
  items: number
}

interface AuthStore {
  user: UserProfile | null
  orders: Order[]
  isAuthenticated: boolean
  setUser: (user: UserProfile | null) => void
  setOrders: (orders: Order[]) => void
  login: (user: UserProfile, orders: Order[]) => void
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      orders: [],
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setOrders: (orders) => set({ orders }),
      login: (user, orders) => set({ user, orders, isAuthenticated: true }),
      logout: () => set({ user: null, orders: [], isAuthenticated: false }),
      updateProfile: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      }))
    }),
    {
      name: 'auth-store'
    }
  )
)
