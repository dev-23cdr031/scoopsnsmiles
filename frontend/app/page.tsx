import ProductCard from '@/components/ProductCard';
import PromotionsSection from '@/components/PromotionsSection';
import NewsletterSignup from '@/components/NewsletterSignup';
import RecipesBlog from '@/components/RecipesBlog';
import LoyaltyProgram from '@/components/LoyaltyProgram';
import PhotoGallery from '@/components/PhotoGallery';
import { getProducts, getTestimonials } from '@/lib/api/client';
import { ArrowRight, Truck, Shield, Clock, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [featuredProducts, testimonialItems] = await Promise.all([
    getProducts({ featured: true, limit: 8 }),
    getTestimonials(3),
  ]);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&h=900&fit=crop&q=80"
            alt="Bakery background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-44">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/90">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Fresh baked daily since 1995
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                Taste the<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Art of Baking</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-lg">
                Puffs, cakes, breads, sweets & more — crafted with love at Sakthi Bakers using the finest ingredients and traditional recipes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-bold text-lg shadow-lg shadow-orange-500/25"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl hover:bg-white/20 transition-all font-semibold text-lg"
                >
                  Our Story
                </Link>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Truck className="w-4 h-4" /></div>
                  Free Delivery ₹500+
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Shield className="w-4 h-4" /></div>
                  100% Fresh
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Star className="w-4 h-4" /></div>
                  4.9★ Rated
                </div>
              </div>
            </div>

            {/* Floating product cards */}
            <div className="hidden md:flex flex-col items-center gap-4 animate-float">
              <div className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=600&fit=crop"
                  alt="Chocolate Donut"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-xl ring-2 ring-white/20 -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300&h=300&fit=crop"
                    alt="Veg Puff"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-xl ring-2 ring-white/20 rotate-6 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=300&h=300&fit=crop"
                    alt="Chocolate Cake"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <PromotionsSection />

      {/* Features Strip */}
      <section className="bg-gradient-to-r from-primary via-primary/90 to-primary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 text-primary-foreground justify-center md:justify-start">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Fresh Daily Delivery</h3>
                <p className="text-sm opacity-80">Baked & delivered every morning</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-primary-foreground justify-center">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Premium Ingredients</h3>
                <p className="text-sm opacity-80">No preservatives, pure butter</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-primary-foreground justify-center md:justify-end">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">30+ Years Legacy</h3>
                <p className="text-sm opacity-80">Trusted since 1995</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">Our Bestsellers</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto">
              Handpicked favourites loved by thousands. Freshly baked, beautifully crafted.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-10 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Loyalty Program */}
      <LoyaltyProgram />

      {/* Testimonials */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto">
              Loved by the local community and food enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialItems.map((testimonial) => (
              <div key={testimonial.id} className="bg-card rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border/50">
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-foreground/50">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes & Blog Section */}
      <RecipesBlog />

      {/* Photo Gallery */}
      <PhotoGallery />

      {/* Newsletter Section */}
      <NewsletterSignup />

      {/* CTA Section */}
      <section className="relative bg-primary text-primary-foreground py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1920&h=600&fit=crop"
            alt="Bakery background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">Ready to Taste the Magic?</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Visit our store, browse online, or place a custom order for your special occasions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary-foreground text-primary rounded-full hover:opacity-90 transition-opacity font-bold text-lg shadow-xl"
            >
              Order Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-primary-foreground rounded-full hover:bg-primary-foreground/10 transition-colors font-bold text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
