'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Gift, Crown, Sparkles, Heart, ShoppingCart, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const tiers = [
  {
    name: 'Bronze',
    minPoints: 0,
    icon: '🥉',
    color: 'from-amber-700 to-amber-500',
    border: 'border-amber-400',
    perks: ['1 point per ₹10 spent', '5% birthday discount', 'Exclusive newsletter'],
  },
  {
    name: 'Silver',
    minPoints: 500,
    icon: '🥈',
    color: 'from-gray-400 to-gray-300',
    border: 'border-gray-400',
    perks: ['1.5x points on every purchase', '10% birthday discount', 'Free delivery on orders ₹300+', 'Early access to new items'],
  },
  {
    name: 'Gold',
    minPoints: 2000,
    icon: '🥇',
    color: 'from-yellow-500 to-amber-400',
    border: 'border-yellow-400',
    perks: ['2x points on every purchase', '15% birthday discount', 'Free delivery always', 'Monthly free pastry', 'Exclusive tastings'],
  },
  {
    name: 'Platinum',
    minPoints: 5000,
    icon: '💎',
    color: 'from-violet-500 to-purple-400',
    border: 'border-purple-400',
    perks: ['3x points on every purchase', '20% birthday discount', 'Priority custom orders', 'Free cake on anniversary', 'VIP event invitations', 'Personal baker consultation'],
  },
];

const howItWorks = [
  { step: '1', title: 'Sign Up Free', description: 'Join Sakthi Rewards in-store or online — it takes 30 seconds.', icon: <Gift className="w-6 h-6" /> },
  { step: '2', title: 'Earn Points', description: 'Get 1 point for every ₹10 you spend. Points stack with every order.', icon: <Star className="w-6 h-6" /> },
  { step: '3', title: 'Level Up', description: 'Reach new tiers for bigger perks. More you bake with us, more you save.', icon: <Crown className="w-6 h-6" /> },
  { step: '4', title: 'Redeem Rewards', description: 'Use points for discounts, free items, or exclusive experiences.', icon: <Heart className="w-6 h-6" /> },
];

const redemptionOptions = [
  { points: 100, reward: 'Free Veg Puff', image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200&h=200&fit=crop' },
  { points: 200, reward: 'Free Donut', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop' },
  { points: 500, reward: 'Free Muffin + Coffee', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=200&fit=crop' },
  { points: 1000, reward: '₹500 Store Credit', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
  { points: 2500, reward: 'Free 1kg Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop' },
  { points: 5000, reward: 'Premium Gift Hamper', image: 'https://images.unsplash.com/photo-1666190020536-e2a5fddcab7d?w=200&h=200&fit=crop' },
];

export default function LoyaltyPage() {
  const [selectedTier, setSelectedTier] = useState(0);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&h=600&fit=crop"
            alt="Loyalty banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-foreground">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Crown className="w-4 h-4 text-yellow-300" />
            Sakthi Rewards
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Earn. Redeem. Celebrate.
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Every bite earns you points. Join thousands of members enjoying exclusive perks, free bakes, and VIP treatment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-primary-foreground text-primary rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-xl">
              Join Now — It&apos;s Free
            </button>
            <button className="px-10 py-4 border-2 border-primary-foreground rounded-full font-bold text-lg hover:bg-primary-foreground/10 transition-colors">
              Check My Points
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">Simple Steps</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative text-center p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  {item.icon}
                </div>
                <div className="absolute -top-3 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">Tiers & Perks</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Membership Levels</h2>
            <p className="text-foreground/60 max-w-xl mx-auto">The more you indulge, the higher you climb. Each tier unlocks better rewards.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {tiers.map((tier, i) => (
              <button
                key={tier.name}
                onClick={() => setSelectedTier(i)}
                className={`text-left p-6 rounded-2xl transition-all duration-300 border-2 ${
                  selectedTier === i
                    ? `${tier.border} bg-card shadow-xl scale-[1.02]`
                    : 'border-border/50 bg-card hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-3">{tier.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-1">{tier.name}</h3>
                <p className="text-xs text-foreground/50 mb-4">{tier.minPoints.toLocaleString('en-IN')}+ points</p>
                <ul className="space-y-2">
                  {tier.perks.map((perk, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-foreground/70">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Redemption Catalog */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">Rewards Catalog</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Redeem Your Points</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {redemptionOptions.map((item, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all text-center group">
                <div className="relative h-28 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.reward}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <div className="text-xs font-bold text-primary mb-1">{item.points} pts</div>
                  <p className="text-xs font-semibold text-foreground line-clamp-2">{item.reward}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-1">5K+</p>
              <p className="text-sm opacity-80">Active Members</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-1">₹12L+</p>
              <p className="text-sm opacity-80">Rewards Redeemed</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-1">50K+</p>
              <p className="text-sm opacity-80">Points Earned Daily</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-1">4.9★</p>
              <p className="text-sm opacity-80">Member Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <Award className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Start Earning Today</h2>
          <p className="text-foreground/60">Join Sakthi Rewards and turn every purchase into a treat. It&apos;s free, simple, and delicious.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg"
            >
              Start Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
