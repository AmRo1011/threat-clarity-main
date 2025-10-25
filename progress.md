# Threat Clarity Frontend - Technical Documentation

## Project Overview

A React-based frontend for a User and Entity Behavior Analytics (UEBA) system. Built with Vite, TypeScript, and shadcn/ui components.

### Core Features

1. Anomaly Detection & Alerts
2. User Risk Scoring
3. Department Analytics
4. System Health Monitoring

## Architecture

### 1. API Layer (`src/lib/api.ts`)

The API layer is organized into domain-specific namespaces:

```typescript
// Example API namespace pattern
export const SystemAPI = {
  health: () => apiFetch<HealthResponse>("/system/health"),
  devToken: (uid, role) => apiFetch<TokenResponse>(`/system/dev-token?uid=${uid}&role=${role}`)
};
```

Common API patterns:
- Authentication via Bearer token in localStorage
- Consistent error handling and response types
- FormData handling for file uploads
- URL parameter encoding

### 2. React Query Hooks (`src/hooks/`)

Custom hooks wrap API calls and handle state management:

```typescript
// Example hook pattern in use-ueba.ts
export function useSystemHealth() {
  return useQuery({
    queryKey: ["system-health"],
    queryFn: () => SystemAPI.health(),
    refetchOnWindowFocus: false
  });
}
```

### 3. Component Structure

#### UI Primitives (`src/components/ui/`)
Base components built on Radix UI:
- `button.tsx`, `card.tsx`, `input.tsx`, etc.
- Consistent styling with Tailwind
- Accessible by default

#### Feature Components (`src/components/`)
Domain-specific components built from primitives:

1. **AlertCard.tsx**
   - Displays individual anomaly alerts
   - Handles alert resolution via mutations
   - Uses react-query for state management

2. **SystemHealthPanel.tsx**
   - Real-time system status monitoring
   - Auto-refresh every 30 seconds
   - Visual status indicators

3. **AlertsTab.tsx & AnalyticsTab.tsx**
   - Data tables with real-time updates
   - Filtering and refresh controls
   - Error and loading states

### 4. Data Flow

1. **Authentication Flow**
```typescript
const { mutate } = useDevAuth();
mutate({ uid: "user", role: "admin" });
// → Stores token in localStorage
// → Invalidates relevant queries
```

2. **Real-time Updates**
```typescript
// Auto-refresh pattern
useQuery({
  queryKey: ["key"],
  queryFn: () => API.fetch(),
  refetchInterval: 15000  // 15 seconds
});
```

3. **Mutation Pattern**
```typescript
const { mutateAsync } = useMutation({
  mutationFn: (id) => API.resolve(id),
  onSuccess: () => {
    queryClient.invalidateQueries(["alerts"]);
  }
});
```

## Component Examples

### System Health Display
```tsx
// SystemHealthPanel.tsx
export default function SystemHealthPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["system-health"],
    queryFn: () => SystemAPI.health(),
    refetchInterval: 30_000
  });

  return (
    <div className="flex items-center gap-2">
      <StatusIndicator status={data?.status} />
      <StatusLabel isLoading={isLoading} />
    </div>
  );
}
```

### Alert Management
```tsx
// AlertCard.tsx
export default function AlertCard({ alert }) {
  const qc = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: AnomaliesAPI.resolve,
    onSuccess: () => {
      qc.invalidateQueries(["anomalies_list"]);
    }
  });

  return (
    <Card>
      <AlertDetails alert={alert} />
      <ResolveButton onResolve={() => mutateAsync(alert.id)} />
    </Card>
  );
}
```

## Development Workflow

1. **Local Development**
```bash
npm i            # Install dependencies
npm run dev      # Start dev server
npm run lint     # Run ESLint
```

2. **Building for Production**
```bash
npm run build         # Production build
npm run build:dev    # Development build
npm run preview      # Preview build locally
```

## Key Dependencies

1. **UI & Styling**
- shadcn/ui (Radix + Tailwind)
- class-variance-authority
- tailwind-merge

2. **State Management**
- @tanstack/react-query
- react-router-dom

3. **Build Tools**
- Vite
- TypeScript
- ESLint

## Future Improvements

1. **Testing**
- Add Jest/Vitest setup
- Component testing with React Testing Library
- API mocking patterns

2. **CI/CD**
- GitHub Actions workflow
- Automated testing and linting
- Deployment pipeline

3. **Type Safety**
- Stricter TypeScript config
- API response type validation
- Runtime type checking

## Common Patterns

1. **Class Name Composition**
```typescript
import { cn } from "@/lib/utils";

className={cn(
  "base-classes",
  condition && "conditional-classes",
  variant === "primary" ? "primary" : "secondary"
)}
```

2. **API Response Types**
```typescript
export type AnomalyResponse = {
  success: boolean;
  data: {
    items: Anomaly[];
    count?: number;
  };
};
```

3. **Hook Creation**
```typescript
export function useCustomHook(params) {
  return useQuery({
    queryKey: ["key", params],
    queryFn: () => API.fetch(params),
    // Common options
    refetchOnWindowFocus: false,
    staleTime: 30000
  });
}
```