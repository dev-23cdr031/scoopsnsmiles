'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Search, MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';

const faqCategories = [
  { id: 'general', name: 'General', icon: '🍞' },
  { id: 'orders', name: 'Orders & Delivery', icon: '🚚' },
  { id: 'products', name: 'Products', icon: '🎂' },
  { id: 'payments', name: 'Payments', icon: '💳' },
  { id: 'loyalty', name: 'Sakthi Rewards', icon: '⭐' },
  { id: 'custom', name: 'Custom Orders', icon: '🎨' },
];

const faqs = [
  // General
  { id: 1, category: 'general', question: 'What are your opening hours?', answer: 'We are open Monday to Friday from 7AM to 7PM, Saturday from 8AM to 6PM, and Sunday from 8AM to 5PM. During festivals, we may have extended hours — follow us on social media for updates.' },
  { id: 2, category: 'general', question: 'Where is Sakthi Bakers located?', answer: 'We are located at 123 Baker Street, NY 10001. We have ample parking and our store is wheelchair accessible. Look for the big brown awning with our logo!' },
  { id: 3, category: 'general', question: 'Do you offer franchise opportunities?', answer: 'We are currently focused on maintaining the quality of our single location. However, we are exploring expansion. Please email us at hello@sakthibakers.com to register your interest.' },

  // Orders & Delivery
  { id: 4, category: 'orders', question: 'Do you offer home delivery?', answer: 'Yes! We deliver within a 10km radius. Orders above ₹500 get free delivery. For orders below ₹500, a flat ₹30 delivery fee applies. Order before 2PM for same-day delivery.' },
  { id: 5, category: 'orders', question: 'How do I place an order?', answer: 'You can order through our website, call us at (555) 123-4567, or WhatsApp us. You can also walk into our store. For custom cakes, we recommend ordering 48 hours in advance.' },
  { id: 6, category: 'orders', question: 'Can I cancel or modify my order?', answer: 'Orders can be modified or cancelled up to 4 hours before the delivery time. Custom orders can be cancelled up to 24 hours in advance. Contact us immediately for any changes.' },
  { id: 7, category: 'orders', question: 'What areas do you deliver to?', answer: 'We currently deliver within a 10km radius of our bakery. For special occasions or bulk orders beyond this area, please contact us and we will try to accommodate your request.' },

  // Products
  { id: 8, category: 'products', question: 'Are your products eggless?', answer: 'We offer both egg and eggless options. All our puffs, breads, and many cakes are available in eggless variants. Products are clearly labeled in-store and online.' },
  { id: 9, category: 'products', question: 'Do you use preservatives?', answer: 'No! We are proud to be preservative-free. All our bakes are made fresh daily with pure butter, premium flour, and natural ingredients. This is why they taste so amazing!' },
  { id: 10, category: 'products', question: 'How long do your products stay fresh?', answer: 'Breads stay fresh for 2-3 days (store in a breadbox). Cakes last 3-5 days refrigerated. Puffs and pastries are best consumed the same day. Cookies stay fresh for up to a week in an airtight container.' },
  { id: 11, category: 'products', question: 'Do you have sugar-free or gluten-free options?', answer: 'We have a limited sugar-free range including diabetic-friendly cakes and cookies. Gluten-free options are available on pre-order (48 hours notice). Please ask our staff for details.' },

  // Payments
  { id: 12, category: 'payments', question: 'What payment methods do you accept?', answer: 'We accept cash, all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), and Sakthi Bakers gift cards. Online orders also support net banking and wallet payments.' },
  { id: 13, category: 'payments', question: 'Do you accept gift cards as payment?', answer: 'Absolutely! Sakthi Bakers gift cards can be used for any in-store or online purchase. They have no expiry date and can be combined with other payment methods.' },

  // Loyalty
  { id: 14, category: 'loyalty', question: 'How does Sakthi Rewards work?', answer: 'Earn 1 point for every ₹10 you spend. Points can be redeemed for free items, discounts, and exclusive rewards. There are 4 membership tiers — Bronze, Silver, Gold, and Platinum — each with increasing benefits.' },
  { id: 15, category: 'loyalty', question: 'How do I check my loyalty points?', answer: 'You can check your points balance in-store, on our website, or by calling us. We also send monthly statements via email to all members.' },
  { id: 16, category: 'loyalty', question: 'Do loyalty points expire?', answer: 'Points are valid for 12 months from the date of earning. As long as you make at least one purchase every 6 months, your points balance stays active.' },

  // Custom
  { id: 17, category: 'custom', question: 'Can I order a custom cake?', answer: 'Yes! We specialize in custom cakes for birthdays, weddings, anniversaries, and corporate events. Share your design or describe your vision, and our cake artists will bring it to life. Order at least 48 hours in advance.' },
  { id: 18, category: 'custom', question: 'Do you do catering for events?', answer: 'Absolutely! We cater for weddings, corporate events, birthday parties, and more. Our catering menu includes mini pastries, sandwiches, cakes, sweets, and custom items. Contact us for a quote.' },
  { id: 19, category: 'custom', question: 'What is the minimum order for custom cakes?', answer: 'Custom cakes start from 500g (₹599). For tiered or sculpted cakes, minimum 1kg applies. Photo cakes start at 1kg. All custom cakes require at least 48 hours advance notice.' },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [openId, setOpenId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = searchQuery ? true : faq.category === selectedCategory;
    const matchesSearch = searchQuery
      ? faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCat && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-secondary py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=600&fit=crop"
            alt="FAQ banner"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto mb-8">
            Got questions? We&apos;ve got answers. Find everything you need to know about Sakthi Bakers.
          </p>
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-border rounded-2xl bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      {!searchQuery && (
        <section className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setOpenId(null); }}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card text-foreground hover:bg-muted border border-border/50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ List */}
      <section className="bg-background py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery && (
            <p className="text-sm text-foreground/50 mb-6">
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
            </p>
          )}

          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 ${
                    openId === faq.id ? 'border-primary/30 bg-card shadow-md' : 'border-border/50 bg-card hover:border-primary/20'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-foreground pr-8">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-foreground/50 flex-shrink-0 transition-transform duration-300 ${
                        openId === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openId === faq.id && (
                    <div className="px-5 pb-5">
                      <div className="pt-3 border-t border-border/50">
                        <p className="text-foreground/70 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🤔</div>
              <p className="text-xl font-semibold text-foreground mb-2">No matching questions</p>
              <p className="text-foreground/60 mb-6">Try rephrasing or browse a different category.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('general'); }}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="bg-secondary/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">Still Have Questions?</h2>
            <p className="text-foreground/60">Our team is always happy to help. Reach out through any of these channels.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Link href="/contact" className="p-6 bg-card rounded-2xl text-center border border-border/50 hover:shadow-lg transition-all group">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Chat With Us</h3>
              <p className="text-sm text-foreground/60">Send us a message anytime</p>
            </Link>
            <a href="tel:5551234567" className="p-6 bg-card rounded-2xl text-center border border-border/50 hover:shadow-lg transition-all group">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Call Us</h3>
              <p className="text-sm text-foreground/60">(555) 123-4567</p>
            </a>
            <a href="mailto:hello@sakthibakers.com" className="p-6 bg-card rounded-2xl text-center border border-border/50 hover:shadow-lg transition-all group">
              <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Email</h3>
              <p className="text-sm text-foreground/60">hello@sakthibakers.com</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
