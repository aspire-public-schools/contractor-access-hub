import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket, Shield, FileText } from "lucide-react";
import type { ZendeskTicket as ZTicket } from "@/types";

export function Systems() {
  const {
    contractors,
    techSystems,
    zendeskTickets,
    createZendeskTickets,
  } = useStore();
  const [selectedContractorId, setSelectedContractorId] = useState<string | null>(null);
  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([]);

  const activeContractors = contractors.filter(
    (c) => c.status === "active" || c.status === "expiring"
  );

  const handleCreateTickets = () => {
    if (!selectedContractorId || selectedSystemIds.length === 0) return;
    createZendeskTickets(selectedContractorId, selectedSystemIds);
  };

  const toggleSystem = (systemId: string) => {
    setSelectedSystemIds((prev) =>
      prev.includes(systemId)
        ? prev.filter((id) => id !== systemId)
        : [...prev, systemId]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Systems & Access</h1>
        <p className="text-muted-foreground">
          View contractor system access and create Zendesk tickets for access requests
        </p>
      </div>

      <Tabs defaultValue="access" className="space-y-4">
        <TabsList>
          <TabsTrigger value="access" className="gap-2">
            <Shield className="h-4 w-4" />
            Access records
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <Ticket className="h-4 w-4" />
            Zendesk tickets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contractor system access</CardTitle>
              <CardDescription>
                Read-only view of contractor system access. Use the tickets tab to request new access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Systems</TableHead>
                      <TableHead>Access level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contractors
                      .filter((c) => c.systemAccess?.length)
                      .map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">
                            {c.firstName} {c.lastName}
                          </TableCell>
                          <TableCell>{c.company}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {c.systemAccess.map((ar) => (
                                <Badge key={ar.id} variant="secondary">
                                  {ar.system.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {c.systemAccess.map((ar) => ar.accessLevel).join(", ")}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              {contractors.every((c) => !c.systemAccess?.length) && (
                <p className="text-muted-foreground text-center py-6">
                  No system access records yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Zendesk tickets</CardTitle>
              <CardDescription>
                Parent ticket for the contractor and child tickets per system requested (parent-child structure).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contractor</label>
                  <Select
                    value={selectedContractorId ?? ""}
                    onValueChange={(v) => setSelectedContractorId(v || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contractor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activeContractors.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.firstName} {c.lastName} · {c.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Systems to request</label>
                  <div className="flex flex-wrap gap-2 rounded-md border p-3">
                    {techSystems.map((sys) => (
                      <label
                        key={sys.id}
                        className="flex cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm hover:bg-muted/50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSystemIds.includes(sys.id)}
                          onChange={() => toggleSystem(sys.id)}
                          className="rounded"
                        />
                        {sys.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCreateTickets}
                disabled={!selectedContractorId || selectedSystemIds.length === 0}
              >
                <Ticket className="mr-2 h-4 w-4" />
                Create parent + child tickets
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated tickets</CardTitle>
              <CardDescription>
                Parent ticket for contractor, child tickets per system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {zendeskTickets.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">
                  No tickets created yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {zendeskTickets.map((t) => (
                    <TicketRow key={t.id} ticket={t} />
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TicketRow({ ticket }: { ticket: ZTicket }) {
  const isChild = ticket.type === "child";
  return (
    <li
      className={`flex items-start gap-3 rounded-lg border p-3 ${
        isChild ? "ml-6 border-l-2 border-l-primary/30" : "bg-muted/30"
      }`}
    >
      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm">{ticket.subject}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{ticket.description}</p>
        <div className="mt-2 flex items-center gap-2 text-muted-foreground text-xs">
          <Badge variant={ticket.type === "parent" ? "default" : "secondary"}>
            {ticket.type}
          </Badge>
          <span>{ticket.contractorName}</span>
          {ticket.systemName && <span>· {ticket.systemName}</span>}
          <span>{new Date(ticket.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <Badge variant="outline">{ticket.status}</Badge>
    </li>
  );
}
