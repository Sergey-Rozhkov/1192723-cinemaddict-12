import {createElement} from "../utils.js";

export default class UserProfileBlock {
  constructor(filmsCount) {
    this._filmsCount = filmsCount;
    this._element = null;
  }

  getTemplate() {
    let rating = ``;
    if (this._filmsCount === 0) {
      rating = ``;
    } else if (this._filmsCount >= 1 && this._filmsCount <= 10) {
      rating = `novice`;
    } else if (this._filmsCount <= 20) {
      rating = `fan`;
    } else {
      rating = `movie buff`;
    }

    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${rating}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

