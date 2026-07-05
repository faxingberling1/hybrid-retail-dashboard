import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LoyaltyStore {
  points: number
  addPoints: (amount: number) => void
  deductPoints: (amount: number) => void
  getPoints: () => number
}

export const useLoyaltyStore = create<LoyaltyStore>()(
  persist(
    (set, get) => ({
      points: 120, // Start with some bonus points for the demo!
      addPoints: (amount) => set({ points: get().points + amount }),
      deductPoints: (amount) => set({ points: Math.max(0, get().points - amount) }),
      getPoints: () => get().points,
    }),
    {
      name: 'hybrid-retail-loyalty',
    }
  )
)
