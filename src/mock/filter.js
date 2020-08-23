import {isFilmInWatchlist, isFilmAlreadyWatched, isFilmInFavorite} from "../utils/film.js";

const filmToFilterMap = {
  all: {
    title: `All movies`,
    func: () => 0
  },
  watchlist: {
    title: `Watchlist`,
    func: (films) => films
      .filter((film) => isFilmInWatchlist(film)).length
  },
  history: {
    title: `History`,
    func: (films) => films
      .filter((film) => isFilmAlreadyWatched(film)).length
  },
  favorites: {
    title: `Favorites`,
    func: (films) => films
      .filter((film) => isFilmInFavorite(film)).length
  }
};

export const generateFilter = (films) => {
  return Object.entries(filmToFilterMap).map(([link, filter]) => {
    return {
      link,
      name: filter.title,
      count: filter.func(films),
    };
  });
};
