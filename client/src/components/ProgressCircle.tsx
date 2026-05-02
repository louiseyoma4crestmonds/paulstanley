import { CheckCircle2, Circle } from "lucide-react";

interface ProgressCircleProps {
  progress: number;
  requirements: {
    id: string;
    label: string;
    completed: boolean;
  }[];
}

export default function ProgressCircle({ progress, requirements }: ProgressCircleProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-64 h-64">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="hsl(var(--primary))"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold">{progress}%</span>
          <span className="text-sm text-muted-foreground mt-2">Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        {requirements.map((req) => (
          <div
            key={req.id}
            className="flex items-center gap-3 p-4 rounded-lg bg-card border"
            data-testid={`requirement-${req.id}`}
          >
            {req.completed ? (
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            )}
            <span className={`text-sm ${req.completed ? "text-foreground" : "text-muted-foreground"}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
