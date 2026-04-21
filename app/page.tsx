import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { StylesSection } from '@/components/home/styles-section'
import { CTASection } from '@/components/home/cta-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-0">
        <HeroSection />
        <FeaturesSection />
        <CategoriesSection />
        <FeaturedProducts />
        <StylesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
