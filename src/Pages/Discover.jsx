import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { findMovies, getGenres, isDemo } from "../services/movieApi";
import { useAsync } from "../hooks/useAsync";
import { genres as fallbackGenres } from "../data/demoMovies";
import MovieGrid from "../components/MovieGrid";
import { EmptyState, ErrorState, LoadingState } from "../components/States";

export default function Discover() {
  const [params, setParams] = useSearchParams();
  const genre = params.get("genre") || "";
  const year = params.get("year") || "";
  const rating = params.get("rating") || "";
  const sort = params.get("sort") || "popularity.desc";
  const category = params.get("category") || "";
  const page = Math.max(1, Math.min(500, Number(params.get("page")) || 1));
  const load = useCallback(
    (signal) =>
      findMovies({ genre, year, rating, sort, category, page }, signal),
    [genre, year, rating, sort, category, page],
  );
  const loadGenres = useCallback((signal) => getGenres(signal), []);
  const { data, loading, error, retry } = useAsync(load);
  const { data: genreOptions } = useAsync(loadGenres);
  function change(key, value) {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }
  const years = Array.from(
    { length: new Date().getFullYear() - 1949 },
    (_, i) => String(new Date().getFullYear() + 1 - i),
  );
  return (
    <div className="page">
      <header className="page-heading">
        <p className="eyebrow">A WORLD OF STORIES</p>
        <h1>Discover your next favorite.</h1>
        <p>Follow your curiosity. There’s a film for every mood.</p>
      </header>
      <div className="filters">
        <label>
          Genre
          <select
            value={genre}
            onChange={(e) => change("genre", e.target.value)}
          >
            <option value="">All genres</option>
            {(genreOptions || fallbackGenres).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Release year
          <select value={year} onChange={(e) => change("year", e.target.value)}>
            <option value="">Any year</option>
            {years.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Minimum rating
          <select
            value={rating}
            onChange={(e) => change("rating", e.target.value)}
          >
            <option value="">Any rating</option>
            {[6, 7, 8, 9].map((item) => (
              <option key={item} value={item}>
                {item}+ / 10
              </option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select value={sort} onChange={(e) => change("sort", e.target.value)}>
            <option value="popularity.desc">Most popular</option>
            <option value="vote_average.desc">Highest rated</option>
            <option value="primary_release_date.desc">Newest releases</option>
            <option value="title.asc">Title A–Z</option>
          </select>
        </label>
        <button className="reset-button" onClick={() => setParams({})}>
          Reset filters
        </button>
      </div>
      <div className="results-heading">
        <h2>
          {category === "upcoming" ? "Upcoming movies" : "The collection"}
        </h2>
        <span>
          {loading
            ? "Finding films…"
            : `${data?.total_results?.toLocaleString() || 0} movies${isDemo ? " in the demo catalog" : ""}`}
        </span>
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={retry} />
      ) : data?.results.length ? (
        <MovieGrid movies={data.results} />
      ) : (
        <EmptyState
          title={
            category === "upcoming" && isDemo
              ? "Upcoming releases need the live catalog"
              : "No films fit this combination"
          }
          description="Try another genre, year, or rating to find something new."
          action="Reset discovery"
          to="/discover"
        />
      )}
      {data?.total_pages > 1 && (
        <div className="pagination">
          <button
            className="button secondary"
            disabled={page <= 1}
            onClick={() => change("page", String(page - 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {Math.min(data.total_pages, 500)}
          </span>
          <button
            className="button secondary"
            disabled={page >= Math.min(data.total_pages, 500)}
            onClick={() => change("page", String(page + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
