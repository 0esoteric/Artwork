import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const styles = [
  {
    id: 1,
    name: 'Streetwear',
    description: 'Urban-inspired looks with bold graphics and comfortable fits.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
    href: '/shop?style=streetwear',
    productCount: 156,
  },
  {
    id: 2,
    name: 'Minimalist',
    description: 'Clean lines, neutral tones, and timeless silhouettes.',
    image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&q=80',
    href: '/shop?style=minimalist',
    productCount: 98,
  },
  {
    id: 3,
    name: 'Casual',
    description: 'Everyday essentials designed for comfort and style.',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80',
    href: '/shop?style=casual',
    productCount: 234,
  },
  {
    id: 4,
    name: 'Vintage',
    description: 'Retro-inspired pieces with a modern twist.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
    href: '/shop?style=vintage',
    productCount: 87,
  },
]

export function StylesSection() {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-2">
            Find Your Aesthetic
          </p>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            Shop by Style
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover collections curated around the styles you love
          </p>
        </div>

        {/* Styles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {styles.map((style) => (
            <Link
              key={style.id}
              href={style.href}
              className="group relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-serif text-background mb-2">
                    {style.name}
                  </h3>
                  <p className="text-sm text-background/70 mb-4 line-clamp-2">
                    {style.description}
                  </p>
                  <div className="flex items-center gap-2 text-background text-sm font-medium">
                    <span>Shop {style.productCount} items</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
