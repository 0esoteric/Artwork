import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { query } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Palette, Award, ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PLACEHOLDER_IMAGE = "/placeholder.svg"

interface Artist {
  id: number
  name: string
  slug: string
  bio: string | null
  image_url: string | null
  location: string | null
  art_form: string | null
  awards: string | null
  is_featured: boolean
  created_at: string
}

interface Product {
  id: number
  name: string
  slug: string
  price: number
  compare_price: number | null
  image_url: string | null
  art_form: string | null
  is_featured: boolean
}

async function getArtist(slug: string): Promise<Artist | null> {
  try {
    const artists = await query<Artist[]>(
      `SELECT * FROM artists WHERE slug = ? AND is_active = 1`,
      [slug]
    )
    return artists && artists.length > 0 ? artists[0] : null
  } catch (error) {
    console.error('Failed to fetch artist:', error)
    return null
  }
}

async function getArtistProducts(artistId: number): Promise<Product[]> {
  try {
    const products = await query<any[]>(
      `SELECT p.id, p.name, p.slug, p.price, p.compare_price, p.art_form, p.is_featured,
              (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC LIMIT 1) as image_url
       FROM products p
       WHERE p.artist_id = ? AND p.is_active = 1
       ORDER BY p.is_featured DESC, p.created_at DESC`,
      [artistId]
    )
    return products || []
  } catch (error) {
    console.error('Failed to fetch artist products:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artist = await getArtist(slug)
  
  if (!artist) {
    return { title: 'Artist Not Found | Artisan Haven' }
  }

  return {
    title: `${artist.name} - ${artist.art_form || 'Artist'} | Artisan Haven`,
    description: artist.bio || `Discover the handcrafted artworks by ${artist.name}, a master ${artist.art_form || 'artisan'} from ${artist.location || 'India'}.`,
    openGraph: {
      title: artist.name,
      description: artist.bio || `Master ${artist.art_form || 'artisan'} from ${artist.location || 'India'}`,
      images: artist.image_url ? [artist.image_url] : [],
    },
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export default async function ArtistProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artist = await getArtist(slug)

  if (!artist) {
    notFound()
  }

  const products = await getArtistProducts(artist.id)

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link 
              href="/artists" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Artists
            </Link>
          </div>
        </div>

        {/* Artist Hero */}
        <section className="bg-secondary/30 pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start">
              {/* Artist Image */}
              <div className="flex-shrink-0">
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden ring-8 ring-background shadow-2xl">
                  <Image
                    src={artist.image_url || PLACEHOLDER_IMAGE}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Artist Info */}
              <div className="flex-1 text-center lg:text-left pt-4">
                {artist.is_featured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                    <Award className="h-4 w-4" />
                    Featured Artist
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                  {artist.name}
                </h1>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                  {artist.art_form && (
                    <div className="flex items-center gap-2 text-lg">
                      <Palette className="h-5 w-5 text-primary" />
                      <span className="font-medium">{artist.art_form}</span>
                    </div>
                  )}
                  {artist.location && (
                    <div className="flex items-center gap-2 text-lg text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <span>{artist.location}</span>
                    </div>
                  )}
                </div>

                {artist.bio && (
                  <div className="prose prose-lg max-w-none text-muted-foreground mb-8">
                    <p className="whitespace-pre-line">{artist.bio}</p>
                  </div>
                )}

                {artist.awards && (
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="flex items-center gap-2 font-semibold mb-3">
                      <Award className="h-5 w-5 text-primary" />
                      Awards & Recognition
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-line">{artist.awards}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Artist Products */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">
                  Artworks by {artist.name}
                </h2>
                <p className="text-muted-foreground">
                  {products.length} {products.length === 1 ? 'artwork' : 'artworks'} available
                </p>
              </div>
              {products.length > 0 && (
                <Button asChild>
                  <Link href={`/shop?artist=${artist.slug}`}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View in Shop
                  </Link>
                </Button>
              )}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 bg-secondary/20 rounded-2xl">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground mb-4">
                  No artworks available at the moment
                </p>
                <Button asChild variant="outline">
                  <Link href="/shop">
                    Browse All Artworks
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group"
                  >
                    <article className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
                      <div className="relative aspect-square bg-muted">
                        <Image
                          src={product.image_url || PLACEHOLDER_IMAGE}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {product.is_featured && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                              Featured
                            </span>
                          </div>
                        )}
                        {product.compare_price && product.compare_price > product.price && (
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
                              {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                          {product.name}
                        </h3>
                        {product.art_form && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {product.art_form}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.compare_price && product.compare_price > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.compare_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Other Artists CTA */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Discover More Artists
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our complete collection of master artisans and their unique art forms
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/artists">
                View All Artists
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
