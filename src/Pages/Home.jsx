import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getCollection, isDemo } from "../services/movieApi";
import { useAsync } from "../hooks/useAsync";
import Hero from "../components/Hero";
import MovieGrid from "../components/MovieGrid";
import Icon from "../components/Icon";
import { LoadingState, ErrorState, EmptyState } from "../components/States";

const sections = [
  {
    key: "trending",
    title: "Trending now",
    subtitle: "The films everyone is talking about.",
    number: "01",
  },
  {
    key: "popular",
    title: "Crowd favorites",
    subtitle: "Big stories. Lasting impressions.",
    number: "02",
  },
  {
    key: "top_rated",
    title: "Worth every minute",
    subtitle: "Highly rated, for a reason.",
    number: "03",
  },
  {
    key: "upcoming",
    title: "Coming to the big screen",
    subtitle: "Something to look forward to.",
    number: "04",
  },
];
function MovieSection({ section }) {
  const load = useCallback(
    (signal) => getCollection(section.key, signal),
    [section.key],
  );
  const { data, loading, error, retry } = useAsync(load);
  return (
    <MovieSectionContent
      section={section}
      data={data}
      loading={loading}
      error={error}
      retry={retry}
    />
  );
}
function MovieSectionContent({ section, data, loading, error, retry }) {
  const to = `/discover?${section.key === "top_rated" ? "sort=vote_average.desc" : section.key === "upcoming" ? "category=upcoming&sort=primary_release_date.desc" : ""}`;
  return (
    <section className="collection">
      <div className="section-heading">
        <div>
          <div className="section-title">
            <span className="section-number">{section.number}</span>
            <h2>{section.title}</h2>
            {isDemo && section.key === "trending" && (
              <span className="pill">Sample picks</span>
            )}
          </div>
          <p>{section.subtitle}</p>
        </div>
        <Link className="text-link" to={to}>
          {section.key === "trending" ? "Explore all" : "View all"}{" "}
          <Icon name="arrow" size={17} />
        </Link>
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={retry} />
      ) : data?.length ? (
        <MovieGrid
          movies={
            isDemo && section.key === "popular"
              ? data.slice(6, 12).length
                ? data.slice(6, 12)
                : data.slice(0, 6)
              : data.slice(0, 6)
          }
        />
      ) : (
        <div className="upcoming-empty">
          <Icon name="film" size={28} />
          <div>
            <h3>
              {isDemo
                ? "Fresh releases, with a live catalog."
                : "No titles available yet."}
            </h3>
            <p>
              {isDemo
                ? "You’re exploring our demo collection. Upcoming releases appear when the live movie catalog is connected."
                : "Check back soon for the next wave of cinema."}
            </p>
          </div>
          <Link to="/discover" className="text-link">
            Explore the collection <Icon name="arrow" />
          </Link>
        </div>
      )}
    </section>
  );
}
export default function Home() {
  const load = useCallback((signal) => getCollection("trending", signal), []);
  const { data, loading, error, retry } = useAsync(load);
  return (
    <>
      <div className="home-intro">
        <div>
          <p className="eyebrow">FOR THE LOVE OF CINEMA</p>
          <h2>Your next great watch.</h2>
        </div>
        <span className="intro-note">Discover. Save. Get lost in a story.</span>
      </div>
      {loading ? (
        <div className="hero-loading">
          <LoadingState />
        </div>
      ) : error ? (
        <ErrorState message={error} retry={retry} />
      ) : data?.[0] ? (
        <Hero movie={data[0]} />
      ) : (
        <EmptyState
          title="The spotlight is taking a break"
          description="Explore the rest of the movie catalog."
        />
      )}
      <div className="genre-strip">
        <span>IN THE MOOD FOR</span>
        {[
          ["All movies", ""],
          ["Action", "28"],
          ["Adventure", "12"],
          ["Animation", "16"],
          ["Comedy", "35"],
          ["Drama", "18"],
          ["Sci-fi", "878"],
          ["Thriller", "53"],
        ].map(([label, id]) => (
          <Link
            key={label}
            className={id ? "genre-chip" : "genre-chip selected"}
            to={`/discover${id ? `?genre=${id}` : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
      <MovieSectionContent
        section={sections[0]}
        data={data}
        loading={loading}
        error={error}
        retry={retry}
      />
      {sections.slice(1).map((section) => (
        <MovieSection key={section.key} section={section} />
      ))}
      <section className="watchlist-banner">
        <div>
          <p className="eyebrow">YOUR OWN LITTLE FILM CLUB</p>
          <h2>Great finds deserve a place.</h2>
          <p>
            Keep the films you love and the ones you can’t wait to see, all
            together.
          </p>
        </div>
        <Link className="button primary" to="/favorites">
          Your watchlist <Icon name="bookmark" />
        </Link>
      </section>
    </>
  );
}
