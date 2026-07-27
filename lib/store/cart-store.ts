import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  stock: number;
}

export type CartType = 'now' | 'future';

interface CartState {
  activeCartType: CartType;
  carts: Record<CartType, CartItem[]>;
  items: CartItem[]; // Computed property to maintain backwards compatibility

  // Multi-cart actions
  switchCart: (type: CartType) => void;
  moveItemToCart: (itemId: string, targetType: CartType) => void;

  // Existing Actions (operate on activeCartType)
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      activeCartType: 'now',
      carts: {
        now: [],
        future: []
      },
      items: [], // Always syncs with carts[activeCartType]

      switchCart: (type) => {
        set((state) => ({
          activeCartType: type,
          items: state.carts[type] || []
        }));
      },

      moveItemToCart: (itemId, targetType) => {
        set((state) => {
          const sourceCartType = targetType === 'now' ? 'future' : 'now';
          const itemToMove = state.carts[sourceCartType].find(i => i.id === itemId);
          if (!itemToMove) return state;

          const newSourceCart = state.carts[sourceCartType].filter(i => i.id !== itemId);
          
          // Check if item already exists in target cart
          const existingItemInTarget = state.carts[targetType].find(i => i.id === itemId);
          let newTargetCart;
          
          if (existingItemInTarget) {
            newTargetCart = state.carts[targetType].map(i => 
              i.id === itemId 
                ? { ...i, quantity: Math.min(i.quantity + itemToMove.quantity, i.stock) } 
                : i
            );
          } else {
            newTargetCart = [...state.carts[targetType], itemToMove];
          }

          const newCarts = {
            ...state.carts,
            [sourceCartType]: newSourceCart,
            [targetType]: newTargetCart
          };

          return {
            carts: newCarts,
            items: newCarts[state.activeCartType]
          };
        });
      },

      addItem: (item, quantity = 1) => {
        set((state) => {
          const currentCartItems = state.carts[state.activeCartType] || [];
          const existingItem = currentCartItems.find((i) => i.id === item.id);
          
          let newItems;
          if (existingItem) {
            const newQuantity = Math.min(existingItem.quantity + quantity, item.stock);
            newItems = currentCartItems.map((i) =>
              i.id === item.id ? { ...i, quantity: newQuantity } : i
            );
          } else {
            newItems = [...currentCartItems, { ...item, quantity: Math.min(quantity, item.stock) }];
          }

          const newCarts = { ...state.carts, [state.activeCartType]: newItems };
          return { carts: newCarts, items: newItems };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = (state.carts[state.activeCartType] || []).filter((i) => i.id !== id);
          const newCarts = { ...state.carts, [state.activeCartType]: newItems };
          return { carts: newCarts, items: newItems };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const currentCartItems = state.carts[state.activeCartType] || [];
          const item = currentCartItems.find((i) => i.id === id);
          if (!item) return state;

          let newItems;
          if (quantity <= 0) {
            newItems = currentCartItems.filter((i) => i.id !== id);
          } else {
            const newQuantity = Math.min(quantity, item.stock);
            newItems = currentCartItems.map((i) =>
              i.id === id ? { ...i, quantity: newQuantity } : i
            );
          }

          const newCarts = { ...state.carts, [state.activeCartType]: newItems };
          return { carts: newCarts, items: newItems };
        });
      },

      clearCart: () => {
        set((state) => {
          const newCarts = { ...state.carts, [state.activeCartType]: [] };
          return { carts: newCarts, items: [] };
        });
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'storefront-cart-v2', 
    }
  )
)
