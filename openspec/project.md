# SentraTest Project Overview

SentraTest is a web-based testing application featuring a microservices-inspired architecture with a Next.js frontend and an Express.js backend.

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (via @tailwindcss/postcss)
- **UI Components:** Lucide React
- **Utilities:** `clsx`, `tailwind-merge`

### Backend
- **Framework:** Express.js 5
- **Language:** JavaScript
- **Utilities:** `cors`, `dotenv`

## Project Structure
- `/frontend`: Next.js application
  - `src/app`: App router structure, including authentication and dashboard groups.
  - `src/components`: Reusable UI components.
  - `src/lib`: Shared utilities.
- `/backend`: Express.js API server.
- `/openspec`: Project specifications and design docs.

## Development Conventions

### General
- Adhere to TypeScript strictly in the frontend.
- Utilize the OpenSpec workflow (`.gemini/skills/`) for all new features and architectural changes.

### Frontend
- Components should be functional React components.
- Use path aliases where configured.
- Tailwind CSS is the standard for styling.

### Specifications
- All significant features must be documented in `openspec/specs/` before implementation.
- `openspec/project.md` acts as the source of truth for high-level project configuration and stack definitions.
