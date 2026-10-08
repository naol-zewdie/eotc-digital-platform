# Ethiopian Orthodox Tewahedo Digital Platform
[![CI Pipeline](https://github.com/eotc-platform/eotc-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/eotc-platform/eotc-platform/actions)

> **Production-oriented system design for a free digital religious, cultural, and church-service platform.**
> Architecture Version 1.0 (October 2026)

---

## 1. High-Level Architecture
- **System Style**: Modular Monolith, API-first, Cloud/VPS deployable.
- **Frontend (`apps/web`)**: Next.js 14+ (App Router, Tailwind CSS, Server Components, Tri-lingual support: Amharic `am`, Ge'ez `gez`, English `en`).
- **Backend (`apps/api`)**: NestJS (REST API, prefix `/api/v1`, modular architecture, strict authorization guards, structured JSON logging).
- **Database & Search**: PostgreSQL 16 + Prisma ORM + PostgreSQL Full-Text Search with Trigram indexes.
- **Storage**: S3-compatible object storage (MinIO for development, AWS S3/Cloudflare R2 in production).
- **Reverse Proxy**: Nginx with rate limiting and security headers.

---

## 2. Monorepo Organization
```
eotc-digital-platform/
├─ apps/
│  ├─ web/                  # Next.js public portal + /admin console
│  └─ api/                  # NestJS modular monolith REST API
├─ packages/
│  ├─ contracts/            # Shared DTOs, Enums, API Error Contract (Appendix B)
│  ├─ config/               # Base tsconfig and lint rules
│  └─ eslint-config/        # Shared ESLint configuration
├─ infrastructure/
│  ├─ docker/               # Multi-stage Dockerfiles for API & Web
│  ├─ nginx/                # Reverse proxy and rate limiting configuration
│  ├─ backup/               # PostgreSQL automated backup scripts
│  └─ deploy/               # Deployment scripts and recipes
├─ docs/
│  ├─ architecture/         # System diagrams and technical specifications
│  ├─ api/                  # OpenAPI / Swagger and endpoint specifications
│  ├─ operations/           # Runbooks and telemetry guides
│  └─ adr/                  # Architecture Decision Records
├─ .github/workflows/       # Automated CI workflow
├─ docker-compose.yml       # Orchestration for PostgreSQL, MinIO, API & Web
└─ README.md
```

---

## 3. Getting Started

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- Docker & Docker Compose (optional for local container orchestration)

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd EOTC

# Install dependencies across all monorepo workspaces
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Starting the Infrastructure Services (Docker)
```bash
# Starts PostgreSQL (5432) and MinIO (9000/9001)
docker compose up -d postgres minio
```

### Running the API & Web Apps Locally
```bash
# Generate Prisma Client
npm run prisma:generate

# Start NestJS API (runs on port 4000)
npm run dev:api

# In a separate terminal, start Next.js Web (runs on port 3000)
npm run dev:web
```

---

## 4. API Endpoints (Version 1)
- `GET /api/v1/health` - System health check, database ping & telemetry
- `GET /api/v1/books` - Public digital library catalog
- `GET /api/v1/churches` - Verified church directory & monasteries
- `GET /api/v1/mezmur` - Mezmur catalog & hymns
- `GET /api/v1/articles` - Theological articles & news
- `GET /api/v1/events` - Ecclesiastical calendar & feast days
- `GET /api/v1/search?q=` - Global cross-domain full-text search

---

## 5. Content Governance & Publishing Rules (Section 14)
All publishable content strictly traverses the publication state machine:
`DRAFT` ➔ `IN_REVIEW` ➔ `APPROVED` ➔ `PUBLISHED` ➔ `ARCHIVED`
- Creator cannot approve their own submission (Separation of duties).
- Every record is linked to a valid `RightsRecord` with explicit provenance.
