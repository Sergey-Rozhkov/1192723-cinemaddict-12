import FilmsBlockView from "../view/films-block";
import FilmsListView from "../view/film-list";
import FilmsView from "../view/films";
import {renderElement, RenderPosition, remove} from "../utils/render";
import FilmsListNoDataView from "../view/film-list-no-data";
import FilmsListTitleView from "../view/film-list-title";
import {FILMS_COUNT_PER_STEP} from "../const";
import SortView from "../view/sort";
import FilmCardView from "../view/film-card";
import FilmDetailView from "../view/film-details";
import ShowMoreView from "../view/show-more";
import TopRatedBlockView from "../view/top-rated-block.js";
import MostRecommendedBlockView from "../view/most-recommended-block.js";

export default class MovieList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;

    this._filmsBlockComponent = new FilmsBlockView();
    this._filmsListComponent = new FilmsListView();
    this._filmsComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._showMoreFilmsBtn = new ShowMoreView();
    this._topRatedFilmsComponent = new TopRatedBlockView();
    this._mostRecommendedFilmsComponent = new MostRecommendedBlockView();
  }

  init(boardFilms, boardTopRatedFilms, boardMostRecommendedFilmss) {
    this._boardFilms = boardFilms;
    this._boardTopRatedFilms = boardTopRatedFilms;
    this._boardMostRecommendedFilms = boardMostRecommendedFilmss;

    renderElement(this._boardContainer, this._filmsBlockComponent, RenderPosition.BEFOREEND);
    renderElement(this._filmsBlockComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderSort() {
    renderElement(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoFilms() {
    renderElement(this._filmsListComponent, new FilmsListNoDataView(), RenderPosition.BEFOREEND);
  }

  _renderFilm(film, container = this._filmsComponent) {
    const filmComponent = new FilmCardView(film);
    const filmDetailComponent = new FilmDetailView(film);
    const footerElement = document.querySelector(`.footer`);

    const openFilmDetail = () => {
      renderElement(footerElement, filmDetailComponent, RenderPosition.AFTEREND);

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

    renderElement(container, filmComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsList() {
    renderElement(this._filmsListComponent, new FilmsListTitleView(), RenderPosition.BEFOREEND);
    renderElement(this._filmsListComponent, this._filmsComponent, RenderPosition.BEFOREEND);

    this._renderFilms(0, FILMS_COUNT_PER_STEP);

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

  _renderFilms(from, to) {
    this._boardFilms
      .slice(from, to)
      .forEach((film) => this._renderFilm(film));
  }

  _renderShowMoreFilmsBtn() {
    renderElement(this._filmsListComponent, this._showMoreFilmsBtn, RenderPosition.BEFOREEND);

    this._showMoreFilmsBtn.setClickHandler(() => {
      this._boardFilms
        .slice(this._renderedFilmCount, this._renderedFilmCount + FILMS_COUNT_PER_STEP)
        .forEach((film) => this._renderFilm(film));

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
