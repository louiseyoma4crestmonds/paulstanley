import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
}

export default function Events() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 px-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Upcoming Events</h1>
            <p className="text-lg md:text-xl leading-relaxed text-primary-foreground/90">
              Join us for exclusive events, live performances, and special gatherings. 
              Be part of unforgettable experiences and connect with the community.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {events.map((event) => (
                  <EventCard 
                    key={event.id} 
                    id={String(event.id)}
                    title={event.title}
                    date={event.date}
                    location={event.location}
                    image={event.image}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No events available at the moment
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
