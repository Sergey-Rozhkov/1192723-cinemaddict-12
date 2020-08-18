import FilmsBlockView from "../view/films-block";
import FilmsListView from "../view/film-list";
import FilmsView from "../view/films";
import {renderElement, remove} from "../utils/render";
import FilmsListNoDataView from "../view/film-list-no-data";
import FilmsListTitleView from "../view/film-list-title";
import {FILMS_COUNT_PER_STEP, SORT_TYPE, RENDER_POSITION} from "../const";
import SortView from "../view/sort";
import FilmCardView from "../view/film-card";
import FilmDetailView from "../view/film-details";
import ShowMoreView from "../view/show-more";
import TopRatedBlockView from "../view/top-rated-block.js";
import MostRecommendedBlockView from "../view/most-recommended-block.js";
import {sortFilmsByDate, sortFilmsByRating} from "../utils/film.js";

export default class MovieList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    this._currentSortType = SORT_TYPE.DEFAULT;

    this._filmsBlockComponent = new FilmsBlockView();
    this._filmsListComponent = new FilmsListView();
    this._filmsComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._showMoreFilmsBtn = new ShowMoreView();
    this._topRatedFilmsComponent = new TopRatedBlockView();
    this._mostRecommendedFilmsComponent = new MostRecommendedBlockView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardFilms, boardTopRatedFilms, boardMostRecommendedFilmss) {
    this._boardFilms = boardFilms;
    this._sourcedBoardFilms = boardFilms.slice();
    this._boardTopRatedFilms = boardTopRatedFilms;
    this._boardMostRecommendedFilms = boardMostRecommendedFilmss;

    renderElement(this._boardContainer, this._filmsBlockComponent, RENDER_POSITION.BEFOREEND);
    renderElement(this._filmsBlockComponent, this._filmsListComponent, RENDER_POSITION.BEFOREEND);

    this._renderBoard();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SORT_TYPE.DATE:
        this._boardFilms.sort(sortFilmsByDate);
        break;
      case SORT_TYPE.RATING:
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
    this._renderSort(this._filmsBlockComponent, RENDER_POSITION.BEFORE);
  }

  _clearSort() {
    this._sortComponent.getElement().remove();
    this._sortComponent.removeElement();
  }

  _clearFilmsList() {
    this._filmsComponent.getElement().innerHTML = ``;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
  }

  _renderSort(container = this._boardContainer, position = RENDER_POSITION.AFTERBEGIN) {
    renderElement(container, this._sortComponent, position);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoFilms() {
    renderElement(this._filmsListComponent, new FilmsListNoDataView(), RENDER_POSITION.BEFOREEND);
  }

  _renderFilm(film, container = this._filmsComponent) {
    const filmComponent = new FilmCardView(film);
    const filmDetailComponent = new FilmDetailView(film);
    const footerElement = document.querySelector(`.footer`);

    const openFilmDetail = () => {
      renderElement(footerElement, filmDetailComponent, RENDER_POSITION.AFTEREND);

      filmDetailComponent.setClosePopupFilmDetailHandler(closeFilmDetail);

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

    filmComponent.setOpenPopupFilmDetailHandler(openFilmDetail);

    renderElement(container, filmComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderFilmsList() {
    renderElement(this._filmsListComponent, new FilmsListTitleView(), RENDER_POSITION.BEFOREEND);
    renderElement(this._filmsListComponent, this._filmsComponent, RENDER_POSITION.BEFOREEND);
    this._renderFilms(this._boardFilms.slice(0, FILMS_COUNT_PER_STEP));

    if (this._boardFilms.length > FILMS_COUNT_PER_STEP) {
      this._renderShowMoreFilmsBtn();
    }
  }

  _renderTopRatedFilmsList() {
    if (this._boardTopRatedFilms.length === 0) {
      return;
    }

    renderElement(this._filmsBlockComponent, this._topRatedFilmsComponent, RENDER_POSITION.BEFOREEND);

    const topRatedFilmsElement = this._topRatedFilmsComponent.getElement().querySelector(`.films-list__container`);
    this._boardTopRatedFilms
      .slice()
      .forEach((film) => this._renderFilm(film, topRatedFilmsElement));
  }

  _renderMostRecommendedFilmsList() {
    if (this._boardMostRecommendedFilms.length === 0) {
      return;
    }

    renderElement(this._filmsBlockComponent, this._mostRecommendedFilmsComponent, RENDER_POSITION.BEFOREEND);

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
    renderElement(this._filmsListComponent, this._showMoreFilmsBtn, RENDER_POSITION.BEFOREEND);

    this._showMoreFilmsBtn.setClickHandler(() => {
      this._renderFilms(
          this._boardFilms
          .slice(this._renderedFilmCount, this._renderedFilmCount + FILMS_COUNT_PER_STEP)
      );

      this._renderedFilmCount += FILMS_COUNT_PER_STEP;

      if (this._renderedFilmCount >= this._boardFilms.length) {
        remove(this._showMoreFilmsBtn);
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