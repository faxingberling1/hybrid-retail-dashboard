import { create } from 'zustand'

interface UIStore {
  isSidebarOpen: boolean
  isCartOpen: boolean
  isAuthModalOpen: boolean
  isAddressModalOpen: boolean
  setSidebarOpen: (isOpen: boolean) => void
  setCartOpen: (isOpen: boolean) => void
  setAuthModalOpen: (isOpen: boolean) => void
  setAddressModalOpen: (isOpen: boolean) => void
  closeAll: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: false,
  isCartOpen: false,
  isAuthModalOpen: false,
  isAddressModalOpen: false,
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen, isCartOpen: false, isAuthModalOpen: false, isAddressModalOpen: false }),
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen, isSidebarOpen: false, isAuthModalOpen: false, isAddressModalOpen: false }),
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen, isSidebarOpen: false, isCartOpen: false, isAddressModalOpen: false }),
  setAddressModalOpen: (isOpen) => set({ isAddressModalOpen: isOpen, isSidebarOpen: false, isCartOpen: false, isAuthModalOpen: false }),
  closeAll: () => set({ isSidebarOpen: false, isCartOpen: false, isAuthModalOpen: false, isAddressModalOpen: false }),
}))
