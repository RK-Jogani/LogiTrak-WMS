# LogiTrack WMS — Enterprise Cloud-Native SaaS Warehouse Management Platform

[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-ef4444?style=for-the-badge&logo=turborepo)](https://turbo.build/)
[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016%20(App%20Router)-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/UI-React%2019-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node & Express](https://img.shields.io/badge/Backend-Express.js%20%2B%20TypeScript-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Docker Compose](https://img.shields.io/badge/DevOps-Docker%20Compose-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 Executive Summary & SaaS Core Proposition

**LogiTrack WMS** is an enterprise-grade **Software-as-a-Service (SaaS) multi-tenant warehouse and supply chain management platform** engineered for 3PL (Third-Party Logistics) providers, fulfillment centers, and eCommerce distributors.

### 🏢 Why LogiTrack WMS is a True SaaS Platform:
1. **Multi-Tenant Data Isolation**: Complete tenant data segregation across companies (`Company` context) at the PostgreSQL database schema and Express API middleware layers.
2. **Dynamic Subscription Quotas**: Automated resource throttling based on subscription tiers (`STARTER`, `PROFESSIONAL`, `ENTERPRISE`), enforcing strict caps on maximum warehouses and user seats.
3. **Dedicated SaaS Super Admin Control Plane**: Platform administration dashboard (`/saas-admin`) allowing the platform owner to oversee tenant health, modify plan limits in real time, monitor Monthly Recurring Revenue (MRR), and analyze platform-wide metrics.
4. **End-to-End Logistics Lifecycle**: Unified operational execution covering receiving, barcode slotting, wave picking, packing, shipping dispatch, reverse logistics (returns & automated restock), CRM, and 3PL billing with general ledger reconciliation.

---

## 👥 Academic Evaluation & Team Information

| Criteria | Details |
|---|---|
| **Course / Assessment** | Software Engineering Project / Capstone Evaluation |
| **Total Marks** | **30 Marks** |
| **Grading Distribution** | **20 Marks** (Coding Quality + SaaS Architecture & Idea) + **10 Marks** (Documentation & Technical Completeness) |
| **Group Size** | **3 Members** |

### 👨‍💻 Project Team Members & Roles

| # | Student Name | Student ID / Roll No | Assigned Project Role | Core Technical Contributions |
|:---:|:---|:---:|:---|:---|
| **1** | **Ramesh Kumar** | `B22110006133` | **Database & Backend Lead** | Prisma ORM schema design (16 relational models), PostgreSQL multi-tenant architecture, Express REST routes, database migrations, and seed automation. |
| **2** | **Preet Kumar** | `B22110006131` | **Backend & Frontend Lead** | API integration, JWT & RBAC authentication middleware, SaaS Super Admin panel, state management (Zustand & Context API), and Turborepo monorepo setup. |
| **3** | **Malaika Qazi** | `B22110006073` | **UI/UX & Frontend Lead** | Next.js 16 App Router UI, Tailwind CSS v4 design system, interactive warehouse dashboards, responsive drawers/modals, and internationalization (i18n). |

---

## 🎯 Scoring Rubric Mapping (Target: 30 / 30 Marks)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   LOGITRAK-WMS EVALUATION BREAKDOWN                      │
├──────────────────────────────────────┬───────────────────────────────────┤
│ CODING + IDEA: 20 MARKS              │ DOCUMENTATION: 10 MARKS           │
├──────────────────────────────────────┼───────────────────────────────────┤
│ • SaaS Multi-Tenant Architecture     │ • Complete Architecture Diagrams  │
│ • Monorepo Turborepo Structure       │ • Prisma Database ERD Breakdown   │
│ • Prisma ORM & PostgreSQL Database   │ • Full RESTful API Specification  │
│ • Express TypeScript API Services    │ • Step-by-Step Run Commands       │
│ • Role-Based Access Control (RBAC)   │ • RBAC Role & Permissions Matrix  │
│ • Reverse Logistics & Auto-Restock   │ • Pre-Seeded Demo Credentials     │
│ • Next.js 16 + React 19 Frontend     │ • Component & Module Catalog      │
│ • Accounting Ledger & 3PL Billing    │ • DOCUMENT.md for PDF Submission  │
└──────────────────────────────────────┴───────────────────────────────────┘
```

---

## 🏗️ System Architecture

LogiTrack WMS follows a modern distributed monorepo architecture leveraging **Turborepo**, cleanly separating client presentation from backend business logic and database persistence.

```mermaid
graph TB
    subgraph "Client Layer (apps/web - Next.js 16 + React 19)"
        UI["Tailwind CSS v4 + Responsive UI"]
        AuthStore["Auth Context (JWT + Local Persistence)"]
        i18n["Language Store (EN / DE / ES / FR)"]
        Pages["App Router Dashboard Pages<br/>(SaaS Admin, Inventory, Orders, Picking, Packing, Shipping, Returns, CRM, Accounting)"]
    end

    subgraph "Network & API Gateway"
        CORS["CORS & Request Logging"]
        AuthMW["authMiddleware (JWT Verification)"]
        RBAC["rbacMiddleware (Role Validation)"]
    end

    subgraph "Backend Application (apps/api - Express + TypeScript)"
        Router["Express Modular Routers"]
        SaaSRoute["/api/saas (Tenant Management & Quotas)"]
        OrderRoute["/api/orders (Order Lifecycle)"]
        InvRoute["/api/inventory (Inventory & Stock)"]
        ReturnRoute["/api/returns (Reverse Logistics & Restock)"]
        AcctRoute["/api/accounting (General Ledger & Summary)"]
        CRMRoute["/api/crm (Customer CRM)"]
        LogRoute["/api/logs (Audit Trail Logging)"]
    end

    subgraph "Data & Persistence Layer"
        Prisma["Prisma ORM Client (Data Access Layer)"]
        Postgres[(PostgreSQL 16 Engine)]
        Redis[(Redis 7 Cache / Queues)]
    end

    UI --> AuthMW
    Pages --> AuthMW
    AuthMW --> RBAC
    RBAC --> Router
    Router --> SaaSRoute & OrderRoute & InvRoute & ReturnRoute & AcctRoute & CRMRoute & LogRoute
    SaaSRoute & OrderRoute & InvRoute & ReturnRoute & AcctRoute & CRMRoute & LogRoute --> Prisma
    Prisma --> Postgres
```

---

## 🏢 Multi-Tenant SaaS Architecture & Isolation

In LogiTrack WMS, multi-tenancy is enforced by design:
1. **Tenant Identification**: Every organization is represented as a `Company` record with a unique `id`.
2. **Tenant Scoping**: All tenant-owned models (`User`, `Warehouse`, `Product`, `Order`, `Customer`, `Transaction`, `AuditLog`, `Subscription`) contain a mandatory `companyId` foreign key.
3. **JWT Token Scoping**: Upon authentication, the signed JWT payload encapsulates `{ id, email, role, companyId }`.
4. **Backend Authorization**: Incoming requests extract `req.user.companyId` to guarantee that queries never leak data across tenants:
   ```typescript
   // Example of tenant-scoped query in apps/api:
   const orders = await prisma.order.findMany({
     where: { companyId: req.user.companyId }
   });
   ```
5. **Subscription Tier Enforcement**: The `Subscription` model dictates resource caps per tenant:

| Subscription Tier | Max Warehouses | Max User Accounts | Features Included |
|---|:---:|:---:|---|
| **STARTER** | 1 Warehouse | Up to 5 Users | Core Inventory, Basic Order Processing |
| **PROFESSIONAL** | 3 Warehouses | Up to 15 Users | Wave Picking, Returns Management, CRM |
| **ENTERPRISE** | 10+ Warehouses | Unlimited / 50+ | Full 3PL Billing, Custom Zones, Accounting, Audit Logs |

---

## 🗄️ Database Entity-Relationship Diagram (Prisma Schema)

```mermaid
erDiagram
    Company ||--o{ User : "employs"
    Company ||--o{ Warehouse : "operates"
    Company ||--o{ Product : "catalogues"
    Company ||--o{ Customer : "manages"
    Company ||--o{ Transaction : "records"
    Company ||--o{ AuditLog : "logs"
    Company ||--o{ Subscription : "subscribes"
    Company ||--o{ BillingRule : "defines"
    Company ||--o{ Invoice : "issues"

    Warehouse ||--o{ Zone : "contains"
    Zone ||--o{ Location : "subdivides"
    Location ||--o{ InventoryItem : "stores"
    Product ||--o{ InventoryItem : "stocked_as"
    Product ||--o{ OrderLine : "requested_in"
    Product ||--o{ ReturnLine : "returned_in"

    Order ||--o{ OrderLine : "contains"
    Order ||--o{ Shipment : "fulfilled_by"
    Order ||--o{ ReturnOrder : "originates"

    ReturnOrder ||--o{ ReturnLine : "items"

    Company {
        string id PK
        string legalName
        string taxId
        string locale
        datetime createdAt
    }

    Subscription {
        string id PK
        string tier
        string status
        int maxWarehouses
        int maxUsers
        string companyId FK
    }

    User {
        string id PK
        string email UK
        string firstName
        string lastName
        string role
        string status
        string companyId FK
    }

    Warehouse {
        string id PK
        string name
        string address
        string companyId FK
    }

    Zone {
        string id PK
        string name
        string template
        string warehouseId FK
    }

    Location {
        string id PK
        string barcode UK
        int capacity
        int currentFill
        string status
        string zoneId FK
    }

    Product {
        string id PK
        string sku UK
        string name
        string category
        float weight
        string companyId FK
    }

    InventoryItem {
        string id PK
        int quantity
        string status
        string productId FK
        string locationId FK
    }

    Order {
        string id PK
        string orderNumber UK
        string channel
        string customer
        string status
        string companyId FK
    }

    ReturnOrder {
        string id PK
        string returnNumber UK
        string orderId FK
        string status
        string inspectionNotes
    }

    Transaction {
        string id PK
        string type
        float amount
        string category
        string description
        string companyId FK
    }

    AuditLog {
        string id PK
        string action
        string entity
        string details
        string companyId FK
    }
```

---

## 🔐 Role-Based Access Control (RBAC) Matrix

LogiTrack WMS implements strict granular roles defined in the Prisma schema:

| Module / Feature | SAAS_SUPER_ADMIN | ADMIN | MANAGER | SUPERVISOR | OPERATOR | ACCOUNTANT | READ_ONLY |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **SaaS Platform Admin (`/saas-admin`)** | ✅ Full | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Tenant Subscription Limits** | ✅ Full | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Company & Warehouse Config** | ✅ View | ✅ Full | ✅ Edit | ❌ | ❌ | ❌ | ❌ |
| **User Onboarding & Roles** | ✅ Platform | ✅ Company | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Inventory & Transfers** | ✅ View | ✅ Full | ✅ Full | ✅ Full | ✅ Update | ❌ | ✅ View |
| **Order Processing & Wave Picking** | ✅ View | ✅ Full | ✅ Full | ✅ Full | ✅ Execute | ❌ | ✅ View |
| **Packing & Shipping Labels** | ✅ View | ✅ Full | ✅ Full | ✅ Full | ✅ Execute | ❌ | ✅ View |
| **Returns & Restock Inspection** | ✅ View | ✅ Full | ✅ Full | ✅ Inspect | ❌ | ❌ | ✅ View |
| **CRM Customer Management** | ✅ View | ✅ Full | ✅ Full | ❌ | ❌ | ❌ | ✅ View |
| **General Ledger & Accounting** | ✅ View | ✅ Full | ❌ | ❌ | ❌ | ✅ Full | ❌ |
| **Audit Logs & Security Trails** | ✅ All | ✅ Company | ✅ Company | ❌ | ❌ | ❌ | ❌ |

---

## ⚡ Complete Terminal Commands Guide

Follow these exact commands to set up, migrate, seed, and run LogiTrack WMS.

### 1. Prerequisites Check
Ensure you have Node.js (v20+), pnpm (v9+), and Docker installed:
```bash
node -v
pnpm -v
docker compose version
```

### 2. Install Project Dependencies
Run from the root directory:
```bash
pnpm install
```

### 3. Setup Environment Variables
```bash
# Copy example environment file for the API backend
cp .env.example apps/api/.env
```

Ensure `apps/api/.env` contains:
```env
DATABASE_URL="postgresql://logitrack:logitrack_pass@localhost:5433/logitrack_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
API_PORT=5000
API_URL="http://localhost:5000"
CORS_ORIGIN="http://localhost:3000"
```

### 4. Start PostgreSQL & Redis Containers
```bash
# Start containers in detached mode
docker compose up -d

# Verify container status (Postgres port 5433, Redis port 6379)
docker compose ps
```

### 5. Apply Database Migrations & Seed Sample Data
```bash
# Push schema migrations to PostgreSQL
pnpm db:migrate

# Seed demo tenant company, warehouses, products, orders, returns & accounts
pnpm db:seed
```

### 6. Run Full Monorepo Development Environment
```bash
# Start both Next.js frontend (port 3000) and Express API (port 5000) concurrently:
pnpm dev
```

Alternatively, run apps individually in separate terminals:
```bash
# Terminal 1: Next.js Frontend
pnpm dev:web

# Terminal 2: Express Backend
pnpm dev:api
```

### 7. Useful Operational Commands
```bash
# Open visual database browser (Prisma Studio)
pnpm db:studio

# Run linting across workspace
pnpm lint

# Build production bundles
pnpm build

# Stop Docker containers
docker compose down
```

---

## 🔑 Pre-Seeded Demo Accounts & Credentials

All accounts share the uniform demo password: **`admin123`**

| Role | Email | Password | Primary Module Access |
|---|---|:---:|---|
| **SaaS Super Admin** | `super@logitrack.com` | `admin123` | Multi-tenant control plane (`/saas-admin`), subscription tier quotas, platform metrics. |
| **Tenant Admin** | `admin@logitrack.com` | `admin123` | Full tenant management (`/dashboard`), warehouse layout, user admin, financial ledger. |
| **Warehouse Manager** | `j.smith@logitrack.com` | `admin123` | Operational supervision, order wave releases, CRM client management, inventory audits. |
| **Warehouse Supervisor** | `m.davis@logitrack.com` | `admin123` | Zone 4 supervision, returns inspection, picking & packing stations. |
| **Floor Operator** | `b.williams@logitrack.com` | `admin123` | Warehouse execution, barcode scanning, order picking, packing verification. |

---

## 🌐 Complete RESTful API Catalog

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Authorization | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns signed JWT with tenant `companyId` and `role`. |
| `POST` | `/api/auth/register` | Admin | Registers a new team user under the tenant company. |
| `GET` | `/api/health` | Public | System health check and server timestamp. |
| `GET` | `/api/saas/tenants` | `SAAS_SUPER_ADMIN` | Lists all registered tenant companies with subscription plans and usage counts. |
| `PUT` | `/api/saas/tenants/:id/subscription` | `SAAS_SUPER_ADMIN` | Updates tenant subscription tier, status, max warehouses, and max users. |
| `GET` | `/api/saas/metrics` | `SAAS_SUPER_ADMIN` | Returns platform-wide KPI metrics (tenant count, user count, tier distribution). |
| `GET` | `/api/warehouses` | Authenticated | Lists all warehouses with zone counts and location capacities for the tenant. |
| `GET` | `/api/warehouses/:id` | Authenticated | Retrieves specific warehouse layout, zones, and barcode locations. |
| `GET` | `/api/inventory` | Authenticated | Returns paginated stock items with product joins and location details. |
| `GET` | `/api/orders` | Authenticated | Retrieves paginated orders filtered by tenant company and order status. |
| `GET` | `/api/orders/:id` | Authenticated | Fetches full order detail including order lines and tracking information. |
| `GET` | `/api/returns` | Authenticated | Lists all logged return orders and returned item line inspections. |
| `POST` | `/api/returns` | Authenticated | Lodges a new return RMA request for an existing order. |
| `POST` | `/api/returns/:id/inspect` | Authenticated | Inspects return lines and **automatically replenishes inventory** if marked `RESTOCKED`. |
| `GET` | `/api/accounting` | Authenticated | Fetches ledger transactions for the tenant company. |
| `GET` | `/api/accounting/summary` | Authenticated | Computes total income, expenses, taxes, and net profit. |
| `POST` | `/api/accounting` | Authenticated | Records manual financial entry and triggers audit log event. |
| `GET` | `/api/crm` | Authenticated | Retrieves customer and lead directory for the tenant. |
| `POST` | `/api/crm` | Authenticated | Creates a new customer account or prospective client. |
| `PUT` | `/api/crm/:id` | Authenticated | Updates customer status and contact information. |
| `GET` | `/api/logs` | Authenticated | Returns paginated immutable audit logs for compliance tracking. |

---

## 📑 Accompanying Project Documents
- **`DOCUMENT.md`**: Complete narrative project report designed for exporting to PDF. Includes comprehensive operational scenarios, technical challenges faced and solved, sprint breakdown, and software engineering reflections.

---

## 📄 License & Academic Integrity
Developed for academic capstone project evaluation under the guidelines of Software Engineering standards.
Licensed under the [MIT License](LICENSE).
