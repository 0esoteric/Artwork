'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const slides = [
  {
    id: 1,
    title: 'New Season',
    subtitle: 'Spring/Summer 2026',
    description: 'Discover the latest collection designed for the modern lifestyle.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
    cta: 'Shop Collection',
    href: '/shop?collection=summer',
  },
  {
    id: 2,
    title: 'Essentials',
    subtitle: 'Timeless Basics',
    description: 'Premium quality everyday wear that stands the test of time.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
    cta: 'Shop Essentials',
    href: '/shop?category=essentials',
  },
  {
    id: 3,
    title: 'Streetwear',
    subtitle: 'Urban Collection',
    description: 'Bold designs for those who set trends, not follow them.',
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1920&q=80',
    cta: 'Explore Now',
    href: '/shop?collection=streetwear',
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[100vh] min-h-[700px] overflow-hidden bg-muted">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-foreground/40" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-xl">
              <p className={cn(
                'text-background/80 text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 delay-200',
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}>
                {slide.subtitle}
              </p>
              <h1 className={cn(
                'text-6xl md:text-7xl lg:text-8xl font-serif font-medium text-background leading-none mb-6 transition-all duration-700 delay-300',
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}>
                {slide.title}
              </h1>
              <p className={cn(
                'text-lg text-background/80 mb-8 max-w-md transition-all duration-700 delay-400',
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}>
                {slide.description}
              </p>
              <Button
                asChild
                size="lg"
                className={cn(
                  'bg-background text-foreground hover:bg-background/90 rounded-none px-8 py-6 text-sm tracking-widest uppercase transition-all duration-700 delay-500',
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                <Link href={slide.href}>
                  {slide.cta}
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              'h-0.5 transition-all duration-300',
              index === currentSlide
                ? 'bg-background w-12'
                : 'bg-background/40 w-6 hover:bg-background/60'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 right-8 z-20 hidden md:flex flex-col items-center gap-2">
        <span className="text-background/60 text-xs tracking-widest uppercase rotate-90 origin-center translate-x-6">
          Scroll
        </span>
        <div className="w-px h-16 bg-background/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-background animate-pulse" />
        </div>
      </div>
    </section>
  )
}
