import { Link } from "react-router-dom";
import { isDemo } from "../services/movieApi";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link to="/" className="footer-brand">
          movieportal<span>.</span>
        </Link>
        <p>Good stories stay with you. Find your next one.</p>
      </div>
      <div className="footer-credit">
        <span>
          {isDemo
            ? "Demo catalog · Sample ratings"
            : "Movie data provided by TMDB"}
        </span>
        <p>
          This product uses the{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
          >
            TMDB API
          </a>{" "}
          but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  );
}
