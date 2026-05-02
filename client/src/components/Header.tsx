import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/causes", label: "Causes" },
    { href: "/events", label: "Events" },
    { href: "/products", label: "Shop" },
    { href: "/meet-greet", label: "Meet & Greet" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/90 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              Paul Stanley
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={location === link.href ? "toggle-elevate toggle-elevated" : ""}
                  data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" data-testid="button-cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <div className="hidden md:flex gap-2">
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login">Login</Button>
              </Link>
              <Link href="/register">
                <Button data-testid="button-register">Join Now</Button>
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="ghost" className="w-full">Login</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full">Join Now</Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
