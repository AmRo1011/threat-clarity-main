# UEBA Frontend

User and Entity Behavior Analytics (UEBA) dashboard for monitoring and analyzing user behavior patterns, detecting anomalies, and managing security alerts.

## Overview

This frontend provides a real-time dashboard for:
- Monitoring system health and security status
- Managing and resolving anomaly alerts
- Uploading and analyzing log data
- Running detection algorithms
- Viewing analytics by department and threat type

Built with:
- React 18 + Vite
- TypeScript
- Tailwind CSS + shadcn/ui
- React Query for data fetching
- React Router for navigation

## Prerequisites

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm 9+
- Access to UEBA backend API (default: http://localhost:8001)

## Quick Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment template:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env`:

```ini
# Backend API URL (required)
VITE_API_URL=http://localhost:8001/api/v1

# Development auth token (optional)
VITE_DEV_TOKEN=your_dev_token
```

## Available Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## API Integration

The frontend connects to the UEBA backend API:

- Base URL: Configured via `VITE_API_URL` (default: http://localhost:8001/api/v1)
- Authentication: JWT Bearer token (stored in localStorage)
- OpenAPI spec: Available at http://localhost:8001/openapi.json
- Development: Use `SystemAPI.devToken()` to get a dev token

### API Client Structure

```typescript
// src/lib/api.ts
const API = import.meta.env.VITE_API_URL;

// Example API namespace
export const SystemAPI = {
  health: () => apiFetch("/system/health"),
  devToken: (uid, role) => apiFetch(`/system/dev-token?uid=${uid}&role=${role}`)
};
```

## Core Routes

- `/` - Dashboard with system health and quick stats
- `/anomalies` - List and manage security alerts
- `/anomalies/:id` - Detailed view of an anomaly with evidence
- `/upload-logs` - CSV log file upload interface
- `/detection` - Run detection algorithms
- `/analytics` - Department and threat analytics
- `/status` - System health monitoring


## Troubleshooting

### CORS Issues
1. Verify backend CORS settings allow your frontend origin
2. Check `VITE_API_URL` matches backend exactly
3. For local development, ensure using correct port (default: 5173)

### Authentication
1. JWT token stored in localStorage as 'uebatoken'
2. For development, use `/system/dev-token` endpoint
3. Check network tab for 401/403 errors

### API Connection
1. Confirm backend is running (`curl http://localhost:8001/api/v1/health`)
2. Verify `VITE_API_URL` includes `/api/v1`
3. Check for SSL/certificate issues if using HTTPS

## Component Library

Reusable components available in `src/components/ui/`:
- `Button` - Actions and submits
- `Card` - Content containers
- `Table` - Data display
- `Toast` - Notifications
- `Dialog` - Confirmations
- `Badge` - Status indicators
- `FileDropzone` - File uploads

Example usage:
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AlertCard({ alert }) {
  return (
    <Card>
      <Button onClick={() => resolve(alert.id)}>
        Resolve Alert
      </Button>
    </Card>
  );
}
```

## Contributing

1. Ensure ESLint passes: `npm run lint`
2. Follow existing patterns for API calls and components
3. Use React Query for data fetching
4. Keep styles in Tailwind where possible
5. Add types for all props and API responses

## Acknowledgments

We gratefully acknowledge the use of Lovable for threat analysis and clarity.

## License

MIT
