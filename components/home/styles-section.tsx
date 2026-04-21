'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const collections = [
  {
    id: 'streetwear',
    name: 'Streetwear',
    tagline: 'Bold. Urban. Unapologetic.',
    description: 'Graphic tees, oversized hoodies, and statement pieces for those who own the streets.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200&q=80',
    href: '/shop?collection=streetwear',
    color: 'bg-orange-500',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    tagline: 'Less is More.',
    description: 'Clean silhouettes, neutral palettes, and timeless pieces that never go out of style.',
    image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=1200&q=80',
    href: '/shop?collection=minimalist',
    color: 'bg-stone-400',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    tagline: 'Retro Revival.',
    description: 'Throwback aesthetics with modern comfort. Classic styles reimagined for today.',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80',
    href: '/shop?collection=vintage',
    color: 'bg-amber-600',
  },
]

export function StylesSection() {
  const [activeCollection, setActiveCollection] = useState(collections[0])

  return (
    <section className="py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
            Find Your Vibe
          </span>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Shop by Style</h2>
        </div>

        {/* Split Layout - Tabs on left, Image on right */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-0">
          {/* Left - Tabs */}
          <div className="space-y-0 lg:pr-12">
            {collections.map((collection, index) => (
              <button
                key={collection.id}
                onClick={() => setActiveCollection(collection)}
                className={cn(
                  'w-full text-left py-6 border-b transition-all duration-300',
                  activeCollection.id === collection.id 
                    ? 'border-foreground' 
                    : 'border-muted hover:border-muted-foreground'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn('w-3 h-3 rounded-full', collection.color)} />
                      <h3 className={cn(
                        'text-2xl lg:text-3xl font-bold transition-colors',
                        activeCollection.id === collection.id ? 'text-foreground' : 'text-muted-foreground'
                      )}>
                        {collection.name}
                      </h3>
                    </div>
                    <p className={cn(
                      'text-sm transition-all duration-300',
                      activeCollection.id === collection.id 
                        ? 'text-muted-foreground opacity-100 max-h-20' 
                        : 'opacity-0 max-h-0 overflow-hidden'
                    )}>
                      {collection.tagline}
                    </p>
                  </div>
                  <span className="text-4xl font-black text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>
              </button>
            ))}

            {/* Active Collection CTA */}
            <div className="pt-8">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {activeCollection.description}
              </p>
              <Button asChild size="lg" className="h-14 px-8">
                <Link href={activeCollection.href}>
                  Shop {activeCollection.name}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[600px] overflow-hidden bg-muted">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className={cn(
                  'absolute inset-0 transition-opacity duration-500',
                  activeCollection.id === collection.id ? 'opacity-100' : 'opacity-0'
                )}
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                
                {/* Floating Tag */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="inline-block bg-background px-4 py-2">
                    <span className="text-sm font-medium tracking-wide">{collection.tagline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
