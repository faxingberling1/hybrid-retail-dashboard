import { create } from 'zustand'

export interface UserProfile {
  id: string
  name: string
  email: string
  points: number
  joinedDate: string
}

export interface Order {
  id: string
  date: string
  total: number
  status: 'Processing' | 'Shipped' | 'Delivered'
  items: number
}

interface AuthStore {
  user: UserProfile | null
  orders: Order[]
  isAuthenticated: boolean
  login: (email: string, name: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  orders: [],
  isAuthenticated: false,
  login: (email, name) => {
    // Generate some mock orders for the demo
    const mockOrders: Order[] = [
      { id: 'ORD-8A9F32', date: '2026-06-20', total: 4500, status: 'Delivered', items: 3 },
      { id: 'ORD-B4C198', date: '2026-07-01', total: 1250, status: 'Shipped', items: 1 },
      { id: 'ORD-E2D455', date: new Date().toISOString().split('T')[0], total: 8400, status: 'Processing', items: 6 },
    ]
    
    set({
      user: {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name,
        email,
        points: 450,
        joinedDate: '2026-01-15'
      },
      orders: mockOrders,
      isAuthenticated: true
    })
  },
  logout: () => set({ user: null, orders: [], isAuthenticated: false })
}))
