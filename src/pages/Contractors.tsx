import { useStore } from "@/store/useStore";
import { ContractorTable } from "@/components/contractors/ContractorTable";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function Contractors() {
  const { contractors, deactivateContractor } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contractors</h1>
          <p className="text-muted-foreground">
            Search, filter, and manage contractor records
          </p>
        </div>
        <Button asChild>
          <Link to="/onboard" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Onboard contractor
          </Link>
        </Button>
      </div>
      <ContractorTable
        contractors={contractors}
        onDeactivate={(id, name, reasonId, notes) =>
          deactivateContractor(id, reasonId, notes, name)
        }
      />
    </div>
  );
}
