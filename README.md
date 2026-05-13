# K8s Sandbox

K8s Sandbox is a browser-based Kubernetes infrastructure visualization and simulation platform. It parses Kubernetes YAML manifests, projects resources into a visual graph, and runs a local simulation engine for reconciliation, pod lifecycle transitions, service links, traffic flow, and event replay.

This project intentionally does **not** connect to real Kubernetes clusters. There is no `kubectl`, no cluster provisioning, and no real infrastructure execution.

## Stack

- Next.js App Router, React, TypeScript strict mode
- TailwindCSS v4, shadcn/ui-style primitives, next-themes
- Monaco Editor for YAML input
- React Flow for infrastructure visualization
- Zustand for editor, simulation, auth, and UI stores
- Supabase Auth and PostgreSQL-ready repository boundary
- js-yaml and zod for parsing and validation

## Getting Started

```bash
bun install
cp .env.example .env.local
bun run dev
```

Open `http://localhost:3000/dashboard`.

Supabase variables are optional for local starter development. When omitted, the login screen explains the fallback and the dashboard remains accessible for local simulation work.

## Commands

```bash
bun run dev
bun run build
bun run typecheck
bun run lint
bun run format
```

## Architecture

The repository uses feature-based and domain-oriented boundaries:

```text
app/                  App Router routes, loading, error, route handlers
components/           Shared layout and UI primitives
config/               Environment validation
constants/            App-wide constants, navigation, sample manifests
features/             Product domains: auth, manifests, visualization, simulation
hooks/                Shared React hooks
lib/                  Framework integrations and shared library adapters
providers/            App-level React providers
services/             Persistence and external service boundaries
simulation/           Local simulation engine, event bus, reconcilers, resources
stores/               Zustand stores and slices
types/                Shared TypeScript contracts
utils/                Framework-agnostic utilities
public/samples/       Starter Kubernetes manifest examples
```

## Current Starter Features

- Live multi-document YAML parsing
- Typed manifest conversion for Deployments, Pods, and Services
- Deployment replica reconciliation
- Pod scheduling and lifecycle transitions
- Kill pod simulation and controller recreation
- React Flow resource graph with animated service and scheduling edges
- Event bus and timeline panel for replay-ready cluster events
- Protected route middleware and Supabase auth setup
- Vercel-ready Next.js configuration

## Database Boundary

`services/playgrounds/playground-repository.ts` is currently an in-memory starter repository with the same shape expected from a Supabase-backed implementation. Replace the repository internals with Supabase table calls when the schema is introduced.

Suggested `playgrounds` table:

```sql
create table playgrounds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  manifest_yaml text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```
