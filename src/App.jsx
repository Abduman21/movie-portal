import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Discover from "./Pages/Discover";
import Favorites from "./Pages/Favorites";
import SearchResults from "./Pages/SearchResults";
import MovieDetails from "./Pages/MovieDetails";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { EmptyState } from "./components/States";
import { isDemo } from "./services/movieApi";
import { useMovieContext } from "./contexts/favorites";
export default function App() {
  const { pathname, search } = useLocation();
  const { storageError } = useMovieContext();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${pathname === "/" ? "Discover your next great watch" : pathname === "/favorites" ? "Your watchlist" : pathname === "/search" ? "Search movies" : "Discover movies"} — Movie Portal`;
  }, [pathname, search]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <NavBar />
      {isDemo && (
        <div className="demo-notice">
          <span className="live-dot" /> You’re exploring the demo collection{" "}
          <span>· A handpicked taste of Movie Portal</span>
        </div>
      )}
      {storageError && (
        <div className="storage-notice" role="alert">
          Your browser couldn’t save this watchlist. Changes will last for this
          visit only.
        </div>
      )}
      <main id="main-content" className="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route
            path="*"
            element={
              <EmptyState
                title="This scene is missing."
                description="We couldn’t find that page. Let’s find you a great movie instead."
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
