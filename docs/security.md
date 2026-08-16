# FlowCRM — Security & Token Architecture

## Token Strategy & Security Decisions

FlowCRM employs a secure, industry-standard dual-token strategy to prevent token theft and XSS vulnerabilities:

### 1. Short-Lived Access Token
- **Lifetime**: 15 minutes.
- **Storage**: In-memory inside Angular `AuthService` state (never written to `localStorage` or `sessionStorage`).
- **Transport**: Transmitted in the `Authorization: Bearer <access_token>` HTTP header for authenticated API calls.
- **Payload**: Contains `user_id`, `email`, `tenant_id`, and granted `permissions`.

### 2. HttpOnly Secure Refresh Token Cookie
- **Lifetime**: 7 days.
- **Storage**: Stored in a browser `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
- **Protection**: Accessible exclusively by HTTP requests to `/api/v1/auth/refresh` and `/api/v1/auth/logout`. JavaScript cannot read or steal the refresh token.
- **Rotation & Revocation**: Managed in Redis / Database table `refresh_tokens`. Revoked upon logout or password reset.

---

## Granular Role-Based Access Control (RBAC)

FlowCRM implements a 2-tier authorization framework:

### Roles
- `SUPER_ADMIN`: System-wide platform administrator.
- `TENANT_ADMIN`: Full administrative control over tenant company, users, and configuration.
- `SALES_MANAGER`: Full management of sales team leads, opportunities, and pipeline.
- `SALES_EXECUTIVE`: Access to assigned leads and sales opportunities.
- `ACCOUNTANT`: Access to financial quotations, invoices, and payment tracking.
- `SUPPORT_AGENT`: Customer service and activity logging.
- `VIEWER`: Read-only access to authorized records.

### Granular Permissions Matrix
- `DASHBOARD_VIEW`
- `USER_VIEW`, `USER_CREATE`, `USER_UPDATE`, `USER_DELETE`
- `ROLE_VIEW`, `ROLE_MANAGE`
- `LEAD_VIEW`, `LEAD_CREATE`, `LEAD_UPDATE`, `LEAD_DELETE`
- `CUSTOMER_VIEW`, `CUSTOMER_CREATE`, `CUSTOMER_UPDATE`
- `QUOTATION_VIEW`, `QUOTATION_CREATE`
- `INVOICE_VIEW`, `INVOICE_CREATE`
- `PAYMENT_VIEW`, `PAYMENT_CREATE`
- `REPORT_VIEW`
- `SETTINGS_VIEW`, `SETTINGS_MANAGE`
