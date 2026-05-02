import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  stock: number;
}

export default function Products() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 px-4 bg-card">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Exclusive Merchandise</h1>
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              Shop premium products and show your support in style. 
              Every purchase helps support our charitable initiatives and brings you closer to exclusive experiences.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map((product) => (
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
                No products available at the moment
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
