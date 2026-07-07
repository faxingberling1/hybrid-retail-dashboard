import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PointEvent {
  id: string
  amount: number
  reason: string
  date: string
  type: 'earned' | 'spent'
}

interface ActiveReward {
  id: string
  name: string
  discount: number // as percentage e.g., 10 for 10%
}

interface LoyaltyStore {
  points: number
  lifetimePoints: number
  history: PointEvent[]
  activeRewards: ActiveReward[]
  addPoints: (amount: number, reason?: string) => void
  deductPoints: (amount: number, reason?: string) => void
  claimReward: (pointsCost: number, rewardName: string, discount: number) => void
  removeReward: (id: string) => void
  getPoints: () => number
  getTier: () => 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
}

export const useLoyaltyStore = create<LoyaltyStore>()(
  persist(
    (set, get) => ({
      points: 120, // Start with some bonus points for the demo!
      lifetimePoints: 120,
      history: [
        { id: '1', amount: 120, reason: 'Welcome Bonus', date: new Date().toISOString(), type: 'earned' }
      ],
      activeRewards: [],
      addPoints: (amount, reason = 'Order Reward') => set((state) => ({ 
        points: state.points + amount,
        lifetimePoints: state.lifetimePoints + amount,
        history: [{
          id: Math.random().toString(36).substring(2, 9),
          amount,
          reason,
          date: new Date().toISOString(),
          type: 'earned'
        }, ...state.history]
      })),
      deductPoints: (amount, reason = 'Redeemed Points') => set((state) => ({ 
        points: Math.max(0, state.points - amount),
        history: [{
          id: Math.random().toString(36).substring(2, 9),
          amount,
          reason,
          date: new Date().toISOString(),
          type: 'spent'
        }, ...state.history]
      })),
      claimReward: (pointsCost, rewardName, discount) => set((state) => {
        if (state.points < pointsCost) return state
        
        return {
          points: state.points - pointsCost,
          history: [{
            id: Math.random().toString(36).substring(2, 9),
            amount: pointsCost,
            reason: `Claimed: ${rewardName}`,
            date: new Date().toISOString(),
            type: 'spent'
          }, ...state.history],
          activeRewards: [{
            id: Math.random().toString(36).substring(2, 9),
            name: rewardName,
            discount
          }, ...state.activeRewards]
        }
      }),
      removeReward: (id) => set((state) => ({
        activeRewards: state.activeRewards.filter(r => r.id !== id)
      })),
      getPoints: () => get().points,
      getTier: () => {
        const lifetime = get().lifetimePoints
        if (lifetime >= 5000) return 'Platinum'
        if (lifetime >= 2000) return 'Gold'
        if (lifetime >= 500) return 'Silver'
        return 'Bronze'
      }
    }),
    {
      name: 'hybrid-retail-loyalty',
    }
  )
)
