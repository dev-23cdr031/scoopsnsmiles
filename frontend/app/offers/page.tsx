import Image from 'next/image';
import Link from 'next/link';
import { Tag, Gift, Percent, Clock, Star, Sparkles, ArrowRight } from 'lucide-react';
import { getOffers } from '@/lib/api/client';

const exclusiveDeals = [
  {
    id: 'combo1',
    title: 'Morning Combo',
    description: '2 Puffs + 1 Tea for just ₹99. Available Mon–Sat, 7AM–10AM.',
    price: '₹99',
    originalPrice: '₹140',
    badge: 'Morning',
    image: 'https://images.unsplash.com/photo-1632203171982-cc0df6e9ceb4?w=600&h=400&fit=crop',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'combo2',
    title: 'Donut Box of 6',
    description: 'Assorted donuts — pick any 6 and save ₹120. Perfect for parties.',
    price: '₹499',
    originalPrice: '₹620',
    badge: 'Party Pack',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'combo3',
    title: 'Sweet Festival Box',
    description: 'Gulab Jamun + Mysore Pak + Jalebi combo box — ideal for gifting.',
    price: '₹699',
    originalPrice: '₹780',
    badge: 'Festival',
    image: 'https://images.unsplash.com/photo-1666190020536-e2a5fddcab7d?w=600&h=400&fit=crop',
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 'combo4',
    title: 'Celebration Cake + 12 Pastries',
    description: 'Any 1kg cake + 12 assorted mini pastries at a special bundled price.',
    price: '₹2,499',
    originalPrice: '₹3,200',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
    color: 'from-emerald-500 to-teal-500',
  },
];

export const dynamic = 'force-dynamic';

export default async function OffersPage() {
  const specialOffers = await getOffers();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1920&h=600&fit=crop"
            alt="Offers banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Special Offers & Deals
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Irresistible Offers
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Save big on your favourite bakes. Fresh combos, festival deals, and more — grab them before they&apos;re gone!
          </p>
        </div>
      </section>

      {/* Running Offers */}
      <section className="bg-background py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">Limited Time</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Current Specials</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {specialOffers.map((offer) => (
              <div key={offer.id} className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {offer.discount}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-foreground">{offer.title}</h3>
                  <p className="text-foreground/60">{offer.description}</p>
                  <div className="flex items-center gap-2 text-sm text-foreground/50">
                    <Clock className="w-4 h-4" />
                    <span>{offer.validTill}</span>
                  </div>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Combos */}
      <section className="bg-secondary/50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">Value Packs</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Exclusive Combos</h2>
            <p className="text-foreground/60 max-w-xl mx-auto">Specially curated combos that save you more. Great for sharing!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {exclusiveDeals.map((deal) => (
              <div key={deal.id} className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute top-3 left-3 bg-gradient-to-r ${deal.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}>
                      {deal.badge}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{deal.title}</h3>
                      <p className="text-sm text-foreground/60 mb-4">{deal.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">{deal.price}</span>
                        <span className="text-sm text-foreground/40 line-through">{deal.originalPrice}</span>
                      </div>
                      <Link
                        href="/products"
                        className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
                      >
                        Order
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558636508-e0db3814a69e?w=1920&h=500&fit=crop"
            alt="Seasonal"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-primary-foreground space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">Festival Season is Here!</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Order sweets boxes, cake combos, and gift packs for your celebrations. Bulk discounts available for orders above ₹5,000.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary-foreground text-primary rounded-full font-bold hover:opacity-90 transition-opacity shadow-xl"
            >
              Shop Festival Specials
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-primary-foreground rounded-full font-bold hover:bg-primary-foreground/10 transition-colors"
            >
              Bulk Order Enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <Tag className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1">Best Prices</h3>
              <p className="text-sm text-foreground/60">Unbeatable value for quality bakes</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <Gift className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1">Gift Packing</h3>
              <p className="text-sm text-foreground/60">Beautiful wrapping for all combos</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <Percent className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1">Loyalty Discount</h3>
              <p className="text-sm text-foreground/60">Extra 5% off for members</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1">Same Day Ready</h3>
              <p className="text-sm text-foreground/60">Order before 2PM for same-day</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
