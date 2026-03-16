'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CreditCard, PackageCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/api/client';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuth();
  const { items, totalPrice, clearCart, setIsOpen } = useCart();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  useEffect(() => {
    if (user?.name) {
      setCustomerName((prev) => prev || user.name);
    }
  }, [user]);

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card p-8 text-center">
          <p className="text-foreground/70">Checking your sign-in status...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-amber-900">Sign in required for checkout</h1>
          <p className="mt-2 text-amber-800">You need to sign in or sign up before placing an order.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signin?returnTo=%2Fcheckout"
              className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:opacity-90"
            >
              Sign In
            </Link>
            <Link
              href="/signup?returnTo=%2Fcheckout"
              className="rounded-lg border border-border bg-white px-5 py-2.5 font-semibold text-foreground hover:bg-muted"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setError('Name, phone and address are required.');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty. Add products before checkout.');
      return;
    }

    setSubmitting(true);

    const result = await createOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      note: note.trim(),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: totalPrice
    });

    setSubmitting(false);

    if (!result) {
      setError('Unable to place order right now. Please try again.');
      return;
    }

    clearCart();
    setIsOpen(false);
    router.push(`/order-tracking?orderId=${encodeURIComponent(result.orderId)}`);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-3 text-foreground/70">Add products to your cart and come back to checkout.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8 md:py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-border/60 bg-card p-6 md:p-8">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="mt-2 text-sm text-foreground/60">Complete your details to place the order.</p>

          <form onSubmit={handlePlaceOrder} className="mt-8 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Full Name</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none ring-primary/40 focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none ring-primary/40 focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Flat / Street / Area"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none ring-primary/40 focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Order Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Any custom instructions"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none ring-primary/40 focus:ring-2"
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              <CreditCard className="h-4 w-4" />
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>
            <p className="mt-1 text-sm text-foreground/60">{totalCount} item(s) in cart</p>

            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 px-3 py-2">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-foreground/60">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-border/60 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground/70">Total</span>
                <span className="text-2xl font-bold text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="text-base font-semibold text-foreground">What happens next</h3>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2"><PackageCheck className="mt-0.5 h-4 w-4 text-primary" /> Order is confirmed instantly.</li>
              <li className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 text-primary" /> You are redirected to live tracking page.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
