import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Users, Leaf, Award, ArrowRight, ShieldCheck, Truck, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'About Us | Artisan Haven',
  description: 'Discover the story behind Artisan Haven - connecting you with India\'s finest master artisans and preserving ancient art forms for future generations.',
}

const values = [
  {
    icon: Heart,
    title: 'Passion for Art',
    description: 'We believe every artwork tells a story. Our passion drives us to bring you authentic pieces that carry the soul of their creators.',
  },
  {
    icon: Users,
    title: 'Artisan First',
    description: 'We ensure fair compensation and recognition for our artisans, helping them sustain their craft and support their families.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Traditional crafts use natural materials and eco-friendly processes. By choosing handmade, you support sustainable practices.',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Every piece is carefully curated and quality-checked to ensure you receive authentic, high-quality artwork.',
  },
]

const stats = [
  { value: '500+', label: 'Artisans Supported' },
  { value: '25+', label: 'Art Forms' },
  { value: '10,000+', label: 'Happy Customers' },
  { value: '15+', label: 'Indian States' },
]

const features = [
  {
    icon: ShieldCheck,
    title: 'Authenticity Guaranteed',
    description: 'Every artwork comes with a certificate of authenticity verifying its origin and the artisan who created it.',
  },
  {
    icon: Truck,
    title: 'Careful Packaging',
    description: 'Each piece is carefully packaged to ensure it reaches you in perfect condition, preserving its beauty and integrity.',
  },
  {
    icon: Globe,
    title: 'Worldwide Shipping',
    description: 'We ship our artworks across the globe, bringing Indian traditional art to homes worldwide.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-secondary/30 py-20 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-primary font-medium tracking-wider uppercase mb-4">
                Our Story
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-balance">
                Preserving Art, Empowering Artisans
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Artisan Haven was born from a simple belief: that the world&apos;s most beautiful art comes from 
                the hands of skilled craftspeople who have inherited their talents through generations.
              </p>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-10 hidden lg:block">
            <div className="w-full h-full bg-gradient-to-l from-primary to-transparent rounded-l-full" />
          </div>
        </section>

        {/* Mission Section */}
        <section id="story" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80"
                    alt="Artisan at work"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-background hidden md:block">
                  <Image
                    src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80"
                    alt="Traditional artwork"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                  Our Mission
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    India is home to some of the world&apos;s most ancient and diverse art forms - from the intricate 
                    Madhubani paintings of Bihar to the bold Warli art of Maharashtra, from the vibrant Pichwai 
                    of Rajasthan to the detailed Pattachitra of Odisha.
                  </p>
                  <p>
                    Yet, many of these traditional art forms are at risk of fading away as modern life makes it 
                    increasingly difficult for artisans to sustain their craft. At Artisan Haven, we&apos;re on a 
                    mission to change that.
                  </p>
                  <p>
                    We work directly with master artisans across India, providing them a platform to showcase their 
                    work to a global audience. By connecting art lovers with authentic artisans, we&apos;re not just 
                    selling artwork - we&apos;re helping preserve cultural heritage and create sustainable livelihoods.
                  </p>
                </div>
                <Button asChild className="mt-8" size="lg">
                  <Link href="/artists">
                    Meet Our Artisans
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-card rounded-2xl p-8 text-center shadow-sm border border-border">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-background/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sustainability Section */}
        <section id="sustainability" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
                  <Leaf className="h-4 w-4" />
                  Sustainability
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                  Art That Cares for the Planet
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Traditional Indian art forms are inherently sustainable. Our artisans use natural materials - 
                    handmade papers, organic dyes from plants and minerals, natural fiber canvases, and 
                    eco-friendly finishes that have been used for centuries.
                  </p>
                  <p>
                    By choosing handmade artwork over mass-produced prints, you&apos;re supporting age-old 
                    techniques that leave minimal environmental footprint. Each piece is created with care, 
                    made to last generations, not end up in landfills.
                  </p>
                  <p>
                    We also use eco-friendly packaging materials and partner with carbon-neutral shipping 
                    providers whenever possible, because protecting art means protecting the planet too.
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80"
                    alt="Natural art materials"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Why Choose Artisan Haven
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We go beyond just selling art - we deliver an experience
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Ready to Bring Art into Your Life?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore our collection of handcrafted artworks and find the perfect piece that speaks to you. 
              Every purchase supports a master artisan and helps preserve traditional art forms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="group">
                <Link href="/shop">
                  Explore Artworks
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/artists">
                  Meet the Artists
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
