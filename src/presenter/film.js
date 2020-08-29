import FilmCardView from "../view/film-card";
import FilmDetailView from "../view/film-details";
import CommentsModel from "../model/comments";
import {renderElement, replaceElement, removeElement} from "../utils/render";
import {RenderPosition, Mode, UserAction, UpdateType} from "../const";

export default class Film {
  constructor(filmListContainer, changeData, changeMode) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = new CommentsModel();

    this._filmComponent = null;
    this._filmDetailComponent = null;
    this._mode = Mode.CLOSED;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closeFilmDetailHandler = this._closeFilmDetailHandler.bind(this);
    this._openFilmDetailHandler = this._openFilmDetailHandler.bind(this);

    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._alreadyWatchClickHandler = this._alreadyWatchClickHandler.bind(this);
    this._inWatchlistClickHandler = this._inWatchlistClickHandler.bind(this);

    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._commentsModel.setComments(film.comments);

    const prevFilmCardComponent = this._filmComponent;
    const prevFilmDetailComponent = this._filmDetailComponent;

    this._filmComponent = new FilmCardView(film);
    this._filmDetailComponent = new FilmDetailView(film);

    this._filmComponent.setOpenPopupFilmDetailHandler(this._openFilmDetailHandler);

    this._filmComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._filmComponent.setAlreadyWatchClickHandler(this._alreadyWatchClickHandler);
    this._filmComponent.setInWatchlistClickHandler(this._inWatchlistClickHandler);

    this._filmDetailComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._filmDetailComponent.setAlreadyWatchClickHandler(this._alreadyWatchClickHandler);
    this._filmDetailComponent.setInWatchlistClickHandler(this._inWatchlistClickHandler);

    if (prevFilmCardComponent === null || prevFilmDetailComponent === null) {
      renderElement(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replaceElement(this._filmComponent, prevFilmCardComponent);
    }

    if (this._filmListContainer.getElement().contains(prevFilmDetailComponent.getElement())) {
      replaceElement(this._filmDetailComponent, prevFilmDetailComponent);
      this._filmDetailComponent.setCommentDeleteHandler(this._commentDeleteClickHandler);
      this._filmDetailComponent.setClosePopupFilmDetailHandler(this._closeFilmDetailHandler);
    }

    removeElement(prevFilmCardComponent);
    removeElement(prevFilmDetailComponent);
  }

  resetView() {
    if (this._mode !== Mode.CLOSED) {
      this._closeFilmDetailHandler();
    }
  }

  destroy() {
    removeElement(this._filmComponent);
    removeElement(this._filmDetailComponent);
  }

  _closeFilmDetailHandler() {
    removeElement(this._filmDetailComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.CLOSED;
  }

  _commentDeleteClickHandler(commentId) {
    this._commentsModel.deleteComment(UserAction.DELETE_COMMENT, commentId);
    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              comments: this._commentsModel.getComments()
            }
        )
    );
  }

  _favoriteClickHandler() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _inWatchlistClickHandler() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              inWatchlist: !this._film.inWatchlist
            }
        )
    );
  }

  _alreadyWatchClickHandler() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              isAlreadyWatched: !this._film.isAlreadyWatched
            }
        )
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closeFilmDetailHandler();
    }
  }

  _openFilmDetailHandler() {
    renderElement(this._filmListContainer, this._filmDetailComponent, RenderPosition.BEFOREEND);

    this._filmDetailComponent.setCommentDeleteHandler(this._commentDeleteClickHandler);
    this._filmDetailComponent.setClosePopupFilmDetailHandler(this._closeFilmDetailHandler);
    this._filmDetailComponent.restoreHandlers();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.OPENED;
  }

}
