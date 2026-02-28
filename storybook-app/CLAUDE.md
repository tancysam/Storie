# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (Vite)
- **Build**: `npm run build`
- **Lint**: `npm run lint` (ESLint 9 with flat config)
- **Preview build**: `npm run preview`

No test framework is configured.

## Architecture

This is a **children's storybook generator** — a React SPA that lets authenticated users create AI-generated bedtime stories with illustrations.

### Tech Stack

- React 19 + Vite 7 + React Router 7 (client-side routing)
- Tailwind CSS 3.4 (do NOT upgrade to v4)
- InsForge BaaS (`@insforge/sdk`) for auth, database, storage, and AI

### Backend (InsForge)

- **Client singleton**: `src/lib/insforgeClient.js` — all SDK calls go through `insforge`
- **Database**: PostgreSQL via PostgREST. Schema in `schema.sql` (two tables: `storybooks`, `story_pages` with RLS)
- **Auth**: Email/password via `insforge.auth`
- **AI**: `insforge.ai.chat.completions` (GPT-4o-mini for story text) and `insforge.ai.images.generate` (Gemini for illustrations)
- **Storage**: Generated images uploaded to `story-images` bucket via `insforge.storage`
- **Environment**: `VITE_INSFORGE_URL` and `VITE_INSFORGE_ANON_KEY` in `.env.local`

### Key Patterns

- **Auth context**: `src/hooks/useAuth.jsx` provides `AuthProvider` + `useAuth()` hook. `AuthGuard` component wraps protected routes.
- **Data hooks**: `src/hooks/useStorybook.js` wraps all database CRUD for storybooks/pages. `src/hooks/useGeneration.js` orchestrates AI generation pipeline.
- **Generation pipeline** (`src/utils/generation.js`): Generates a 4-act story structure via AI chat, then generates images for all acts in parallel, uploads to storage, and saves pages to the database.
- **SDK returns `{data, error}`** — all InsForge operations use this pattern, not exceptions.
- **Database inserts require array format**: e.g., `.insert([{...}])`

### Routes

| Path | Component | Auth |
|------|-----------|------|
| `/login` | LoginPage | No |
| `/` | HomePage | Yes |
| `/create` | CreateStoryPage | Yes |
| `/edit/:id` | EditStoryPage | Yes |
| `/story/:id` | ViewStoryPage | No (public for published stories) |

### Story Structure

Each storybook has exactly 4 acts: Introduction, The Journey, The Gentle Conflict, The Sleepy Resolution. Visual style options and act titles are defined in `src/utils/constants.js`.

### InsForge MCP Tools

Infrastructure tasks (schema changes, bucket management, deployments) use InsForge MCP tools. Always call `fetch-docs` or `fetch-sdk-docs` before writing InsForge integration code to get up-to-date SDK patterns. See `AGENTS.md` for full MCP documentation.
