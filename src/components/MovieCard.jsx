


function MovieCard({ Movie }) {
  function OnFavoriteClick() {
    alert("clicked");
  }
  return (
    <>
      <div className="Movie-Card">
        <div className="Movie-Poster">
          <img src={Movie.url} alt={Movie.title} />
          <div className="Movie-Overlay">
            <button className="Favorite-Btn" onClick={OnFavoriteClick}>
              💗
            </button>
          </div>
        </div>
        <div className="Movie-Info">
          <h3>{Movie.title}</h3>
          <p>{Movie.releas_date}</p>
        </div>
      </div>
    </>
  );
}

export default MovieCard;
