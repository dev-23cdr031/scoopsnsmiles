'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Truck, CheckCircle, Clock, ChefHat, MapPin, Phone, ArrowRight } from 'lucide-react';
import { getRecentOrders, trackOrder } from '@/lib/api/client';
import type { OrderResult, OrderStatus } from '@/lib/types';

const statusSteps: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'confirmed', label: 'Order Confirmed', icon: <CheckCircle className="w-5 h-5" /> },
  { key: 'preparing', label: 'Preparing', icon: <ChefHat className="w-5 h-5" /> },
  { key: 'baking', label: 'Baking', icon: <Clock className="w-5 h-5" /> },
  { key: 'ready', label: 'Ready', icon: <Package className="w-5 h-5" /> },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: <Truck className="w-5 h-5" /> },
  { key: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-5 h-5" /> },
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const autoLoadedOrder = useRef<string | null>(null);
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderResult[]>([]);
  const [loadingRecentOrders, setLoadingRecentOrders] = useState(true);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  const loadRecentOrders = async () => {
    setLoadingRecentOrders(true);
    const items = await getRecentOrders(24);
    setRecentOrders(items);
    setLoadingRecentOrders(false);
  };

  const searchByOrderId = async (value: string) => {
    const normalized = value.trim();
    if (!normalized) {
      setError('Please enter an order ID.');
      setOrder(null);
      return;
    }

    setError('');
    setOrder(null);
    setSearching(true);

    const found = await trackOrder(normalized);
    if (found) {
      setOrder(found);
    } else {
      setError('Order not found. Please check your order ID and try again.');
    }

    setSearching(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchByOrderId(orderId);
  };

  useEffect(() => {
    void loadRecentOrders();
  }, []);

  useEffect(() => {
    const initialOrderId = searchParams.get('orderId')?.trim() || '';
    if (!initialOrderId) {
      return;
    }

    if (autoLoadedOrder.current === initialOrderId) {
      return;
    }

    autoLoadedOrder.current = initialOrderId;
    setOrderId(initialOrderId);
    void searchByOrderId(initialOrderId);
  }, [searchParams]);

  const getStepStatus = (stepKey: OrderStatus) => {
    if (!order) return 'pending';
    const orderIndex = statusSteps.findIndex(s => s.key === order.status);
    const stepIndex = statusSteps.findIndex(s => s.key === stepKey);
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'pending';
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-secondary py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1920&h=600&fit=crop"
            alt="Tracking banner"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto mb-8">
            Pick from recent orders or enter an order ID to see real-time updates on your fresh bakes.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type="text"
                  placeholder="e.g. SB-2026-0001"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-border rounded-2xl bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={!orderId.trim() || searching}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
              >
                {searching ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {/* Demo IDs hint */}
          <div className="mt-4 text-sm text-foreground/40">
            Try: <button onClick={() => setOrderId('SB-2026-0001')} className="text-primary hover:underline font-medium">SB-2026-0001</button>
            {' • '}
            <button onClick={() => setOrderId('SB-2026-0002')} className="text-primary hover:underline font-medium">SB-2026-0002</button>
            {' • '}
            <button onClick={() => setOrderId('SB-2026-0003')} className="text-primary hover:underline font-medium">SB-2026-0003</button>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="bg-background py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Recent Orders and Products</h2>
              <p className="text-sm text-foreground/60">Select any order below to track instantly. No manual order ID needed.</p>
            </div>
            <button
              onClick={() => void loadRecentOrders()}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Refresh List
            </button>
          </div>

          {loadingRecentOrders ? (
            <div className="rounded-2xl border border-border/50 bg-card p-6 text-foreground/70">
              Loading recent orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="rounded-2xl border border-border/50 bg-card p-6 text-foreground/70">
              No orders available yet. Place a new order to see it here.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recentOrders.map((recent) => (
                <article key={recent.orderId} className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-foreground">{recent.orderId}</p>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold capitalize text-primary">
                      {recent.status.replaceAll('-', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-foreground/60">{recent.customerName} | ₹{recent.totalAmount.toLocaleString('en-IN')}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {recent.items.map((item, index) => (
                      <span key={`${recent.orderId}_${index}`} className="rounded-md bg-muted px-2 py-1 text-xs text-foreground/80">
                        {item}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setOrderId(recent.orderId);
                      void searchByOrderId(recent.orderId);
                    }}
                    className="mt-4 w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Track This Order
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Error */}
      {error && (
        <section className="bg-background py-12">
          <div className="max-w-lg mx-auto px-4 text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <p className="text-red-700 font-semibold mb-2">{error}</p>
              <p className="text-red-600/70 text-sm">Double-check the ID or contact us for help.</p>
            </div>
          </div>
        </section>
      )}

      {/* Order Result */}
      {order && (
        <section className="bg-background py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Order Header */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-foreground/50">Order ID</p>
                  <p className="text-2xl font-bold text-foreground">{order.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground/50">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-foreground/50">Customer</p>
                  <p className="font-semibold text-foreground">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-foreground/50">Order Date</p>
                  <p className="font-semibold text-foreground">{order.orderDate}</p>
                </div>
                <div>
                  <p className="text-foreground/50">Estimated Delivery</p>
                  <p className="font-semibold text-foreground">{order.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 mb-8">
              <h3 className="text-lg font-bold text-foreground mb-8">Order Progress</h3>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-8">
                  {statusSteps.map((step) => {
                    const status = getStepStatus(step.key);
                    return (
                      <div key={step.key} className="flex items-center gap-4 relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all ${
                            status === 'completed'
                              ? 'bg-green-500 text-white'
                              : status === 'current'
                              ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110'
                              : 'bg-muted text-foreground/30'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div>
                          <p className={`font-semibold ${status === 'pending' ? 'text-foreground/40' : 'text-foreground'}`}>
                            {step.label}
                          </p>
                          {status === 'current' && (
                            <p className="text-sm text-primary font-medium">In progress...</p>
                          )}
                          {status === 'completed' && (
                            <p className="text-sm text-green-600">Done</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Order Items</h3>
              <ul className="space-y-3">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      {!order && !error && (
        <section className="bg-background py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-3">How Order Tracking Works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center p-6 bg-card rounded-2xl border border-border/50">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Place an Order</h3>
                <p className="text-sm text-foreground/60">Order online, via WhatsApp, or in-store. You&apos;ll receive an order ID.</p>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border border-border/50">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Select or Search</h3>
                <p className="text-sm text-foreground/60">Use the recent orders list, or paste your order ID above if you already have it.</p>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border border-border/50">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  <Truck className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Get Updates</h3>
                <p className="text-sm text-foreground/60">Track from confirmed → baking → out-for-delivery → at your door.</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-foreground/50 mb-4">Need to place an order?</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Bar */}
      <section className="bg-secondary/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-foreground/60">Questions about your order? We&apos;re here to help.</p>
            <div className="flex gap-4">
              <a href="tel:5551234567" className="flex items-center gap-2 px-5 py-2 bg-card rounded-full border border-border/50 text-sm font-semibold text-foreground hover:shadow-md transition-shadow">
                <Phone className="w-4 h-4 text-primary" /> (555) 123-4567
              </a>
              <Link href="/contact" className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                <MapPin className="w-4 h-4" /> Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <OrderTrackingContent />
    </Suspense>
  );
}
