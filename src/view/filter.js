import AbstractView from "./abstract";

export default class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  _createFilterItemTemplate(filter, isChecked) {
    const {link, name, count} = filter;

    const filmsCount = link !== `all` ? ` <span class="main-navigation__item-count">${count}</span>` : ``;

    return (
      `<a href="#${link}" class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``}">${name}${filmsCount}</a>`
    );
  }

  getTemplate() {
    const filterItemsTemplate = this._filters
      .map((filter, index) => this._createFilterItemTemplate(filter, index === 0))
      .join(``);

    return (
      `<nav class="main-navigation">
      <div class="main-navigation__items">
      ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
    );
  }
}
