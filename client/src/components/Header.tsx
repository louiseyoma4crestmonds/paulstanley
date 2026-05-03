import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "./ThemeToggle";
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useCart } from "@/contexts/CartContext";

interface UserData {
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
}

export default function Header() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count, setIsOpen: openCart } = useCart();

  const { data: user } = useQuery<UserData>({
    queryKey: ["/api/user"],
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("/api/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.clear();
      setLocation("/");
    },
  });

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
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => openCart(true)}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                  {count}
                </Badge>
              )}
            </Button>
            <ThemeToggle />
            <div className="hidden md:flex gap-2">
              {user ? (
                <>
                  <Link href={user.isAdmin ? "/admin" : "/dashboard"}>
                    <Button variant="ghost" data-testid="button-dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      {user.isAdmin ? "Admin" : "Dashboard"}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" data-testid="button-login">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button data-testid="button-register">Join Now</Button>
                  </Link>
                </>
              )}
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
              {user ? (
                <>
                  <Link href={user.isAdmin ? "/admin" : "/dashboard"} className="flex-1">
                    <Button variant="ghost" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      {user.isAdmin ? "Admin" : "Dashboard"}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { logoutMutation.mutate(); setMobileMenuOpen(false); }}
                    disabled={logoutMutation.isPending}
                    data-testid="button-logout-mobile"
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button variant="ghost" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">Join Now</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
