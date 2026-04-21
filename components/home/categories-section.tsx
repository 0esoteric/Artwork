import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'T-Shirts',
    slug: 'tshirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    productCount: 124,
  },
  {
    name: 'Hoodies',
    slug: 'hoodies',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    productCount: 86,
  },
  {
    name: 'Jackets',
    slug: 'jackets',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    productCount: 58,
  },
  {
    name: 'Pants',
    slug: 'pants',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    productCount: 92,
  },
  {
    name: 'Shirts',
    slug: 'shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    productCount: 78,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    productCount: 156,
  },
]

export function CategoriesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.2em] uppercase mb-2">
              Browse
            </p>
            <h2 className="text-4xl md:text-5xl font-serif">
              Shop by Category
            </h2>
          </div>
          <Link 
            href="/shop"
            className="mt-4 sm:mt-0 text-sm font-medium tracking-wide uppercase hover:underline underline-offset-4 flex items-center gap-2"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className={`group relative overflow-hidden bg-muted ${
                index === 0 ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto min-h-[300px] md:min-h-[500px]' : 'aspect-[4/5]'
              }`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <h3 className={`font-serif text-background mb-1 ${
                  index === 0 ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
                }`}>
                  {category.name}
                </h3>
                <div className="flex items-center gap-2 text-background/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>{category.productCount} Products</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
