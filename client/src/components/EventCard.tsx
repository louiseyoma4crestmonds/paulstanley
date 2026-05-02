import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  ticketUrl?: string;
}

export default function EventCard({ id, title, date, location, image, ticketUrl }: EventCardProps) {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const eventDate = new Date(date);
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        setCountdown(`${days}d ${hours}h`);
      } else {
        setCountdown("Event Started");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [date]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all" data-testid={`card-event-${id}`}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm">
          <Clock className="mr-1 h-3 w-3" />
          {countdown}
        </Badge>
      </div>
      <CardHeader>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" data-testid={`button-ticket-${id}`}>
          Get Tickets
        </Button>
      </CardFooter>
    </Card>
  );
}
