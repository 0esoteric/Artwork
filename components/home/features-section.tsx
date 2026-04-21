import { Truck, Shield, Palette, Heart, Award, RefreshCw } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: '100% Handcrafted',
    description: 'Every piece is uniquely handmade by skilled artisans using traditional techniques.',
  },
  {
    icon: Award,
    title: 'Certified Authentic',
    description: 'Each artwork comes with a certificate of authenticity signed by the artist.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Shop with confidence using our secure Razorpay payment gateway.',
  },
  {
    icon: Truck,
    title: 'Safe Delivery',
    description: 'Carefully packaged and insured shipping to ensure your art arrives safely.',
  },
  {
    icon: Heart,
    title: 'Artisan Support',
    description: 'Your purchase directly supports traditional artists and their families.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '14-day hassle-free returns if you are not completely satisfied.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium tracking-wider uppercase mb-2">
            Why Choose Us
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            The Artisan Haven Promise
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-8 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
