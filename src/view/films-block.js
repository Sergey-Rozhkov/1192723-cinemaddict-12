import AbstractView from "./abstract";

export default class FilmsBlockView extends AbstractView {
  getTemplate() {
    return (
      `<section class="films"></section>`
    );
  }
}

