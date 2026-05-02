import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CauseCard from "@/components/CauseCard";
import EventCard from "@/components/EventCard";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Calendar, ShoppingBag, Users, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import heroImage from '@assets/generated_images/kiss-paul-stanley.jpg';
import meetGreetImage from '@assets/generated_images/Meet_and_greet_moment_30f0ca44.png';

interface Cause {
  id: string;
  title: string;
  description: string;
  goal: string;
  raised: string;
  image: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  image: string;
  stock: number;
}

export default function Home() {
  const { data: causes, isLoading: causesLoading } = useQuery<Cause[]>({ queryKey: ["/api/causes"] });
  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({ queryKey: ["/api/events"] });
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({ queryKey: ["/api/products"] });

  const featuredCauses = causes?.slice(0, 3) ?? [];
  const featuredEvents = events?.slice(0, 2) ?? [];
  const featuredProducts = products?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main>
        <HeroSection
          image={heroImage}
          celebName="Paul Stanley"
          tagline="Connecting Hearts, Changing Lives"
          description="Join me on this incredible journey of giving back to communities, creating unforgettable experiences, and making a real difference in the world."
        />

        {/* Featured Causes */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4">Featured Causes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Support meaningful initiatives that are making a real impact in communities worldwide
              </p>
            </div>
            {causesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : featuredCauses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featuredCauses.map((cause) => (
                  <CauseCard
                    key={cause.id}
                    id={String(cause.id)}
                    title={cause.title}
                    description={cause.description}
                    goal={parseFloat(cause.goal)}
                    raised={parseFloat(cause.raised)}
                    image={cause.image}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No causes available yet — check back soon.
              </div>
            )}
            <div className="text-center mt-12">
              <Link href="/causes">
                <Button size="lg" variant="outline" data-testid="button-view-all-causes">
                  <Heart className="mr-2 h-5 w-5" />
                  View All Causes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4">Upcoming Events</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join exclusive events and be part of unforgettable experiences
              </p>
            </div>
            {eventsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : featuredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
                {featuredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={String(event.id)}
                    title={event.title}
                    date={event.date}
                    location={event.location}
                    image={event.image}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No upcoming events yet — check back soon.
              </div>
            )}
            <div className="text-center mt-12">
              <Link href="/events">
                <Button size="lg" variant="outline" data-testid="button-view-all-events">
                  <Calendar className="mr-2 h-5 w-5" />
                  View All Events
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4">Exclusive Merchandise</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Shop premium products and show your support in style
              </p>
            </div>
            {productsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={String(product.id)}
                    name={product.name}
                    description={product.description}
                    price={parseFloat(product.price)}
                    image={product.image}
                    stock={product.stock}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No products available yet — check back soon.
              </div>
            )}
            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" variant="outline" data-testid="button-shop-all">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Unlock Access */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-4xl md:text-5xl font-semibold mb-6">
                  Unlock Exclusive Access
                </h2>
                <p className="text-lg mb-8 text-primary-foreground/90 leading-relaxed">
                  Complete four simple requirements to unlock the opportunity for a personal meet & greet or live call.
                  Each step brings you closer to an unforgettable experience.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    { icon: Heart, title: "1. Get a Promo Code or Fan Card", desc: "Acquire your exclusive access pass" },
                    { icon: Heart, title: "2. Support a Cause", desc: "Make a meaningful donation" },
                    { icon: ShoppingBag, title: "3. Purchase Merchandise", desc: "Get exclusive products" },
                    { icon: Users, title: "4. Pay Logistics Fee", desc: "Cover coordination costs" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex items-start gap-3">
                      <div className="bg-primary-foreground/20 rounded-full p-1 mt-1">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{title}</h3>
                        <p className="text-sm text-primary-foreground/80">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link href="/meet-greet">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                    data-testid="button-meet-greet-info"
                  >
                    Learn More About Meet & Greet
                  </Button>
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                <img
                  src={meetGreetImage}
                  alt="Meet and Greet"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-semibold mb-6">
                Ready to Connect?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Join thousands of fans who are making a difference and creating lasting memories.
                Your journey to an exclusive experience starts here.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" data-testid="button-cta-register">Join us Today</Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" data-testid="button-cta-contact">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
