import AbstractView from "./abstract.js";
import {MAX_FILM_DESCRIPTION_LENGTH, FILM_DESCRIPTION_AFTER_SIGN} from "../const.js";
import {humanizeFilmReleaseYear} from "../utils/film.js";


export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._openPopupFilmDetailHandler = this._openPopupFilmDetailHandler.bind(this);
  }

  _openPopupFilmDetailHandler() {
    this._callback.openFilmDetail();
  }

  setOpenPopupFilmDetailHandler(callback) {
    this._callback.openFilmDetail = callback;

    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._openPopupFilmDetailHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._openPopupFilmDetailHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._openPopupFilmDetailHandler);
  }

  getTemplate() {
    const {name, poster, date, genres, shortDescription, comments, duration, rating} = this._film;
    const filmGenres = genres.join(`, `);

    const filmDate = humanizeFilmReleaseYear(date);

    const description = shortDescription.length > MAX_FILM_DESCRIPTION_LENGTH
      ? shortDescription.substring(0, MAX_FILM_DESCRIPTION_LENGTH - 2) + FILM_DESCRIPTION_AFTER_SIGN
      : shortDescription;

    return (
      `<article class="film-card">
        <h3 class="film-card__title">${name}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${filmDate}</span>
          <span class="film-card__duration">${duration}</span>
          <span class="film-card__genre">${filmGenres}</span>
        </p>
        <img src="${poster}" alt="Film ${name}" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
        </form>
      </article>`
    );
  }
}

