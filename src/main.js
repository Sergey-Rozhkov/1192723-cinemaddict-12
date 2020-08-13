import {FILMS_CARD_COUNT, TOP_RATED_COUNT, MOST_RECOMMENDED_COUNT, FILMS_COUNT_PER_STEP} from "./const.js";
import {getRandomInteger, renderElement, RenderPosition} from "./utils.js";

import UserProfileBlockView from "./view/user-profile-block.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import FilmsBlockView from "./view/films-block.js";
import FilmsListView from "./view/film-list.js";
import FilmsView from "./view/films.js";
import FilmCardView from "./view/film-card.js";
import ShowMoreView from "./view/show-more.js";
import MostRecommendedBlockView from "./view/most-recommended-block.js";
import TopRatedBlockView from "./view/top-rated-block.js";
import FilmDetailView from "./view/film-details.js";
import StatisticView from "./view/statistic.js";

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";

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

renderElement(headerElement, new UserProfileBlockView(watchedFilmsCount).getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const renderFilm = (container, film) => {
  const filmComponent = new FilmCardView(film);
  const filmDetailComponent = new FilmDetailView(film);

  const openFilmDetail = () => {
    renderElement(footerElement, filmDetailComponent.getElement(), RenderPosition.AFTEREND);

    filmDetailComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
      closeFilmDetail();
    });

    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const closeFilmDetail = () => {
    filmDetailComponent.getElement().remove();
    filmDetailComponent.removeElement();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      closeFilmDetail();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  filmComponent.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => {
    openFilmDetail();
  });

  filmComponent.getElement().querySelector(`.film-card__title`).addEventListener(`click`, () => {
    openFilmDetail();
  });

  filmComponent.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, () => {
    openFilmDetail();
  });

  renderElement(container, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderFilmsBoard = (boardContainer, boardFilms, boardTopRatedFilms = [], boardMostRecommendedFilms = []) => {
  const filmsBlockComponent = new FilmsBlockView();
  const filmsListComponent = new FilmsListView();
  const filmsComponent = new FilmsView();

  renderElement(boardContainer, filmsBlockComponent.getElement(), RenderPosition.BEFOREEND);
  renderElement(filmsBlockComponent.getElement(), filmsListComponent.getElement(), RenderPosition.BEFOREEND);
  renderElement(filmsListComponent.getElement(), filmsComponent.getElement(), RenderPosition.BEFOREEND);

  boardFilms
    .slice(0, FILMS_COUNT_PER_STEP)
    .forEach((film) => renderFilm(filmsComponent.getElement(), film));

  if (boardFilms.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmCount = FILMS_COUNT_PER_STEP;

    const showMoreFilmsBtn = new ShowMoreView();
    renderElement(filmsComponent.getElement(), showMoreFilmsBtn.getElement(), RenderPosition.AFTEREND);

    showMoreFilmsBtn.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      boardFilms
        .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsComponent.getElement(), film));

      renderedFilmCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmCount >= boardFilms.length) {
        showMoreFilmsBtn.remove();
      }
    });
  }

  if (boardTopRatedFilms) {
    const topRatedFilmsComponent = new TopRatedBlockView();
    renderElement(filmsBlockComponent.getElement(), topRatedFilmsComponent.getElement(), RenderPosition.BEFOREEND);

    const topRatedFilmsElement = topRatedFilmsComponent.getElement().querySelector(`.films-list__container`);
    boardTopRatedFilms
      .slice()
      .forEach((film) => renderFilm(topRatedFilmsElement, film));
  }

  if (boardMostRecommendedFilms) {
    const moreRecommendedFilmsComponent = new MostRecommendedBlockView();
    renderElement(filmsBlockComponent.getElement(), moreRecommendedFilmsComponent.getElement(), RenderPosition.BEFOREEND);

    const mostRecommendedFilmsElement = moreRecommendedFilmsComponent.getElement().querySelector(`.films-list__container`);
    boardMostRecommendedFilms
      .slice()
      .forEach((film) => renderFilm(mostRecommendedFilmsElement, film));
  }
};

renderFilmsBoard(mainElement, films, topRatedFilms, mostRecommendedFilms);

renderElement(footerStatisticElement, new StatisticView(filmsCountInBase).getElement(), RenderPosition.BEFOREEND);
