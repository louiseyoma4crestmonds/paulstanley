import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { SiPaypal, SiBitcoin, SiEthereum, SiLitecoin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Paul Stanley</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your exclusive gateway to connect with Paul through meaningful engagement.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/causes" className="text-sm text-muted-foreground hover:text-foreground block">
                Causes
              </Link>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground block">
                Events
              </Link>
              <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground block">
                Shop
              </Link>
              <Link href="/meet-greet" className="text-sm text-muted-foreground hover:text-foreground block">
                Meet & Greet
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <nav className="space-y-2">
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground block">
                Contact Us
              </Link>
              <Link href="/payment-methods" className="text-sm text-muted-foreground hover:text-foreground block">
                Payment Methods
              </Link>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground block">FAQ</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground block">Privacy Policy</a>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Stay updated with exclusive news</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" type="email" data-testid="input-newsletter" />
              <Button data-testid="button-subscribe">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">We Accept:</span>
              <div className="flex items-center gap-3">
                <SiPaypal className="h-5 w-5 text-muted-foreground" />
                <SiBitcoin className="h-5 w-5 text-muted-foreground" />
                <SiEthereum className="h-5 w-5 text-muted-foreground" />
                <SiLitecoin className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="link-youtube">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              © 2025 Kiss band. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
