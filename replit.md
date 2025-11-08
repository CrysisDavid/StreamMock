# CineStream - Movie Streaming Platform

## Overview

CineStream is a Netflix-inspired movie streaming platform built as a full-stack web application. The platform allows users to browse movies, manage favorites lists, and authenticate using JWT tokens. The frontend is built with React, TypeScript, and Tailwind CSS using the shadcn/ui component library, while the backend is an Express server with planned PostgreSQL database integration through Drizzle ORM.

The application follows a modern monorepo structure with separate client and server directories, sharing common schemas and types through a shared directory.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server, configured for hot module replacement
- **Wouter** for lightweight client-side routing (not React Router)
- Path aliases configured via TypeScript and Vite for clean imports (`@/`, `@shared/`, `@assets/`)

**State Management & Data Fetching**
- **TanStack Query (React Query)** for server state management, caching, and data synchronization
- Custom hooks pattern for encapsulating API logic (`useMovies`, `useFavorites`, `useAuth`)
- Context API for global authentication state via `AuthProvider`

**UI Component System**
- **shadcn/ui** component library (New York variant) built on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens and dark mode support
- Netflix-inspired design system with content-first visual hierarchy
- Responsive grid layouts: mobile (2 cols) → tablet (3-4 cols) → desktop (5 cols)

**Authentication Flow**
- JWT-based authentication with access and refresh tokens
- Tokens stored in localStorage
- Axios interceptors handle token refresh and unauthorized responses
- Protected routes redirect to login when unauthenticated

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for the REST API
- Custom request logging middleware tracking API performance
- Session management prepared with `connect-pg-simple`
- Vite middleware integration for serving the React app in development

**API Structure**
- RESTful API design with `/api` prefix for all endpoints
- Planned endpoints based on API documentation:
  - `/api/auth/login` - User authentication
  - `/api/peliculas` - Movie catalog with pagination
  - `/api/favoritos` - User favorites management
- Currently implements a storage interface pattern for future database integration

**Database Layer**
- **Drizzle ORM** configured for PostgreSQL dialect
- **Neon Database** serverless PostgreSQL via `@neondatabase/serverless`
- Schema-first approach with Zod validation via `drizzle-zod`
- Database schema defined in `shared/schema.ts` for type sharing
- Migration system configured with `drizzle-kit`

**Current Storage Implementation**
- In-memory storage implementation (`MemStorage`) for development
- Interface-based design (`IStorage`) allows swapping to database without breaking API
- User model includes: id (UUID), username, password fields

**Design Patterns**
- Repository pattern through storage interface abstraction
- Shared schema types between client and server prevent duplication
- Environment-based configuration with `.env` file support

### Key Architectural Decisions

**Monorepo Structure**
- **Problem**: Managing frontend, backend, and shared code in a single repository
- **Solution**: Three-folder structure (client/, server/, shared/) with TypeScript path aliases
- **Rationale**: Enables code sharing (types, schemas) while maintaining clear separation of concerns
- **Trade-offs**: Single package.json increases deployment complexity but simplifies development

**API Client Architecture**
- **Problem**: Managing HTTP requests with authentication and error handling
- **Solution**: Axios instance with interceptors for token management and refresh logic
- **Rationale**: Centralized request/response handling prevents code duplication
- **Alternatives Considered**: Fetch API lacks interceptor pattern without additional libraries

**Database ORM Choice**
- **Problem**: Type-safe database queries with PostgreSQL
- **Solution**: Drizzle ORM with Zod schema validation
- **Rationale**: Lightweight, TypeScript-first ORM with excellent type inference
- **Alternatives Considered**: Prisma (heavier), TypeORM (more complex)

**Component Library Strategy**
- **Problem**: Building consistent, accessible UI components quickly
- **Solution**: shadcn/ui components with Radix UI primitives
- **Rationale**: Copy-paste components provide full control and customization
- **Trade-offs**: No package dependency but requires manual updates

**State Management Approach**
- **Problem**: Managing server data, caching, and synchronization
- **Solution**: TanStack Query for server state, Context API for auth state
- **Rationale**: Specialized tools for different state types (server vs. client)
- **Alternatives Considered**: Redux (overkill), Zustand (less server-state focused)

## External Dependencies

### Third-Party Services
- **External Movie API**: Backend expects to integrate with a movie API service at `http://localhost:8000` (currently stubbed)
- **Neon Database**: Serverless PostgreSQL hosting service requiring `DATABASE_URL` environment variable

### UI Component Libraries
- **Radix UI**: Headless UI primitives for accessibility and behavior (@radix-ui/react-*)
- **Lucide Icons**: Icon library for UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom configuration

### Authentication & Session
- **JWT Tokens**: Access and refresh token pattern for stateless authentication
- **connect-pg-simple**: PostgreSQL session store for Express sessions (prepared but not yet implemented)

### Build & Development Tools
- **Vite**: Frontend build tool and dev server
- **ESBuild**: Server bundling for production builds
- **TypeScript**: Type system across entire stack
- **Replit Plugins**: Development environment integration (@replit/vite-plugin-*)

### Database & ORM
- **Drizzle ORM**: Schema definition and query builder
- **Drizzle Kit**: Database migrations and schema management
- **@neondatabase/serverless**: Neon's serverless PostgreSQL driver

### Data Fetching & Validation
- **Axios**: HTTP client with interceptor support
- **TanStack Query**: Server state management and caching
- **Zod**: Runtime type validation and schema parsing
- **React Hook Form**: Form state management with Zod resolvers

### Styling Dependencies
- **class-variance-authority**: Component variant styling system
- **tailwind-merge**: Tailwind class merging utility
- **clsx**: Conditional class name utility
- **PostCSS & Autoprefixer**: CSS processing