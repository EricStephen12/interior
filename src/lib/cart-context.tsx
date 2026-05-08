'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { Product, CartItem, ProductVariant } from '@/lib/supabase'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; variant: ProductVariant; quantity?: number }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART'; items: CartItem[] }

interface CartContextType {
  state: CartState
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.items }
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product_variant_id === action.variant.id)

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product_variant_id === action.variant.id
              ? { ...item, quantity: item.quantity + (action.quantity || 1) }
              : item
          )
        }
      }

      const newItem: CartItem = {
        id: Date.now().toString(),
        product_variant_id: action.variant.id,
        variant: action.variant,
        product: action.product,
        quantity: action.quantity || 1
      }

      return {
        ...state,
        items: [...state.items, newItem]
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.itemId)
      }

    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.itemId)
        }
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.itemId
            ? { ...item, quantity: action.quantity }
            : item
        )
      }

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('sharers-cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'SET_CART', items })
      } catch (e) {
        console.error('Failed to load cart', e)
      }
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('sharers-cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', product, variant, quantity })
  }

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', itemId })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', itemId, quantity })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
