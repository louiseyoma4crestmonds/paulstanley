import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Heart, ShoppingBag, Users, Video } from "lucide-react";
import meetGreetImage from '@assets/generated_images/Meet_and_greet_moment_30f0ca44.png';

export default function MeetGreet() {
  const requirements = [
    {
      icon: Heart,
      title: "1. Get a Promo Code or Fan Card",
      description: "Acquire your exclusive access pass through our promo code system or purchase a Fan Card for $50.",
    },
    {
      icon: Heart,
      title: "2. Support a Cause",
      description: "Make a meaningful donation to one of our charitable causes. Every contribution makes a difference.",
    },
    {
      icon: ShoppingBag,
      title: "3. Purchase Merchandise",
      description: "Get exclusive products from our store. Show your support while completing this requirement.",
    },
    {
      icon: Users,
      title: "4. Pay Logistics Fee",
      description: "Cover the coordination costs with a $200 logistics fee to finalize your eligibility.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={meetGreetImage}
              alt="Meet and Greet"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          </div>
          <div className="relative container mx-auto px-4 z-10 text-white">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Unlock Exclusive Access
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed mb-8 text-white/90">
                Complete four simple requirements to unlock the opportunity for a personal meet & greet 
                or live video call. An unforgettable experience awaits.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-primary/90 backdrop-blur-sm hover:bg-primary text-lg px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Follow these four steps to complete your requirements and unlock exclusive access
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requirements.map((req, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <req.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-2">{req.title}</CardTitle>
                        <CardDescription>{req.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-card">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Experience</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Once you complete all requirements, choose between an in-person meet & greet or a live video call
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">In-Person Meet & Greet</CardTitle>
                  <CardDescription>Experience a personal, face-to-face meeting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Meet in person at select locations
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Photo opportunities included
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Exclusive merchandise gifts
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      30-minute session
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Video className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Live Video Call</CardTitle>
                  <CardDescription>Connect virtually from anywhere in the world</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      One-on-one video call session
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Available via Zoom or Google Meet
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Screen capture recording provided
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      20-minute session
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Begin?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90 leading-relaxed">
              Create your account and start tracking your progress towards an exclusive experience. 
              Every step brings you closer to making this dream a reality.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  Create Account
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
