# FlowCRM — Local Development Guide

## Environment Setup

### 1. Prerequisites
- Java 21 JDK installed (`java -version`)
- Node.js 18+ & npm installed (`node -v`)
- Docker Desktop or Docker engine running (`docker --version`)

### 2. Launch PostgreSQL & Redis
Run from project root:
```bash
docker-compose up -d postgres redis
```

---

## Running Backend (Spring Boot 3)

```bash
cd backend
./mvnw clean spring-boot:run
```

- Open Swagger UI: `http://localhost:8080/swagger-ui.html`
- Health check: `http://localhost:8080/actuator/health`

---

## Running Frontend (Angular Standalone SPA)

```bash
cd frontend
npm install
npm start
```

- Web App: `http://localhost:4200`
