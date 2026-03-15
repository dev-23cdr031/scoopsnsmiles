'use client';

import { Truck, Clock, MapPin, Phone } from 'lucide-react';

export default function DeliveryInfo() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Delivery & Pickup Options</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* In-Store Pickup */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-primary">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">In-Store Pickup</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Pick up fresh items directly from our bakery. Perfect for custom orders and bulk purchases.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-foreground">Hours:</p>
              <p>Monday - Friday: 6:00 AM - 8:00 PM</p>
              <p>Saturday: 7:00 AM - 7:00 PM</p>
              <p>Sunday: 8:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Home Delivery */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-accent">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-accent" />
              <h3 className="text-2xl font-bold text-foreground">Home Delivery</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              We deliver fresh baked goods to your doorstep within 5 km radius. Same-day delivery available.
            </p>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Delivery Hours:</span> 10:00 AM - 7:00 PM</p>
              <p><span className="font-semibold">Minimum Order:</span> ₹200</p>
              <p><span className="font-semibold">Delivery Fee:</span> ₹30 (Free over ₹500)</p>
            </div>
          </div>
        </div>

        {/* Custom Orders */}
        <div className="mt-8 bg-accent/10 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-accent" />
            <h3 className="text-2xl font-bold text-foreground">Custom Orders</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Planning a special event? Order custom cakes, pastries, and specialty items with at least 48 hours notice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold">
              Place Custom Order
            </button>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              <span className="font-semibold">Call: (555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
