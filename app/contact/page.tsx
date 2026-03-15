'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { submitContact } from '@/lib/api/client';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError('');
    setSubmitting(true);

    const response = await submitContact(formData);
    setSubmitting(false);

    if (!response) {
      setSubmitError('Unable to send your message right now. Please try again.');
      return;
    }

    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=600&fit=crop"
            alt="Contact banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-white/70 max-w-xl">
            Have questions, want a custom cake, or just say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <MapPin className="w-6 h-6" />, title: 'Visit Us', line1: '123 Baker Street', line2: 'New York, NY 10001' },
              { icon: <Phone className="w-6 h-6" />, title: 'Call Us', line1: '(555) 123-4567', line2: 'Mon-Sat, 7AM-7PM' },
              { icon: <Mail className="w-6 h-6" />, title: 'Email Us', line1: 'hello@sakthibakers.com', line2: 'We reply in 24 hours' },
              { icon: <Clock className="w-6 h-6" />, title: 'Open Hours', line1: 'Mon-Fri: 7AM-7PM', line2: 'Sat-Sun: 8AM-5PM' },
            ].map((card, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-primary">
                  {card.icon}
                </div>
                <h3 className="font-bold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-foreground/60">{card.line1}</p>
                <p className="text-sm text-foreground/60">{card.line2}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="bg-background py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Send us a Message</h2>
              </div>
              {submitted ? (
                <div className="bg-green-50 text-green-800 p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <p className="font-bold text-lg">Thank you for your message!</p>
                  <p className="text-sm text-green-600">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>

                  {submitError && (
                    <p className="text-sm text-red-600">{submitError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="text-xl font-bold text-foreground mb-3">Custom Orders</h3>
                <p className="text-foreground/60 leading-relaxed mb-4">
                  Planning a special event? We offer custom cakes, pastry platters, and catering for weddings, birthdays, corporate events, and more.
                </p>
                <Link
                  href="mailto:hello@sakthibakers.com"
                  className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-primary text-primary rounded-full hover:bg-primary/10 transition-colors font-semibold text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Email for Custom Orders
                </Link>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-bold text-foreground mb-3">Quick Response Times</h3>
                <ul className="space-y-2.5">
                  {[
                    'Email responses within 24 hours',
                    'Phone support during business hours',
                    'Custom order consultations available',
                    'Local delivery options for large orders',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground/70 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
                <div className="relative h-48">
                  <Image
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=300&fit=crop"
                    alt="Sakthi Bakers store interior"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-foreground mb-2">Visit Us in Store</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    Come experience our bakery firsthand. Meet our bakers, sample fresh items, and enjoy the aroma of fresh-baked bread.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
