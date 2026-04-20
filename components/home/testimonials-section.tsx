'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    text: 'The Madhubani painting I purchased is absolutely stunning. The colors are vibrant and the details are incredible. You can truly feel the artist\'s dedication in every stroke.',
    product: 'Tree of Life Madhubani',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    location: 'Delhi',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    text: 'I\'ve been collecting traditional Indian art for years, and Artisan Haven has the most authentic collection I\'ve seen. The quality and craftsmanship are unmatched.',
    product: 'Gond Wildlife Collection',
  },
  {
    id: 3,
    name: 'Ananya Iyer',
    location: 'Bangalore',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    text: 'What I love most is knowing that my purchase directly supports the artisan community. The packaging was beautiful and the artwork arrived in perfect condition.',
    product: 'Warli Art Series',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Jaipur',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    text: 'The Pichwai painting has transformed my living room. It\'s a conversation starter and brings such positive energy to the space. Highly recommended!',
    product: 'Krishna Leela Pichwai',
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-foreground text-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium tracking-wider uppercase mb-2">
            Customer Love
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            What Our Customers Say
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="text-center">
                    <Quote className="h-12 w-12 text-primary mx-auto mb-6 opacity-50" />
                    
                    <p className="text-xl md:text-2xl leading-relaxed mb-8 font-serif italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-primary">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-background/60">{testimonial.location}</p>
                        <p className="text-xs text-primary">Purchased: {testimonial.product}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 p-3 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 p-3 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-primary w-6'
                    : 'bg-background/30 hover:bg-background/50'
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
