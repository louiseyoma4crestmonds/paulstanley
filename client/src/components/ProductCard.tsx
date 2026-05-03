import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  stock?: number;
}

export default function ProductCard({ id, name, price, image, description, stock = 10 }: ProductCardProps) {
  const inStock = stock > 0;
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({ productId: id, name, price, image });
    toast({ title: "Added to cart", description: `${name} has been added to your cart.` });
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all" data-testid={`card-product-${id}`}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {!inStock && (
          <Badge variant="destructive" className="absolute top-4 left-4">
            Out of Stock
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
      )}
      <CardFooter>
        <Button
          className="w-full"
          disabled={!inStock}
          onClick={handleAddToCart}
          data-testid={`button-add-cart-${id}`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
