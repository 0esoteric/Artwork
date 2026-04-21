import Link from 'next/link'
import { Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/shop?sort=newest' },
    { name: 'Bestsellers', href: '/shop?filter=bestseller' },
    { name: 'T-Shirts', href: '/shop?category=tshirts' },
    { name: 'Hoodies', href: '/shop?category=hoodies' },
    { name: 'Jackets', href: '/shop?category=jackets' },
  ],
  help: [
    { name: 'Contact', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
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
      {/* Top Section - Full Width Newsletter */}
      <div className="border-b border-background/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-black tracking-tight">
                Join the Club
              </h3>
              <p className="mt-2 text-background/60">
                Sign up for early access to drops, exclusive offers, and more.
              </p>
            </div>
            <form className="flex gap-2 max-w-md lg:ml-auto">
              <Input
                type="email"
                placeholder="Your email"
                className="h-14 flex-1 bg-background/10 border-0 text-background placeholder:text-background/50 rounded-none"
              />
              <Button className="h-14 px-8 bg-background text-foreground hover:bg-background/90 rounded-none">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer - Horizontal Links */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-black tracking-tight">
              THREADS
            </Link>
            <p className="mt-4 text-sm text-background/60 leading-relaxed max-w-xs">
              Modern essentials for everyday style. Quality basics designed to last.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center bg-background/10 hover:bg-background/20 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">Shop</h4>
            <ul className="space-y-4">
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

          {/* Help */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">Help</h4>
            <ul className="space-y-4">
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

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase mb-6">Company</h4>
            <ul className="space-y-4">
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
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-background/60">
              &copy; {new Date().getFullYear()} THREADS. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-background/60">
              <span>Secure Checkout</span>
              <span>Free Shipping $100+</span>
              <span>30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
