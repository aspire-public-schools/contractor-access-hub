export type ContractorStatus = "active" | "pending" | "inactive" | "expiring";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  type: string;
}

export interface TechSystem {
  id: string;
  name: string;
  description: string;
  category: string;
  accessLevels: string[];
}

export interface SystemAccessRecord {
  id: string;
  contractorId: string;
  systemId: string;
  system: TechSystem;
  accessLevel: string;
  grantedAt: string;
  grantedBy?: string;
  status: "active" | "revoked" | "pending";
}

export interface SiteAssignment {
  id: string;
  contractorId: string;
  siteId: string;
  site: Site;
  assignedAt: string;
  assignedBy?: string;
}

export interface Contractor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  contractStart: string;
  contractEnd: string;
  status: ContractorStatus;
  supervisorId: string;
  supervisor?: Employee;
  siteAssignments: SiteAssignment[];
  systemAccess: SystemAccessRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  type: "onboard" | "deactivate" | "access_request" | "site_assignment" | "contract_update";
  title: string;
  description: string;
  contractorId?: string;
  contractorName?: string;
  timestamp: string;
}

export interface DeactivationReason {
  id: string;
  label: string;
  description?: string;
}

export interface ZendeskTicket {
  id: string;
  type: "parent" | "child";
  parentId?: string;
  contractorId: string;
  contractorName: string;
  subject: string;
  description: string;
  systemId?: string;
  systemName?: string;
  status: "open" | "pending" | "solved";
  createdAt: string;
}
