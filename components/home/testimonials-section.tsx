'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'

const reviews = [
  {
    id: 1,
    name: 'Alex K.',
    location: 'NYC',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    text: 'Best quality basics I\'ve ever owned. The cotton is incredibly soft and holds up wash after wash.',
    product: 'Essential Tee',
    verified: true,
  },
  {
    id: 2,
    name: 'Jordan M.',
    location: 'LA',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    text: 'Finally a brand that gets minimalist style right. Clean designs, perfect fit, premium feel.',
    product: 'Minimal Hoodie',
    verified: true,
  },
  {
    id: 3,
    name: 'Sam T.',
    location: 'Chicago',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    text: 'The streetwear collection is insane. Copped the cargo pants and they\'re now my everyday go-to.',
    product: 'Cargo Pants',
    verified: true,
  },
  {
    id: 4,
    name: 'Riley P.',
    location: 'Austin',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    text: 'Lightning fast shipping and the packaging is chef\'s kiss. Will definitely be ordering again.',
    product: 'Denim Jacket',
    verified: true,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        {/* Header with stats */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
              Customer Love
            </span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Reviews</h2>
          </div>
          
          {/* Stats row */}
          <div className="flex items-center gap-8 lg:gap-12">
            <div className="text-center">
              <p className="text-3xl lg:text-4xl font-black">4.9</p>
              <div className="flex items-center gap-0.5 justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-foreground text-foreground" />
                ))}
              </div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl lg:text-4xl font-black">2.5k+</p>
              <p className="text-xs text-muted-foreground mt-1">Reviews</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-3xl lg:text-4xl font-black">98%</p>
              <p className="text-xs text-muted-foreground mt-1">Recommend</p>
            </div>
          </div>
        </div>

        {/* Reviews Masonry Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              className={`bg-background p-6 border ${index === 0 ? 'lg:row-span-2' : ''}`}
            >
              {/* Rating */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
                ))}
              </div>

              {/* Review Text */}
              <p className={`text-foreground leading-relaxed mb-6 ${index === 0 ? 'text-lg' : 'text-sm'}`}>
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Product Tag */}
              <div className="inline-block bg-muted px-3 py-1 mb-6">
                <span className="text-xs font-medium">{review.product}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{review.name}</p>
                    {review.verified && (
                      <span className="text-xs text-green-600 font-medium">Verified</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
