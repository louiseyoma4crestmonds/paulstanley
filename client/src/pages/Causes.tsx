import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CauseCard from "@/components/CauseCard";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Cause {
  id: number;
  title: string;
  description: string;
  goal: string;
  raised: string;
  image: string;
}

export default function Causes() {
  const { data: causes, isLoading } = useQuery<Cause[]>({
    queryKey: ["/api/causes"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Making a Difference Together</h1>
            <p className="text-lg md:text-xl leading-relaxed text-primary-foreground/90">
              Every donation counts. Support the causes that matter and help create positive change in communities around the world. 
              Your contribution helps us achieve our mission of giving back and making a real impact.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : causes && causes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {causes.map((cause) => (
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
                No causes available at the moment
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
