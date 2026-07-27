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
  activeIndustry: string;
  activeCartType: CartType;
  
  // Mapping of industry -> cartType -> CartItem[]
  industries: Record<string, Record<CartType, CartItem[]>>;
  
  items: CartItem[]; // Computed property to maintain backwards compatibility

  setActiveIndustry: (industry: string) => void;
  
  // Multi-cart actions
  switchCart: (type: CartType) => void;
  moveItemToCart: (itemId: string, targetType: CartType) => void;

  // Existing Actions (operate on activeCartType for activeIndustry)
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const getDefaultCarts = () => ({
  now: [],
  future: []
});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      activeIndustry: 'grocery',
      activeCartType: 'now',
      industries: {},
      items: [],

      setActiveIndustry: (industry) => {
        set((state) => {
          const industryData = state.industries[industry] || getDefaultCarts();
          return {
            activeIndustry: industry,
            industries: {
              ...state.industries,
              [industry]: industryData
            },
            items: industryData[state.activeCartType]
          }
        });
      },

      switchCart: (type) => {
        set((state) => {
          const industryData = state.industries[state.activeIndustry] || getDefaultCarts();
          return {
            activeCartType: type,
            items: industryData[type]
          }
        });
      },

      moveItemToCart: (itemId, targetType) => {
        set((state) => {
          const industry = state.activeIndustry;
          const industryData = state.industries[industry] || getDefaultCarts();
          
          const sourceCartType = targetType === 'now' ? 'future' : 'now';
          const itemToMove = industryData[sourceCartType].find(i => i.id === itemId);
          if (!itemToMove) return state;

          const newSourceCart = industryData[sourceCartType].filter(i => i.id !== itemId);
          
          // Check if item already exists in target cart
          const existingItemInTarget = industryData[targetType].find(i => i.id === itemId);
          let newTargetCart;
          
          if (existingItemInTarget) {
            newTargetCart = industryData[targetType].map(i => 
              i.id === itemId 
                ? { ...i, quantity: Math.min(i.quantity + itemToMove.quantity, i.stock) } 
                : i
            );
          } else {
            newTargetCart = [...industryData[targetType], itemToMove];
          }

          const newIndustryData = {
            ...industryData,
            [sourceCartType]: newSourceCart,
            [targetType]: newTargetCart
          };

          return {
            industries: {
              ...state.industries,
              [industry]: newIndustryData
            },
            items: newIndustryData[state.activeCartType]
          };
        });
      },

      addItem: (item, quantity = 1) => {
        set((state) => {
          const industry = state.activeIndustry;
          const industryData = state.industries[industry] || getDefaultCarts();
          const currentCartItems = industryData[state.activeCartType] || [];
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

          const newIndustryData = { ...industryData, [state.activeCartType]: newItems };
          return {
            industries: { ...state.industries, [industry]: newIndustryData },
            items: newItems
          };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const industry = state.activeIndustry;
          const industryData = state.industries[industry] || getDefaultCarts();
          const newItems = (industryData[state.activeCartType] || []).filter((i) => i.id !== id);
          const newIndustryData = { ...industryData, [state.activeCartType]: newItems };
          
          return {
            industries: { ...state.industries, [industry]: newIndustryData },
            items: newItems
          };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const industry = state.activeIndustry;
          const industryData = state.industries[industry] || getDefaultCarts();
          const currentCartItems = industryData[state.activeCartType] || [];
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

          const newIndustryData = { ...industryData, [state.activeCartType]: newItems };
          return {
            industries: { ...state.industries, [industry]: newIndustryData },
            items: newItems
          };
        });
      },

      clearCart: () => {
        set((state) => {
          const industry = state.activeIndustry;
          const industryData = state.industries[industry] || getDefaultCarts();
          const newIndustryData = { ...industryData, [state.activeCartType]: [] };
          
          return {
            industries: { ...state.industries, [industry]: newIndustryData },
            items: []
          };
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
      name: 'storefront-cart-v3', // increment version to clear old cache
    }
  )
)
