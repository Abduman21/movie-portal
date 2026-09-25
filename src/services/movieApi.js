import { createMovieRequest } from "./tmdbClient.js";
import { demoMovies, genres } from "../data/demoMovies.js";
const apiKey = import.meta.env?.VITE_TMDB_API_KEY?.trim();
export const isDemo = !apiKey;
const request = createMovieRequest(apiKey);
export const imageUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export async function getCollection(category = "popular", signal) {
  if (isDemo)
    return category === "upcoming"
      ? []
      : category === "top_rated"
        ? [...demoMovies].sort((a, b) => b.vote_average - a.vote_average)
        : demoMovies;
  return (
    (
      await request(
        category === "trending" ? "trending/movie/week" : `movie/${category}`,
        {},
        signal,
      )
    ).results || []
  );
}
export async function getMovie(id, signal) {
  if (!/^\d+$/.test(String(id))) throw new Error("Movie not found.");
  if (!isDemo) return request(`movie/${id}`, {}, signal);
  const movie = demoMovies.find((item) => item.id === Number(id));
  if (!movie) throw new Error("Movie not found in the demo catalog.");
  return movie;
}
export async function getGenres(signal) {
  return isDemo
    ? genres
    : (await request("genre/movie/list", {}, signal)).genres;
}
export async function findMovies(
  {
    query = "",
    genre = "",
    year = "",
    rating = "",
    sort = "popularity.desc",
    page = 1,
    category = "",
  },
  signal,
) {
  if (isDemo) {
    let movies = category === "upcoming" ? [] : [...demoMovies];
    movies = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query.trim().toLowerCase()) &&
        (!genre || movie.genre_ids.includes(Number(genre))) &&
        (!year || movie.release_date.startsWith(year)) &&
        movie.vote_average >= Number(rating),
    );
    movies.sort((a, b) =>
      sort === "title.asc"
        ? a.title.localeCompare(b.title)
        : sort === "vote_average.desc"
          ? b.vote_average - a.vote_average
          : sort === "primary_release_date.desc"
            ? b.release_date.localeCompare(a.release_date)
            : b.popularity - a.popularity,
    );
    return {
      results: movies,
      page: 1,
      total_pages: 1,
      total_results: movies.length,
    };
  }
  if (query.trim())
    return request(
      "search/movie",
      { query: query.trim(), include_adult: "false", page },
      signal,
    );
  const params = {
    page,
    include_adult: "false",
    sort_by: sort,
    "vote_count.gte": sort === "vote_average.desc" ? 200 : 0,
  };
  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;
  if (rating) params["vote_average.gte"] = rating;
  if (category === "upcoming")
    params["primary_release_date.gte"] = new Date().toISOString().slice(0, 10);
  return request("discover/movie", params, signal);
}
