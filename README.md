# Velora Streaming Web App

Velora is a cinematic streaming web application featuring a premium React-based UI and "TV Mode" keyboard navigation. This version is a standalone web application that uses local browser storage for data persistence.

## Architecture

This project is a React application built with Vite:

```
velora-stream/
├── apps/
│   └── web/        (React Web App)
└── package.json
```

## Features
- **Cinematic UI**: Premium dark-mode interface with smooth animations and transitions.
- **TV Mode**: Full keyboard and focus-based navigation for television use.
- **Local Persistence**: Watchlists and history are stored locally in your browser.
- **4K Support**: Dedicated section for high-quality content.

---

## 1. TMDB Setup

The application uses TMDB for movie and show metadata.

1. Obtain your API key from [The Movie Database (TMDB)](https://www.themoviedb.org/).
2. Create a `.env` file in the root directory:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

---

## 2. Web App Setup

The web application uses React, Vite, and Tailwind CSS.

### Local Development
From the root directory, install dependencies and run:
```bash
npm install
npm run dev:web
```
Open `http://localhost:8080`.

### Deployment (Vercel)
The web app is optimized for Vercel. 
- Build Command: `npm run build:web`
- Output Directory: `apps/web/dist`
- Root Directory: `./` (or as configured in your Vercel project)

---

## Technical Considerations
- **Iframes**: The web player embeds an external video player (`vidking.net`). Cross-origin policies restrict some direct DOM controls. The web app communicates with the iframe using the `postMessage` API.
- **Persistence**: Since no backend is connected, all user data (watchlist, history, profile) is stored in `localStorage`. Clearing your browser data will reset the application state.
