import moment from "moment";

const formatDateByTemplate = (date, format) => {
  if (!(date instanceof Date)) {
    return ``;
  }

  return moment(date).format(format);
};

export const formatFilmReleaseDate = (dueDate) => {
  return formatDateByTemplate(dueDate, `YYYY`);
};

export const formatFilmDetailReleaseDate = (date) => {
  return formatDateByTemplate(date, `DD MMMM YYYY`);
};

export const formatFilmDuration = (duration) => {
  if (!duration) {
    return ``;
  }

  const momentDuration = moment.duration(duration, `minutes`);
  return `${momentDuration.hours()}h ${momentDuration.minutes()}m`;
};

export const humanizeCommentDate = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }

  return moment(date).fromNow();
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
