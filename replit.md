# Fanfiction Recommendation Platform

## Overview

This is a modern full-stack web application built as a fanfiction recommendation platform called "FicRecs". The application allows users to discover, filter, and bookmark fanfiction stories from various sources with a clean, responsive interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### January 2025 - Database Integration and Scraping Framework
- Migrated from mock data to PostgreSQL database with Drizzle ORM
- Implemented web scraping framework with rate limiting and ethical compliance
- Added Archive of Our Own (AO3) scraper with proper data extraction
- Created admin interface at `/admin` for managing scraping operations
- Updated all components to handle database story types and numeric IDs
- Enhanced localStorage functions to work with database story identifiers

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with a comprehensive design system
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Theme System**: Custom dark/light theme context with localStorage persistence

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout the stack
- **API Design**: RESTful endpoints with JSON responses
- **Data Storage**: PostgreSQL database with Drizzle ORM integration and API endpoints
- **Session Management**: Connect-pg-simple for PostgreSQL sessions (configured but not actively used)

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL integration
- **Schema**: Database tables for stories, users, and bookmarks in `shared/schema.ts`
- **Database**: PostgreSQL (via Neon) with seeded story data
- **Migrations**: Drizzle-kit for database migrations
- **Storage**: DatabaseStorage implementation replacing MemStorage

## Key Components

### Core Data Models
- **Story**: Main entity containing title, author, summary, fandom, tags, rating, word count, status, and metadata
- **User Preferences**: Theme settings, bookmarks, reading lists, favorite genres, and filter preferences
- **Filter Options**: Dynamic filtering system for fandoms, status, ratings, and word counts

### UI Components
- **Header**: Search functionality, navigation, and theme toggle
- **Featured Story**: Highlighted story display with enhanced visual treatment
- **Story Card**: Individual story display with bookmarking functionality
- **Sidebar Filters**: Advanced filtering interface with multiple criteria
- **Trending Section**: Weekly trending stories display

### Backend Services
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Route Handlers**: API endpoints for stories, user preferences, and features
- **Middleware**: Request logging, JSON parsing, and error handling

## Data Flow

1. **Client-Side State**: User preferences and bookmarks stored in localStorage
2. **Mock Data**: Currently using static mock data for story content
3. **API Layer**: Express routes configured for future database integration
4. **Filtering**: Client-side filtering and sorting of story collections
5. **Search**: Real-time search functionality across story titles and content

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL integration
- **drizzle-orm** & **drizzle-zod**: Database ORM and schema validation
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Comprehensive UI primitive library
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Minimal client-side routing

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- TypeScript compilation and type checking
- Replit-specific development tools and error overlay

### Production Build
- Vite builds optimized client bundle to `dist/public`
- esbuild bundles server code with external package handling
- Static file serving through Express in production

### Database Setup
- Drizzle migrations ready for PostgreSQL deployment
- Environment variable configuration for DATABASE_URL
- Session storage configured for PostgreSQL (currently unused)

### Key Architectural Decisions

1. **Monorepo Structure**: Shared schema and types between client/server for consistency
2. **Type Safety**: Full TypeScript coverage with strict configuration
3. **Component Architecture**: Modular UI components with shadcn/ui for consistency
4. **Data Validation**: Zod schemas for runtime validation and type generation
5. **Storage Abstraction**: Interface-based storage layer for easy database swapping
6. **Client-Side Storage**: localStorage for user preferences to work without authentication
7. **Mock Data Strategy**: Static data for development with API structure ready for real backend

The application is architected for easy transition from mock data to a full database-backed system while maintaining a polished user experience throughout development.