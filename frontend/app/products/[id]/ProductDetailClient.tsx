'use client';

import { useState } from 'react';
import { ShoppingCart, Star, Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, qty);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-primary uppercase mb-2">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </p>
          <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-foreground/70">(48 reviews)</span>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-3xl font-bold text-primary mb-6">
            ₹{product.price}
          </p>
          <p className="text-lg text-foreground/80 text-balance leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-foreground">Available every day</p>
          <p className="text-foreground/70">
            Made fresh daily using the finest artisan techniques and premium ingredients.
          </p>
        </div>
      </div>

      {/* Quantity + CTA */}
      <div className="space-y-4 pt-8 border-t border-border">
        {/* Quantity selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">Quantity:</span>
          <div className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-7 h-7 rounded-full bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-lg font-bold w-8 text-center">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-7 h-7 rounded-full bg-background flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <span className="text-sm text-foreground/60">Total: ₹{product.price * qty}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              addedMsg
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {addedMsg ? 'Added to Cart!' : 'Add to Cart'}
          </button>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              wishlisted ? 'border-red-400 text-red-400' : 'border-border text-foreground/50 hover:border-red-300'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-400' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
