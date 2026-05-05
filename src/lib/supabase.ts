// Types used by cart and shop components

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

export interface DeliveryZone {
  id: string
  location_name: string
  price: number
  estimated_days?: string
  created_at: string
}
