import type { ActivityItem } from "@/types";
import {
  UserPlus,
  UserMinus,
  Ticket,
  MapPin,
  FileText,
  LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const typeConfig: Record<
  ActivityItem["type"],
  { icon: LucideIcon; label: string; color: string }
> = {
  onboard: { icon: UserPlus, label: "Onboarded", color: "text-emerald-600 bg-emerald-50" },
  deactivate: { icon: UserMinus, label: "Deactivated", color: "text-red-600 bg-red-50" },
  access_request: { icon: Ticket, label: "Access request", color: "text-blue-600 bg-blue-50" },
  site_assignment: { icon: MapPin, label: "Site assignment", color: "text-amber-600 bg-amber-50" },
  contract_update: { icon: FileText, label: "Contract update", color: "text-slate-600 bg-slate-100" },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays === 0) {
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  const list = activities.slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Recent activity</h3>
        <p className="text-muted-foreground text-sm">
          Latest contractor and access events
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {list.map((item) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;
            return (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    config.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-muted-foreground text-xs truncate">
                    {item.description}
                  </p>
                  {item.contractorName && (
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {item.contractorName}
                    </p>
                  )}
                </div>
                <span className="text-muted-foreground text-xs shrink-0 whitespace-nowrap">
                  {formatTime(item.timestamp)}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
