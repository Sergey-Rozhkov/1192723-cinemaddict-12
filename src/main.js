import {FILMS_CARD_COUNT, TOP_RATED_COUNT, MOST_RECOMMENDED_COUNT, FILMS_COUNT_PER_STEP} from "./const.js";
import {getRandomInteger} from "./utils.js";

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

import {generateFilm} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";

const films = new Array(FILMS_CARD_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);
const topRatedFilms = new Array(TOP_RATED_COUNT).fill().map(generateFilm);
const mostRecommendedFilms = new Array(MOST_RECOMMENDED_COUNT).fill().map(generateFilm);
const filmsCountInBase = getRandomInteger(10000, 1000000);
const watchedFilmsCount = getRandomInteger(0, 30);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer`);
const footerStatisticElement = footerElement.querySelector(`.footer__statistics`);
const mainElement = document.querySelector(`.main`);

render(headerElement, createUserProfileBlockTemplate(watchedFilmsCount), `beforeend`);
render(mainElement, createMainNavigationTemplate(filters), `beforeend`);
render(mainElement, createSortTemplate(), `beforeend`);
render(mainElement, createFilmsBlockTemplate(), `beforeend`);

const filmsBlockElement = document.querySelector(`.films`);
const filmsContainerElement = filmsBlockElement.querySelector(`.films-list__container`);

films
  .slice(0, FILMS_COUNT_PER_STEP)
  .forEach((film) => render(filmsContainerElement, createFilmCardTemplate(film), `beforeend`));

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCount = FILMS_COUNT_PER_STEP;

  render(filmsContainerElement, createShowMoreTemplate(), `afterend`);

  const showMoreFilmsBtn = document.querySelector(`.films-list__show-more`);

  showMoreFilmsBtn.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => render(filmsContainerElement, createFilmCardTemplate(film), `beforeend`));

    renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreFilmsBtn.remove();
    }
  });
}

render(filmsBlockElement, createTopRatedBlockTemplate(), `beforeend`);
render(filmsBlockElement, createMostRecommendedBlockTemplate(), `beforeend`);

const [topRatedContainerElement, mostRecommendedContainerElement] = filmsBlockElement.querySelectorAll(`.films-list--extra`);

const topRatedFilmsElement = topRatedContainerElement.querySelector(`.films-list__container`);
for (let i = 0, len = topRatedFilms.length; i < len; i++) {
  render(topRatedFilmsElement, createFilmCardTemplate(topRatedFilms[i]), `beforeend`);
}

const mostRecommendedFilmsElement = mostRecommendedContainerElement.querySelector(`.films-list__container`);
for (let i = 0, len = mostRecommendedFilms.length; i < len; i++) {
  render(mostRecommendedFilmsElement, createFilmCardTemplate(mostRecommendedFilms[i]), `beforeend`);
}

render(footerStatisticElement, createStatisticTemplate(filmsCountInBase), `beforeend`);
render(footerElement, createFilmDetailsTemplate(films[0]), `afterend`);
