import { Users, UserPlus, AlertCircle, Ticket } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export function Dashboard() {
  const { contractors, activities } = useStore();
  const active = contractors.filter((c) => c.status === "active").length;
  const pending = contractors.filter((c) => c.status === "pending").length;
  const expiring = contractors.filter((c) => c.status === "expiring").length;
  const accessRequests = activities.filter((a) => a.type === "access_request").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Contractor access overview and quick actions
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active contractors"
          value={active}
          description="Currently active"
          icon={Users}
        />
        <StatCard
          title="Pending onboarding"
          value={pending}
          description="Awaiting setup"
          icon={UserPlus}
        />
        <StatCard
          title="Expiring contracts"
          value={expiring}
          description="Within 90 days"
          icon={AlertCircle}
        />
        <StatCard
          title="Access requests"
          value={accessRequests}
          description="Recent ticket activity"
          icon={Ticket}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
