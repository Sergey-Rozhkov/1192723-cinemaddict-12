import AbstractView from "./abstract";
import {EMOJI_HEIGHT, EMOJI_WIDTH} from "../const";

export default class CommentListView extends AbstractView {
  constructor(commentsLength) {
    super();
    this._commentsLength = commentsLength;

    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this._commentAddHandler = this._commentAddHandler.bind(this);
    this._emotionClickHandler = this._emotionClickHandler.bind(this);
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    const emoji = this.getElement()
      .querySelectorAll(`.film-details__emoji-label`);

    emoji.forEach((element) => {
      element.addEventListener(`click`, this._emotionClickHandler);
    });
  }

  _emotionClickHandler(evt) {
    const emojiBlockElement = evt.currentTarget.closest(`.film-details__new-comment`).querySelector(`.film-details__add-emoji-label`);
    let img = document.createElement(`img`);
    img.width = EMOJI_WIDTH;
    img.heigth = EMOJI_HEIGHT;
    img.src = evt.currentTarget.querySelector(`img`).src;
    emojiBlockElement.innerHTML = ``;
    emojiBlockElement.append(img);
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    const commentId = evt.target.dataset.commentId;
    this._callback.commentDeleteClick(commentId);
  }

  _commentAddHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && ((evt.keyCode === 10 || evt.keyCode === 13))) {
      const text = this.getElement().querySelector(`.film-details__inner [name=comment]`).value;
      const emotion = this.getElement().querySelector(`.film-details__inner [name=comment-emoji]:checked`).value;
      const date = new Date();

      evt.preventDefault();
      this._callback.commentAddHandler({
        text,
        emotion,
        date
      });
    }
  }

  setCommentDeleteHandler(callback) {
    this._callback.commentDeleteClick = callback;

    const commentDeleteBtnElements = this.getElement()
      .querySelectorAll(`.film-details__comment-delete`);

    commentDeleteBtnElements.forEach((element) => {
      element.addEventListener(`click`, this._commentDeleteHandler);
    });
  }

  setCommentAddHandler(callback) {
    this._callback.commentAddHandler = callback;
    this.getElement().addEventListener(`keydown`, this._commentAddHandler);
  }

  getTemplate() {

    return (
      `<section class="film-details__comments-wrap">
              <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._commentsLength}</span></h3>

                <ul class="film-details__comments-list"></ul>

              <div class="film-details__new-comment">
                <div for="add-emoji" class="film-details__add-emoji-label"></div>

                <label class="film-details__comment-label">
                  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                  <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                  <label class="film-details__emoji-label" for="emoji-sleeping">
                    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                  <label class="film-details__emoji-label" for="emoji-puke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                  </label>

                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                  <label class="film-details__emoji-label" for="emoji-angry">
                    <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                  </label>
                </div>
              </div>
            </section>`
    );
  }
}

