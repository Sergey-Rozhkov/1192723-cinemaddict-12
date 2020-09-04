import FilmCardView from "../view/film-card";
import FilmDetailView from "../view/film-details";
import FilmDetailLoadingView from "../view/film-details-loading";
import CommentModel from "../model/comment";
import {renderElement, replaceElement, removeElement} from "../utils/render";
import {RenderPosition, Mode, UserAction, UpdateType, FilmDetailCardState} from "../const";
import {getCurrentDate} from "../utils/common";
import {generateId} from "../utils/film";
import CommentListPresenter from "./comment-list";

export default class FilmPresenter {
  constructor(filmListContainer, changeData, changeMode, api) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = new CommentModel();
    this._api = api;
    this._loadingComponent = new FilmDetailLoadingView();
    this._commentListPresenter = null;

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
    this._commentCtrlEnterAddHandler = this._commentCtrlEnterAddHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init(film) {
    this._film = film;
    this._film.loadedComments = this._commentsModel.getComments();

    const prevFilmCardComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(film);

    this._filmComponent.setOpenPopupFilmDetailHandler(this._openFilmDetailHandler);

    this._filmComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._filmComponent.setAlreadyWatchClickHandler(this._alreadyWatchClickHandler);
    this._filmComponent.setInWatchlistClickHandler(this._inWatchlistClickHandler);

    if (prevFilmCardComponent === null) {
      renderElement(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replaceElement(this._filmComponent, prevFilmCardComponent);
    }

    removeElement(prevFilmCardComponent);
    if (this._mode === Mode.OPENED) {
      this._replaceOpenedPopupInfo();
    }
  }

  _handleModelEvent(actionType, updateType, update) {
    debugger
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this._renderComments();
        //need to update preview card update
        break;
    }
  }

  resetView() {
    if (this._mode !== Mode.CLOSED) {
      this._closeFilmDetailHandler();
    }
  }

  destroy() {
    removeElement(this._filmComponent);
    removeElement(this._filmDetailComponent);
    this._commentsModel.removeObserver(this._handleModelEvent);
  }

  _closeFilmDetailHandler() {
    removeElement(this._filmDetailComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.CLOSED;
  }

  _commentDeleteClickHandler(commentId) {
    this._api.deleteComment(commentId).then(() => {
      this._commentsModel.deleteComment(UserAction.DELETE_COMMENT, commentId);
      this._changeData(
          UserAction.DELETE_COMMENT,
          UpdateType.PATCH,
          Object.assign(
              {},
              this._film,
              {
                loadedComments: this._commentsModel.getComments()
              }
          )
      );
    });
  }

  _generateBlankComment() {
    return {
      id: generateId(),
      filmId: this._film.id,
      text: ``,
      emotion: ``,
      author: ``,
      date: new Date(),
    };
  }

  _commentCtrlEnterAddHandler(update) {
    const blankComment = this._generateBlankComment();
    const comment = Object.assign(
        {},
        blankComment,
        update
    );

    this._api.addComment(comment).then((response) => {
      this._commentsModel.setComments(response);
      this._changeData(
          UserAction.ADD_COMMENT,
          UpdateType.PATCH,
          Object.assign(
              {},
              this._film,
              {
                loadedComments: this._commentsModel.getComments()
              }
          )
      );
    });
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
              isAlreadyWatched: !this._film.isAlreadyWatched,
              watchingDate: !this._film.isAlreadyWatched ? getCurrentDate() : null
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
    renderElement(this._filmListContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);

    this._api.getComments(this._film).then((response) => {
      removeElement(this._loadingComponent);

      this._commentsModel.setComments(response);
      this._film.loadedComments = this._commentsModel.getComments();

      this._prepareFilmDetailComponent();

      renderElement(this._filmListContainer, this._filmDetailComponent, RenderPosition.BEFOREEND);

      this._renderComments();

      document.addEventListener(`keydown`, this._escKeyDownHandler);
      this._changeMode();
      this._mode = Mode.OPENED;
    });
  }

  _prepareFilmDetailComponent() {
    this._filmDetailComponent = new FilmDetailView(this._film);

    this._filmDetailComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._filmDetailComponent.setAlreadyWatchClickHandler(this._alreadyWatchClickHandler);
    this._filmDetailComponent.setInWatchlistClickHandler(this._inWatchlistClickHandler);
    this._filmDetailComponent.setCommentDeleteHandler(this._commentDeleteClickHandler);
    this._filmDetailComponent.setCommentAddHandler(this._commentCtrlEnterAddHandler);
    this._filmDetailComponent.setClosePopupFilmDetailHandler(this._closeFilmDetailHandler);
    this._filmDetailComponent.restoreHandlers();
  }

  _replaceOpenedPopupInfo() {
    const prevFilmDetailComponent = this._filmDetailComponent;
    this._prepareFilmDetailComponent();

    replaceElement(this._filmDetailComponent, prevFilmDetailComponent);

    removeElement(prevFilmDetailComponent);

    this._renderComments();
  }

  setViewState(state) {
    switch (state) {
      case FilmDetailCardState.SAVING:
        this._filmDetailComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case FilmDetailCardState.DELETING:
        this._filmDetailComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
    }
  }

  _renderComments() {
    const container = this._filmDetailComponent.getElement().querySelector(`.form-details__bottom-container`);
    if (this._commentListPresenter !== null) {
      this._commentListPresenter.destroy();
    }
    this._commentListPresenter = new CommentListPresenter(container, this._commentsModel, this._changeData, this._api);
    this._commentListPresenter.init();
  }
}
