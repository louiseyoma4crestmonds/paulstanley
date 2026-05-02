import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  image: string;
  celebName: string;
  tagline: string;
  description: string;
}

export default function HeroSection({ image, celebName, tagline, description }: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={image}
          alt={celebName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      <div className="relative container mx-auto px-4 z-10">
        <div className="max-w-3xl text-white">
          <h1 className="font-serif text-6xl md:text-8xl font-bold tracking-tight mb-6">
            {celebName}
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-6 tracking-wide">
            {tagline}
          </p>
          <p className="text-lg md:text-xl leading-relaxed mb-8 text-white/90 max-w-2xl">
            {description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-primary/90 backdrop-blur-sm hover:bg-primary text-lg px-8"
                data-testid="button-hero-join"
              >
                Join Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/meet-greet">
              <Button
                size="lg"
                variant="outline"
                className="bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30 text-lg px-8"
                data-testid="button-hero-learn"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
