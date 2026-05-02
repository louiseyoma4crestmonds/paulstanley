import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react";

interface CauseCardProps {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
}

export default function CauseCard({ id, title, description, goal, raised, image }: CauseCardProps) {
  const percentage = (raised / goal) * 100;

  return (
    <Card className="overflow-hidden hover-elevate transition-all" data-testid={`card-cause-${id}`}>
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Raised</span>
            <span className="font-semibold">${raised.toLocaleString()} of ${goal.toLocaleString()}</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" data-testid={`button-donate-${id}`}>
          <Heart className="mr-2 h-4 w-4" />
          Donate Now
        </Button>
      </CardFooter>
    </Card>
  );
}
