import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Madhubani',
    slug: 'madhubani',
    description: 'Intricate patterns from Bihar',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    productCount: 45,
  },
  {
    name: 'Warli',
    slug: 'warli',
    description: 'Tribal art from Maharashtra',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&q=80',
    productCount: 32,
  },
  {
    name: 'Gond',
    slug: 'gond',
    description: 'Forest-inspired tribal art',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    productCount: 28,
  },
  {
    name: 'Kalamkari',
    slug: 'kalamkari',
    description: 'Ancient pen art from Andhra',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80',
    productCount: 38,
  },
  {
    name: 'Pichwai',
    slug: 'pichwai',
    description: 'Temple art from Rajasthan',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80',
    productCount: 24,
  },
  {
    name: 'Pattachitra',
    slug: 'pattachitra',
    description: 'Scroll paintings from Odisha',
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=600&q=80',
    productCount: 31,
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium tracking-wider uppercase mb-2">
            Discover Our Collections
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Shop by Art Form
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore India&apos;s rich artistic heritage through our curated collections of traditional art forms
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/shop?artform=${category.slug}`}
              className={`group relative overflow-hidden rounded-lg ${
                index === 0 ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-square'
              }`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-background mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-background/70 mb-2 hidden sm:block">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{category.productCount} Artworks</span>
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
