import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Sakthi Bakers</h3>
            <p className="text-sm opacity-90">
              Artisan bakery crafting fresh, delicious baked goods since 1995. Quality ingredients, timeless recipes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:opacity-80 transition-opacity">Products</Link></li>
              <li><Link href="/offers" className="hover:opacity-80 transition-opacity">Offers & Deals</Link></li>
              <li><Link href="/gift-cards" className="hover:opacity-80 transition-opacity">Gift Cards</Link></li>
              <li><Link href="/gallery" className="hover:opacity-80 transition-opacity">Gallery</Link></li>
              <li><Link href="/blog" className="hover:opacity-80 transition-opacity">Blog & Recipes</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:opacity-80 transition-opacity">About Us</Link></li>
              <li><Link href="/contact" className="hover:opacity-80 transition-opacity">Contact</Link></li>
              <li><Link href="/faq" className="hover:opacity-80 transition-opacity">FAQ</Link></li>
              <li><Link href="/loyalty" className="hover:opacity-80 transition-opacity">Loyalty Rewards</Link></li>
              <li><Link href="/order-tracking" className="hover:opacity-80 transition-opacity">Track Order</Link></li>
              <li><Link href="/admin" className="hover:opacity-80 transition-opacity">Admin Analytics</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact & Hours</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Baker Street, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@sakthibakers.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5" />
                <span>Mon–Fri 7AM–7PM<br />Sat 8AM–6PM · Sun 8AM–5PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
            <p>&copy; {new Date().getFullYear()} Sakthi Bakers. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/order-tracking" className="hover:opacity-80 transition-opacity">Track Order</Link>
              <Link href="/admin" className="hover:opacity-80 transition-opacity">Admin Analytics</Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">Privacy</Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">Terms</Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
