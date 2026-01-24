import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
  is_featured: boolean
  created_at: string
}

export interface Size {
  id: string
  name: string
  dimensions?: string
  created_at: string
}

export interface Product {
  id: string
  brand_id: string
  brand?: Brand
  name: string
  slug: string
  description: string
  category: string
  type?: string
  images: string[]
  materials?: string
  firmness?: string
  warranty?: string
  is_featured: boolean
  created_at: string
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  size_id: string
  size?: Size
  price: number
  promo_price?: number
  stock_quantity: number
  sku?: string
  created_at: string
}

export interface CartItem {
  id: string
  product_variant_id: string
  variant?: ProductVariant
  product?: Product
  quantity: number
}

export interface Order {
  id: string
  user_id?: string
  customer_name: string
  customer_email?: string
  customer_phone: string
  delivery_address: string
  delivery_zone_id: string
  delivery_cost: number
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method: 'whatsapp' | 'card' | 'transfer'
  payment_status: 'pending' | 'paid' | 'failed'
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_variant_id: string
  product_name: string
  size_name: string
  quantity: number
  price: number
  created_at: string
}

export interface DeliveryZone {
  id: string
  location_name: string
  price: number
  estimated_days?: string
  created_at: string
}
