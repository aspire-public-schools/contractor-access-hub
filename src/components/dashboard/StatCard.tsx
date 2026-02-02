import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  className?: string;
  trend?: { value: string; positive?: boolean };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  trend,
}: StatCardProps) {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-muted-foreground text-sm font-medium">
          {title}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-muted-foreground text-xs mt-1">
            {description}
            {trend && (
              <span
                className={cn(
                  "ml-1 font-medium",
                  trend.positive === true
                    ? "text-emerald-600"
                    : trend.positive === false
                      ? "text-amber-600"
                      : "text-muted-foreground"
                )}
              >
                {trend.value}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
