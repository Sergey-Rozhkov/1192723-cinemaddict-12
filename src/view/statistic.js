import {createElement} from "../utils.js";

export default class StatisticView {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    const formattedCount = new Intl.NumberFormat(`ru-RU`).format(this._count);
    return (
      `<p>${formattedCount} movies inside</p>`
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

