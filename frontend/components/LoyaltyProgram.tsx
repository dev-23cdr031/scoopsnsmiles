'use client';

import { Award, Star, Gift, TrendingUp } from 'lucide-react';

export default function LoyaltyProgram() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Sakthi Rewards</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Join our loyalty program and earn points on every purchase at Sakthi Bakers!
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Earn Points</h3>
                  <p className="text-muted-foreground">Earn 1 point for every ₹10 spent on any product.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Gift className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Redeem Rewards</h3>
                  <p className="text-muted-foreground">Redeem 100 points for a ₹100 discount on your next order.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Exclusive Perks</h3>
                  <p className="text-muted-foreground">Members get early access to limited editions and special events.</p>
                </div>
              </div>
            </div>

            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold">
              Join Sakthi Rewards
            </button>
          </div>

          {/* Right Content - Benefits Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground mb-1">5%</p>
              <p className="text-muted-foreground">Bonus points on birthday</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <Gift className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground mb-1">10%</p>
              <p className="text-muted-foreground">Discount at signup</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <Award className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground mb-1">1:1</p>
              <p className="text-muted-foreground">Point ratio on purchases</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-3xl font-bold text-foreground mb-1">24/7</p>
              <p className="text-muted-foreground">Track points anytime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
