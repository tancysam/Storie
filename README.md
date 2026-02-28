# Storie - AI Children's Storybook Generator

A React application that generates personalized bedtime stories for children using AI. Each story features custom illustrations and follows a gentle 4-act narrative structure perfect for bedtime reading.

## Features

- **AI-Powered Story Generation**: Creates personalized 4-act bedtime stories using GPT-4o-mini
- **Custom Illustrations**: Generates child-friendly artwork in various visual styles
- **Story Editor**: Edit and regenerate individual pages with text and image feedback
- **Fullscreen Storytime Mode**: Side-by-side layout for immersive reading experience
- **Swipe Navigation**: Touch-friendly page navigation for tablets
- **Multiple Visual Styles**: Watercolor, Claymation, Pastel, Cartoon, and Digital Art

## Story Structure

Each generated storybook follows a 4-act structure:

1. **Introduction** - Sets the scene and introduces characters
2. **The Journey** - The main adventure begins
3. **The Gentle Conflict** - A mild challenge arises
4. **The Sleepy Resolution** - Everything ends peacefully

## Tech Stack

- **Frontend**: React 19 + Vite 7
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router 7
- **Backend**: InsForge BaaS (Database, Storage, AI)
- **AI Story Generation**: OpenAI GPT-4o-mini
- **AI Image Generation**: Wavespeed AI

## Prerequisites

- Node.js 18+
- npm or yarn
- InsForge account (for database and storage)
- OpenAI API key
- Wavespeed AI API key

## Environment Variables

Create a `.env.local` file in the project root with:

```env
VITE_INSFORGE_URL=https://your-app.region.insforge.app
VITE_INSFORGE_ANON_KEY=your-insforge-anon-key
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_WAVESPEED_API_KEY=your-wavespeed-api-key
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Database Setup

Run the SQL schema in your InsForge dashboard:

```sql
-- See schema.sql for complete database setup
-- Creates: storybooks and story_pages tables
```

Create a storage bucket named `story-images` in InsForge for storing generated illustrations.

## Project Structure

```
storybook-app/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   └── storybook/       # Story-specific components
│   ├── hooks/
│   │   ├── useStorybook.js  # Database CRUD operations
│   │   └── useGeneration.js # AI generation pipeline
│   ├── lib/
│   │   └── insforgeClient.js # InsForge SDK client
│   ├── pages/
│   │   ├── HomePage.jsx     # Story library
│   │   ├── CreateStoryPage.jsx # Story creation wizard
│   │   ├── EditStoryPage.jsx  # Page editor
│   │   └── ViewStoryPage.jsx  # Storytime mode
│   └── utils/
│       ├── constants.js     # Visual styles, act titles
│       └── generation.js    # AI generation functions
├── schema.sql               # Database schema
└── .env.local              # Environment variables
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home - View all storybooks |
| `/create` | Create a new storybook |
| `/edit/:id` | Edit storybook pages |
| `/story/:id` | Storytime reading mode |

## Visual Styles

- **Watercolor** - Soft, flowing watercolor paintings
- **Claymation** - Playful clay-style illustrations
- **Pastel Illustration** - Gentle pastel artwork
- **Cartoon** - Fun cartoon-style drawings
- **Digital Art** - Modern digital illustrations

## API Integrations

### OpenAI GPT-4o-mini
Used for generating story structure and text content with child-friendly language.

### Wavespeed AI
Used for generating illustrations with safety prompts to ensure child-appropriate content.

### InsForge
Provides:
- PostgreSQL database for story storage
- File storage for generated images
- Authentication

## Development

```bash
# Run linting
npm run lint

# Start dev server with hot reload
npm run dev
```

The app runs on `http://localhost:5173` by default.


