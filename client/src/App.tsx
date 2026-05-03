import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Contact from "@/pages/Contact";
import PaymentMethods from "@/pages/PaymentMethods";
import Causes from "@/pages/Causes";
import Events from "@/pages/Events";
import Products from "@/pages/Products";
import MeetGreet from "@/pages/MeetGreet";
import Admin from "@/pages/Admin";
import VerifyEmail from "@/pages/VerifyEmail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={Admin} />
      <Route path="/contact" component={Contact} />
      <Route path="/payment-methods" component={PaymentMethods} />
      <Route path="/causes" component={Causes} />
      <Route path="/events" component={Events} />
      <Route path="/products" component={Products} />
      <Route path="/meet-greet" component={MeetGreet} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
          <CartDrawer />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
