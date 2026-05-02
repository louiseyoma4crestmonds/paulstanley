import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CauseCard from "@/components/CauseCard";
import EventCard from "@/components/EventCard";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Calendar, ShoppingBag, Users } from "lucide-react";

import heroImage from '@assets/generated_images/kiss-paul-stanley.jpg';
import educationImage from '@assets/generated_images/Education_charity_cause_7be64c6a.png';
import environmentImage from '@assets/generated_images/Environmental_cause_bca34897.png';
import healthcareImage from '@assets/generated_images/Healthcare_charity_cause_45f99c5d.png';
import concertImage from '@assets/generated_images/Concert_venue_event_0f0136d1.png';
import galaImage from '@assets/generated_images/Charity_gala_event_f8642558.png';
import tshirtImage from '@assets/generated_images/dress-to-kill.png';
import capImage from '@assets/generated_images/hoodie.png';
import hoodieImage from '@assets/generated_images/kiss-mug.png';
import meetGreetImage from '@assets/generated_images/Meet_and_greet_moment_30f0ca44.png';

export default function Home() {
  const causes = [
    {
      id: "1",
      title: "Education for All",
      description: "Help provide quality education and learning resources to underprivileged children in communities around the world.",
      goal: 50000,
      raised: 32500,
      image: educationImage,
    },
    {
      id: "2",
      title: "Environmental Action",
      description: "Support our initiatives to plant trees, clean communities, and create a sustainable future for the next generation.",
      goal: 75000,
      raised: 48200,
      image: environmentImage,
    },
    {
      id: "3",
      title: "Healthcare Access",
      description: "Ensure everyone has access to quality healthcare services regardless of their economic background.",
      goal: 100000,
      raised: 67800,
      image: healthcareImage,
    },
  ];

  const events = [
    {
      id: "1",
      title: "Live Concert Experience",
      date: "2025-12-15T20:00:00",
      location: "Madison Square Garden, New York",
      image: concertImage,
    },
    {
      id: "2",
      title: "Annual Charity Gala",
      date: "2025-11-20T19:00:00",
      location: "Beverly Hills Hotel, Los Angeles",
      image: galaImage,
    },
  ];

  const products = [
    {
      id: "1",
      name: "Signature T-Shirt",
      price: 45,
      image: tshirtImage,
      description: "Premium quality cotton t-shirt with exclusive design",
    },
    {
      id: "2",
      name: "Branded Cap",
      price: 35,
      image: capImage,
      description: "Stylish cap with embroidered logo",
    },
    {
      id: "3",
      name: "Premium Hoodie",
      price: 75,
      image: hoodieImage,
      description: "Comfortable hoodie with artistic graphic design",
    },
  ];

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

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4">Featured Causes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Support meaningful initiatives that are making a real impact in communities worldwide
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {causes.map((cause) => (
                <CauseCard key={cause.id} {...cause} />
              ))}
            </div>
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

        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4">Upcoming Events</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join exclusive events and be part of unforgettable experiences
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              {events.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
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

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4">Exclusive Merchandise</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Shop premium products and show your support in style
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
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
                  <li className="flex items-start gap-3">
                    <div className="bg-primary-foreground/20 rounded-full p-1 mt-1">
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">1. Get a Promo Code or Fan Card</h3>
                      <p className="text-sm text-primary-foreground/80">Acquire your exclusive access pass</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary-foreground/20 rounded-full p-1 mt-1">
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">2. Support a Cause</h3>
                      <p className="text-sm text-primary-foreground/80">Make a meaningful donation</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary-foreground/20 rounded-full p-1 mt-1">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">3. Purchase Merchandise</h3>
                      <p className="text-sm text-primary-foreground/80">Get exclusive products</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary-foreground/20 rounded-full p-1 mt-1">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">4. Pay Logistics Fee</h3>
                      <p className="text-sm text-primary-foreground/80">Cover coordination costs</p>
                    </div>
                  </li>
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
                  <Button size="lg" data-testid="button-cta-register">
                    Join us Today
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" data-testid="button-cta-contact">
                    Contact Us
                  </Button>
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
