# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Fashi-ON (https://fashi-on.com) — frontend for a fashion marketplace (buyers, multiple seller types, charities, assisted selling, offers/negotiation, real-time chat). The backend is a separate Node/Express/Prisma service; this repo only talks to it over REST and Socket.IO.

## Commands

pnpm is the package manager (Dockerfile uses `pnpm install --frozen-lockfile`; `pnpm-workspace.yaml` controls which deps may run build scripts). A `package-lock.json` also exists but `pnpm-lock.yaml` is authoritative.

- `pnpm dev` — dev server on **port 5001**
- `pnpm build` / `pnpm start` — production build / serve (Docker exposes 3000)
- `pnpm lint` — `next lint` (extends `next/core-web-vitals`, `next/typescript`)
- Type-check: `pnpm exec tsc --noEmit`

There is no test suite.

## Stack

Next.js 15 App Router + React 19, TypeScript, Tailwind CSS v4 (config lives in `src/app/globals.css`, no tailwind.config), shadcn/ui ("new-york", components in `src/components/ui`), Redux Toolkit + RTK Query + redux-persist, react-hook-form + zod, sonner toasts, socket.io-client. Path alias `@/*` → `src/*`.

## Environment

Read through `src/config/index.ts` (`EnvConfig`), not `process.env` directly:
- `NEXT_PUBLIC_BASE_URL` — API base for client-side RTK Query
- `SERVER_BASE_API` — API base for server-side fetches (server actions / RSC)
- `NEXT_PUBLIC_SOCKET` — Socket.IO URL
- `NEXT_PUBLIC_CLIENT_BASE_URL`, `SERVER_ROOT`, `NEXT_PUBLIC_MAP_KEY` (Google Maps), `HAS_SSL`, `RATES_API_BASE_URL`

## Architecture and structure

- [docs/architecture.md](docs/architecture.md) — how the app works: routing and middleware, the server-side vs RTK Query data layers, auth and roles, providers and sockets, Redux state, currency handling and configuration. Read it before changing any of those areas.
- [docs/STRUCTURE.md](docs/STRUCTURE.md) — folder-by-folder layout of the repo and where new code should go. Read it before adding pages, components, or API code.

## Notes

- `next.config.ts` allows remote images from any host and sets server action body limit to 500mb (for image uploads via FormData).
- `src/components/ui` is shadcn-generated; prefer extending over rewriting.
