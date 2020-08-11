const createFilterItemTemplate = (filter, isChecked) => {
  const {link, name, count} = filter;

  const filmsCount = link !== `all` ? ` <span class="main-navigation__item-count">${count}</span>` : ``;

  return (
    `<a href="#${link}" class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``}">${name}${filmsCount}</a>`
  );
};

export const createMainNavigationTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
      ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
