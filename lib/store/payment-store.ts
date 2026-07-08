import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PaymentMethodType = 'credit_card' | 'jazzcash' | 'easypaisa'

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  
  // For cards
  cardNumber?: string // in real app, just last4
  expiry?: string
  cvv?: string
  
  // For wallets
  mobileNumber?: string
  
  label?: string
  isDefault: boolean
}

export type TransactionType = 'top_up' | 'refund' | 'purchase'

export interface WalletTransaction {
  id: string
  type: TransactionType
  amount: number
  date: string
  description: string
}

interface PaymentStore {
  walletBalance: number
  transactions: WalletTransaction[]
  methods: PaymentMethod[]
  topUpWallet: (amount: number, description?: string) => void
  refundToWallet: (amount: number, description: string) => void
  spendFromWallet: (amount: number, description: string) => void
  addMethod: (method: Omit<PaymentMethod, 'id'>) => void
  removeMethod: (id: string) => void
  setDefaultMethod: (id: string) => void
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set) => ({
      walletBalance: 0,
      transactions: [],
      methods: [
        {
          id: 'demo-mc-1',
          type: 'credit_card',
          cardNumber: '8888',
          expiry: '12/28',
          label: 'Mastercard',
          isDefault: true
        }
      ],
      
      topUpWallet: (amount, description = 'Topped up via Credit Card') => set((state) => {
        const newTransaction: WalletTransaction = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'top_up',
          amount,
          date: new Date().toISOString(),
          description
        }
        return { 
          walletBalance: state.walletBalance + amount,
          transactions: [newTransaction, ...state.transactions]
        }
      }),

      refundToWallet: (amount, description) => set((state) => {
        const newTransaction: WalletTransaction = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'refund',
          amount,
          date: new Date().toISOString(),
          description
        }
        return { 
          walletBalance: state.walletBalance + amount,
          transactions: [newTransaction, ...state.transactions]
        }
      }),

      spendFromWallet: (amount, description) => set((state) => {
        const newTransaction: WalletTransaction = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'purchase',
          amount: -amount,
          date: new Date().toISOString(),
          description
        }
        return { 
          walletBalance: Math.max(0, state.walletBalance - amount),
          transactions: [newTransaction, ...state.transactions]
        }
      }),
      
      addMethod: (method) => set((state) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newMethod = { ...method, id }
        
        // If it's the first method or explicitly set as default, ensure it is the default
        if (state.methods.length === 0 || method.isDefault) {
          newMethod.isDefault = true
          const updatedMethods = state.methods.map(m => ({ ...m, isDefault: false }))
          return { methods: [...updatedMethods, newMethod] }
        }
        
        return { methods: [...state.methods, newMethod] }
      }),
      
      removeMethod: (id) => set((state) => {
        const remaining = state.methods.filter(m => m.id !== id)
        
        // If we removed the default, make the first remaining method default
        if (state.methods.find(m => m.id === id)?.isDefault && remaining.length > 0) {
          remaining[0].isDefault = true
        }
        
        return { methods: remaining }
      }),
      
      setDefaultMethod: (id) => set((state) => ({
        methods: state.methods.map(m => ({
          ...m,
          isDefault: m.id === id
        }))
      }))
    }),
    {
      name: 'hybrid-retail-payment-store-v2'
    }
  )
)
