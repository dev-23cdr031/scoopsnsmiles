'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { getCategories, getProducts } from '@/lib/api/client';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Category, Product } from '@/lib/types';

const categoryImages: Record<string, string> = {
  all: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
  breads: 'https://images.unsplash.com/photo-1609956941277-50a630884325?w=300&h=200&fit=crop',
  pastries: 'https://images.unsplash.com/photo-1558636508-e0db3814a69e?w=300&h=200&fit=crop',
  muffins: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=200&fit=crop',
  cakes: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
  cookies: 'https://images.unsplash.com/photo-1569718212e3-a1e3a5c0ee48?w=300&h=200&fit=crop',
  puffs: 'https://images.unsplash.com/photo-1632203171982-cc0df6e9ceb4?w=300&h=200&fit=crop',
  donuts: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop',
  sweets: 'https://images.unsplash.com/photo-1666190403712-44b98561d920?w=300&h=200&fit=crop',
};

const categoryIcons: Record<string, string> = {
  all: '🍞',
  breads: '🥖',
  pastries: '🥐',
  muffins: '🧁',
  cakes: '🎂',
  cookies: '🍪',
  puffs: '🥟',
  donuts: '🍩',
  sweets: '🍬',
};

type SortOption = 'default' | 'price-low' | 'price-high' | 'name';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      const [nextProducts, nextCategories] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      if (!active) {
        return;
      }

      setProducts(nextProducts);
      setCategories(nextCategories);
      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const availableCategories =
    categories.length > 0
      ? categories
      : [{ id: 'all', name: 'All Products', icon: 'cart' }];

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  return (
    <main className="min-h-screen bg-background">
      {/* Header Banner */}
      <section className="relative bg-secondary py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1920&h=600&fit=crop"
            alt="Products banner"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Our Products
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            From flaky puffs to decadent cakes — explore our complete range of fresh, handcrafted bakery delights.
          </p>
        </div>
      </section>

      {/* Category Visual Tiles */}
      <section className="bg-secondary/50 py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all duration-300`}
              >
                <div className={`relative w-20 h-20 rounded-2xl overflow-hidden border-3 transition-all shadow-md ${
                  selectedCategory === cat.id ? 'border-primary scale-110 shadow-lg shadow-primary/20' : 'border-transparent hover:border-primary/40 hover:scale-105'
                }`}>
                  <Image
                    src={categoryImages[cat.id] || categoryImages['all']}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center text-2xl ${selectedCategory === cat.id ? 'bg-primary/30' : 'bg-black/30'}`}>
                    {categoryIcons[cat.id] || '🍰'}
                  </div>
                </div>
                <span className={`text-xs font-bold ${selectedCategory === cat.id ? 'text-primary' : 'text-foreground/70'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Sort */}
      <section className="bg-background border-b border-border sticky top-20 z-40 backdrop-blur-md bg-background/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
              <input
                type="text"
                placeholder="Search bakes, cakes, puffs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-foreground/50 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2.5 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name">Name: A → Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-foreground/60">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <p className="text-foreground/60 mb-6 text-sm">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && ` in ${availableCategories.find(c => c.id === selectedCategory)?.name}`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-2xl font-semibold text-foreground mb-2">No products found</p>
              <p className="text-foreground/60">
                Try a different search term or browse another category.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
