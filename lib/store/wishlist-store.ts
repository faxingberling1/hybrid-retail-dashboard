import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image_url: string | null
}

interface WishlistStore {
  activeIndustry: string
  industries: Record<string, WishlistItem[]>
  items: WishlistItem[] // Computed property for active industry

  setActiveIndustry: (industry: string) => void
  addItem: (product: WishlistItem) => void
  removeItem: (id: string) => void
  hasItem: (id: string) => boolean
  clearWishlist: () => void
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      activeIndustry: 'grocery',
      industries: {},
      items: [],

      setActiveIndustry: (industry) => {
        set((state) => {
          const industryItems = state.industries[industry] || []
          return {
            activeIndustry: industry,
            industries: {
              ...state.industries,
              [industry]: industryItems
            },
            items: industryItems
          }
        })
      },

      addItem: (product) => {
        set((state) => {
          const industry = state.activeIndustry
          const currentItems = state.industries[industry] || []
          const existingItem = currentItems.find(item => item.id === product.id)
          
          if (!existingItem) {
            const newItems = [...currentItems, product]
            return {
              industries: { ...state.industries, [industry]: newItems },
              items: newItems
            }
          }
          return state
        })
      },

      removeItem: (id) => {
        set((state) => {
          const industry = state.activeIndustry
          const currentItems = state.industries[industry] || []
          const newItems = currentItems.filter(item => item.id !== id)
          
          return {
            industries: { ...state.industries, [industry]: newItems },
            items: newItems
          }
        })
      },

      hasItem: (id) => {
        const { items } = get()
        return items.some(item => item.id === id)
      },

      clearWishlist: () => {
        set((state) => {
          const industry = state.activeIndustry
          return {
            industries: { ...state.industries, [industry]: [] },
            items: []
          }
        })
      },

      getItemCount: () => get().items.length,
    }),
    {
      name: 'storefront-wishlist-v2',
    }
  )
)
