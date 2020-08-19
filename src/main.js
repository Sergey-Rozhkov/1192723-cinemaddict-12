import {FILMS_CARD_COUNT, TOP_RATED_COUNT, MOST_RECOMMENDED_COUNT, RENDER_POSITION} from "./const.js";
import {renderElement} from "./utils/render.js";
import {getRandomInteger} from "./utils/common.js";

import UserProfileBlockView from "./view/user-profile-block.js";
import FilterView from "./view/filter.js";
import StatisticView from "./view/statistic.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";

import MovieListPresenter from "./presenter/movie-list.js";

const films = new Array(FILMS_CARD_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);
const topRatedFilms = new Array(TOP_RATED_COUNT).fill().map(generateFilm);
const mostRecommendedFilms = new Array(MOST_RECOMMENDED_COUNT).fill().map(generateFilm);
const filmsCountInBase = getRandomInteger(10000, 1000000);
const watchedFilmsCount = getRandomInteger(0, 30);

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

renderElement(headerElement, new UserProfileBlockView(watchedFilmsCount), RENDER_POSITION.BEFOREEND);

const movieListPresenter = new MovieListPresenter(mainElement);
movieListPresenter.init(films, topRatedFilms, mostRecommendedFilms);
renderElement(mainElement, new FilterView(filters), RENDER_POSITION.AFTERBEGIN);

renderElement(footerStatisticElement, new StatisticView(filmsCountInBase), RENDER_POSITION.BEFOREEND);
