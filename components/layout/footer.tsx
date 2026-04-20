import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const footerLinks = {
  shop: [
    { name: 'All Artworks', href: '/shop' },
    { name: 'New Arrivals', href: '/shop?sort=newest' },
    { name: 'Bestsellers', href: '/shop?sort=bestselling' },
    { name: 'Ready to Ship', href: '/shop?ready_to_ship=true' },
    { name: 'Under Rs. 10,000', href: '/shop?max_price=10000' },
  ],
  artForms: [
    { name: 'Madhubani', href: '/shop?artform=madhubani' },
    { name: 'Warli', href: '/shop?artform=warli' },
    { name: 'Gond', href: '/shop?artform=gond' },
    { name: 'Kalamkari', href: '/shop?artform=kalamkari' },
    { name: 'Pichwai', href: '/shop?artform=pichwai' },
    { name: 'Pattachitra', href: '/shop?artform=pattachitra' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Artists', href: '/artists' },
    { name: 'Our Story', href: '/about#story' },
    { name: 'Sustainability', href: '/about#sustainability' },
    { name: 'Careers', href: '/careers' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Shipping & Returns', href: '/shipping' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'YouTube', href: '#', icon: Youtube },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h3 className="text-2xl font-serif font-bold">
                Join the Artisan Community
              </h3>
              <p className="mt-2 text-background/70">
                Subscribe to receive updates on new artworks, artist stories, and exclusive offers.
              </p>
            </div>
            <form className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-md bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-primary min-w-[280px]"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="text-2xl font-serif font-bold">
              Artisan<span className="text-primary">Haven</span>
            </Link>
            <p className="mt-4 text-sm text-background/70 leading-relaxed">
              Connecting you with India&apos;s finest master artisans. Every piece tells a story of tradition, skill, and passion.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-background/60 hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Art Forms Links */}
          <div>
            <h4 className="font-semibold mb-4">Art Forms</h4>
            <ul className="space-y-3">
              {footerLinks.artForms.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <a href="mailto:hello@artisanhaven.com" className="flex items-center gap-2 text-sm text-background/70 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                hello@artisanhaven.com
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 text-sm text-background/70 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +91 123 456 7890
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-background/60">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM4 0h16v2H4zm0 22h16v2H4zm8-10a2.5 2.5 0 000-5 2.5 2.5 0 000 5zm0 1c-1.67 0-5 .84-5 2.5V17h10v-1.5c0-1.66-3.33-2.5-5-2.5z"/>
              </svg>
              <span>Authentic Artworks</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
              </svg>
              <span>Quality Assured</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-background/10 text-center">
          <p className="text-sm text-background/60">
            &copy; {new Date().getFullYear()} Artisan Haven. All rights reserved. 
            Made with love for Indian art and artisans.
          </p>
        </div>
      </div>
    </footer>
  )
}
