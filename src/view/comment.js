import AbstractView from "./abstract";
import he from "he";
import {humanizeCommentDate} from "../utils/film";

export default class CommentView extends AbstractView {
  constructor(comment) {
    super();
    this._comment = comment;

    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    const commentId = evt.target.dataset.commentId;
    this._callback.commentDeleteClick(commentId);
  }

  setCommentDeleteHandler(callback) {
    this._callback.commentDeleteClick = callback;

    const commentDeleteBtnElements = this.getElement()
      .querySelectorAll(`.film-details__comment-delete`);

    commentDeleteBtnElements.forEach((element) => {
      element.addEventListener(`click`, this._commentDeleteHandler);
    });
  }

  getTemplate() {
    const {emotion, text, author, date, id} = this._comment;

    return (
      `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${he.encode(text)}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
                <button class="film-details__comment-delete" data-comment-id="${id}">
                Delete
                </button>
              </p>
            </div>
          </li>`
    );
  }
}

