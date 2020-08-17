import AbstractView from "./abstract.js";

export default class FilmListTitle extends AbstractView {
  getTemplate() {
    return (
      `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`
    );
  }
}

