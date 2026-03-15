import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Award, Users, Leaf } from 'lucide-react';
import DeliveryInfo from '@/components/DeliveryInfo';
import { getTeamMembers } from '@/lib/api/client';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const team = await getTeamMembers();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=700&fit=crop"
            alt="Our bakery"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-primary-foreground/80 font-semibold text-sm tracking-widest uppercase mb-3 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full">Est. 1995</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-2xl">
            About Sakthi Bakers
          </h1>
          <p className="text-lg text-white/70 max-w-xl">
            A story of passion, tradition, and artisan craftsmanship — baking love into every bite for 30 years.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">Our Journey</span>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                  30 Years of Baking Excellence
                </h2>
              </div>
              <div className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  Founded in 1995 by Sakthi Kumar, Sakthi Bakers has been a cornerstone of our community for nearly three decades. What started as a small neighborhood bakery with just two ovens has grown into a beloved destination for artisan baked goods, serving thousands of happy customers.
                </p>
                <p>
                  We believe in the power of traditional techniques combined with premium ingredients. Every bread is hand-shaped, every pastry is crafted with care, and every dessert is baked with passion using time-tested family recipes.
                </p>
                <p>
                  Our commitment to quality has never wavered. We source the finest local ingredients, use pure butter without shortcuts, and maintain our original sourdough starter that&apos;s been alive since 1995.
                </p>
              </div>
            </div>

            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=500&fit=crop"
                alt="Sakthi Bakers"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <p className="text-white font-bold text-lg">Our bakery since 1995</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">What We Stand For</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Heart className="w-6 h-6" />, title: 'Passion', desc: 'Every bake is made with love and devotion to the craft.' },
              { icon: <Award className="w-6 h-6" />, title: 'Quality', desc: 'Premium ingredients, zero preservatives, pure butter always.' },
              { icon: <Leaf className="w-6 h-6" />, title: 'Tradition', desc: 'Time-tested recipes passed down through generations.' },
              { icon: <Users className="w-6 h-6" />, title: 'Community', desc: 'More than a bakery — a gathering place for our neighborhood.' },
            ].map((v, i) => (
              <div key={i} className="p-6 bg-card rounded-2xl border border-border/50 text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-foreground/60">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-2">Our People</span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Meet Our Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.id} className="group text-center bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6 -mt-8 relative">
                  <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                  <p className="text-primary font-semibold text-sm mb-2">{member.role}</p>
                  <p className="text-foreground/60 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <DeliveryInfo />

      {/* Stats */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&h=500&fit=crop"
            alt="Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-primary-foreground">
            {[
              { num: '30+', label: 'Years in Business' },
              { num: '10K+', label: 'Happy Customers' },
              { num: '50+', label: 'Fresh Items Daily' },
              { num: '3', label: 'Master Bakers' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-4xl md:text-6xl font-bold mb-2">{s.num}</p>
                <p className="text-sm md:text-base opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-16">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Experience the Difference
          </h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Visit our bakery and taste the quality and passion we put into every creation.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-bold shadow-lg"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
