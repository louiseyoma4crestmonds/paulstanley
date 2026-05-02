# CelebConnect

## Overview

CelebConnect is a celebrity fan engagement platform that enables exclusive interactions between celebrities and their fans through multiple channels: charitable causes, events, merchandise sales, and meet & greet opportunities. The platform implements a progressive unlock system where fans complete specific requirements (promo codes, donations, purchases, logistics fees) to gain access to exclusive experiences like video calls and in-person meetings.

The application is built as a full-stack TypeScript monorepo with a React frontend and Express backend, using PostgreSQL for data persistence and PayPal for payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing, providing a lightweight alternative to React Router with similar API patterns.

**State Management**: TanStack Query (React Query) for server state management, caching, and data fetching. No global client state management library is used; component state is managed locally with React hooks.

**UI Component Library**: Shadcn UI (Radix UI primitives) with Tailwind CSS for styling. The design system follows the "new-york" style variant with custom color variables and typography defined in the design guidelines.

**Form Handling**: React Hook Form with Zod for schema validation (via @hookform/resolvers).

**Design System**: Custom design tokens based on a neutral color palette with HSL color values, supporting both light and dark themes. Typography uses Inter for UI elements and Playfair Display for accent/serif text.

### Backend Architecture

**Server Framework**: Express.js with TypeScript, running in ESM module mode.

**Authentication Strategy**: Session-based authentication using Passport.js with the Local Strategy. Sessions are stored in-memory using memorystore (note: this should be replaced with a persistent store like PostgreSQL for production). Passwords are hashed with bcryptjs (10 rounds).

**API Design**: RESTful endpoints with convention-based routing:
- Public endpoints for landing page data (causes, events, products)
- Protected `/api/*` routes requiring authentication middleware
- Admin-only routes using role-based access control (isAdmin flag)

**Request Handling**: JSON body parsing with raw body preservation for webhook signature verification. Request/response logging middleware for API routes.

**Database Access Pattern**: Repository pattern implemented via the `IStorage` interface in `server/storage.ts`, abstracting database operations from route handlers. This allows for easier testing and potential database swapping.

### Data Storage Architecture

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Database**: PostgreSQL via Neon's serverless driver with WebSocket support (using the `ws` library for Node.js environments).

**Schema Design**:
- **users**: Core user accounts with email/password authentication, verification codes, admin flags, and optional profile fields
- **causes**: Charitable initiatives with funding goals and raised amounts (decimal precision for currency)
- **events**: Scheduled events with date, location, and imagery
- **products**: Merchandise with pricing, stock tracking, and descriptions
- **transactions**: Financial records linking users to purchases/donations with payment method tracking and status
- **meetGreetRequests**: User requests for exclusive experiences with type differentiation (video call vs in-person), status tracking, and preference fields
- **promoCodes**: Access codes with usage limits and expiration tracking

**Primary Keys**: UUID generation using PostgreSQL's `gen_random_uuid()` function.

**Migration Strategy**: Drizzle Kit for schema migrations with migrations stored in the `/migrations` directory.

### Authentication and Authorization

**Registration Flow**: Two-step process requiring email verification via 6-digit code (stored in user record, generated with crypto.randomInt). Users cannot access protected features until `emailVerified` is true.

**Login Flow**: Email/password credentials validated against bcrypt hashes, with Passport serialization storing minimal user data in session.

**Session Management**: HTTP-only cookies with 30-day expiration. Session secret should be set via `SESSION_SECRET` environment variable in production.

**Password Reset**: Placeholder implementation referenced in requirements (reset link with 15-minute validity) - not yet fully implemented in codebase.

**Authorization Levels**:
- Public (unauthenticated): Landing pages, causes, events, products, contact form
- Authenticated: Dashboard, transaction history, meet & greet requests
- Admin: User management, request approval, content management

### Payment Integration

**Payment Provider**: PayPal via the official PayPal Server SDK, configured for sandbox environment with environment variable credentials (`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`).

**Payment Flow**:
1. Create order via `createPayPalOrder()` with amount and currency
2. Client completes payment on PayPal
3. Backend captures order via `capturePayPalOrder()` with order ID

**Transaction Recording**: All payments (donations, purchases, logistics fees) are logged in the transactions table with type, amount, status, and payment method.

**Alternative Payment Methods**: The platform lists cryptocurrency options (BTC, ETH, LTC) with wallet addresses displayed on a static information page, but these are not programmatically integrated.

### Progressive Unlock System

**Meet & Greet Eligibility**: Users must complete four requirements to unlock exclusive access:
1. Obtain a promo code or purchase a Fan Card ($50)
2. Make a charitable donation
3. Purchase merchandise
4. Pay logistics fee ($200)

**Progress Tracking**: Dashboard displays completion percentage via circular progress indicator, calculated from user transaction history checking for specific transaction types.

**Request System**: Once eligible, users can submit meet & greet requests specifying preferences (date, location for in-person; platform for video calls) with admin approval workflow.

## External Dependencies

**Database**: Neon PostgreSQL serverless database (requires `DATABASE_URL` environment variable)

**Payment Processing**: PayPal payment gateway (sandbox mode)
- Client ID and secret must be configured
- SDK handles OAuth authentication automatically

**Email Delivery**: Email functionality is referenced in requirements (2FA codes, contact form, password reset) but SMTP configuration is not yet implemented in the codebase. Celery is mentioned in requirements but not present in dependencies.

**UI Components**: Radix UI primitives (@radix-ui/*) for accessible, unstyled components

**Build Tools**:
- Vite for frontend bundling and dev server
- esbuild for backend bundling in production builds
- tsx for TypeScript execution in development

**Styling**: Tailwind CSS with PostCSS for processing

**Development Tools** (Replit-specific):
- @replit/vite-plugin-runtime-error-modal
- @replit/vite-plugin-cartographer
- @replit/vite-plugin-dev-banner

**Asset Management**: Generated images stored in `/attached_assets/generated_images/` directory and imported as static assets

**Type Safety**: Shared schema definitions using Drizzle Zod schemas for runtime validation between frontend and backend