import { Truck, RefreshCw, Shield, Headphones } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Complimentary shipping on all orders over $150',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day hassle-free return policy',
  },
  {
    icon: Shield,
    title: 'Secure Checkout',
    description: '100% secure payment processing',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated customer service team',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-medium tracking-wide uppercase mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
