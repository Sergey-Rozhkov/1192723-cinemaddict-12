import Film from "../presenter/film";
import FilmsBlockView from "../view/films-block";
import FilmsListView from "../view/film-list";
import FilmsView from "../view/films";
import {renderElement, removeElement} from "../utils/render";
import FilmsListNoDataView from "../view/film-list-no-data";
import FilmsListTitleView from "../view/film-list-title";
import {FILMS_COUNT_PER_STEP, SortType, RenderPosition} from "../const";
import SortView from "../view/sort";
import ShowMoreView from "../view/show-more";
import TopRatedBlockView from "../view/top-rated-block";
import MostRecommendedBlockView from "../view/most-recommended-block";
import {updateItem} from "../utils/common";
import {sortFilmsByDate, sortFilmsByRating} from "../utils/film";

export default class MovieList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};

    this._filmsBlockComponent = new FilmsBlockView();
    this._filmsListComponent = new FilmsListView();
    this._filmsComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._showMoreFilmsBtn = new ShowMoreView();
    this._topRatedFilmsComponent = new TopRatedBlockView();
    this._mostRecommendedFilmsComponent = new MostRecommendedBlockView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(boardFilms, boardTopRatedFilms, boardMostRecommendedFilms) {
    this._boardFilms = boardFilms;
    this._sourcedBoardFilms = boardFilms.slice();
    this._boardTopRatedFilms = boardTopRatedFilms;
    this._boardMostRecommendedFilms = boardMostRecommendedFilms;

    renderElement(this._boardContainer, this._filmsBlockComponent, RenderPosition.BEFOREEND);
    renderElement(this._filmsBlockComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._sourcedBoardFilms = updateItem(this._sourcedBoardFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._boardFilms.sort(sortFilmsByDate);
        break;
      case SortType.RATING:
        this._boardFilms.sort(sortFilmsByRating);
        break;
      default:
        this._boardFilms = this._sourcedBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);

    this._clearFilmsList();
    this._clearSort();
    this._renderFilmsList();
    this._renderSort(this._filmsBlockComponent, RenderPosition.BEFORE);
  }

  _clearSort() {
    this._sortComponent.getElement().remove();
    this._sortComponent.removeElement();
  }

  _clearFilmsList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
  }

  _renderSort(container = this._boardContainer, position = RenderPosition.AFTERBEGIN) {
    renderElement(container, this._sortComponent, position);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoFilms() {
    renderElement(this._filmsListComponent, new FilmsListNoDataView(), RenderPosition.BEFOREEND);
  }

  _renderFilm(film, container = this._filmsComponent) {
    const filmPresenter = new Film(container, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilmsList() {
    renderElement(this._filmsListComponent, new FilmsListTitleView(), RenderPosition.BEFOREEND);
    renderElement(this._filmsListComponent, this._filmsComponent, RenderPosition.BEFOREEND);
    this._renderFilms(this._boardFilms.slice(0, FILMS_COUNT_PER_STEP));

    if (this._boardFilms.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreFilmsBtn();
    }
  }

  _renderTopRatedFilmsList() {
    if (this._boardTopRatedFilms.length === 0) {
      return;
    }

    renderElement(this._filmsBlockComponent, this._topRatedFilmsComponent, RenderPosition.BEFOREEND);

    const topRatedFilmsElement = this._topRatedFilmsComponent.getElement().querySelector(`.films-list__container`);
    this._boardTopRatedFilms
      .slice()
      .forEach((film) => this._renderFilm(film, topRatedFilmsElement));
  }

  _renderMostRecommendedFilmsList() {
    if (this._boardMostRecommendedFilms.length === 0) {
      return;
    }

    renderElement(this._filmsBlockComponent, this._mostRecommendedFilmsComponent, RenderPosition.BEFOREEND);

    const mostRecommendedFilmsElement = this._mostRecommendedFilmsComponent.getElement().querySelector(`.films-list__container`);
    this._boardMostRecommendedFilms
      .slice()
      .forEach((film) => this._renderFilm(film, mostRecommendedFilmsElement));
  }

  _renderFilms(films) {
    films
      .forEach((film) => this._renderFilm(film));
  }

  _renderShowMoreFilmsBtn() {
    renderElement(this._filmsListComponent, this._showMoreFilmsBtn, RenderPosition.BEFOREEND);

    this._showMoreFilmsBtn.setClickHandler(() => {
      this._renderFilms(
          this._boardFilms
          .slice(this._renderedFilmCount, this._renderedFilmCount + FILMS_COUNT_PER_STEP)
      );

      this._renderedFilmCount += FILMS_COUNT_PER_STEP;

      if (this._renderedFilmCount >= this._boardFilms.length) {
        removeElement(this._showMoreFilmsBtn);
      }
    });
  }

  _renderBoard() {
    if (this._boardFilms.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();

    this._renderFilmsList();

    this._renderTopRatedFilmsList();

    this._renderMostRecommendedFilmsList();
  }
}
