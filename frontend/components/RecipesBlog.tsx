'use client';

import { BookOpen, ChefHat, Clock } from 'lucide-react';
import Link from 'next/link';

const recipes = [
  {
    id: 1,
    title: "How to Make Perfect Sourdough at Home",
    author: "Sakthi Kumar",
    date: "March 5, 2024",
    readTime: "8 min read",
    excerpt: "Learn the secrets to making authentic sourdough bread with our step-by-step guide. Discover the art of starter maintenance and perfect scoring techniques.",
    image: "https://images.unsplash.com/photo-1585521528961-d92f10ee8fa9?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Pastry Chef Tips: Achieving The Perfect Lamination",
    author: "Meera Sakthi",
    date: "February 28, 2024",
    readTime: "6 min read",
    excerpt: "Master the art of laminating dough for croissants and Danish pastries. Essential tips and common mistakes to avoid.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Seasonal Ingredients: Spring Baking Ideas",
    author: "Arjun Singh",
    date: "February 20, 2024",
    readTime: "7 min read",
    excerpt: "Explore fresh spring ingredients perfect for seasonal baking. From strawberry tarts to rhubarb cakes, discover what's in season.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
  },
];

export default function RecipesBlog() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Baking Tips & Recipes</h2>
            <ChefHat className="w-6 h-6 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn baking techniques, recipes, and tips from our master bakers at Sakthi Bakers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <article
              key={recipe.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                  <span>{recipe.author}</span>
                  <span>•</span>
                  <span>{recipe.date}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                  {recipe.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {recipe.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {recipe.readTime}
                  </div>
                  <Link
                    href="#"
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
}
