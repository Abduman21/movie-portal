import { Link } from "react-router-dom";
import Icon from "./Icon";
export function EmptyState({
  title = "Nothing here yet",
  description,
  action = "Discover movies",
  to = "/discover",
}) {
  return (
    <div className="empty-state">
      <div className="state-icon">
        <Icon name="film" size={30} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="button primary" to={to}>
        {action}
        <Icon name="arrow" />
      </Link>
    </div>
  );
}
export function ErrorState({ message, retry }) {
  return (
    <div className="empty-state" role="alert">
      <div className="state-icon">!</div>
      <h2>A little intermission</h2>
      <p>{message}</p>
      <div className="actions">
        {retry && (
          <button className="button primary" onClick={retry}>
            Try again
          </button>
        )}
        <Link className="button secondary" to="/discover">
          Browse movies
        </Link>
      </div>
    </div>
  );
}
export function LoadingState() {
  return (
    <div className="loading-state" role="status">
      <span className="sr-only">Loading movies…</span>
      <div className="movie-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="skeleton-card" key={index}>
            <div />
            <span />
            <span />
          </div>
        ))}
      </div>
    </div>
  );
}
