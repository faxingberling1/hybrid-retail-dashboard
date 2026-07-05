import { create } from 'zustand'

interface UIStore {
  isSidebarOpen: boolean
  isCartOpen: boolean
  isAuthModalOpen: boolean
  setSidebarOpen: (isOpen: boolean) => void
  setCartOpen: (isOpen: boolean) => void
  setAuthModalOpen: (isOpen: boolean) => void
  closeAll: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: false,
  isCartOpen: false,
  isAuthModalOpen: false,
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen, isCartOpen: false, isAuthModalOpen: false }),
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen, isSidebarOpen: false, isAuthModalOpen: false }),
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen, isSidebarOpen: false, isCartOpen: false }),
  closeAll: () => set({ isSidebarOpen: false, isCartOpen: false, isAuthModalOpen: false }),
}))
