# FlowCRM — Database Schema & Migration Guide

## PostgreSQL Flyway Schema

FlowCRM relies on Flyway for version-controlled database migrations.

### Initial Migration (`V1__initial_schema.sql`)
The initial schema defines core tenant, user, RBAC, session, and company settings tables:

```text
  ┌──────────────┐          ┌──────────────┐          ┌──────────────────┐
  │   tenants    │◄─────────┤    users     ├─────────►│ company_settings │
  └──────┬───────┘          └──────┬───────┘          └──────────────────┘
         │                         │
         │                  ┌──────┴──────┐
         │                  │ user_roles  │
         │                  └──────┬──────┘
         │                         │
         │                  ┌──────┴──────┐
         │                  │    roles    │
         │                  └──────┬──────┘
         │                         │
         │                  ┌──────┴──────────┐
         │                  │role_permissions │
         │                  └──────┬──────────┘
         │                         │
         ▼                         ▼
  ┌──────────────┐          ┌──────────────┐
  │ audit_logs   │          │ permissions  │
  └──────────────┘          └──────────────┘
```

---

## Table Structures

### `tenants`
- `id` (BIGSERIAL PRIMARY KEY)
- `public_id` (UUID UNIQUE)
- `name` (VARCHAR 100)
- `slug` (VARCHAR 100 UNIQUE)
- `logo_url`, `industry`, `email`, `phone`, `website`
- `address`, `city`, `state`, `country`, `postal_code`, `tax_number`
- `currency` (VARCHAR 10 DEFAULT 'INR'), `timezone` (VARCHAR 50 DEFAULT 'Asia/Kolkata')
- `status` (VARCHAR 20 DEFAULT 'ACTIVE')
- `created_at`, `updated_at`, `deleted_at`

### `users`
- `id` (BIGSERIAL PRIMARY KEY)
- `public_id` (UUID UNIQUE)
- `tenant_id` (BIGINT REFERENCES tenants(id))
- `first_name`, `last_name`, `email`, `password_hash`, `phone`, `avatar_url`
- `status` (VARCHAR 20 DEFAULT 'ACTIVE'), `email_verified` (BOOLEAN)
- `last_login_at`, `created_at`, `updated_at`, `deleted_at`
- **Constraint**: `UNIQUE(tenant_id, email)`
