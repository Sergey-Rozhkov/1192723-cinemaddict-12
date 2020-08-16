import AbstractView from "./abstract.js";

export default class FilmsBlock extends AbstractView {
  getTemplate() {
    return (
      `<section class="films"></section>`
    );
  }
}

