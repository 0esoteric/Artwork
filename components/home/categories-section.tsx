'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const categories = [
  {
    name: 'Hoodies',
    count: '48',
    href: '/shop?category=hoodies',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
  },
  {
    name: 'T-Shirts',
    count: '96',
    href: '/shop?category=tshirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  },
  {
    name: 'Jackets',
    count: '32',
    href: '/shop?category=jackets',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
  },
  {
    name: 'Pants',
    count: '64',
    href: '/shop?category=pants',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 px-6 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header - Left aligned with counter */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
              Browse by
            </span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Categories</h2>
          </div>
          <Link 
            href="/shop" 
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          >
            View All Categories
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto pb-4 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none scrollbar-hide">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative flex-shrink-0 w-[280px] lg:w-auto snap-start"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                
                {/* Content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-background mb-1">
                        {category.name}
                      </h3>
                      <p className="text-background/70 text-sm">
                        {category.count} items
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Index Number */}
                <div className="absolute top-6 left-6">
                  <span className="text-background/30 text-6xl font-black">
                    0{index + 1}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <Link 
          href="/shop" 
          className="flex md:hidden items-center justify-center gap-2 text-sm font-medium mt-6 py-3 border-t"
        >
          View All Categories
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
