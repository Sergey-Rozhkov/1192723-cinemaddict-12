import {FILMS_CARD_COUNT, TOP_RATED_COUNT, MOST_RECOMMENDED_COUNT, RenderPosition} from "./const";
import {renderElement} from "./utils/render";
import {getRandomInteger} from "./utils/common";

import UserProfileBlockView from "./view/user-profile-block";
import FilterView from "./view/filter";
import StatisticView from "./view/statistic";

import {generateFilm} from "./mock/film";
import {generateFilter} from "./mock/filter";

import MovieListPresenter from "./presenter/movie-list";

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

renderElement(headerElement, new UserProfileBlockView(watchedFilmsCount), RenderPosition.BEFOREEND);

const movieListPresenter = new MovieListPresenter(mainElement);
movieListPresenter.init(films, topRatedFilms, mostRecommendedFilms);
renderElement(mainElement, new FilterView(filters), RenderPosition.AFTERBEGIN);

renderElement(footerStatisticElement, new StatisticView(filmsCountInBase), RenderPosition.BEFOREEND);
