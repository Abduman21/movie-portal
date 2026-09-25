import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import MovieImage from "./MovieImage";
import Icon from "./Icon";
import { genres } from "../data/demoMovies";
export default function Hero({ movie }) {
  const names =
    movie.genres?.map((genre) => genre.name) ||
    genres
      .filter((genre) => movie.genre_ids?.includes(genre.id))
      .map((genre) => genre.name);
  return (
    <section className="hero" aria-labelledby="featured-title">
      <MovieImage
        path={movie.backdrop_path}
        backdrop
        eager
        className="hero-backdrop"
      />
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow">
          <span className="live-dot" /> THE SPOTLIGHT
        </p>
        <h1 id="featured-title">{movie.title}</h1>
        <div className="hero-meta">
          <span className="hero-rating">
            <Icon name="star" size={16} />{" "}
            {movie.vote_average?.toFixed(1) || "NR"}
          </span>
          <span>{movie.release_date?.slice(0, 4) || "TBA"}</span>
          <span>{names.slice(0, 2).join(" / ")}</span>
        </div>
        <p className="hero-overview">
          {movie.overview || "A new story is waiting to be discovered."}
        </p>
        <div className="actions">
          <Link className="button primary" to={`/movie/${movie.id}`}>
            Explore movie <Icon name="arrow" size={18} />
          </Link>
          <FavoriteButton movie={movie} />
        </div>
      </div>
      <div className="hero-caption">
        <span>THE NEXT GREAT STORY</span>
        <span>Starts here.</span>
      </div>
    </section>
  );
}
