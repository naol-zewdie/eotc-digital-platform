# ADR 0001: Modular Monolith and Stack Selection

## Status
Accepted

## Context
The Ethiopian Orthodox Tewahedo Church Digital Platform serves millions of followers, researchers, and churches globally. The platform requires high relational data integrity, multilingual support (Amharic, Ge'ez, English), content governance with provenance tracking, digital library capabilities, and a responsive mobile-first experience.

## Decision
1. **Architecture Style**: Modular Monolith over microservices to minimize operational complexity while preserving clear bounded contexts.
2. **Frontend**: Next.js (App Router, Server Components, Tailwind CSS, shadcn/ui, next-intl).
3. **Backend**: NestJS REST API with modular architecture, strict dependency injection, and guards.
4. **Database & ORM**: PostgreSQL with Prisma ORM and Full-Text Search.
5. **Storage**: S3-compatible object storage (MinIO locally, S3 in production).
6. **Delivery**: Nginx reverse proxy with Docker Compose.

## Consequences
- Fast developer velocity with a unified TypeScript codebase.
- Clear module boundaries allow future service extraction if justified by telemetry.
- No microservice operational overhead for V1.
