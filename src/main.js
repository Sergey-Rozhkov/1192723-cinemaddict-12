import {createUserProfileBlockTemplate} from "./view/user-profile-block.js";
import {createMainNavigationTemplate} from "./view/main-navigation.js";
import {createSortTemplate} from "./view/sort.js";
import {createFilmsBlockTemplate} from "./view/films-block.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowMoreTemplate} from "./view/show-more.js";
import {createMostRecommendedBlockTemplate} from "./view/most-recommended-block.js";
import {createTopRatedBlockTemplate} from "./view/top-rated-block.js";
import {createFilmDetailsTemplate} from "./view/film-details.js";
import {createStatisticTemplate} from "./view/statistic.js";

const FILMS_CARD_COUNT = 5;
const TOP_RATED_COUNT = 2;
const MOST_RECOMMENDED_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);
const mainElement = document.querySelector(`.main`);

render(headerElement, createUserProfileBlockTemplate(), `beforeend`);
render(mainElement, createMainNavigationTemplate(), `beforeend`);
render(mainElement, createSortTemplate(), `beforeend`);
render(mainElement, createFilmsBlockTemplate(), `beforeend`);

const filmsBlockElement = document.querySelector(`.films`);
const filmsContainerElement = filmsBlockElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILMS_CARD_COUNT; i++) {
  render(filmsContainerElement, createFilmCardTemplate(), `beforeend`);
}

render(filmsContainerElement, createShowMoreTemplate(), `afterend`);

render(filmsBlockElement, createTopRatedBlockTemplate(), `beforeend`);
render(filmsBlockElement, createMostRecommendedBlockTemplate(), `beforeend`);

const [topRatedContainerElement, mostRecommendedContainerElement] = filmsBlockElement.querySelectorAll(`.films-list--extra`);

const topRatedFilmsElement = topRatedContainerElement.querySelector(`.films-list__container`);
for (let i = 0; i < TOP_RATED_COUNT; i++) {
  render(topRatedFilmsElement, createFilmCardTemplate(), `beforeend`);
}

const mostRecommendedFilmsElement = mostRecommendedContainerElement.querySelector(`.films-list__container`);
for (let i = 0; i < MOST_RECOMMENDED_COUNT; i++) {
  render(mostRecommendedFilmsElement, createFilmCardTemplate(), `beforeend`);
}

render(footerStatisticElement, createStatisticTemplate(), `beforeend`);
render(footerElement, createFilmDetailsTemplate(), `afterend`);
