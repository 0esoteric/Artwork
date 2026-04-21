import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { query } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Palette, Award } from 'lucide-react'

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
  product_count: number
}

async function getArtists(): Promise<Artist[]> {
  try {
    const artists = await query<Artist[]>(
      `SELECT a.*, COUNT(p.id) as product_count
       FROM artists a
       LEFT JOIN products p ON a.id = p.artist_id AND p.is_active = 1
       WHERE a.is_active = 1
       GROUP BY a.id
       ORDER BY a.is_featured DESC, a.name ASC`
    )
    return artists || []
  } catch (error) {
    console.error('Failed to fetch artists:', error)
    return []
  }
}

export const metadata = {
  title: 'Our Artists | Artisan Haven',
  description: 'Meet the master artisans behind our handcrafted artworks. Each artist brings generations of tradition and skill to their craft.',
}

export default async function ArtistsPage() {
  const artists = await getArtists()
  const featuredArtists = artists.filter(a => a.is_featured)
  const otherArtists = artists.filter(a => !a.is_featured)

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="bg-secondary/30 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-primary font-medium tracking-wider uppercase mb-3">
              The Makers
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-balance">
              Our Master Artisans
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              Every artwork tells a story - of tradition, skill, and passion passed down through generations.
              Meet the artists who bring these timeless traditions to life.
            </p>
          </div>
        </section>

        {/* Featured Artists */}
        {featuredArtists.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Featured Artists</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Award-winning artisans recognized for their exceptional craftsmanship
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArtists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.slug}`}
                    className="group"
                  >
                    <article className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={artist.image_url || PLACEHOLDER_IMAGE}
                          alt={artist.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                            Featured
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                          {artist.name}
                        </h3>
                        <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
                          {artist.art_form && (
                            <span className="flex items-center gap-1">
                              <Palette className="h-4 w-4" />
                              {artist.art_form}
                            </span>
                          )}
                          {artist.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {artist.location}
                            </span>
                          )}
                        </div>
                        {artist.bio && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {artist.bio}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-sm text-muted-foreground">
                            {artist.product_count} {artist.product_count === 1 ? 'Artwork' : 'Artworks'}
                          </span>
                          <span className="text-primary font-medium text-sm group-hover:underline">
                            View Profile
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Artists */}
        <section className={`py-16 md:py-20 ${featuredArtists.length > 0 ? 'bg-secondary/20' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {featuredArtists.length > 0 && (
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">All Artists</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover our complete collection of talented artisans
                </p>
              </div>
            )}
            
            {artists.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No artists found. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {(featuredArtists.length > 0 ? otherArtists : artists).map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artists/${artist.slug}`}
                    className="group text-center"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-full mb-5 mx-auto max-w-[200px] ring-4 ring-background shadow-lg group-hover:ring-primary/30 transition-all duration-300">
                      <Image
                        src={artist.image_url || PLACEHOLDER_IMAGE}
                        alt={artist.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-lg font-serif font-bold group-hover:text-primary transition-colors mb-1">
                      {artist.name}
                    </h3>
                    {artist.art_form && (
                      <p className="text-primary font-medium text-sm mb-1">
                        {artist.art_form}
                      </p>
                    )}
                    {artist.location && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {artist.location}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {artist.product_count} {artist.product_count === 1 ? 'Artwork' : 'Artworks'}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-foreground text-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Award className="h-12 w-12 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Supporting Traditional Artisans
            </h2>
            <p className="text-lg text-background/70 mb-8 max-w-2xl mx-auto">
              Every purchase directly supports the artisan community, helping preserve ancient art forms
              and providing sustainable livelihoods for master craftspeople.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Explore Artworks
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
