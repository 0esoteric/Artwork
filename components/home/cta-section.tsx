import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80"
          alt="Fashion background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-foreground/80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center text-background">
          <p className="text-sm tracking-[0.3em] uppercase mb-4 text-background/70">
            Stay in the Loop
          </p>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Join the VELURA Community
          </h2>
          <p className="text-lg text-background/80 mb-8">
            Subscribe to get exclusive early access to new collections, special offers, and styling inspiration delivered to your inbox.
          </p>
          
          {/* Newsletter Form */}
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="h-12 bg-background/10 border-background/30 text-background placeholder:text-background/50 rounded-none focus-visible:ring-background"
            />
            <Button 
              type="submit" 
              className="h-12 px-8 bg-background text-foreground hover:bg-background/90 rounded-none"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-background/60">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  )
}
