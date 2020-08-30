import moment from "moment";

export const countWatchedFilms = (films) => {
  return films.filter((film) => film.isAlreadyWatched).length;
};

export const getWatchedFilmsDuration = (films) => {
  const duration = films.reduce((counter, film) => {
    return counter + film.duration;
  }, 0);


  if (duration === 0) {
    return {
      hours: 0,
      minutes: 0
    };
  }

  const momentDuration = moment.duration(duration, `minutes`);
  return {
    hours: momentDuration.hours(),
    minutes: momentDuration.minutes()
  };
};
