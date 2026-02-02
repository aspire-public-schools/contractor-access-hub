import type {
  Contractor,
  Employee,
  Site,
  TechSystem,
  ActivityItem,
  DeactivationReason,
} from "@/types";

export const mockEmployees: Employee[] = [
  { id: "e1", name: "Sarah Chen", email: "sarah.chen@company.com", department: "Operations", title: "Operations Manager" },
  { id: "e2", name: "James Wilson", email: "james.wilson@company.com", department: "IT", title: "IT Director" },
  { id: "e3", name: "Maria Garcia", email: "maria.garcia@company.com", department: "Facilities", title: "Facilities Lead" },
  { id: "e4", name: "David Kim", email: "david.kim@company.com", department: "Security", title: "Security Manager" },
  { id: "e5", name: "Emily Brown", email: "emily.brown@company.com", department: "HR", title: "HR Coordinator" },
];

export const mockSites: Site[] = [
  { id: "s1", name: "HQ Building A", address: "123 Main St, City", type: "Office" },
  { id: "s2", name: "Warehouse North", address: "456 Industrial Pkwy", type: "Warehouse" },
  { id: "s3", name: "Data Center East", address: "789 Tech Blvd", type: "Data Center" },
  { id: "s4", name: "Retail Store 01", address: "100 Commerce Dr", type: "Retail" },
];

export const mockTechSystems: TechSystem[] = [
  { id: "sys1", name: "Workday", description: "HR and payroll system", category: "HR", accessLevels: ["View", "Edit", "Admin"] },
  { id: "sys2", name: "ServiceNow", description: "IT service management", category: "IT", accessLevels: ["User", "Agent", "Admin"] },
  { id: "sys3", name: "Badge System", description: "Physical access control", category: "Security", accessLevels: ["Basic", "Extended"] },
  { id: "sys4", name: "SharePoint", description: "Document collaboration", category: "Collaboration", accessLevels: ["Read", "Contribute", "Full Control"] },
  { id: "sys5", name: "Zendesk", description: "Support ticket system", category: "Support", accessLevels: ["Agent", "Admin"] },
];

const employeesById = Object.fromEntries(mockEmployees.map((e) => [e.id, e]));
const sitesById = Object.fromEntries(mockSites.map((s) => [s.id, s]));
const systemsById = Object.fromEntries(mockTechSystems.map((s) => [s.id, s]));

