import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductDetail } from '@/components/product/product-detail'
import { RelatedProducts } from '@/components/product/related-products'

import { query } from '@/lib/db'

const PLACEHOLDER_IMAGE = "/placeholder.svg"

async function getProduct(slug: string) {
  try {
    const products: any[] = await query(
      `SELECT p.*, c.name as category_name, col.name as collection_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN collections col ON p.collection_id = col.id
       WHERE p.slug = ?`,
      [slug]
    )

    if (products.length === 0) return null

    const product = products[0]

    // Fetch images
    const images: any[] = await query(
      `SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC`,
      [product.id]
    )

    // Parse sizes and colors from JSON
    let sizes: string[] = []
    let colors: string[] = []
    try {
      sizes = product.sizes ? JSON.parse(product.sizes) : []
      colors = product.colors ? JSON.parse(product.colors) : []
    } catch (e) {
      // If parsing fails, use defaults
    }

    return {
      ...product,
      images: images.length > 0 ? images.map(img => img.image_url) : [PLACEHOLDER_IMAGE],
      category: product.category_name || 'Clothing',
      collection: product.collection_name || null,
      sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
      colors: colors.length > 0 ? colors : ['black', 'white', 'navy'],
      material: product.material || '100% Cotton',
      fit: product.fit || 'Regular Fit',
      careInstructions: product.care_instructions || 'Machine wash cold. Do not bleach. Tumble dry low.',
      shortDescription: product.short_description || product.description?.substring(0, 160) || 'Premium quality clothing',
      isNewArrival: Boolean(product.is_new_arrival),
      isBestseller: Boolean(product.is_featured),
      stockQuantity: product.stock_quantity || 0,
      shipmentTime: product.shipment_time || '3-5 business days',
      couponCode: product.coupon_code || null,
      couponDiscount: product.coupon_discount || 0,
      shippingDetails: product.shipping_details || 'Free shipping on orders over $100. Standard delivery within 3-5 business days.',
      returnPolicy: product.return_policy || '30-day return policy. Items must be unworn with original tags.',
      comparePrice: product.compare_price || null,
    }
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: `${product.name} | VELURA`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.images[0]],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        <ProductDetail product={product} />
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </main>
      <Footer />
    </>
  )
}
