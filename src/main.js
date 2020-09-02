import {
  RenderPosition,
  END_POINT,
  AUTHORIZATION, UpdateType
} from "./const";
import {renderElement} from "./utils/render";
import {getRandomInteger} from "./utils/common";

import UserProfileBlockView from "./view/user-profile-block";
import StatisticView from "./view/statistic";

import AppPageModePresenter from "./presenter/page-mode";
import MovieListPresenter from "./presenter/movie-list";
import FilterPresenter from "./presenter/filter";
import StatisticsPresenter from "./presenter/statistics";
import FilmsModel from "./model/films";
import FilterModel from "./model/filter";
import AppPageModeModel from "./model/page-mode";
import {countWatchedFilms} from "./utils/statistics";
import Api from "./api";

const api = new Api(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const filmsCountInBase = getRandomInteger(10000, 1000000);
const watchedFilmsCount = countWatchedFilms(filmsModel.getFilms());

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);

renderElement(headerElement, new UserProfileBlockView(watchedFilmsCount), RenderPosition.BEFOREEND);

const pageModeModel = new AppPageModeModel();

const movieListPresenter = new MovieListPresenter(mainElement, filmsModel, filterModel, pageModeModel);
const statisticsPresenter = new StatisticsPresenter(mainElement, filmsModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel, pageModeModel);
filterPresenter.init();
movieListPresenter.init(true);

const appPageModePresenter = new AppPageModePresenter(mainElement, pageModeModel, movieListPresenter, statisticsPresenter);
appPageModePresenter.init();

renderElement(footerStatisticElement, new StatisticView(filmsCountInBase), RenderPosition.BEFOREEND);

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
