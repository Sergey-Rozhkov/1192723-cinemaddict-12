import Observer from "../utils/observer";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._broadcast(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._broadcast(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          commentsCount: film.comments.length,
          poster: film.film_info.poster,
          fullPoster: film.film_info.poster,
          name: film.film_info.title,
          originalName: film.film_info.alternative_title,
          producer: film.film_info.director,
          writers: film.film_info.writers,
          actors: film.film_info.actors,
          rating: film.film_info.total_rating,
          date: film.film_info.release.date,
          duration: film.film_info.runtime,
          genres: film.film_info.genre,
          countries: [film.film_info.release.release_country],
          shortDescription: film.film_info.description,
          description: film.film_info.description,
          ageRating: film.film_info.age_rating,
          inWatchlist: film.user_details.watchlist,
          isAlreadyWatched: film.user_details.already_watched,
          isFavorite: film.user_details.favorite,
          watchingDate: film.user_details.watching_date
        }
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "user_details": {
            "watchlist": film.inWatchlist,
            "already_watched": film.isAlreadyWatched,
            "watching_date": `2019-04-12T16:12:32.554Z`,
            "favorite": film.isFavorite
          }
        }
    );

    return adaptedFilm;
  }
}
