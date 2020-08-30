import FilmPresenter from "../presenter/film";
import FilmsBlockView from "../view/films-block";
import FilmsListView from "../view/film-list";
import FilmsView from "../view/films";
import FilmsListNoDataView from "../view/film-list-no-data";
import FilmsListTitleView from "../view/film-list-title";
import SortView from "../view/sort";
import ShowMoreView from "../view/show-more";
import TopRatedBlockView from "../view/top-rated-block";
import MostRecommendedBlockView from "../view/most-recommended-block";
import {filter} from "../utils/filter";
import {renderElement, removeElement} from "../utils/render";
import {sortFilmsByDate, sortFilmsByRating} from "../utils/film";
import {FILMS_COUNT_PER_STEP, SortType, RenderPosition, UpdateType, UserAction} from "../const";

export default class MovieList {
  constructor(boardContainer, filmsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};

    this._sortComponent = null;
    this._showMoreFilmsBtn = null;

    this._filmsBlockComponent = new FilmsBlockView();
    this._filmsListComponent = new FilmsListView();
    this._filmsComponent = new FilmsView();
    this._noFilmComponent = new FilmsListNoDataView();
    this._topRatedFilmsComponent = new TopRatedBlockView();
    this._mostRecommendedFilmsComponent = new MostRecommendedBlockView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreFilmsBtn = this._handleShowMoreFilmsBtn.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init(renderBoard = true, boardTopRatedFilms, boardMostRecommendedFilms) {
    this._boardTopRatedFilms = boardTopRatedFilms || [];
    this._boardMostRecommendedFilms = boardMostRecommendedFilms || [];

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    if (renderBoard) {
      this._renderBoard();
    }
  }

  destroy() {
    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    removeElement(this._filmsBlockComponent);
    removeElement(this._sortComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);


    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.slice().sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.slice().sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
      case UserAction.DELETE_COMMENT:
      case UserAction.ADD_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleFilmChange(updatedFilm) {
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _handleShowMoreFilmsBtn() {
    const films = this._getFilms();

    this._renderFilms(
        films.slice(this._renderedFilmCount, this._renderedFilmCount + FILMS_COUNT_PER_STEP)
    );

    this._renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmCount >= films.length) {
      removeElement(this._showMoreFilmsBtn);
    }
  }

  _renderSort(container = this._boardContainer) {
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    renderElement(container, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderNoFilms() {
    this._renderFilmsWrapper();

    renderElement(this._filmsListComponent, this._noFilmComponent, RenderPosition.BEFOREEND);
  }

  _renderFilm(film, container = this._filmsComponent) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilmsList() {
    const films = this._getFilms();

    renderElement(this._filmsListComponent, new FilmsListTitleView(), RenderPosition.BEFOREEND);
    renderElement(this._filmsListComponent, this._filmsComponent, RenderPosition.BEFOREEND);
    this._renderFilms(films.slice(0, FILMS_COUNT_PER_STEP));

    if (films.length > FILMS_COUNT_PER_STEP) {
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
    if (this._showMoreFilmsBtn !== null) {
      this._showMoreFilmsBtn = null;
    }

    this._showMoreFilmsBtn = new ShowMoreView();
    this._showMoreFilmsBtn.setClickHandler(this._handleShowMoreFilmsBtn);

    renderElement(this._filmsListComponent, this._showMoreFilmsBtn, RenderPosition.BEFOREEND);
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    removeElement(this._sortComponent);
    removeElement(this._noFilmComponent);
    removeElement(this._showMoreFilmsBtn);
    removeElement(this._topRatedFilmsComponent);
    removeElement(this._mostRecommendedFilmsComponent);

    if (resetRenderedTaskCount) {
      this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmsCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsWrapper() {
    renderElement(this._boardContainer, this._filmsBlockComponent, RenderPosition.BEFOREEND);
    renderElement(this._filmsBlockComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {
    const films = this._getFilms();
    if (films.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();

    this._renderFilmsWrapper();

    this._renderFilmsList();

    this._renderTopRatedFilmsList();

    this._renderMostRecommendedFilmsList();
  }
}
