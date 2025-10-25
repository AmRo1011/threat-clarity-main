## Quick context for AI coding agents

This is a Vite + React + TypeScript frontend scaffold (shadcn-style UI + Tailwind).
Aim to make small, low-risk, discoverable edits. Keep changes consistent with existing patterns: UI primitives in `src/components/ui`, higher-level features in `src/components`, pages in `src/pages`.

Key facts (quick):
- Build & dev: `npm run dev` (Vite), `npm run build`, `npm run preview`.
- Lint: `npm run lint` (ESLint).
- Path alias: `@/*` -> `./src/*` (see `tsconfig.json`). Use imports like `import { Button } from "@/components/ui/button"`.
- Global helper: `src/lib/utils.ts` exports `cn(...)` (clsx + tailwind-merge). Prefer it for composing Tailwind classes.

Architecture & conventions
- UI primitives: `src/components/ui/*` are small wrappers around Radix and Tailwind (lowercase filenames, e.g. `button.tsx`, `input.tsx`). Use these primitives instead of re-creating base components so styling and accessibility remain consistent.
- Feature components: `src/components/*.tsx` contain higher-level UI (tabs, panels, cards). These use primitives from `src/components/ui`.
- Pages & routing: `src/pages/Index.tsx` and `src/pages/NotFound.tsx` are mounted in `src/App.tsx` using `react-router-dom`. To add routes, update `src/App.tsx` (note the in-file comment: "ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL \"*\" ROUTE").
- API layer: `src/lib/api.ts` exports domain-specific APIs (SystemAPI, AnomaliesAPI, etc.). Each API namespace handles authentication and error handling consistently.
- Hooks layer: `src/hooks/use-*.ts` contain React Query hooks that wrap API calls. Always use these instead of direct API calls (e.g. `useSystemHealth()` instead of `SystemAPI.health()`).
- State & data fetching: `@tanstack/react-query` (QueryClient created in `App.tsx`) is the standard pattern for async data. Key patterns:
  - Queries: `useQuery({ queryKey: ["key", params], queryFn: () => API.fetch() })`
  - Mutations: `useMutation({ mutationFn: (id) => API.update(id), onSuccess: () => queryClient.invalidateQueries() })`
  - Auto-refresh: Use `refetchInterval` for polling (see `SystemHealthPanel.tsx`)

Patterns to follow (concrete examples)
- Use the `cn` helper for conditional class names: `import { cn } from "@/lib/utils"` then `className={cn("px-2", condition && "text-sm")}`.
- Import primitives via the `@/components/ui` path. Example: `import { Toaster } from "@/components/ui/toaster"` (see `src/App.tsx`).
- Keep page-level layout and routing in `src/App.tsx` and `src/pages/*`. Let `src/components` provide reusable building blocks.

Files & locations to inspect first
- Entrypoints: `src/main.tsx`, `src/App.tsx` (routing, providers like QueryClient and TooltipProvider).
- UI primitives: `src/components/ui/*` (Radix wrappers, toasts, tooltips, buttons, inputs).
- Features: `src/components/*.tsx` (AlertsTab, AnalyticsTab, DashboardHeader, Sidebar, etc.).
- Utilities: `src/lib/utils.ts`, `src/hooks/*` (e.g. `use-mobile.tsx`, `use-toast.ts`).
- Configs: `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json` (note the `@` alias).

Integration & external dependencies
- No server code in the repo. Expect external APIs to be called via fetch/axios inside react-query hooks or components.
- Key libs: Radix UI, shadcn-style components, `@tanstack/react-query`, `react-router-dom`, `sonner` (toasts), `class-variance-authority` + `tailwind-merge`.

Developer workflows
- Dev: `npm i` then `npm run dev` (Vite hot reload). On Windows use PowerShell; commands are standard `npm` commands.
- Build: `npm run build` (production). There is also `npm run build:dev` to build with `--mode development`.
- Linting: `npm run lint` (ESLint config at repo root). There are no test scripts present—if adding tests, integrate them and add scripts to `package.json`.

Do's and don'ts (repo-specific)
- Do reuse primitives from `src/components/ui` for consistent styling and accessibility.
- Do use `react-query` patterns (QueryClientProvider already set up in `App.tsx`).
- Do import using the `@/` alias to match the tsconfig paths.
- Don't add global CSS outside of `index.css` or Tailwind classes without discussing—styles aim to be atomic and Tailwind-driven.

When you need to change architecture
- Small UI/feature changes: edit `src/components/*` and `src/pages/*` and follow existing naming and export patterns.
- New primitives: place them in `src/components/ui`, keep filename lowercase, and follow the wrapper pattern used by other primitives.

If something is missing
- There are no test commands or CI workflows in the repo. If you add CI or test runners, update `package.json` and add a short note here.

Questions or unclear parts? Tell me which area felt underspecified (routing, data fetching, component patterns, or build/CI) and I will expand the instructions with examples or small code edits.
