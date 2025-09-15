# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Structure

This is a personal website built with a Nuxt 4 frontend and FastAPI backend, featuring real-time Spotify and weather data integration.

### Architecture Overview

- **Frontend**: Nuxt 4 (Vue 3) with TypeScript, TailwindCSS, and i18n support (Russian/English)
- **Backend**: FastAPI with async polling for Spotify Web API and OpenWeather API
- **Monorepo**: Uses pnpm workspaces to manage the full-stack project
- **Data Flow**: Backend continuously polls external APIs and caches data, frontend polls backend for real-time updates

### Key Directories

- `app/` - Nuxt application with pages, components, composables, and types
- `backend/` - FastAPI server with Spotify/weather polling logic
- `newtab/` - Standalone HTML page (browser extension/new tab page)

## Development Commands

### Frontend (Nuxt)
```bash
# Install dependencies
pnpm install

# Development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview production build
pnpm preview
```

### Backend (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables (copy from .env.example)
cp .env.example .env

# Run development server (http://localhost:8000)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Full Development Setup
1. Start backend: `cd backend && uvicorn main:app --reload --port 8000`
2. Start frontend: `pnpm dev` (in project root)
3. Frontend will proxy API calls to backend via runtime config

## API Integration Architecture

### Spotify Integration
- Backend polls Spotify Web API every 1 second using ETags for efficiency
- Handles token refresh automatically when needed
- Caches current track data in `storage/currently_playing.json`
- Frontend composable (`useSpotify`) polls backend and provides live progress tracking
- Color extraction from album art for dynamic UI theming

### Weather Integration  
- Backend polls OpenWeather API every 10 minutes
- Fetches weather in both Russian and English
- Caches data in `storage/weather.json`
- Frontend composable (`useWeather`) displays localized weather info

### Backend Environment Setup
Required environment variables in `backend/.env`:
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
OPENWEATHER_API_KEY=your_api_key
OPENWEATHER_LAT=your_lat
OPENWEATHER_LON=your_lon
```

## Frontend Architecture Patterns

### Composables Design
- `useSpotify()` - Manages Spotify data with live progress updates and color theming
- `useWeather()` - Handles weather data polling and temperature conversion
- `useClock()` - Real-time clock updates
- `useUiReady()` - Coordinated UI animation entrance

### Component Structure
- Card-based layout with responsive grid system
- Components are self-contained with their own data fetching
- Live updates without page refreshes using Vue's reactivity
- Smooth transitions and loading states

### Internationalization
- Configured for Russian (default) and English
- Uses `@nuxtjs/i18n` with locale files in `locales/` directory
- URL strategy: prefix except default locale (`/en/page` vs `/page`)
- Browser language detection with cookie persistence

## Testing Commands

This project doesn't currently have a formal test suite. For testing:

### Manual Testing
- Frontend: `pnpm dev` and verify all cards load correctly
- Backend: `uvicorn main:app --reload` and test endpoints:
  - `GET /spotify` - Current track data
  - `GET /weather` - Weather data
  - `GET /spotify/debug` - Token and fetch status

### API Testing
```bash
# Test backend endpoints directly
curl http://localhost:8000/spotify
curl http://localhost:8000/weather
curl http://localhost:8000/spotify/debug
```

## Common Development Tasks

### Adding New API Endpoints
1. Add endpoint function in `backend/main.py`
2. Create corresponding types in `app/types/index.ts`
3. Create composable in `app/composables/` if needed
4. Update runtime config in `nuxt.config.ts` if required

### Updating Spotify Integration
- Token management is handled in `backend/main.py`
- Frontend logic is in `app/composables/useSpotify.ts`
- UI components: `app/components/SpotifyCard.vue`

### Modifying Weather Display
- Backend polling in `poll_weather_loop()` function
- Frontend logic in `app/composables/useWeather.ts`  
- UI component: `app/components/WeatherTile.vue`

### Styling Changes
- Uses TailwindCSS with custom configuration in `tailwind.config.js`
- Global styles in `app/assets/css/main.css`
- Font loading via `@nuxtjs/google-fonts` (Raleway, Onest)

## Production Deployment Notes

- Frontend: Use `pnpm generate` for static generation or `pnpm build` for SSR
- Backend: Deploy with `uvicorn main:app --host 0.0.0.0 --port 8000`
- Ensure backend storage directory is writable for caching
- Configure CORS origins in `backend/main.py` for production domains
- Set proper environment variables for all API keys and tokens