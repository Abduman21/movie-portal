import { useMovieContext } from "../contexts/favorites";
import Icon from "./Icon";
export default function FavoriteButton({ movie, compact = false }) {
  const { isFavorite, toggleFavorite } = useMovieContext();
  const saved = isFavorite(movie.id);
  return (
    <button
      className={`${compact ? "save-button" : "button secondary"} ${saved ? "saved" : ""}`}
      aria-label={`${saved ? "Remove" : "Add"} ${movie.title} ${saved ? "from" : "to"} watchlist`}
      aria-pressed={saved}
      onClick={() => toggleFavorite(movie)}
    >
      <Icon name={saved ? "check" : compact ? "bookmark" : "plus"} />
      {!compact && (saved ? "In your watchlist" : "Add to watchlist")}
    </button>
  );
}
