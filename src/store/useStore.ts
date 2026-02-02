import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type {
  Contractor,
  Employee,
  Site,
  TechSystem,
  ActivityItem,
  ZendeskTicket,
} from "@/types";
import {
  mockContractors,
  mockEmployees,
  mockSites,
  mockTechSystems,
  mockActivities,
  employeesById,
  sitesById,
  systemsById,
} from "@/data/mock";

function enrichContractor(c: Contractor): Contractor {
  return {
    ...c,
    supervisor: c.supervisorId ? employeesById[c.supervisorId] ?? c.supervisor : undefined,
    siteAssignments: (c.siteAssignments ?? []).map((sa) => ({
      ...sa,
      site: sitesById[sa.siteId] ?? sa.site,
    })),
    systemAccess: (c.systemAccess ?? []).map((ar) => ({
      ...ar,
      system: systemsById[ar.systemId] ?? ar.system,
    })),
  };
}

interface AppState {
  contractors: Contractor[];
  employees: Employee[];
  sites: Site[];
  techSystems: TechSystem[];
  activities: ActivityItem[];
  zendeskTickets: ZendeskTicket[];
}

export type NewContractorPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  contractStart: string;
  contractEnd: string;
  status: Contractor["status"];
  supervisorId: string;
  siteAssignments: { siteId: string }[];
  systemAccess: { systemId: string; accessLevel: string }[];
};

interface AppActions {
  addContractor: (c: NewContractorPayload) => void;
  updateContractor: (id: string, updates: Partial<Contractor>) => void;
  deactivateContractor: (id: string, reasonId: string, notes?: string, contractorName?: string) => void;
  addActivity: (activity: Omit<ActivityItem, "id">) => void;
  createZendeskTickets: (contractorId: string, systemIds: string[]) => ZendeskTicket[];
  getContractor: (id: string) => Contractor | undefined;
  getEmployee: (id: string) => Employee | undefined;
  getSite: (id: string) => Site | undefined;
  getTechSystem: (id: string) => TechSystem | undefined;
}

