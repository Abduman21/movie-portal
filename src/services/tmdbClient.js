// Isolated transport: each client owns a short-lived response cache.
export function createMovieRequest(apiKey) {
  const cache = new Map();
  return async function request(path, params, signal) {
    const query = new URLSearchParams({
      api_key: apiKey,
      language: "en-US",
      ...params,
    });
    const url = `https://api.themoviedb.org/3/${path}?${query}`;
    const cached = cache.get(url);
    if (cached && Date.now() - cached.time < 300000) return cached.data;
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(abort, 12000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok)
        throw new Error(
          response.status === 404
            ? "Movie not found."
            : response.status === 401
              ? "Movie service authentication failed. Check your TMDB configuration."
              : response.status === 429
                ? "The movie service is busy. Please try again shortly."
                : "We couldn’t reach the movie catalog. Please try again.",
        );
      const data = await response.json();
      cache.set(url, { data, time: Date.now() });
      return data;
    } catch (error) {
      if (signal?.aborted) throw error;
      if (error.name === "AbortError")
        throw new Error("The request took too long. Please try again.");
      if (error instanceof TypeError)
        throw new Error(
          "You seem to be offline. Check your connection and try again.",
        );
      throw error;
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
    }
  };
}
