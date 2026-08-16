# FlowCRM — Architectural Blueprint

## System Overview

FlowCRM is built as a modular Spring Boot 3 monolith backend paired with a standalone Angular SPA frontend, designed with multi-tenancy, clean architecture, and commercial production readiness.

```text
┌─────────────────────────────────────────────────────────────┐
│                     Angular SPA Frontend                    │
│    Theme Engine ── Standalone Components ── RxJS ── UI Shell │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON / Cookies
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Nginx                      │
│            Reverse Proxy & TLS Termination                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / HttpOnly JWT
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Spring Boot REST Backend                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Security Filter Chain & JWT Auth Filter                 │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ TenantContext Filter (ThreadLocal Multi-Tenant Isolation)│ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ RBAC Authorization Annotations (@PreAuthorize)          │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Business Controllers & Services (Auth, User, Tenant)    │ │
│ └────────────────────────────┬────────────────────────────┘ │
└──────────────────────────────┼──────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
     PostgreSQL DB        Redis Cache        AWS S3 Storage
  (Multi-tenant Schema) (Tokens/Sessions)  (Documents/Files)
```

---

## Multi-Tenancy Architecture

FlowCRM implements Discriminator-based Multi-Tenancy with ThreadLocal Context Resolution:

1. **Context Resolution**: Every request passing through `TenantContextFilter` extracts the `tenant_id` claim from the validated JWT token (or `X-Tenant-ID` header during public onboarding).
2. **Context Holder**: `TenantContext.getCurrentTenant()` retains the tenant context for the duration of the thread.
3. **Repository Data Isolation**: All database queries explicitly filter by `tenant_id`. Cross-tenant record reads, updates, or deletes are strictly blocked at the repository/service layer.

---

## Modular Backend Structure

```text
com.flowcrm
├── auth/           # Login, Register, Refresh, Logout, JWT generation
├── tenant/         # Tenant entity, onboarding, settings, ThreadLocal context
├── user/           # User entity, RBAC Roles, Permissions
├── config/         # Spring Security, CORS, Redis, OpenAPI configuration
├── common/         # Global Exception Handler, ApiResponse envelope, Audit log
└── health/         # Actuator health indicators
```

---

## Angular SPA Frontend Architecture

```text
src/app/
├── core/           # AuthService, ThemeService, AuthInterceptor, AuthGuard, RoleGuard
├── layout/         # Header, Smart Collapsible Sidebar, Workspace Switcher, Shell
├── shared/ui/      # Button, Input, Card, Modal, Drawer, Toast, Skeleton, CommandPalette
└── features/       # Auth (Login/Register), Dashboard, Settings, Profile, ComingSoon
```
