import {removeElement, renderElement} from "../utils/render";
import {RenderPosition, UserAction, UpdateType, FilmDetailCardState} from "../const";
import CommentListView from "../view/comment-list";
import {generateId} from "../utils/film";
import CommentPresenter from "./comment";


export default class CommentListPresenter {
  constructor(commentContainer, commentModel, changeData, api) {
    this._commentContainer = commentContainer;
    this._changeData = changeData;
    this._commentModel = commentModel;
    this._commentsLength = commentModel.getComments().length;
    this._api = api;
    this._commentPresenter = {};

    this._commentsListComponent = new CommentListView(this._commentsLength);
    this._commentsList = this._commentsListComponent.getElement().querySelector(`.film-details__comments-list`);

    this._commentCtrlEnterAddHandler = this._commentCtrlEnterAddHandler.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
  }

  init() {
    renderElement(this._commentContainer, this._commentsListComponent, RenderPosition.BEFOREEND);

    this._renderComments(this._commentModel.getComments());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this._commentModel.deleteComment(actionType, update.id);
        break;
    }
  }

  _renderComments(comments) {
    comments
      .forEach((comment) => this._renderComment(comment));
  }

  _renderComment(comment) {
    const commentPresenter = new CommentPresenter(this._commentsList, this._handleViewAction, this._api);
    commentPresenter.init(comment);
    this._commentPresenter[comment.id] = commentPresenter;
  }

  destroy() {
    removeElement(this._commentsListComponent);
    Object
      .values(this._commentPresenter)
      .forEach((presenter) => presenter.destroy());
    this._commentPresenter = {};
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
                comments: this._commentsModel.getComments()
              }
          )
      );
    });
  }
}
