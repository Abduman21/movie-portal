# Movie Portal

A responsive movie discovery app built with React 19, Vite, JavaScript, and React Router. A charcoal-and-lime visual identity, cinematic artwork, and a personal watchlist make it easy to find your next great watch.

## Run locally

Use Node.js 22.12+ (or 20.19+).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. No API key is needed for the demo collection.

```sh
npm run lint
npm test
npm run build
npm run preview
```

On Windows, if a stale npm shim reports a missing `npm-cli.js`, repair the Node installation or use the working bundled command: `& 'C:\Program Files\nodejs\npm.cmd' run dev` in PowerShell.

## Live movie data

1. Request a TMDB v3 API key in your [TMDB account settings](https://www.themoviedb.org/settings/api).
2. Copy `.env.example` to `.env` in the project root.
3. Set `VITE_TMDB_API_KEY=your_key_here` and restart Vite (or rebuild for production).

Environment files are ignored by Git. **Vite variables are included in the browser bundle**: an environment variable prevents committing a key but does not make it a server-side secret. Use a backend proxy if your deployment requires private credentials. The credential previously embedded in this project was removed; rotate it in TMDB if it has been published in repository history.

`src/services/movieApi.js` owns TMDB requests, a five-minute in-memory response cache, request cancellation, a twelve-second timeout, and actionable errors. The live service uses trending, popular, top-rated, upcoming, discovery, search, genre, and detail endpoints. Search is submitted explicitly, avoiding a network request on every keystroke. Live discovery filters and sorting run on the server, with pagination up to TMDB’s 500-page limit.

Without a key, the app uses twelve fixed films in `src/data/demoMovies.js`. The app clearly labels demo mode; sample ratings/popularity are not live rankings. Upcoming releases stay empty rather than mislabeling released films. Posters and fonts need an internet connection; missing artwork has a styled fallback and system fonts remain available. Demo descriptions are brief editorial summaries, and tagline text is showcase copy.

## Pages and interactions

- `/`: featured film, genre shortcuts, trending, popular, top-rated, and upcoming sections.
- `/discover`: genre, year, minimum rating, sorting, and pagination. Filters are encoded in shareable URLs.
- `/search?q=...`: submitted title search with clear, loading, error, and no-results states.
- `/movie/:id`: artwork, overview, genres, release date, runtime, language, audience score, and watchlist action.
- `/favorites`: saved movies with individual removal and an empty state.
- Unknown routes and unavailable movies show recovery links instead of blank pages.

Favorites use the original `favorites` localStorage key. The provider initializes from storage before writing, validates stored entries, removes duplicates, and handles malformed or unavailable storage. Saving is local to this browser and device; there are no accounts or cloud sync. Buttons expose their saved state to assistive technology and announce changes.

## Structure

```text
src/
  components/   # Navigation, hero, cards, grid, search, artwork, buttons, states, footer
  contexts/     # Watchlist provider and shared context hook
  data/         # Clearly labeled fallback collection and genre names
  hooks/        # Cancellable async loading
  Pages/        # Home, Discover, SearchResults, MovieDetails, Favorites
  services/     # TMDB and demo data access
  css/          # Responsive design system and component styles
```

The existing React/Vite/JavaScript stack and React Router dependency are retained. No runtime dependencies were added. Semantic elements, visible keyboard focus, a skip link, reduced-motion support, accessible control names, and lazy-loaded posters are included.

## Deployment

Build with `npm run build` and serve `dist`. Configure the host to rewrite unknown paths to `index.html` so direct links and page refreshes work with BrowserRouter. For subdirectory hosting, configure both Vite’s `base` and the router’s `basename`. Deployment is not configured by this change.

## Data and attribution

Movie metadata and artwork are from [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB. Artwork belongs to its respective owners. Review [TMDB’s API documentation](https://developer.themoviedb.org/docs/getting-started) and usage requirements before a public deployment.

## Validation

Run lint, the eight built-in Node service tests, and the production build before publishing. Service tests cover demo discovery, missing data, request caching, authentication retry, offline errors, and cancellation. Manually check:

- Search for `Dune`, search for a nonmatching title, and clear the search.
- Filter to Animation, change rating/year/sort, and reset.
- Add a film, reload the watchlist, remove it, and check the empty state.
- Open a film detail route directly and try an invalid ID and unknown route.
- Inspect navigation, filters, cards, and details at desktop, tablet, and mobile widths.
- With a live key, verify network errors, retry, pagination, and current upcoming releases.

Live authenticated results require a user-provided TMDB key. The demo is designed to work without one.
