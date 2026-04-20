import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=80"
          alt="Handmade artworks background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-foreground/85" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-background">
            <p className="text-primary font-medium tracking-wider uppercase mb-4">
              Creating Sustainable Livelihoods
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              Support Traditional Artists & Preserve Indian Heritage
            </h2>
            <p className="text-lg text-background/80 mb-8 leading-relaxed">
              When you purchase from Artisan Haven, you&apos;re not just buying art – you&apos;re investing in the preservation of centuries-old traditions and supporting the livelihoods of master artisans and their families.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-foreground">
                <Link href="/about">
                  Our Mission
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 text-center text-background">
              <p className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">500+</p>
              <p className="text-sm text-background/80">Artisans Supported</p>
            </div>
            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 text-center text-background">
              <p className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">25+</p>
              <p className="text-sm text-background/80">Art Forms</p>
            </div>
            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 text-center text-background">
              <p className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">10K+</p>
              <p className="text-sm text-background/80">Artworks Sold</p>
            </div>
            <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 text-center text-background">
              <p className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">15+</p>
              <p className="text-sm text-background/80">States Covered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
