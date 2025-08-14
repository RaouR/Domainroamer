# Overview

This is a **Registrar Optimizer** application that helps users save money on domain renewals by comparing prices across different registrars. The application allows users to import their domain portfolio via CSV upload, track domain expiry dates, and get personalized recommendations for potential savings. It's built as a full-stack web application with authentication, data visualization, and portfolio management features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript, using Vite for development and build tooling
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for client-side routing with conditional rendering based on authentication state
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling and request logging middleware
- **File Uploads**: Multer middleware for CSV file processing
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple

## Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema**: Includes users, domains, registrar prices, and session tables
- **Migrations**: Drizzle Kit for database schema management

## Authentication & Authorization
- **Provider**: Replit's OpenID Connect (OIDC) authentication system
- **Strategy**: Passport.js with OpenID Client strategy
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Security**: HTTP-only cookies with secure flags and CSRF protection

## Data Models
- **Users**: Profile information from OIDC provider (email, name, profile image)
- **Domains**: User portfolio with domain name, TLD, registrar, expiry date, and pricing
- **Registrar Prices**: Market pricing data for TLD comparison across registrars
- **Portfolio Analytics**: Calculated savings, expiry tracking, and registrar distribution

## API Structure
- **Authentication Routes**: User profile and session management
- **Domain Management**: CRUD operations for user domain portfolio
- **CSV Import**: Bulk domain import with validation and error handling
- **Analytics**: Portfolio statistics and savings calculations
- **Registrar Data**: Price comparison and market data endpoints

# External Dependencies

## Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database with connection pooling
- **Database URL**: Environment variable configuration for database connectivity

## Authentication Services
- **Replit OIDC**: OAuth 2.0 / OpenID Connect authentication provider
- **Environment Variables**: REPLIT_DOMAINS, ISSUER_URL, SESSION_SECRET for auth configuration

## Development Tools
- **Replit Integration**: Development environment with hot reload and error modal plugins
- **Cartographer**: Replit's development tooling for enhanced debugging experience

## Frontend Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives
- **TanStack Query**: Server state management with caching and synchronization
- **Lucide React**: Icon library for consistent iconography
- **Date-fns**: Date manipulation and formatting utilities

## Build & Deployment
- **Vite**: Frontend build tool with React plugin and development server
- **ESBuild**: Backend bundling for production deployment
- **TypeScript**: Compile-time type checking across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework with custom design system