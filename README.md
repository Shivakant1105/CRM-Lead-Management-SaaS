# FlowCRM — Multi-Tenant Enterprise CRM / ERP SaaS Platform

FlowCRM is a commercial-grade, multi-tenant enterprise CRM / ERP SaaS platform designed for high performance, modern user experience, strict multi-tenant data isolation, fine-grained RBAC, and modular business workflows.

![FlowCRM System Architecture](docs/flowcrm-architecture-diagram.png)

---

## 🌟 Key Features & Capabilities

- **Modern Architecture**: Spring Boot 3 (Java 21) REST API backend with modular architecture, PostgreSQL, Flyway migrations, Redis, and Angular SPA frontend.
- **Strict Multi-Tenancy**: ThreadLocal `TenantContext` isolation on all backend data requests preventing cross-tenant data access.
- **Secure Authentication & RBAC**: JWT access tokens + HttpOnly refresh cookies, password hashing (BCrypt), and granular role/permission matrix (`SUPER_ADMIN`, `TENANT_ADMIN`, `SALES_MANAGER`, `SALES_EXECUTIVE`, `ACCOUNTANT`).
- **Premium Design System & Theme Engine**: Dual theme engine (☀ Light, 🌙 Dark, System) with CSS design tokens, soft neutral surfaces, deep indigo (`#4F46E5`) primary branding, electric violet (`#7C3AED`) accents, smooth 250ms transitions.
- **Productivity UX Shell**: Collapsible smart sidebar (250px / 72px), workspace switcher, global search, `Ctrl + K` Command Palette, Quick Create menu, Toast system, Modals, Drawers, Skeleton shimmer loaders, and responsive mobile drawer.
- **Sales Workflow**: Lead Management (`LD-000001`), Follow-up Intelligence & Drag-and-Drop Calendar, Sales Pipeline Kanban Board, Opportunity Tracking (`OPP-000001`), Customer 360 (`CUS-000001`), and Multi-Step Lead Conversion.
- **Docker Infrastructure**: Containerized orchestration for Spring Boot, Angular Nginx Gateway, PostgreSQL 16, and Redis 7.

---

## 📂 Repository Structure

```text
flowcrm/
├── backend/                      # Java 21 Spring Boot Monolith REST API
│   ├── src/main/java/com/flowcrm/
│   │   ├── auth/                 # Authentication & JWT endpoints
│   │   ├── config/               # Security, Redis, CORS, OpenAPI configs
│   │   ├── tenant/               # Multi-tenant context, resolution & settings
│   │   ├── user/                 # User & RBAC management
│   │   ├── common/               # ApiResponse, Exception Handling, Audit
│   │   └── health/               # Actuator & dependency health checks
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/         # Flyway schema V1 & V2 seed data
├── frontend/                     # Angular SPA Standalone Application
│   ├── src/app/
│   │   ├── core/                 # Auth, ThemeService, Interceptors, Guards, API
│   │   ├── layout/               # Header, Smart Sidebar, Shell Layout
│   │   ├── shared/ui/            # FlowCRM Design System UI Components
│   │   └── features/             # Auth, Onboarding, Dashboard, Settings, Profile
│   └── src/styles.css            # Light & Dark Theme CSS Variables & Design Tokens
├── infrastructure/               # Nginx reverse proxy gateway config
├── docs/                         # Architecture, Security, Database, API docs
├── docker-compose.yml            # Docker orchestration
├── .env.example                  # Environment variable configuration template
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Java 21 JDK** & **Maven 3.9+**
- **Node.js 18+** & **npm 10+**
- **Docker** & **Docker Compose**
- **PostgreSQL 16** (or run via Docker)
- **Redis 7** (or run via Docker)

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Start Database & Redis via Docker
```bash
docker-compose up -d postgres redis
```

### 3. Run Backend (Spring Boot API)
```bash
cd backend
./mvnw spring-boot:run
```
The REST API will be live at `http://localhost:8080/api/v1`
OpenAPI / Swagger UI: `http://localhost:8080/swagger-ui.html`

### 4. Run Frontend (Angular SPA)
```bash
cd frontend
npm install
npm start
```
The web application will be accessible at `http://localhost:4200`

---

## 🔐 Seed Credentials (Demo Data)

| Role | Email | Password | Tenant |
|---|---|---|---|
| **Tenant Admin** | `demo.admin@flowcrm.local` | `Password123!` | FlowCRM Demo |
| **Sales Manager** | `sales.manager@flowcrm.local` | `Password123!` | FlowCRM Demo |
| **Sales Executive** | `sales.executive@flowcrm.local` | `Password123!` | FlowCRM Demo |
| **Accountant** | `accountant@flowcrm.local` | `Password123!` | FlowCRM Demo |

---

## 📖 Documentation
- [Architecture Blueprint](docs/architecture.md)
- [Security & Token Strategy](docs/security.md)
- [Database Schema & ERD](docs/database.md)
- [API Reference](docs/api.md)
- [Local Development Guide](docs/local-development.md)

---

## 📄 License
This project is proprietary software built for enterprise SaaS deployment. All rights reserved.
