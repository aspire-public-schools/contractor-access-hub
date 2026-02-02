import { Link } from "react-router-dom";
import { UserPlus, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const actions = [
  {
    to: "/onboard",
    label: "Onboard Contractor",
    description: "Add a new contractor and assign access",
    icon: UserPlus,
  },
  {
    to: "/contractors",
    label: "View Contractors",
    description: "Manage contractor list and details",
    icon: Users,
  },
  {
    to: "/systems",
    label: "Systems & Access",
    description: "View access records and request tickets",
    icon: Shield,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Quick actions</h3>
        <p className="text-muted-foreground text-sm">
          Common tasks and shortcuts
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button key={action.to} variant="outline" size="sm" asChild>
              <Link to={action.to} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
