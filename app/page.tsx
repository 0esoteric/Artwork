import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { StylesSection } from '@/components/home/styles-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { FeaturesSection } from '@/components/home/features-section'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CategoriesSection />
        <FeaturedProducts />
        <StylesSection />
        <CTASection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
