'use client';

import Image from 'next/image';
import { Gift, Heart, ShoppingCart, Sparkles, Send, Clock, Store, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getGiftCards } from '@/lib/api/client';
import type { GiftCard } from '@/lib/types';

const customAmounts = [250, 500, 1000, 2000, 5000];

export default function GiftCardsPage() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    let active = true;

    const loadGiftCards = async () => {
      const cards = await getGiftCards();
      if (!active) {
        return;
      }
      setGiftCards(cards);
      setLoadingCards(false);
    };

    void loadGiftCards();

    return () => {
      active = false;
    };
  }, []);

  const faqs = [
    { q: 'How long is the gift card valid?', a: 'Sakthi Bakers gift cards have no expiration date. Use them whenever you\'d like!' },
    { q: 'Can I use it in-store and online?', a: 'Yes! Our gift cards work both in our physical store and on our online platform.' },
    { q: 'Can I check my balance?', a: 'Contact us or check your balance online using your gift card number.' },
    { q: 'What if I lose my card?', a: 'We can help! Contact our customer service with your card details for assistance.' },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1607478900766-efe13248b125?w=1400&h=600&fit=crop"
          alt="Gift cards banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4" />
            The Perfect Present
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Gift Cards</h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            Share the sweetness with a Sakthi Bakers gift card — perfect for any occasion!
          </p>
        </div>
      </section>

      {/* Gift Cards Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary tracking-widest uppercase">Choose a Card</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Our Gift Card Collection</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {loadingCards ? (
              <div className="col-span-full text-center py-10 text-foreground/60">Loading gift cards...</div>
            ) : giftCards.map((card, idx) => {
              const gradients = [
                'from-amber-500 to-orange-600',
                'from-rose-500 to-pink-600',
                'from-violet-500 to-purple-600',
              ];
              return (
                <div
                  key={card.id}
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border-2 ${
                    selectedCard === card.id
                      ? 'border-primary shadow-xl scale-[1.02]'
                      : 'border-border/50 bg-card hover:shadow-xl hover:scale-[1.01]'
                  }`}
                  onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                >
                  {/* Card Visual */}
                  <div className={`relative h-44 bg-gradient-to-br ${gradients[idx % 3]} p-6 flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 text-sm font-medium tracking-wide">SAKTHI BAKERS</span>
                      <Gift className="w-6 h-6 text-white/80" />
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-white">₹{card.amount.toLocaleString('en-IN')}</div>
                      <div className="text-white/70 text-xs tracking-wider mt-1">GIFT CARD</div>
                    </div>
                    <div className="absolute top-4 right-4 opacity-10">
                      <Gift className="w-32 h-32 text-white" />
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{card.name}</h3>
                        <p className="text-foreground/60 text-sm mt-1">{card.description}</p>
                      </div>
                      <Heart className={`w-5 h-5 transition-colors ${selectedCard === card.id ? 'fill-red-500 text-red-500' : 'text-foreground/30 group-hover:text-red-400'}`} />
                    </div>

                    <button className="w-full mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-bold flex items-center justify-center gap-2 shadow-sm">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>

                    {selectedCard === card.id && (
                      <div className="mt-4 pt-4 border-t border-border/50 space-y-3 animate-in slide-in-from-top-2">
                        <p className="text-sm text-foreground/60 flex items-center gap-2">
                          <Send className="w-3.5 h-3.5" /> Digital delivery available
                        </p>
                        <button className="w-full px-4 py-2.5 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-colors font-semibold text-sm">
                          Send as E-Gift
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Amount */}
          <div className="bg-card rounded-2xl border border-border/50 p-8 md:p-10 mb-16">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Custom Amount</h3>
                </div>
                <p className="text-foreground/60">Choose your own amount for a personalised gift.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {customAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCustomAmount(customAmount === amt ? null : amt)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      customAmount === amt
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : 'bg-secondary text-foreground hover:bg-primary/10 border border-border/50'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="relative rounded-2xl overflow-hidden mb-16">
            <Image
              src="https://images.unsplash.com/photo-1486427944544-d2c246c4df4a?w=1400&h=400&fit=crop"
              alt="Bakery"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/85" />
            <div className="relative z-10 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Why Choose Sakthi Bakers Gift Cards?</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Gift, title: 'Perfect Gift', desc: 'Ideal for birthdays, anniversaries, or just to say thanks!' },
                  { icon: Store, title: 'Use Anywhere', desc: 'Use online or in-store. Valid for all products.' },
                  { icon: Clock, title: 'Never Expires', desc: 'No expiration date. Redeem when you want.' },
                  { icon: Heart, title: 'Support Local', desc: 'Support quality baking & traditional recipes.' },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                    <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-1">{title}</h3>
                    <p className="text-white/75 text-sm">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl border border-border/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="font-semibold text-foreground">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-foreground/40 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4 text-foreground/60 text-sm leading-relaxed animate-in slide-in-from-top-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
