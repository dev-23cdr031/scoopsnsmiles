'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

const badgeColors: Record<string, string> = {
  Bestseller: 'bg-red-500 text-white',
  Popular: 'bg-orange-500 text-white',
  New: 'bg-emerald-500 text-white',
  Traditional: 'bg-amber-700 text-white',
  Premium: 'bg-purple-600 text-white',
  Favourite: 'bg-pink-500 text-white',
  'Gift Pick': 'bg-sky-500 text-white',
  Healthy: 'bg-green-600 text-white',
};

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  featured?: boolean;
  badge?: string;
}

export default function ProductCard({ id, name, price, image, featured, badge }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <Link href={`/products/${id}`}>
      <div className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-border/50">
        {/* Image Container */}
        <div className="relative overflow-hidden h-56">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge */}
          {badge && (
            <div className={`absolute top-3 left-3 ${badgeColors[badge] || 'bg-primary text-primary-foreground'} px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-lg`}>
              {badge}
            </div>
          )}

          {/* Featured tag */}
          {featured && !badge && (
            <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              ⭐ Featured
            </div>
          )}

          {/* Wishlist button */}
          <button
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-md"
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>

          {/* Add to cart button */}
          <button
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            onClick={handleAddToCart}
          >
            <div className={`${added ? 'bg-green-500 scale-110' : 'bg-primary hover:bg-primary/90'} text-primary-foreground p-3 rounded-xl transition-all duration-200 shadow-lg`}>
              <ShoppingCart className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-primary">₹{price.toLocaleString('en-IN')}</p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
