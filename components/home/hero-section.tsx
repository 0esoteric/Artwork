'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="bg-background">
      {/* Split Hero - Completely different from carousel */}
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-100px)]">
        {/* Left - Text Content */}
        <div className="flex flex-col justify-center px-6 lg:px-16 py-16 lg:py-24 order-2 lg:order-1">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">
            New Season 2026
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight mb-6">
            DEFINE<br />
            YOUR<br />
            <span className="text-muted-foreground">STYLE</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mb-8 leading-relaxed">
            Premium streetwear and essentials designed for those who refuse to blend in. 
            Crafted with purpose, worn with pride.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-sm tracking-wide">
              <Link href="/shop?gender=men">
                Shop Men
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-sm tracking-wide">
              <Link href="/shop?gender=women">
                Shop Women
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right - Image Grid */}
        <div className="relative order-1 lg:order-2 min-h-[60vh] lg:min-h-0">
          <div className="absolute inset-0 grid grid-cols-2 gap-1">
            <div className="relative bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
                alt="Men's fashion"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                alt="Women's fashion"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative bg-muted col-span-2">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
                alt="Store collection"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-foreground/30" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-background text-sm font-medium tracking-wide">
                  Summer Collection Now Available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker Banner */}
      <div className="bg-foreground text-background py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 text-sm font-medium tracking-wide">
              FREE SHIPPING OVER $100 • NEW ARRIVALS WEEKLY • EASY 30-DAY RETURNS • SUSTAINABLE FABRICS
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
