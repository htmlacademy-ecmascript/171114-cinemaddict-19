import AbstractView from '../framework/view/abstract-view.js';

const TitleByFilter = {
  all: 'There are no movies in our database',
  watchlist: 'There are no movies to watch now',
  history: 'There are no watched movies now',
  favorites: 'There are no favorite movies now'
};


function createEmptyTemplate(currentFilter) {
  const title = TitleByFilter[currentFilter];
  return `<h2 class="films-list__title">${title}</h2>`;
}

export default class EmptyView extends AbstractView {
  #currentFilter = null;

  constructor(currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createEmptyTemplate(this.#currentFilter);
  }
}
