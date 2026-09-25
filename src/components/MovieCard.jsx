import { Link } from "react-router-dom";
import { genres } from "../data/demoMovies";
import MovieImage from "./MovieImage";
import FavoriteButton from "./FavoriteButton";
import Icon from "./Icon";
export default function MovieCard({ movie }) {
  const genre =
    movie.genres?.[0]?.name ||
    genres.find((item) => item.id === movie.genre_ids?.[0])?.name;
  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <Link to={`/movie/${movie.id}`} aria-label={`View ${movie.title}`}>
          <MovieImage path={movie.poster_path} title={movie.title} />
          <span className="poster-details">
            Explore film <Icon name="arrow" />
          </span>
        </Link>
        <FavoriteButton movie={movie} compact />
        <span className="rating">
          <Icon name="star" size={13} />
          {movie.vote_average ? movie.vote_average.toFixed(1) : "NR"}
        </span>
      </div>
      <h3>
        <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
      </h3>
      <p className="card-meta">
        {movie.release_date?.slice(0, 4) || "TBA"}
        {genre && (
          <>
            <span>•</span>
            {genre}
          </>
        )}
      </p>
    </article>
  );
}
