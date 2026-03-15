'use client';

import Image from 'next/image';
import Link from 'next/link';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop', alt: 'Strawberry Tart', tag: 'Pastry' },
  { src: 'https://images.unsplash.com/photo-1609956941277-50a630884325?w=400&h=400&fit=crop', alt: 'Sourdough Bread', tag: 'Bread' },
  { src: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop', alt: 'Chocolate Donuts', tag: 'Donuts' },
  { src: 'https://images.unsplash.com/photo-1558636508-e0db3814a69e?w=400&h=400&fit=crop', alt: 'Chocolate Croissant', tag: 'Pastry' },
  { src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', alt: 'Layered Cake', tag: 'Cake' },
  { src: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop', alt: 'Blueberry Muffins', tag: 'Muffin' },
  { src: 'https://images.unsplash.com/photo-1632203171982-cc0df6e9ceb4?w=400&h=400&fit=crop', alt: 'Crispy Puffs', tag: 'Puff' },
  { src: 'https://images.unsplash.com/photo-1666190403712-44b98561d920?w=400&h=400&fit=crop', alt: 'Indian Sweets', tag: 'Sweets' },
  { src: 'https://images.unsplash.com/photo-1569718212e3-a1e3a5c0ee48?w=400&h=400&fit=crop', alt: 'Macarons', tag: 'Cookies' },
  { src: 'https://images.unsplash.com/photo-1600080869217-b0e71e64a5f8?w=400&h=400&fit=crop', alt: 'Cinnamon Roll', tag: 'Pastry' },
];

export default function PhotoGallery() {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">Gallery</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Fresh From Our Oven</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">A glimpse into the delicious world of Sakthi Bakers</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                i === 0 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <div className={i === 0 ? 'h-[280px] md:h-full min-h-[300px]' : 'h-40 md:h-48'}>
                <div className="relative h-full w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4">
                    <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-full mb-1">
                      {img.tag}
                    </span>
                    <span className="text-white font-semibold text-sm text-center px-2">
                      {img.alt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-10 py-3.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            Explore All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
