'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, ArrowRight } from 'lucide-react'

export function CTASection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        {/* Asymmetric Grid Layout */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-0 items-stretch min-h-[500px]">
          {/* Left Image - Takes 2 columns */}
          <div className="relative lg:col-span-2 min-h-[300px] lg:min-h-0 bg-muted overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
              alt="Fashion model"
              fill
              className="object-cover"
            />
          </div>

          {/* Middle Content - Takes 2 columns */}
          <div className="lg:col-span-2 bg-foreground text-background p-8 lg:p-12 flex flex-col justify-center">
            <span className="text-xs tracking-[0.3em] uppercase text-background/60 mb-4">
              Newsletter
            </span>
            <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-4">
              GET 15% OFF<br />YOUR FIRST ORDER
            </h2>
            <p className="text-background/70 mb-8 leading-relaxed">
              Join the THREADS community. Be first to know about drops, exclusive offers, and style inspiration.
            </p>

            {submitted ? (
              <div className="flex items-center gap-3 text-background">
                <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">You&apos;re on the list!</p>
                  <p className="text-sm text-background/60">Check your email for your code.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-background/10 border-background/20 text-background placeholder:text-background/40 rounded-none"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-background text-foreground hover:bg-background/90 rounded-none font-medium tracking-wide"
                >
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}

            <p className="text-xs text-background/40 mt-6">
              By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </div>

          {/* Right Image - Takes 1 column */}
          <div className="relative hidden lg:block lg:col-span-1 bg-muted overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
              alt="Fashion detail"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