type StoreContextValue = AppState & AppActions;

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [contractors, setContractors] = useState<Contractor[]>(() =>
    mockContractors.map(enrichContractor)
  );
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [zendeskTickets, setZendeskTickets] = useState<ZendeskTicket[]>([]);
  const employees = mockEmployees;
  const sites = mockSites;
  const techSystems = mockTechSystems;

  const addContractor = useCallback((payload: NewContractorPayload) => {
    const id = `c${Date.now()}`;
    const now = new Date().toISOString();
    const dateOnly = now.slice(0, 10);
    const supervisor = employees.find((e) => e.id === payload.supervisorId);
    const contractor: Contractor = {
      ...payload,
      id,
      createdAt: now,
      updatedAt: now,
      supervisor,
      siteAssignments: (payload.siteAssignments ?? []).map((sa, i) => ({
        id: `sa${id}-${i}`,
        contractorId: id,
        siteId: sa.siteId,
        site: sites.find((s) => s.id === sa.siteId)!,
        assignedAt: dateOnly,
        assignedBy: undefined,
      })),
      systemAccess: (payload.systemAccess ?? []).map((ar, i) => ({
        id: `ar${id}-${i}`,
        contractorId: id,
        systemId: ar.systemId,
        system: techSystems.find((s) => s.id === ar.systemId)!,
        accessLevel: ar.accessLevel,
        grantedAt: dateOnly,
        grantedBy: undefined,
        status: "active" as const,
      })),
    };
    setContractors((prev) => [...prev, enrichContractor(contractor)]);
    setActivities((prev) => [
      {
        id: `a${Date.now()}`,
        type: "onboard",
        title: "Contractor onboarded",
        description: `${contractor.firstName} ${contractor.lastName} added to the system`,
        contractorId: contractor.id,
        contractorName: `${contractor.firstName} ${contractor.lastName}`,
        timestamp: now,
      },
      ...prev,
    ]);
  }, [employees, sites, techSystems]);

  const updateContractor = useCallback((id: string, updates: Partial<Contractor>) => {
    const now = new Date().toISOString();
    setContractors((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const supervisor =
          updates.supervisorId !== undefined
            ? employees.find((e) => e.id === updates.supervisorId)
            : c.supervisor;
        return enrichContractor({ ...c, ...updates, updatedAt: now, supervisor });
      })
    );
  }, [employees]);

  const deactivateContractor = useCallback(
    (id: string, _reasonId: string, notes?: string, contractorName?: string) => {
      const now = new Date().toISOString();
      setContractors((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: "inactive" as const,
                updatedAt: now,
                siteAssignments: [],
                systemAccess: [],
              }
            : c
        )
      );
      const c = contractors.find((x) => x.id === id);
      const name = contractorName ?? (c ? `${c.firstName} ${c.lastName}` : undefined);
      setActivities((prev) => [
        {
          id: `a${Date.now()}`,
          type: "deactivate",
          title: "Contractor deactivated",
          description: name
            ? `${name} offboarded${notes ? ` - ${notes}` : ""}`
            : "Contractor offboarded",
          contractorId: id,
          contractorName: name,
          timestamp: now,
        },
        ...prev,
      ]);
    },
    [contractors]
  );

  const addActivity = useCallback((activity: Omit<ActivityItem, "id">) => {
    setActivities((prev) => [{ ...activity, id: `a${Date.now()}` }, ...prev]);
  }, []);

  const createZendeskTickets = useCallback(
    (contractorId: string, systemIds: string[]): ZendeskTicket[] => {
      const contractor = contractors.find((c) => c.id === contractorId);
      const name = contractor ? `${contractor.firstName} ${contractor.lastName}` : "Unknown";
      const now = new Date().toISOString();
      const parentId = `zd-${Date.now()}`;
      const parent: ZendeskTicket = {
        id: parentId,
        type: "parent",
        contractorId,
        contractorName: name,
        subject: `Access request: ${name}`,
        description: `Contractor access request for ${name}. Child tickets created per system.`,
        status: "open",
        createdAt: now,
      };
      const children: ZendeskTicket[] = systemIds.map((systemId, i) => {
        const system = techSystems.find((s) => s.id === systemId);
        return {
          id: `${parentId}-child-${i}`,
          type: "child",
          parentId,
          contractorId,
          contractorName: name,
          systemId,
          systemName: system?.name ?? systemId,
          subject: `Access: ${system?.name ?? systemId}`,
          description: `Request access to ${system?.name ?? systemId} for ${name}.`,
          status: "open" as const,
          createdAt: now,
        };
      });
      const all = [parent, ...children];
      setZendeskTickets((prev) => [...prev, ...all]);
      addActivity({
        type: "access_request",
        title: "Access request tickets created",
        description: `Zendesk tickets created for ${name} (${systemIds.length} system(s))`,
        contractorId,
        contractorName: name,
        timestamp: now,
      });
      return all;
    },
    [contractors, techSystems, addActivity]
  );

  const getContractor = useCallback((id: string) => contractors.find((c) => c.id === id), [contractors]);
  const getEmployee = useCallback((id: string) => employees.find((e) => e.id === id), [employees]);
  const getSite = useCallback((id: string) => sites.find((s) => s.id === id), [sites]);
  const getTechSystem = useCallback((id: string) => techSystems.find((s) => s.id === id), [techSystems]);

  const value = useMemo<StoreContextValue>(
    () => ({
      contractors,
      employees,
      sites,
      techSystems,
      activities,
      zendeskTickets,
      addContractor,
      updateContractor,
      deactivateContractor,
      addActivity,
      createZendeskTickets,
      getContractor,
      getEmployee,
      getSite,
      getTechSystem,
    }),
    [
      contractors,
      activities,
      zendeskTickets,
      addContractor,
      updateContractor,
      deactivateContractor,
      addActivity,
      createZendeskTickets,
      getContractor,
      getEmployee,
      getSite,
      getTechSystem,
    ]
  );

  return React.createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
