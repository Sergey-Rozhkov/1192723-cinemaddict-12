import {DATE_LOCALE} from "../const.js";

export const humanizeFilmReleaseYear = (date) => {
  return date.toLocaleString(DATE_LOCALE, {year: `numeric`});
};

export const humanizeFilmReleaseDate = (date) => {
  const day = (`0` + date.getDate()).slice(-2);
  const month = date.toLocaleString(DATE_LOCALE, {month: `long`});
  return `${day} ${month} ${date.getFullYear()}`;
};

export const humanizeCommentDate = (date) => {
  const month = (`0` + (date.getMonth() + 1)).slice(-2);
  const day = (`0` + date.getDate()).slice(-2);
  const hours = (`0` + date.getHours()).slice(-2);
  const minutes = (`0` + date.getMinutes()).slice(-2);
  return `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}`;
};

export const isFilmInWatchlist = (film) => {
  return film.inWatchlist;
};

export const isFilmAlreadyWatched = (film) => {
  return film.isAlreadyWatched;
};

export const isFilmInFavorite = (film) => {
  return film.isFavorite;
};

export const sortFilmsByDate = (firstFilm, secondFilm) => {
  return secondFilm.date.getTime() - firstFilm.date.getTime();
};

export const sortFilmsByRating = (firstFilm, secondFilm) => {
  return secondFilm.rating - firstFilm.rating;
};
