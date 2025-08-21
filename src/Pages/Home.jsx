import MovieCard from "../components/MovieCard"

function Home() {

    const movies = [
        {id: 1, title: "john wick",release_date: "2020"},
        {id: 2, title: "terminator",release_date: "2099"},
        {id: 3, title: "the matrix",release_date: "2098"}
    ]
  return (
    <div className="Home">
      <div className="movie-grid">
        {movies.map(movie => <MovieCard movie= {movie} key={movie.id}/>)}
      </div>
    </div>
  );
}
