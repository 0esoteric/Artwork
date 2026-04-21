import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    value: '$100+',
    description: 'On all orders',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    value: '30 Days',
    description: 'Hassle-free',
  },
  {
    icon: ShieldCheck,
    title: 'Secure',
    value: '100%',
    description: 'Payment protected',
  },
  {
    icon: Clock,
    title: 'Support',
    value: '24/7',
    description: 'Always here',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/50">
      <div className="max-w-[1400px] mx-auto">
        {/* Horizontal strip with dividers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
          {features.map((feature) => (
            <div key={feature.title} className="px-6 lg:px-8 py-8 lg:py-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">{feature.value}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {feature.title} {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
