import AbstractView from '../framework/view/abstract-view.js';

function createFilmListTemplate() {
  return `<section class="films">
  <section class="films-list">
  <div class="films-list__container">
  </div>
  </section>
  </section>`;
}

export default class FilmListView extends AbstractView {
  get template() {
    return createFilmListTemplate();
  }

  getFilmListContainer() {
    return this.element.querySelector('.films-list__container');
  }

  getFilmList() {
    return this.element.querySelector('.films-list');
  }
}
