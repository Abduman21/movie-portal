import { useMovieContext } from "../contexts/favorites";
import MovieGrid from "../components/MovieGrid";
import { EmptyState } from "../components/States";
export default function Favorites() {
  const { favorites } = useMovieContext();
  return (
    <div className="page">
      <header className="page-heading">
        <p className="eyebrow">SAVED FOR A GOOD NIGHT</p>
        <h1>Your watchlist.</h1>
        <p>A personal collection of stories you don’t want to miss.</p>
      </header>
      <div className="results-heading">
        <h2>Your saved films</h2>
        <span>
          {favorites.length} {favorites.length === 1 ? "movie" : "movies"} ·
          Saved on this device
        </span>
      </div>
      {favorites.length ? (
        <MovieGrid movies={favorites} />
      ) : (
        <EmptyState
          title="No favorite movies yet."
          description="See something you like? Tap the bookmark on a movie to save it here for later."
        />
      )}
    </div>
  );
}
