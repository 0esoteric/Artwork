'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  slug: string
  price: number
  comparePrice: number | null
  category: string
  size?: string
  color?: string
  material?: string
  image: string
  quantity: number
  isNewArrival: boolean
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: number, size?: string, color?: string) => void
  updateQuantity: (id: number, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item, quantity = 1) => {
        set((state) => {
          // Check for existing item with same id, size, and color
          const existingItem = state.items.find(
            (i) => i.id === item.id && i.size === item.size && i.color === item.color
          )
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.size === item.size && i.color === item.color
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          
          return {
            items: [...state.items, { ...item, quantity }],
          }
        })
      },
      
      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.size === size && i.color === color)
          ),
        }))
      },
      
      updateQuantity: (id, quantity, size, color) => {
        if (quantity < 1) {
          get().removeItem(id, size, color)
          return
        }
        
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'velura-cart',
    }
  )
)
