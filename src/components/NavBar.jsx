import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useMovieContext } from "../contexts/favorites";
import Icon from "./Icon";
import SearchBar from "./SearchBar";
export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { favorites } = useMovieContext();
  const { pathname } = useLocation();
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link to="/" className="brand" aria-label="Movie Portal home">
          <span className="brand-mark">
            <Icon name="film" size={23} />
          </span>
          movie<span className="brand-light">portal</span>
          <span className="brand-dot">.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/discover">Discover</NavLink>
          <NavLink to="/favorites">
            Watchlist <span className="nav-count">{favorites.length}</span>
          </NavLink>
        </nav>
        <div className="nav-search">
          <SearchBar key={pathname} />
        </div>
        <Link
          className="mobile-search icon-button"
          to="/search"
          aria-label="Search movies"
        >
          <Icon name="search" />
        </Link>
        <button
          className="menu-button icon-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
          onClick={() => setOpen(false)}
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/discover">Discover</NavLink>
          <NavLink to="/favorites">Watchlist ({favorites.length})</NavLink>
        </nav>
      )}
    </header>
  );
}
