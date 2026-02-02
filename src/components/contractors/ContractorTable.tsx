import { useMemo, useState } from "react";
import type { Contractor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreHorizontal, Eye, UserMinus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContractorDetailModal } from "./ContractorDetailModal";
import { DeactivateDialog } from "./DeactivateDialog";

const statusVariant: Record<Contractor["status"], "success" | "secondary" | "destructive" | "warning"> = {
  active: "success",
  pending: "secondary",
  inactive: "destructive",
  expiring: "warning",
};

export function ContractorTable({
  contractors,
  onDeactivate,
}: {
  contractors: Contractor[];
  onDeactivate: (id: string, name: string, reasonId: string, notes?: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Contractor["status"] | "">("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [deactivateName, setDeactivateName] = useState("");

  const filtered = useMemo(() => {
    let list = contractors;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((c) => c.status === statusFilter);
    }
    return list;
  }, [contractors, search, statusFilter]);

  const openDeactivate = (id: string, name: string) => {
    setDeactivateId(id);
    setDeactivateName(name);
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contractors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter((e.target.value || "") as Contractor["status"] | "")}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expiring">Expiring</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Contract</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">
                  {c.firstName} {c.lastName}
                </TableCell>
                <TableCell>{c.company}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {c.email}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {c.contractStart} – {c.contractEnd}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDetailId(c.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      {(c.status === "active" || c.status === "expiring") && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            openDeactivate(c.id, `${c.firstName} ${c.lastName}`)
                          }
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filtered.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          No contractors match your filters.
        </p>
      )}

      <ContractorDetailModal
        contractorId={detailId}
        onClose={() => setDetailId(null)}
        onDeactivate={(id, name) => {
          setDetailId(null);
          openDeactivate(id, name);
        }}
      />

      <DeactivateDialog
        open={!!deactivateId}
        contractorId={deactivateId}
        contractorName={deactivateName}
        onClose={() => {
          setDeactivateId(null);
          setDeactivateName("");
        }}
        onConfirm={(id, name, reasonId, notes) => {
          onDeactivate(id, name, reasonId, notes);
        }}
      />
    </>
  );
}
