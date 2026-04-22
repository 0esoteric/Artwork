'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: number
  name: string
  slug: string
  price: number
  comparePrice: number | null
  category: string
  sizes?: string[]
  colors?: string[]
  material?: string
  image: string
  isNewArrival: boolean
}

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: number) => void
  isInWishlist: (id: number) => boolean
  clearWishlist: () => void
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id)
          if (exists) return state
          return { items: [...state.items, item] }
        })
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },
      
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id)
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      getItemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'velura-wishlist',
    }
  )
)
