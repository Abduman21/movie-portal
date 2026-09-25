import { useEffect, useState } from "react";
import { MovieContext } from "./favorites";

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    return Array.isArray(saved)
      ? saved.filter(
          (movie, index, all) =>
            movie &&
            Number.isInteger(movie.id) &&
            typeof movie.title === "string" &&
            all.findIndex((item) => item?.id === movie.id) === index,
        )
      : [];
  } catch {
    return [];
  }
}
export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState(readFavorites);
  const [storageError, setStorageError] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [favorites]);
  const isFavorite = (id) => favorites.some((movie) => movie.id === id);
  const toggleFavorite = (movie) => {
    const saved = isFavorite(movie.id);
    setFavorites((previous) =>
      previous.some((item) => item.id === movie.id)
        ? previous.filter((item) => item.id !== movie.id)
        : [...previous, movie],
    );
    setAnnouncement(
      `${movie.title} ${saved ? "removed from" : "added to"} your watchlist.`,
    );
  };
  return (
    <MovieContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, storageError }}
    >
      {children}
      <div className="sr-only" role="status">
        {announcement}
      </div>
    </MovieContext.Provider>
  );
}
