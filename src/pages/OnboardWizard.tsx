import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/store/useStore";
import { EmployeeCombobox } from "@/components/EmployeeCombobox";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, User, UserCheck, MapPin, Shield, FileCheck } from "lucide-react";

const step1Schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Required"),
  company: z.string().min(1, "Required"),
  contractStart: z.string().min(1, "Required"),
  contractEnd: z.string().min(1, "Required"),
});

type Step1Values = z.infer<typeof step1Schema>;

const steps = [
  { id: "info", label: "Contractor info", icon: User },
  { id: "supervisor", label: "Supervisor", icon: UserCheck },
  { id: "sites", label: "Site assignments", icon: MapPin },
  { id: "access", label: "System access", icon: Shield },
  { id: "review", label: "Review", icon: FileCheck },
];

export function OnboardWizard() {
  const navigate = useNavigate();
  const { employees, sites, techSystems, addContractor } = useStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [supervisorId, setSupervisorId] = useState<string | null>(null);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
  const [selectedSystems, setSelectedSystems] = useState<{ systemId: string; accessLevel: string }[]>([]);

  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      contractStart: "",
      contractEnd: "",
    },
  });

  const step1Valid = form.formState.isValid;
  const canNextStep1 = step1Valid;
  const canNextStep2 = !!supervisorId;
  const currentStepId = steps[stepIndex].id;

  const toggleSite = (siteId: string) => {
    setSelectedSiteIds((prev) =>
      prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
    );
  };

  const setSystemAccess = (systemId: string, accessLevel: string) => {
    setSelectedSystems((prev) => {
      const rest = prev.filter((s) => s.systemId !== systemId);
      if (!accessLevel || accessLevel === "_none") return rest;
      return [...rest, { systemId, accessLevel }];
    });
  };

  const getSystemLevel = (systemId: string) =>
    selectedSystems.find((s) => s.systemId === systemId)?.accessLevel ?? "_none";

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const handleSubmit = () => {
    const values = form.getValues();
    if (!supervisorId) return;
    addContractor({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      company: values.company,
      contractStart: values.contractStart,
      contractEnd: values.contractEnd,
      status: "active",
      supervisorId,
      siteAssignments: selectedSiteIds.map((siteId) => ({ siteId })),
      systemAccess: selectedSystems.map(({ systemId, accessLevel }) => ({ systemId, accessLevel })),
    });
    navigate("/contractors");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Onboard contractor</h1>
        <p className="text-muted-foreground">
          Multi-step form to add a new contractor and assign access
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = i === stepIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStepIndex(i)}
              className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {s.label}
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[stepIndex].label}</CardTitle>
          <CardDescription>
            {currentStepId === "info" && "Enter contractor contact and contract details."}
            {currentStepId === "supervisor" && "Assign a supervising employee."}
            {currentStepId === "sites" && "Select sites this contractor will access."}
            {currentStepId === "access" && "Request system access and levels."}
            {currentStepId === "review" && "Confirm and submit."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStepId === "info" && (
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(handleNext)}>
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" {...form.register("firstName")} />
                {form.formState.errors.firstName && (
                  <p className="text-destructive text-sm">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" {...form.register("lastName")} />
                {form.formState.errors.lastName && (
                  <p className="text-destructive text-sm">{form.formState.errors.lastName.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-destructive text-sm">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" {...form.register("company")} />
                {form.formState.errors.company && (
                  <p className="text-destructive text-sm">{form.formState.errors.company.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractStart">Contract start</Label>
                <Input id="contractStart" type="date" {...form.register("contractStart")} />
                {form.formState.errors.contractStart && (
                  <p className="text-destructive text-sm">{form.formState.errors.contractStart.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractEnd">Contract end</Label>
                <Input id="contractEnd" type="date" {...form.register("contractEnd")} />
                {form.formState.errors.contractEnd && (
                  <p className="text-destructive text-sm">{form.formState.errors.contractEnd.message}</p>
                )}
              </div>
            </form>
          )}

          {currentStepId === "supervisor" && (
            <div className="space-y-2">
              <Label>Supervisor</Label>
              <EmployeeCombobox
                employees={employees}
                value={supervisorId}
                onValueChange={(id) => setSupervisorId(id)}
                placeholder="Select supervisor..."
              />
            </div>
          )}

          {currentStepId === "sites" && (
            <div className="space-y-2">
              <Label>Site assignments</Label>
              <div className="flex flex-col gap-2 rounded-md border p-4">
                {sites.map((site) => (
                  <label
                    key={site.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={selectedSiteIds.includes(site.id)}
                      onCheckedChange={() => toggleSite(site.id)}
                    />
                    <div>
                      <p className="font-medium">{site.name}</p>
                      <p className="text-muted-foreground text-sm">{site.address} · {site.type}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStepId === "access" && (
            <div className="space-y-2">
              <Label>System access</Label>
              <div className="flex flex-col gap-3 rounded-md border p-4">
                {techSystems.map((sys) => (
                  <div
                    key={sys.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">{sys.name}</p>
                      <p className="text-muted-foreground text-sm">{sys.description}</p>
                    </div>
                    <Select
                      value={getSystemLevel(sys.id)}
                      onValueChange={(v) => setSystemAccess(sys.id, v)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="No access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">No access</SelectItem>
                        {sys.accessLevels.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStepId === "review" && (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-muted-foreground">Contractor</h4>
                <p className="font-medium">
                  {form.watch("firstName")} {form.watch("lastName")} · {form.watch("company")}
                </p>
                <p>{form.watch("email")} · {form.watch("phone")}</p>
                <p>Contract: {form.watch("contractStart")} – {form.watch("contractEnd")}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">Supervisor</h4>
                <p>{employees.find((e) => e.id === supervisorId)?.name ?? "—"}</p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">Sites</h4>
                <p>
                  {selectedSiteIds.length
                    ? sites.filter((s) => selectedSiteIds.includes(s.id)).map((s) => s.name).join(", ")
                    : "None"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground">System access</h4>
                <p>
                  {selectedSystems.length
                    ? selectedSystems
                        .map(
                          (s) =>
                            `${techSystems.find((t) => t.id === s.systemId)?.name ?? s.systemId} (${s.accessLevel})`
                        )
                        .join(", ")
                    : "None"}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={stepIndex === 0 ? () => navigate(-1) : handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {currentStepId !== "review" ? (
              <Button
                type="button"
                onClick={() => {
                  if (currentStepId === "info") form.handleSubmit(handleNext)();
                  else handleNext();
                }}
                disabled={
                  (currentStepId === "info" && !canNextStep1) ||
                  (currentStepId === "supervisor" && !canNextStep2)
                }
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
