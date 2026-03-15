'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Clock, ChefHat, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'How to Make Perfect Sourdough at Home',
    author: 'Sakthi Kumar',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    date: 'March 5, 2026',
    readTime: '8 min read',
    category: 'Bread',
    excerpt: 'Learn the secrets to making authentic sourdough bread with our step-by-step guide. Discover the art of starter maintenance, hydration ratios, and perfect scoring techniques that our bakers use daily.',
    image: 'https://images.unsplash.com/photo-1585521528961-d92f10ee8fa9?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Pastry Chef Tips: Achieving The Perfect Lamination',
    author: 'Meera Sakthi',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    date: 'February 28, 2026',
    readTime: '6 min read',
    category: 'Pastry',
    excerpt: 'Master the art of laminating dough for croissants and Danish pastries. Essential tips on butter temperature, folding techniques, and common mistakes to avoid.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    id: 3,
    title: 'The Art of Indian Puffs: From Dough to Delight',
    author: 'Arjun Singh',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    date: 'February 20, 2026',
    readTime: '7 min read',
    category: 'Snacks',
    excerpt: 'Explore the crispy, flaky world of Indian puffs. From the perfect potato filling to layered pastry dough — learn how Sakthi Bakers makes the city\'s favourite puffs.',
    image: 'https://images.unsplash.com/photo-1632203171982-cc0df6e9ceb4?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    id: 4,
    title: '5 Cake Decorating Techniques Every Home Baker Should Know',
    author: 'Meera Sakthi',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    date: 'February 15, 2026',
    readTime: '10 min read',
    category: 'Cakes',
    excerpt: 'Take your cakes from ordinary to extraordinary with these professional decorating techniques. Piping, fondant work, ganache drips, and more.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    id: 5,
    title: 'The Science Behind the Perfect Donut',
    author: 'Sakthi Kumar',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    date: 'February 10, 2026',
    readTime: '5 min read',
    category: 'Donuts',
    excerpt: 'Why are some donuts fluffy and some dense? Dive into the food science behind frying temperature, dough hydration, and the perfect glaze consistency.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    id: 6,
    title: 'Traditional Indian Sweets: Gulab Jamun Secrets',
    author: 'Arjun Singh',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    date: 'February 5, 2026',
    readTime: '9 min read',
    category: 'Sweets',
    excerpt: 'The secret to perfectly soft gulab jamun lies in the khoya-to-maida ratio. Our master sweet maker shares his 30-year-old recipe and technique.',
    image: 'https://images.unsplash.com/photo-1666190020536-e2a5fddcab7d?w=800&h=500&fit=crop',
    featured: false,
  },
];

const categories = ['All', 'Bread', 'Pastry', 'Snacks', 'Cakes', 'Donuts', 'Sweets'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured || selectedCategory !== 'All');

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative bg-secondary py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=600&fit=crop"
            alt="Blog banner"
            fill
            className="object-cover opacity-15"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <ChefHat className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Baking Tips & Recipes
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Learn techniques, discover recipes, and get inspired by our master bakers at Sakthi Bakers.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === 'All' && searchQuery === '' && (
        <section className="bg-background py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-foreground/50">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-foreground/60 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image src={post.authorImage} alt={post.author} fill className="object-cover" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{post.author}</span>
                      </div>
                      <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter & Search */}
      <section className="bg-secondary/30 border-y border-border sticky top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
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
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="bg-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-foreground/50 mb-6">
            {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
          </p>
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'All' && searchQuery === '' ? regularPosts : filteredPosts).map((post) => (
                <article key={post.id} className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-full">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-foreground/50">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-foreground/60 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="relative w-7 h-7 rounded-full overflow-hidden">
                        <Image src={post.authorImage} alt={post.author} fill className="object-cover" />
                      </div>
                      <span className="text-xs font-medium text-foreground/70">{post.author}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl font-semibold text-foreground mb-2">No articles found</p>
              <p className="text-foreground/60">Try a different search or category.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Never Miss a Recipe</h2>
          <p className="text-primary-foreground/80">Subscribe and get our latest baking tips delivered to your inbox every week.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground placeholder-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            />
            <button className="px-6 py-3 bg-primary-foreground text-primary rounded-full font-bold hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
