import {renderElement, removeElement} from "../utils/render";
import {RenderPosition, UpdateType, UserAction} from "../const";
import CommentView from "../view/comment";

export default class CommentPresenter {
  constructor(commentContainer, changeData, api) {
    this._commentContainer = commentContainer;
    this._api = api;
    this._changeData = changeData;
    this._commentComponent = null;

    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
  }

  init(comment) {
    this._comment = comment;

    const prevCommentComponent = this._commentComponent;

    this._commentComponent = new CommentView(comment);

    this._commentComponent.setCommentDeleteHandler(this._commentDeleteClickHandler);

    // this._commentComponent.setCommentDeleteHandler(this._commentDeleteClickHandler);

    // this._filmComponent.setOpenPopupFilmDetailHandler(this._openFilmDetailHandler);
    //
    // this._filmComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    // this._filmComponent.setAlreadyWatchClickHandler(this._alreadyWatchClickHandler);
    // this._filmComponent.setInWatchlistClickHandler(this._inWatchlistClickHandler);

    if (prevCommentComponent === null) {
      renderElement(this._commentContainer, this._commentComponent, RenderPosition.BEFOREEND);
      return;
    }
    //
    // if (this._filmListContainer.getElement().contains(prevFilmCardComponent.getElement())) {
    //   replaceElement(this._filmComponent, prevFilmCardComponent);
    // }

    removeElement(prevCommentComponent);
    // if (this._mode === Mode.OPENED) {
    //   this._replaceOpenedPopupInfo();
    // }
  }

  destroy() {
    removeElement(this._commentComponent);
  }

  _commentDeleteClickHandler(commentId) {
    this._api.deleteComment(commentId).then(() => {
      this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        Object.assign(
          {},
          this._comment,
        )
      );
    });
  }
}
