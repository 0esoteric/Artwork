-- Add new fields to products table for enhanced product management
-- Run this migration to add shipment_time, coupon fields, about_artist, shipping/return details

-- Add new columns to products table
ALTER TABLE products
ADD COLUMN shipment_time VARCHAR(100) DEFAULT '7-10 business days',
ADD COLUMN coupon_code VARCHAR(50),
ADD COLUMN coupon_discount DECIMAL(5, 2) DEFAULT 0,
ADD COLUMN about_artist TEXT,
ADD COLUMN shipping_details VARCHAR(1000) DEFAULT 'Free shipping on orders above Rs. 999. Standard delivery within 7-10 business days.',
ADD COLUMN return_policy VARCHAR(1000) DEFAULT '7-day return policy. Items must be unused and in original packaging.';

-- Add updated_at to artists
ALTER TABLE artists
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create index for coupon lookups
CREATE INDEX idx_products_coupon ON products(coupon_code);
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
