# Project Documentation: Dr. Islamiat Raji-Adebayo Website

This project is a modern, high-performance web application built as a **pnpm workspace monorepo**. It serves as the personal and academic website for Dr. Islamiat Raji-Adebayo, featuring a built-in Content Management System (CMS) and a robust backend.

## 🛠 Tech Stack

### Frontend (`artifacts/iar-site`)
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 4 (with Typography plugin)
- **UI Components**: Radix UI, Lucide React, Embla Carousel
- **Animations**: Framer Motion
- **State Management**: React Query (TanStack Query)
- **Routing**: Wouter
- **Backend Integration**: Supabase JS SDK

### Backend/API Server (`artifacts/api-server`)
- **Framework**: Express 5
- **Runtime**: Node.js 24
- **Database ORM**: Drizzle ORM
- **Logging**: Pino & Pino-HTTP
- **Email**: Nodemailer (via Gmail)
- **Storage**: Supabase Storage

### Infrastructure
- **Package Manager**: pnpm (Workspaces)
- **Primary Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Hosting**: Firebase Hosting (Main site)

## 📁 Project Structure

```text
.
├── artifacts/
│   ├── iar-site/             # Main React website & CMS dashboard
│   ├── api-server/           # Express backend for file uploads & contact form
│   └── mockup-sandbox/       # Isolated environment for UI component testing
├── lib/
│   ├── db/                   # Shared database schema (Drizzle)
│   ├── api-spec/             # OpenAPI 3.0 specification (openapi.yaml)
│   ├── api-zod/              # Generated Zod schemas from API spec
│   ├── api-client-react/     # Generated React hooks for API interaction
│   └── integrations/         # Shared integration logic
├── functions/                # Firebase Cloud Functions
├── scripts/                  # Workspace-level utility scripts
├── firebase.json             # Firebase configuration
└── pnpm-workspace.yaml       # Workspace configuration
```

## 🚀 Key Commands

### Development
- `pnpm install` — Install all dependencies (requires `pnpm`).
- `pnpm --filter @workspace/iar-site run dev` — Run the frontend dev server.
- `pnpm --filter @workspace/api-server run dev` — Run the API server.
- `pnpm run typecheck` — Run TypeScript validation across the entire workspace.

### Build
- `pnpm run build` — Build all workspace projects.
- `pnpm --filter @workspace/iar-site run build` — Build only the website.

## 🔑 Environment Variables

The following variables are required for full functionality:

| Variable | Location | Purpose |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Frontend & API | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Public Supabase key for data fetching |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | API Server | Private key for bypass RLS (e.g. file uploads) |
| `DATABASE_URL` | API Server | PostgreSQL connection string for Drizzle |
| `GMAIL_USER` | API Server | Gmail account for receiving contact form emails |
| `GMAIL_APP_PASSWORD` | API Server | Gmail App Password for authenticated SMTP |
| `PORT` | API Server | Port for the backend server (default: 8080) |

## 📐 Architecture Notes

1. **CMS Logic**: The website uses a custom CMS implementation where content and lists are stored in Supabase tables (`cms_content` and `cms_lists`). The frontend falls back to `cmsDefaults.ts` if remote data is unavailable.
2. **API Codegen**: The project uses **Orval** to generate type-safe React Query hooks from the `openapi.yaml` spec.
3. **Database**: While the frontend interacts with Supabase directly for content, the API server is designed to use Drizzle ORM for more complex backend operations.
4. **Platform Overrides**: For Windows development, ensure that platform-specific overrides in `pnpm-workspace.yaml` are not blocking the installation of native binaries (`rollup`, `esbuild`, etc.).
