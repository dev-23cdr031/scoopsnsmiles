'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, Phone, ShoppingCart, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const mainLinks = [
  { href: '/products', label: 'Products' },
  { href: '/offers', label: 'Offers' },
  { href: '/gift-cards', label: 'Gift Cards' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const moreLinks = [
  { href: '/blog', label: 'Blog & Recipes' },
  { href: '/loyalty', label: 'Loyalty Rewards' },
  { href: '/faq', label: 'FAQ' },
  { href: '/order-tracking', label: 'Order Tracking' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { totalCount, setIsOpen: setCartOpen } = useCart();
  const moreRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
              S
            </div>
            <span className="hidden sm:inline font-bold text-xl text-primary">Sakthi Bakers</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
            {/* More Dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors font-medium text-sm"
              >
                More
                <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-card border border-border/50 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                      onClick={() => setMoreOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Search className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm">
              <Phone className="w-4 h-4" />
              Call Us
            </button>
          </div>

          {/* Mobile Cart + Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
            <button className="p-2" onClick={toggleMenu}>
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {[...mainLinks, ...moreLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button className="w-full mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call Us
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
