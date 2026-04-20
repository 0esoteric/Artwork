'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const slides = [
  {
    id: 1,
    title: 'Handcrafted Artworks',
    subtitle: 'From Master Artisans',
    description: 'Discover authentic traditional Indian art, crafted with centuries-old techniques by award-winning artists.',
    image: '/images/hero-artwork.jpg',
    cta: 'Explore Collection',
    href: '/shop',
  },
  {
    id: 2,
    title: 'Madhubani Masterpieces',
    subtitle: 'Bihar\'s Living Heritage',
    description: 'Intricate patterns and vibrant colors that tell stories of mythology and nature.',
    image: '/images/artisan-working.jpg',
    cta: 'Shop Madhubani',
    href: '/shop?category=madhubani-art',
  },
  {
    id: 3,
    title: 'Support Artisan Communities',
    subtitle: 'Every Purchase Makes a Difference',
    description: 'When you buy from us, you directly support the livelihoods of traditional artists and their families.',
    image: '/images/hero-artwork.jpg',
    cta: 'Meet Our Artists',
    href: '/shop',
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl">
              <p className={cn(
                'text-primary font-medium tracking-wider uppercase mb-4 transition-all duration-700 delay-200',
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}>
                {slide.subtitle}
              </p>
              <h1 className={cn(
                'text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-background leading-tight mb-6 transition-all duration-700 delay-300',
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}>
                {slide.title}
              </h1>
              <p className={cn(
                'text-lg md:text-xl text-background/80 mb-8 max-w-lg transition-all duration-700 delay-400',
                index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}>
                {slide.description}
              </p>
              <Button
                asChild
                size="lg"
                className={cn(
                  'group text-base transition-all duration-700 delay-500',
                  index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                <Link href={slide.href}>
                  {slide.cta}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/10 backdrop-blur-sm text-background hover:bg-background/20 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/10 backdrop-blur-sm text-background hover:bg-background/20 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              'w-3 h-3 rounded-full transition-all',
              index === currentSlide
                ? 'bg-primary w-8'
                : 'bg-background/50 hover:bg-background/80'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
