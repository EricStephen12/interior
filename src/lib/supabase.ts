import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  category: string
  images: string[]
  specifications: {
    weight: string
    length: string
    width: string
    depth: string
    volume: string
  }
  productCode?: string
  in_stock: boolean
  created_at: string
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: Product
}

export interface User {
  id: string
  email: string
  full_name: string
  created_at: string
}
