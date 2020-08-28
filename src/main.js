import {FILMS_CARD_COUNT, TOP_RATED_COUNT, MOST_RECOMMENDED_COUNT, RenderPosition} from "./const";
import {renderElement} from "./utils/render";
import {getRandomInteger} from "./utils/common";

import UserProfileBlockView from "./view/user-profile-block";
import StatisticView from "./view/statistic";

import {generateFilm} from "./mock/film";

import MovieListPresenter from "./presenter/movie-list";
import FilterPresenter from "./presenter/filter";
import FilmsModel from "./model/films";
import FilterModel from "./model/filter";


const films = new Array(FILMS_CARD_COUNT).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const topRatedFilms = new Array(TOP_RATED_COUNT).fill().map(generateFilm);
const mostRecommendedFilms = new Array(MOST_RECOMMENDED_COUNT).fill().map(generateFilm);
const filmsCountInBase = getRandomInteger(10000, 1000000);
const watchedFilmsCount = getRandomInteger(0, 30);

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

renderElement(headerElement, new UserProfileBlockView(watchedFilmsCount), RenderPosition.BEFOREEND);

const movieListPresenter = new MovieListPresenter(mainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);
movieListPresenter.init(topRatedFilms, mostRecommendedFilms);
filterPresenter.init();


renderElement(footerStatisticElement, new StatisticView(filmsCountInBase), RenderPosition.BEFOREEND);
