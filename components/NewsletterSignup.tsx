'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { subscribeNewsletter } from '@/lib/api/client';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (email) {
      setSubmitting(true);
      const response = await subscribeNewsletter(email);
      setSubmitting(false);

      if (!response) {
        setError('Could not subscribe right now. Please try again.');
        return;
      }

      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Mail className="w-6 h-6 text-accent" />
          <h2 className="text-3xl font-bold text-foreground">Stay Fresh & Updated</h2>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Subscribe to our newsletter for weekly specials, new recipes, and exclusive offers from Sakthi Bakers
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold whitespace-nowrap"
          >
            {submitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        {submitted && (
          <div className="mt-4 flex items-center justify-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <p className="font-medium">Thanks for subscribing! Check your email.</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
