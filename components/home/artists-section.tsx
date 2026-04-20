import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const featuredArtists = [
  {
    id: 1,
    name: 'Ambika Devi',
    slug: 'ambika-devi',
    artForm: 'Madhubani',
    location: 'Bihar, India',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    bio: 'A renowned Madhubani artist with over 30 years of experience.',
  },
  {
    id: 2,
    name: 'Kalyan Joshi',
    slug: 'kalyan-joshi',
    artForm: 'Phad',
    location: 'Rajasthan, India',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'National Award winning Phad painter preserving ancient traditions.',
  },
  {
    id: 3,
    name: 'Sandeep Dhurve',
    slug: 'sandeep-dhurve',
    artForm: 'Gond',
    location: 'Madhya Pradesh, India',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    bio: 'Master Gond artist known for detailed wildlife paintings.',
  },
  {
    id: 4,
    name: 'Gitanjali Das',
    slug: 'gitanjali-das',
    artForm: 'Pattachitra',
    location: 'Odisha, India',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80',
    bio: 'Award-winning Pattachitra artist known for divine feminine art.',
  },
]

export function ArtistsSection() {
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
          {featuredArtists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-full mb-6 mx-auto max-w-[240px] ring-4 ring-background shadow-lg">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">
                  {artist.name}
                </h3>
                <p className="text-primary font-medium text-sm mb-1">
                  {artist.artForm}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {artist.location}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {artist.bio}
                </p>
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
