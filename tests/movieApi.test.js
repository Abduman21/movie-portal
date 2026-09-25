import test from "node:test";
import assert from "node:assert/strict";
import { createMovieRequest } from "../src/services/tmdbClient.js";
import {
  findMovies,
  getMovie,
  getCollection,
  imageUrl,
} from "../src/services/movieApi.js";

test("demo search is case insensitive and filters compose", async () => {
  assert.equal((await findMovies({ query: "  DUNE  " })).total_results, 2);
  const filtered = await findMovies({ genre: "16", year: "2001", rating: "8" });
  assert.deepEqual(
    filtered.results.map((movie) => movie.title),
    ["Spirited Away"],
  );
  assert.equal(
    (await findMovies({ genre: "16", rating: "9" })).total_results,
    0,
  );
});
test("sorting does not mutate the catalog", async () => {
  const original = (await getCollection()).map((movie) => movie.id);
  const sorted = (await findMovies({ sort: "vote_average.desc" })).results;
  assert.ok(
    sorted.every(
      (movie, index) =>
        index === 0 || sorted[index - 1].vote_average >= movie.vote_average,
    ),
  );
  assert.deepEqual(
    (await getCollection()).map((movie) => movie.id),
    original,
  );
});
test("demo never claims released films are upcoming", async () => {
  assert.deepEqual(await getCollection("upcoming"), []);
  assert.equal((await findMovies({ category: "upcoming" })).total_results, 0);
});
test("missing movie and artwork are explicit", async () => {
  await assert.rejects(getMovie("invalid"), /not found/);
  await assert.rejects(getMovie("999999999"), /not found/);
  assert.equal(imageUrl(null), null);
});
test("successful requests encode parameters and reuse cached results", async (t) => {
  const urls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    urls.push(new URL(url));
    return { ok: true, json: async () => ({ results: [{ id: 1 }] }) };
  });
  const request = createMovieRequest("test-only");
  const first = await request("search/movie", { query: "A & B" });
  assert.deepEqual(await request("search/movie", { query: "A & B" }), first);
  assert.equal(urls.length, 1);
  assert.equal(urls[0].searchParams.get("query"), "A & B");
});
test("failed requests remain errors and can be retried", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () =>
    ++calls === 1
      ? { ok: false, status: 401 }
      : { ok: true, json: async () => ({ results: [] }) },
  );
  const request = createMovieRequest("test-only");
  await assert.rejects(request("movie/popular", {}), /authentication failed/);
  assert.deepEqual(await request("movie/popular", {}), { results: [] });
  assert.equal(calls, 2);
});
test("network failures produce a useful connection message", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("Failed to fetch");
  });
  await assert.rejects(
    createMovieRequest("test-only")("movie/popular", {}),
    /connection/,
  );
});
test("navigation cancellation reaches the in-flight request", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    (_url, { signal }) =>
      new Promise((_resolve, reject) =>
        signal.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError")),
        ),
      ),
  );
  const controller = new AbortController();
  const pending = createMovieRequest("test-only")(
    "movie/popular",
    {},
    controller.signal,
  );
  controller.abort();
  await assert.rejects(pending, { name: "AbortError" });
});
