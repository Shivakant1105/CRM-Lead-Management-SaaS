# FlowCRM — REST API Specification

All API endpoints reside under `/api/v1/`.

## Standard API Response Envelope

### Success Response (`ApiResponse<T>`)
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... }
}
```

### Error Response (`ApiResponse<T>`)
```json
{
  "success": false,
  "message": "Invalid email or password.",
  "code": "AUTHENTICATION_FAILED",
  "timestamp": "2026-08-16T20:00:00Z",
  "path": "/api/v1/auth/login",
  "errors": [
    {
      "field": "password",
      "message": "Password is required."
    }
  ]
}
```

---

## Authentication APIs (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Authenticate user & return JWT access token + HttpOnly cookie | No |
| `POST` | `/api/v1/auth/register` | Register tenant & tenant admin user | No |
| `POST` | `/api/v1/auth/refresh` | Refresh access token using HttpOnly cookie | No |
| `POST` | `/api/v1/auth/logout` | Revoke session & clear HttpOnly cookie | Yes |
| `GET` | `/api/v1/auth/me` | Fetch current user & permissions | Yes |
| `POST` | `/api/v1/auth/forgot-password` | Initiate password reset flow | No |
| `POST` | `/api/v1/auth/reset-password` | Reset password using token | No |

---

## User & Profile APIs (`/api/v1/users`)

| Method | Endpoint | Description | Permissions Required |
|---|---|---|---|
| `GET` | `/api/v1/users/me` | Get active user profile | Authenticated |
| `PUT` | `/api/v1/users/me` | Update active user profile | Authenticated |

---

## Settings APIs (`/api/v1/settings`)

| Method | Endpoint | Description | Permissions Required |
|---|---|---|---|
| `GET` | `/api/v1/settings/company` | Get tenant company settings | `SETTINGS_VIEW` |
| `PUT` | `/api/v1/settings/company` | Update tenant company settings | `SETTINGS_MANAGE` |
| `GET` | `/api/v1/settings/users` | List tenant users | `USER_VIEW` |
| `GET` | `/api/v1/settings/roles` | List available RBAC roles | `ROLE_VIEW` |

---

## Health Indicator (`/actuator/health`)

| Method | Endpoint | Description | Response |
|---|---|---|---|
| `GET` | `/actuator/health` | Comprehensive DB & Redis health status | `{"status": "UP"}` |
