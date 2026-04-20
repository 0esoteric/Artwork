import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductDetail } from '@/components/product/product-detail'
import { RelatedProducts } from '@/components/product/related-products'

// Mock product data - in production, fetch from database
import { query } from '@/lib/db'

async function getProduct(slug: string) {
  try {
    const products: any[] = await query(
      `SELECT p.*, c.name as category_name, a.name as artist_name, a.slug as artist_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN artists a ON p.artist_id = a.id
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

    // Fetch tags
    const tags: any[] = await query(
      `SELECT t.name FROM product_tags t
       JOIN product_tag_relations ptr ON t.id = ptr.tag_id
       WHERE ptr.product_id = ?`,
      [product.id]
    )

    return {
      ...product,
      images: images.length > 0 ? images.map(img => img.image_url) : ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80'],
      artist: product.artist_name || 'Artisan Haven',
      artistSlug: product.artist_slug || 'artisan-haven',
      artForm: product.art_form || 'Handmade',
      medium: product.medium || 'Traditional',
      dimensions: product.dimensions || 'Standard',
      shortDescription: product.short_description || product.description?.substring(0, 160) || 'Handmade artwork from India',
      tags: tags.map(t => t.name) || [],
      isReadyToShip: Boolean(product.is_ready_to_ship),
      isBestseller: Boolean(product.is_featured),
      stockQuantity: product.stock_quantity || 0,
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
    title: `${product.name} | Artisan Haven`,
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
        <RelatedProducts currentProductId={product.id} artForm={product.artForm} />
      </main>
      <Footer />
    </>
  )
}
