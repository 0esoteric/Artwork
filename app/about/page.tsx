import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Leaf, Recycle, Heart } from 'lucide-react'

export const metadata = {
  title: 'About Us | VELURA',
  description: 'Discover the story behind VELURA - modern fashion designed for the contemporary individual.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
            alt="Fashion atelier"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="relative text-center text-background max-w-3xl px-4">
            <h1 className="text-4xl md:text-6xl font-serif mb-6">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-background/80">
              Founded on the belief that great style shouldn&apos;t compromise quality or ethics.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  Our Mission
                </p>
                <h2 className="text-3xl md:text-4xl font-serif mb-6">
                  Redefining Modern Fashion
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    VELURA was born from a simple idea: create clothing that looks exceptional, feels incredible, and stands the test of time. We believe fashion should be an extension of your personality, not a fleeting trend.
                  </p>
                  <p>
                    Every piece in our collection is thoughtfully designed and crafted with premium materials. We work directly with skilled manufacturers who share our commitment to quality and ethical practices.
                  </p>
                  <p>
                    Our goal is to help you build a wardrobe you&apos;ll love for years – pieces that become more meaningful with every wear.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"
                  alt="Clothing design process"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-secondary/30" id="sustainability">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Our Values
              </p>
              <h2 className="text-3xl md:text-4xl font-serif">
                What We Stand For
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border">
                  <Leaf className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-medium mb-4">Sustainable Materials</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We source organic cotton, recycled materials, and eco-friendly fabrics wherever possible, minimizing our environmental footprint.
                </p>
              </div>
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border">
                  <Heart className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-medium mb-4">Ethical Production</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  All our partners adhere to fair labor practices. We believe in transparency and treating everyone in our supply chain with respect.
                </p>
              </div>
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border">
                  <Recycle className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-medium mb-4">Less Waste</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We produce in small batches to reduce excess inventory. Our packaging is plastic-free and made from recycled materials.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/5] order-2 lg:order-1">
                <Image
                  src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80"
                  alt="Our team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  Our Journey
                </p>
                <h2 className="text-3xl md:text-4xl font-serif mb-6">
                  From Concept to Collection
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    What started as a small passion project has grown into a movement. We launched VELURA with just five essential pieces, each designed to be a wardrobe staple.
                  </p>
                  <p>
                    Today, our community spans the globe, united by a shared appreciation for thoughtful design and conscious consumption. We&apos;re grateful for every customer who has joined us on this journey.
                  </p>
                  <p>
                    As we grow, our commitment remains the same: create timeless pieces that you&apos;ll reach for again and again.
                  </p>
                </div>
                <div className="mt-8">
                  <Button asChild className="rounded-none group">
                    <Link href="/shop">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl md:text-5xl font-serif mb-2">50K+</p>
                <p className="text-sm text-background/60">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-serif mb-2">30+</p>
                <p className="text-sm text-background/60">Countries Shipped</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-serif mb-2">100%</p>
                <p className="text-sm text-background/60">Sustainable Packaging</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-serif mb-2">4.9</p>
                <p className="text-sm text-background/60">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Join the VELURA Community
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Follow us on social media for style inspiration, behind-the-scenes content, and exclusive previews of new collections.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline" className="rounded-none">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button asChild className="rounded-none">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
