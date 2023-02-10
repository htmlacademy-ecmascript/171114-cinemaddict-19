import AbstractView from '../framework/view/abstract-view.js';

function createExtraTemplate(title) {
  return `<section class="films-list films-list--extra">
  <h2 class="films-list__title">${title}</h2>
  <div class="films-list__container">
  </div>
  </section>`;
}

export default class ExtraView extends AbstractView {
  #title = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createExtraTemplate(this.#title);
  }

  getFilmList() {
    return this.element.querySelector('.films-list__container');
  }
}
