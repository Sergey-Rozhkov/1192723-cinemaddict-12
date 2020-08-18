import AbstractView from "./abstract.js";
import {SORT_TYPE} from "../const.js";

export default class SortView extends AbstractView {
  constructor() {
    super();

    this._sortType = SORT_TYPE.DEFAULT;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._sortType = evt.target.dataset.sortType;
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  getTemplate() {
    const activeClass = `sort__button--active`;
    return (
      `<ul class="sort">
        <li><a href="#" class="sort__button ${this._sortType === SORT_TYPE.DEFAULT ? activeClass : ``}" data-sort-type="${SORT_TYPE.DEFAULT}">Sort by default</a></li>
        <li><a href="#" class="sort__button ${this._sortType === SORT_TYPE.DATE ? activeClass : ``}" data-sort-type="${SORT_TYPE.DATE}">Sort by date</a></li>
        <li><a href="#" class="sort__button ${this._sortType === SORT_TYPE.RATING ? activeClass : ``}" data-sort-type="${SORT_TYPE.RATING}">Sort by rating</a></li>
      </ul>`
    );
  }


}
