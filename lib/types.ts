export interface User {
  id: number
  email: string
  password_hash?: string
  name: string
  phone?: string
  avatar_url?: string
  role: 'customer' | 'admin'
  provider: 'email' | 'google'
  provider_id?: string
  email_verified: boolean
  created_at: Date
  updated_at: Date
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: number
  is_active: boolean
  created_at: Date
}

export interface Artist {
  id: number
  name: string
  slug: string
  bio?: string
  image_url?: string
  location?: string
  art_form?: string
  awards?: string
  is_featured: boolean
  is_active: boolean
  created_at: Date
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  short_description?: string
  price: number
  compare_price?: number
  sku?: string
  stock_quantity: number
  category_id?: number
  artist_id?: number
  dimensions?: string
  medium?: string
  art_form?: string
  is_featured: boolean
  is_ready_to_ship: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
  // New enhanced fields
  shipment_time?: string
  coupon_code?: string
  coupon_discount?: number
  about_artist?: string
  shipping_details?: string
  return_policy?: string
  // Joined fields
  category_name?: string
  artist_name?: string
  images?: ProductImage[]
  image?: string // Primary image URL for convenience
}

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
}

export interface Address {
  id: number
  user_id: number
  name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  pincode: string
  country: string
  is_default: boolean
  created_at: Date
}

export interface WishlistItem {
  id: number
  user_id: number
  product_id: number
  created_at: Date
  product?: Product
}

export interface CartItem {
  id: number
  user_id?: number
  session_id?: string
  product_id: number
  quantity: number
  created_at: Date
  updated_at: Date
  product?: Product
}

export interface Order {
  id: number
  order_number: string
  user_id: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  subtotal: number
  shipping_cost: number
  discount: number
  total: number
  shipping_address_id?: number
  shipping_name?: string
  shipping_phone?: string
  shipping_address?: string
  notes?: string
  created_at: Date
  updated_at: Date
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_name: string
  product_image?: string
  quantity: number
  price: number
  total: number
  created_at: Date
}

export interface Review {
  id: number
  product_id: number
  user_id: number
  rating: number
  title?: string
  comment?: string
  is_verified: boolean
  is_approved: boolean
  created_at: Date
  user?: User
}

export interface Coupon {
  id: number
  code: string
  description?: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_discount?: number
  usage_limit?: number
  used_count: number
  valid_from?: Date
  valid_until?: Date
  is_active: boolean
  created_at: Date
}