export const mockContractors: Contractor[] = [
  {
    id: "c1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@contractor.com",
    phone: "+1 555-0101",
    company: "ABC Services",
    contractStart: "2024-01-15",
    contractEnd: "2025-01-14",
    status: "active",
    supervisorId: "e1",
    supervisor: employeesById["e1"],
    siteAssignments: [
      { id: "sa1", contractorId: "c1", siteId: "s1", site: mockSites[0], assignedAt: "2024-01-20", assignedBy: "e1" },
    ],
    systemAccess: [
      { id: "ar1", contractorId: "c1", systemId: "sys1", system: mockTechSystems[0], accessLevel: "View", grantedAt: "2024-01-22", grantedBy: "e2", status: "active" },
      { id: "ar2", contractorId: "c1", systemId: "sys3", system: mockTechSystems[2], accessLevel: "Basic", grantedAt: "2024-01-22", grantedBy: "e4", status: "active" },
    ],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-06-01T12:00:00Z",
  },
  {
    id: "c2",
    firstName: "Lisa",
    lastName: "Johnson",
    email: "lisa.j@vendor.com",
    phone: "+1 555-0102",
    company: "Vendor Co",
    contractStart: "2024-03-01",
    contractEnd: "2025-02-28",
    status: "active",
    supervisorId: "e2",
    supervisor: employeesById["e2"],
    siteAssignments: [
      { id: "sa2", contractorId: "c2", siteId: "s3", site: mockSites[2], assignedAt: "2024-03-05", assignedBy: "e2" },
    ],
    systemAccess: [
      { id: "ar3", contractorId: "c2", systemId: "sys2", system: mockTechSystems[1], accessLevel: "User", grantedAt: "2024-03-06", grantedBy: "e2", status: "active" },
      { id: "ar4", contractorId: "c2", systemId: "sys4", system: mockTechSystems[3], accessLevel: "Read", grantedAt: "2024-03-06", grantedBy: "e2", status: "active" },
    ],
    createdAt: "2024-02-20T09:00:00Z",
    updatedAt: "2024-05-15T14:00:00Z",
  },
  {
    id: "c3",
    firstName: "Michael",
    lastName: "Davis",
    email: "m.davis@temp.com",
    phone: "+1 555-0103",
    company: "Temp Staff Inc",
    contractStart: "2024-06-01",
    contractEnd: "2024-12-31",
    status: "expiring",
    supervisorId: "e1",
    supervisor: employeesById["e1"],
    siteAssignments: [
      { id: "sa3", contractorId: "c3", siteId: "s1", site: mockSites[0], assignedAt: "2024-06-05", assignedBy: "e1" },
      { id: "sa4", contractorId: "c3", siteId: "s2", site: mockSites[1], assignedAt: "2024-06-05", assignedBy: "e1" },
    ],
    systemAccess: [
      { id: "ar5", contractorId: "c3", systemId: "sys3", system: mockTechSystems[2], accessLevel: "Basic", grantedAt: "2024-06-06", grantedBy: "e4", status: "active" },
    ],
    createdAt: "2024-05-25T11:00:00Z",
    updatedAt: "2024-09-01T08:00:00Z",
  },
  {
    id: "c4",
    firstName: "Anna",
    lastName: "Martinez",
    email: "anna.m@newcontractor.com",
    phone: "+1 555-0104",
    company: "New Contractor LLC",
    contractStart: "2024-10-01",
    contractEnd: "2025-09-30",
    status: "pending",
    supervisorId: "e3",
    supervisor: employeesById["e3"],
    siteAssignments: [],
    systemAccess: [],
    createdAt: "2024-09-20T14:00:00Z",
    updatedAt: "2024-09-20T14:00:00Z",
  },
  {
    id: "c5",
    firstName: "Robert",
    lastName: "Lee",
    email: "r.lee@former.com",
    phone: "+1 555-0105",
    company: "Former Vendor",
    contractStart: "2023-06-01",
    contractEnd: "2024-05-31",
    status: "inactive",
    supervisorId: "e1",
    supervisor: employeesById["e1"],
    siteAssignments: [],
    systemAccess: [],
    createdAt: "2023-05-15T09:00:00Z",
    updatedAt: "2024-06-01T16:00:00Z",
  },
];

export const mockActivities: ActivityItem[] = [
  { id: "a1", type: "onboard", title: "Contractor onboarded", description: "Anna Martinez added to the system", contractorId: "c4", contractorName: "Anna Martinez", timestamp: "2024-09-20T14:00:00Z" },
  { id: "a2", type: "access_request", title: "Access request submitted", description: "John Smith requested ServiceNow access", contractorId: "c1", contractorName: "John Smith", timestamp: "2024-09-18T11:30:00Z" },
  { id: "a3", type: "site_assignment", title: "Site assignment updated", description: "Michael Davis assigned to Warehouse North", contractorId: "c3", contractorName: "Michael Davis", timestamp: "2024-09-15T09:00:00Z" },
  { id: "a4", type: "deactivate", title: "Contractor deactivated", description: "Robert Lee offboarded - contract ended", contractorId: "c5", contractorName: "Robert Lee", timestamp: "2024-06-01T16:00:00Z" },
  { id: "a5", type: "contract_update", title: "Contract dates updated", description: "Lisa Johnson contract extended", contractorId: "c2", contractorName: "Lisa Johnson", timestamp: "2024-05-15T14:00:00Z" },
];

export const deactivationReasons: DeactivationReason[] = [
  { id: "reason1", label: "Contract ended", description: "Contract term completed" },
  { id: "reason2", label: "Early termination", description: "Contract terminated before end date" },
  { id: "reason3", label: "No longer required", description: "Work scope no longer needed" },
  { id: "reason4", label: "Compliance / policy", description: "Policy or compliance related" },
  { id: "reason5", label: "Other", description: "Other reason" },
];

export { employeesById, sitesById, systemsById };
