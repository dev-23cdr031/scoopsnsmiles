import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { getOffers } from '@/lib/api/client';

export default async function PromotionsSection() {
  const specialOffers = await getOffers();

  return (
    <section className="py-16 bg-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Special Offers</h2>
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground">Check out our current promotions and exclusive deals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {specialOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-l-4 border-accent"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold shadow">
                    {offer.discount}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{offer.title}</h3>
                <p className="text-muted-foreground mb-4">{offer.description}</p>
                <p className="text-sm text-accent font-semibold">Valid: {offer.validTill}</p>
                <button className="mt-6 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
