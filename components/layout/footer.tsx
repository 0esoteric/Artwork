import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/shop?sort=newest' },
    { name: 'Bestsellers', href: '/shop?filter=bestseller' },
    { name: 'T-Shirts', href: '/shop?category=tshirts' },
    { name: 'Hoodies', href: '/shop?category=hoodies' },
    { name: 'Jackets', href: '/shop?category=jackets' },
    { name: 'Sale', href: '/shop?sale=true' },
  ],
  collections: [
    { name: 'Summer Essentials', href: '/shop?collection=summer' },
    { name: 'Streetwear', href: '/shop?collection=streetwear' },
    { name: 'Minimalist', href: '/shop?collection=minimalist' },
    { name: 'Vintage', href: '/shop?collection=vintage' },
  ],
  help: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Track Order', href: '/orders' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Sustainability', href: '/about#sustainability' },
    { name: 'Careers', href: '/careers' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

const socialLinks = [
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="border-b border-background/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="max-w-md">
              <h3 className="text-2xl font-serif">
                Stay in the loop
              </h3>
              <p className="mt-2 text-background/60 text-sm">
                Subscribe for exclusive offers, new arrivals, and style inspiration.
              </p>
            </div>
            <form className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12 min-w-[280px] bg-background/10 border-background/20 text-background placeholder:text-background/50 rounded-none focus-visible:ring-background"
              />
              <Button className="h-12 bg-background text-foreground hover:bg-background/90 rounded-none px-8">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="text-2xl font-serif tracking-tight">
              VELURA
            </Link>
            <p className="mt-4 text-sm text-background/60 leading-relaxed">
              Modern fashion for the contemporary individual. Quality clothing designed to last.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-background/60 hover:text-background transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wide uppercase mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wide uppercase mb-4">Collections</h4>
            <ul className="space-y-3">
              {footerLinks.collections.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wide uppercase mb-4">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wide uppercase mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <a href="mailto:hello@velura.com" className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors">
                <Mail className="h-4 w-4" />
                hello@velura.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-background/60">
              &copy; {new Date().getFullYear()} VELURA. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-background/60">
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                Secure Checkout
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Free Returns
              </span>
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z"/>
                </svg>
                Worldwide Shipping
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
