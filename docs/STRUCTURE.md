# Folder Structure

A guided tour of the repository layout. For how the pieces work together (data fetching, auth, state) see [architecture.md](architecture.md).

## Top level

| Path | What it is |
|---|---|
| `src/` | All application code (alias `@/*` → `src/*`) |
| `public/` | Static assets served from `/`: images, badges, GIFs, and JSON data (`public/data/countries*.json`) |
| `docs/` | Project documentation |
| `.claude/` | Claude Code project settings |
| `CLAUDE.md` | Guidance for Claude Code |
| `next.config.ts` | Next.js config (remote images, server action body limit) |
| `components.json` | shadcn/ui generator config |
| `Dockerfile`, `docker-compose.yml` | Container build/run (pnpm, Node 22) |
| `.env` | Environment variables (read only via `src/config/index.ts`) |
| `pnpm-lock.yaml`, `pnpm-workspace.yaml` | pnpm lockfile and build-script allowlist (authoritative; `package-lock.json` also exists) |

## `src/app` — routes

Next.js App Router. Folders in parentheses are **route groups**: they organise code but do not appear in the URL.

| Group | URLs | Contents |
|---|---|---|
| `(auth)` | `/sign-in`, `/sign-up/[role]`, `/verify-otp`, `/forget-password`, `/set-new-password`, `/auth-finish` | Authentication flows |
| `(public)` | `/shop`, `/member/[username]`, `/checkout/*`, `/blogs`, `/help`, `/favourites`, `/shopping-cart`, `/notifications`, `/sell`, `/all-charities`, `/order-tracking`, policy and about pages | Storefront and shopping |
| `(profile)` | `/profile/*` | Logged-in dashboard: `sell`, `purchase`, `earnings`, `donation`, `donation-contribution`, `assisted-sell`, `address`, `badges`, `vacation-mode`, `edit`, `change-password` |
| `(private)` | `/inbox`, `/assisted-seller` | Chat and assisted-seller area |

Root files: `layout.tsx` (global providers, navbar, footer), `page.tsx` (home), `error.tsx`, `not-found.tsx`, `globals.css` (Tailwind v4 config and theme).

Each route may contain a `_components/` folder (underscore = not a route) holding components used only by that page. A few older pages use `components/` instead.

## `src/components`

| Folder | Purpose |
|---|---|
| `ui/` | shadcn/ui primitives (button, dialog, select, table, …). Generated; extend rather than rewrite. |
| `shared/` | Components used across several pages: `Navbar`, `Footer`, `Cards`, `Modal`, `Pagination`, `Message`, `FormatCurrency`, `SetRates`, … |
| `modules/home/` | Sections that make up the home page (hero, new arrivals, trending, feedbacks, …) |
| `skeletons/` | Loading placeholders |
| `animatedArrows/` | Small animated arrow components |

Rule of thumb: used by one page → that page's `_components/`; used by several → `shared/`; shadcn primitive → `ui/`.

## `src/lib` — server logic and constants

| Path | Purpose |
|---|---|
| `services/` | Server-side GET helpers called from server components |
| `Actions/` | `"use server"` mutations (`*.action.ts`) and `ReAuthRequest.ts`, the shared server fetch wrapper |
| `provider/Providers.tsx` | Redux provider, persistence gate, tooltip provider |
| `userRole.ts`, `profileRoutes.ts`, `authRoutes.ts`, `NavLinks.ts`, `navigation-data.ts` | Roles and route/navigation definitions |
| `brandsData.ts`, `categoryData.ts`, `colorData.ts`, `conditionData.ts`, `materialData.ts`, `sizeData.ts`, `sortByData.ts`, … | Static option lists for filters and forms |
| `utils.ts`, `getErrorMessage.ts` | Helpers (`cn`, error message extraction) |

## `src/redux` — client state

| Path | Purpose |
|---|---|
| `store.ts` | Store setup; `auth` and `rate` are persisted to localStorage |
| `api/` | RTK Query endpoints per feature, injected into `baseApi.ts` |
| `features/` | Slices: `authSlice`, `cart.slice`, `rateSlice` |
| `tagTypes.ts` | Registry of RTK Query cache tags |
| `hooks.ts` | Typed `useAppDispatch` / `useAppSelector` |

## Other `src` folders

| Path | Purpose |
|---|---|
| `Context/` | `SocketProvider` (Socket.IO connection, `useSocket()`) |
| `hooks/` | Reusable hooks: `useCurrency`, `useUpdateSearchParams`, `useLazyLoad`, … |
| `utils/` | Pure helpers: `serverTags.ts` (Next cache tags), text/enum formatters, role mappers |
| `types/` | Shared TypeScript types (`IUser`, `UserRole`, …) |
| `config/` | `EnvConfig`, the single place env vars are read |
| `animations/` | Framer Motion variants and animated text |
| `assets/` | Images and icons imported by components (`banner`, `icons`, `images`, `sizes`) |
| `icons/` | Custom SVG icon components |
| `data/` | Dummy/sample data |
| `firebase.init.ts` | Firebase initialisation |
| `middleware.ts` | Redirects unauthenticated users away from protected routes |

## Where to put new code

- New page → folder under the matching route group in `src/app`; add it to the middleware `matcher` if it needs login.
- Page-only component → that page's `_components/`.
- Server data read → `src/lib/services/`; mutation → `src/lib/Actions/<feature>.action.ts`.
- Browser-side API call → new file in `src/redux/api/` (register any new cache tag in `tagTypes.ts`).
- Static dropdown values → `src/lib/<name>Data.ts`.
