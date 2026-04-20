-- Add new fields to products table for enhanced product management
-- Run this migration to add shipment_time, coupon fields, about_artist, shipping/return details

-- Add new columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS shipment_time VARCHAR(100) DEFAULT '7-10 business days',
ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS coupon_discount DECIMAL(5, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS about_artist TEXT,
ADD COLUMN IF NOT EXISTS shipping_details TEXT DEFAULT 'Free shipping on orders above Rs. 999. Standard delivery within 7-10 business days.',
ADD COLUMN IF NOT EXISTS return_policy TEXT DEFAULT '7-day return policy. Items must be unused and in original packaging.';

-- Create index for coupon lookups
CREATE INDEX IF NOT EXISTS idx_products_coupon ON products(coupon_code);
