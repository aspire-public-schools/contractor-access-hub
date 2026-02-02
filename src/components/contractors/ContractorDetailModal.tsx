import type { Contractor } from "@/types";
import { useStore } from "@/store/useStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserMinus, Mail, Phone, Building2, Calendar, MapPin, Shield } from "lucide-react";

const statusVariant: Record<Contractor["status"], "success" | "secondary" | "destructive" | "warning"> = {
  active: "success",
  pending: "secondary",
  inactive: "destructive",
  expiring: "warning",
};

interface ContractorDetailModalProps {
  contractorId: string | null;
  onClose: () => void;
  onDeactivate: (id: string, name: string) => void;
}

export function ContractorDetailModal({
  contractorId,
  onClose,
  onDeactivate,
}: ContractorDetailModalProps) {
  const { getContractor } = useStore();
  const contractor = contractorId ? getContractor(contractorId) : null;

  if (!contractor) return null;

  const fullName = `${contractor.firstName} ${contractor.lastName}`;
  const canDeactivate =
    contractor.status === "active" || contractor.status === "expiring";

  return (
    <Dialog open={!!contractorId} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-lg" showClose={true}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {fullName}
            <Badge variant={statusVariant[contractor.status]}>{contractor.status}</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${contractor.email}`} className="text-foreground hover:underline">
                {contractor.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              {contractor.phone}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {contractor.company}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Contract: {contractor.contractStart} – {contractor.contractEnd}
            </div>
            {contractor.supervisor && (
              <div className="text-muted-foreground">
                Supervisor: {contractor.supervisor.name} ({contractor.supervisor.department})
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Site assignments
            </h4>
            {contractor.siteAssignments?.length ? (
              <ul className="space-y-1 text-sm">
                {contractor.siteAssignments.map((sa) => (
                  <li key={sa.id} className="text-muted-foreground">
                    {sa.site.name} — {sa.site.type}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">None</p>
            )}
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <Shield className="h-4 w-4" />
              System access
            </h4>
            {contractor.systemAccess?.length ? (
              <ul className="space-y-1 text-sm">
                {contractor.systemAccess.map((ar) => (
                  <li key={ar.id} className="text-muted-foreground flex justify-between">
                    <span>{ar.system.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {ar.accessLevel}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">None</p>
            )}
          </div>

          {canDeactivate && (
            <div className="pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDeactivate(contractor.id, fullName)}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Deactivate contractor
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
