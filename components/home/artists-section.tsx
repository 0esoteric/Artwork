import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { query } from '@/lib/db'

const PLACEHOLDER_IMAGE = "/placeholder.svg"

interface Artist {
  id: number
  name: string
  slug: string
  art_form: string | null
  location: string | null
  image_url: string | null
  bio: string | null
}

async function getFeaturedArtists(): Promise<Artist[]> {
  try {
    const artists = await query<Artist[]>(
      `SELECT id, name, slug, art_form, location, image_url, bio
       FROM artists
       WHERE is_active = 1
       ORDER BY is_featured DESC, RAND()
       LIMIT 4`
    )
    return artists || []
  } catch (error) {
    console.error('Failed to fetch featured artists:', error)
    return []
  }
}

export async function ArtistsSection() {
  const artists = await getFeaturedArtists()

  // If no artists in database, show nothing or minimal placeholder
  if (artists.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium tracking-wider uppercase mb-2">
            Meet the Makers
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Our Master Artisans
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each artwork is created by skilled artisans who have dedicated their lives to preserving India&apos;s rich artistic heritage
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-full mb-6 mx-auto max-w-[240px] ring-4 ring-background shadow-lg">
                <Image
                  src={artist.image_url || PLACEHOLDER_IMAGE}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">
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
                {artist.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {artist.bio}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/artists">
              View All Artists
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
