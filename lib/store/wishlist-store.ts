import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image_url: string | null
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (product: WishlistItem) => void
  removeItem: (id: string) => void
  hasItem: (id: string) => boolean
  clearWishlist: () => void
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items
        const existingItem = currentItems.find(item => item.id === product.id)
        if (!existingItem) {
          set({ items: [...currentItems, product] })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },
      hasItem: (id) => {
        return get().items.some(item => item.id === id)
      },
      clearWishlist: () => set({ items: [] }),
      getItemCount: () => get().items.length,
    }),
    {
      name: 'hybrid-retail-wishlist',
    }
  )
)
