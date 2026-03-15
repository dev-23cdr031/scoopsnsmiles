'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

const galleryItems = [
  { src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop', alt: 'Artisan Sourdough', category: 'Breads' },
  { src: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=800&fit=crop', alt: 'Butter Croissant', category: 'Pastries' },
  { src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop', alt: 'Chocolate Layer Cake', category: 'Cakes' },
  { src: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=800&fit=crop', alt: 'Glazed Donuts', category: 'Donuts' },
  { src: 'https://images.unsplash.com/photo-1632203171982-cc0df6e9ceb4?w=800&h=800&fit=crop', alt: 'Golden Veg Puff', category: 'Puffs' },
  { src: 'https://images.unsplash.com/photo-1666190020536-e2a5fddcab7d?w=800&h=800&fit=crop', alt: 'Gulab Jamun', category: 'Sweets' },
  { src: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=800&fit=crop', alt: 'Blueberry Muffins', category: 'Muffins' },
  { src: 'https://images.unsplash.com/photo-1558636508-e0db3814a69e?w=800&h=800&fit=crop', alt: 'Chocolate Croissant', category: 'Pastries' },
  { src: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&h=800&fit=crop', alt: 'Red Velvet Cake', category: 'Cakes' },
  { src: 'https://images.unsplash.com/photo-1569718212e3-a1e3a5c0ee48?w=800&h=800&fit=crop', alt: 'French Macarons', category: 'Cookies' },
  { src: 'https://images.unsplash.com/photo-1600080869217-b0e71e64a5f8?w=800&h=800&fit=crop', alt: 'Cinnamon Roll', category: 'Pastries' },
  { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop', alt: 'Our Bakery', category: 'Store' },
  { src: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&h=800&fit=crop', alt: 'Black Forest Cake', category: 'Cakes' },
  { src: 'https://images.unsplash.com/photo-1533910534207-90f31029a78e?w=800&h=800&fit=crop', alt: 'Strawberry Donut', category: 'Donuts' },
  { src: 'https://images.unsplash.com/photo-1585521528961-d92f10ee8fa9?w=800&h=800&fit=crop', alt: 'Fresh Baked Bread', category: 'Breads' },
  { src: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&h=800&fit=crop', alt: 'Mysore Pak', category: 'Sweets' },
  { src: 'https://images.unsplash.com/photo-1601303516403-36bb662e1e4e?w=800&h=800&fit=crop', alt: 'Jalebi', category: 'Sweets' },
  { src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=800&fit=crop', alt: 'Strawberry Tart', category: 'Pastries' },
];

const filterCategories = ['All', 'Breads', 'Pastries', 'Cakes', 'Donuts', 'Puffs', 'Sweets', 'Muffins', 'Cookies', 'Store'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = galleryItems.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-secondary py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1920&h=600&fit=crop"
            alt="Gallery banner"
            fill
            className="object-cover opacity-15"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Our Gallery
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            A visual feast — browse through our handcrafted bakes, cakes, and more.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-background border-b border-border sticky top-20 z-40 backdrop-blur-md bg-background/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-foreground hover:bg-muted border border-border/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="bg-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-foreground/50 mb-6">{filteredImages.length} photos</p>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredImages.map((item, i) => (
              <div
                key={i}
                className="break-inside-avoid group cursor-pointer relative rounded-2xl overflow-hidden"
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={400}
                  height={400 + (i % 3) * 100}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex flex-col justify-end p-4">
                  <span className="inline-block w-fit px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-full mb-1">
                    {item.category}
                  </span>
                  <span className="text-white font-semibold text-sm">{item.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].alt}
              width={900}
              height={900}
              className="max-h-[85vh] w-auto mx-auto object-contain rounded-lg"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg text-center">
              <p className="text-white font-bold text-lg">{filteredImages[lightboxIndex].alt}</p>
              <p className="text-white/60 text-sm">{filteredImages[lightboxIndex].category} • {lightboxIndex + 1} / {filteredImages.length}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
