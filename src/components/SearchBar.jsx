import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
export default function SearchBar({ initialQuery = "", large = false }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  function submit(event) {
    event.preventDefault();
    navigate(
      query.trim()
        ? `/search?q=${encodeURIComponent(query.trim())}`
        : "/search",
    );
  }
  return (
    <form
      className={`search-form ${large ? "search-large" : ""}`}
      role="search"
      onSubmit={submit}
    >
      <Icon name="search" />
      <input
        aria-label="Search movies"
        type="search"
        placeholder="Find your next favorite film…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        maxLength={150}
      />
      {query && (
        <button
          type="button"
          className="icon-button"
          aria-label="Clear search"
          onClick={() => {
            setQuery("");
            if (large) navigate("/search");
          }}
        >
          <Icon name="close" size={16} />
        </button>
      )}
      <button
        type="submit"
        className={large ? "button primary" : "search-submit"}
        aria-label="Search"
      >
        {large ? "Search" : <Icon name="arrow" size={17} />}
      </button>
    </form>
  );
}
