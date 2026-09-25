import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { findMovies } from "../services/movieApi";
import { useAsync } from "../hooks/useAsync";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import { EmptyState, ErrorState, LoadingState } from "../components/States";
export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const query = (params.get("q") || "").trim();
  const page = Math.max(1, Math.min(500, Number(params.get("page")) || 1));
  const load = useCallback(
    (signal) =>
      query ? findMovies({ query, page }, signal) : Promise.resolve(null),
    [query, page],
  );
  const { data, loading, error, retry } = useAsync(load);
  return (
    <div className="page">
      <header className="page-heading">
        <p className="eyebrow">LET CURIOSITY LEAD</p>
        <h1>Find a story worth your time.</h1>
        <p>Search for a film you love, or one you’ve been meaning to see.</p>
      </header>
      <SearchBar key={query} initialQuery={query} large />
      {!query ? (
        <EmptyState
          title="What’s on your mind?"
          description="Enter a movie title above, or explore the collection."
        />
      ) : (
        <>
          <div className="results-heading">
            <h2>Results for “{query}”</h2>
            <span role="status">
              {!loading && !error && `${data?.total_results || 0} movies found`}
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
              title="No matching movies"
              description="Try a different title or check the spelling. A new favorite might be just one search away."
            />
          )}
          {data?.total_pages > 1 && (
            <div className="pagination">
              <button
                className="button secondary"
                disabled={page <= 1}
                onClick={() => setParams({ q: query, page: String(page - 1) })}
              >
                Previous
              </button>
              <span>
                Page {page} of {Math.min(data.total_pages, 500)}
              </span>
              <button
                className="button secondary"
                disabled={page >= Math.min(data.total_pages, 500)}
                onClick={() => setParams({ q: query, page: String(page + 1) })}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
