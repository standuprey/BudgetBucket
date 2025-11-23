# Budget Tracker Application

## Overview

A personal expense tracking application for couples to manage their monthly budget across multiple categories. The application provides real-time expense tracking, visual budget monitoring with progress bars, and monthly recaps with budget adjustment capabilities. Built with a mobile-first approach following Material Design 3 principles.

**Current Implementation Status:** ✅ Fully functional MVP with real-time expense tracking, budget monitoring, and category management.

**Key Features:**
- Real-time expense entry with floating action button
- 18 pre-configured budget categories from user's CSV (Rent, Groceries, Utilities, etc.)
- Visual progress tracking with color-coded indicators (green = under budget, orange = near limit, red = over budget)
- Monthly budget overview showing total spent, remaining balance, and savings
- Expense history with category icons and filtering
- Budget adjustment interface for tuning monthly allocations
- Monthly recap summaries with top spending categories
- Dark/light theme toggle
- Responsive design optimized for mobile and desktop

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component System**
- Shadcn/ui component library with Radix UI primitives for accessibility
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design 3 inspired design system with fintech app influences (Mint, YNAB, Splitwise)
- Inter font family for consistent typography across all UI elements
- Dark/light theme support with CSS variables

**State Management Strategy**
- Server state managed through React Query with query invalidation on mutations
- Local UI state managed with React hooks (useState, useEffect)
- Form state handled by React Hook Form with Zod schema validation
- Toast notifications for user feedback on actions

**Key Design Decisions**
- Mobile-first responsive design with floating action button for quick expense entry
- Card-based layout for displaying budget categories and expense lists
- Progress bars and visual indicators for at-a-glance budget status
- Form validation at both client and server levels using shared Zod schemas

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript for type safety
- Separate development (Vite middleware) and production (static serving) entry points
- RESTful API design for CRUD operations on budgets, categories, and expenses

**API Structure**
- `GET /api/categories` - Retrieve all budget categories
- `POST /api/categories` - Create new budget category (with validation)
- `PATCH /api/categories/:id` - Update category budget allocation
- `GET /api/expenses?month=YYYY-MM` - Retrieve expenses for a specific month (enriched with category metadata)
- `POST /api/expenses` - Create new expense (returns enriched data with categoryName and categoryIcon)
- `DELETE /api/expenses/:id` - Delete an expense
- `GET /api/budgets/:month` - Get monthly budget for specific month
- `POST /api/budgets` - Create monthly budget with total income
- `PATCH /api/budgets/:month` - Update monthly income allocation
- `POST /api/initialize` - Initialize default budget from CSV data (with full schema validation)

**API Response Enrichment:**
- Expense endpoints automatically join category data to include categoryName and categoryIcon
- This eliminates the need for client-side joins and ensures consistent data shape
- All monetary values stored as decimal strings for precision, parsed to numbers client-side

**Data Validation**
- Shared Zod schemas between client and server for consistent validation
- Drizzle-zod integration for automatic schema generation from database models
- Request body validation in API routes before database operations

**Storage Layer**
- Abstract storage interface (IStorage) allowing for flexible backend implementations
- Currently using in-memory storage (MemStorage) for immediate functionality
- Data persists during server runtime but resets on restart
- PostgreSQL migration path available via Drizzle ORM schema
- UUID-based primary keys for all entities

**Implementation Notes:**
- In-memory storage chosen for MVP to enable immediate use without database setup
- Data includes default budget from user's CSV ($16,060 monthly income, 18 categories)
- Future enhancement: Migrate to PostgreSQL for permanent persistence and multi-user support

### Database Design

**Schema Architecture**
- Three main tables: `budget_categories`, `expenses`, and `monthly_budgets`
- Decimal type for currency values ensuring precision
- Date fields for expense tracking and temporal queries
- Foreign key relationships through categoryId linking expenses to categories

**Data Model Characteristics**
- Budget categories store name, monthly allocation, and icon identifier
- Expenses track amount, category, date, and optional notes with auto-generated timestamps
- Monthly budgets store total income per month (YYYY-MM format) for budget planning
- All IDs generated using PostgreSQL's `gen_random_uuid()` function

**Migration Strategy**
- Drizzle Kit for schema migrations with TypeScript-first approach
- Schema definitions in shared directory for use across client and server
- Database URL configuration through environment variables

### External Dependencies

**Database**
- Neon serverless PostgreSQL (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and schema management
- Connect-pg-simple for session storage (configured but not actively used in current implementation)

**UI Component Libraries**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, menus, etc.)
- Lucide React for consistent iconography
- Embla Carousel for potential swipeable UI elements
- date-fns for date formatting and manipulation

**Form Management**
- React Hook Form for performant form handling
- @hookform/resolvers for Zod schema integration
- Client-side validation before API calls

**Development Tools**
- Replit-specific plugins for development experience (runtime error overlay, cartographer, dev banner)
- ESBuild for production server bundling
- TypeScript compiler for type checking without emission

**Design System Integration**
- Class Variance Authority (CVA) for component variant management
- clsx and tailwind-merge for conditional className composition
- Custom Tailwind configuration with extended color palette and design tokens