# Contractor Access Hub

A React/TypeScript contractor management application with Tailwind CSS and shadcn/ui-style components. It manages contractor lifecycle, site assignments, and system access provisioning.

## Features

- **Dashboard** — Stats (active contractors, pending onboarding, expiring contracts, access requests), recent activity feed, and quick actions
- **Contractor Management** — Searchable/filterable table with status badges; detail modal with contact info, contract dates, site assignments, and system access
- **Onboarding Wizard** — Multi-step form: contractor info → supervisor selection → site assignments → system access → review (with validation and searchable employee combobox)
- **Systems/Access Records** — Read-only view of contractor system access; Zendesk ticket generation (parent ticket per contractor, child tickets per system)
- **Deactivation Flow** — Offboard contractors with reason selection and confirmation

## Tech Stack

- React 18, TypeScript, Vite
- Tailwind CSS v4, shadcn/ui (Radix primitives + Tailwind)
- React Router, React Hook Form + Zod

## Setup

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Project Structure

- `src/components/` — Reusable UI (EmployeeCombobox, ContractorTable, ContractorDetailModal, DeactivateDialog, StatCard, QuickActions, RecentActivity)
- `src/components/layout/` — MainLayout with responsive sidebar
- `src/pages/` — Dashboard, Contractors, OnboardWizard, Systems
- `src/store/` — React Context store (contractors, employees, sites, tech systems, activities, Zendesk tickets)
- `src/types/` — Data model types
- `src/data/` — Mock data

## Data Model

- **Contractors** — Contact info, company, contract dates, status, supervisor (employee ref), site assignments, system access records
- **Employees** — Name, email, department, title
- **Sites** — Name, address, type
- **Tech systems** — Name, description, category, access levels

Design: professional admin interface with semantic color tokens and responsive layout.
