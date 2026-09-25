import { useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovie } from "../services/movieApi";
import { useAsync } from "../hooks/useAsync";
import MovieImage from "../components/MovieImage";
import FavoriteButton from "../components/FavoriteButton";
import Icon from "../components/Icon";
import { ErrorState, LoadingState } from "../components/States";
export default function MovieDetails() {
  const { id } = useParams();
  const load = useCallback((signal) => getMovie(id, signal), [id]);
  const { data: movie, loading, error, retry } = useAsync(load);
  useEffect(() => {
    if (movie) document.title = `${movie.title} — Movie Portal`;
  }, [movie]);
  if (loading)
    return (
      <div className="page">
        <LoadingState />
      </div>
    );
  if (error)
    return (
      <div className="page">
        <ErrorState
          message={error}
          retry={error.includes("not found") ? undefined : retry}
        />
      </div>
    );
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "Not available";
  let language = movie.original_language || "Not available";
  try {
    if (movie.original_language)
      language = new Intl.DisplayNames(["en"], { type: "language" }).of(
        movie.original_language,
      );
  } catch {
    /* Keep the language code. */
  }
  return (
    <div className="details-page">
      <Link to="/discover" className="back-link">
        ← Back to discovery
      </Link>
      <div className="details-visual">
        <MovieImage path={movie.backdrop_path} backdrop eager />
        <div />
      </div>
      <section className="details-content">
        <div className="details-poster">
          <MovieImage path={movie.poster_path} title={movie.title} eager />
        </div>
        <div className="details-copy">
          <p className="eyebrow">THE FILM IN FOCUS</p>
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}
          <div className="hero-meta">
            <span className="hero-rating">
              <Icon name="star" size={18} />
              {movie.vote_average?.toFixed(1) || "NR"}
              <span className="muted"> / 10</span>
            </span>
            <span>{movie.release_date?.slice(0, 4) || "TBA"}</span>
            <span>{runtime}</span>
          </div>
          <div className="detail-genres">
            {movie.genres?.map((genre) => (
              <Link
                className="genre-chip"
                key={genre.id}
                to={`/discover?genre=${genre.id}`}
              >
                {genre.name}
              </Link>
            ))}
          </div>
          <h2>Overview</h2>
          <p className="overview">
            {movie.overview ||
              "An overview isn’t available for this movie yet."}
          </p>
          <FavoriteButton movie={movie} />
          <dl className="movie-facts">
            <div>
              <dt>Release date</dt>
              <dd>
                {movie.release_date
                  ? new Date(
                      `${movie.release_date}T12:00:00`,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "To be announced"}
              </dd>
            </div>
            <div>
              <dt>Original language</dt>
              <dd>{language}</dd>
            </div>
            <div>
              <dt>Runtime</dt>
              <dd>{runtime}</dd>
            </div>
            {movie.vote_count > 0 && (
              <div>
                <dt>Audience votes</dt>
                <dd>{movie.vote_count.toLocaleString()}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>
    </div>
  );
}
