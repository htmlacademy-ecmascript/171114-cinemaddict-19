import AbstractView from '../framework/view/abstract-view.js';

function createShowMoreTemplate() {
  return '<button class="films-list__show-more">Show more</button>';
}

export default class ShowMoreView extends AbstractView {
  #onClick = null;
  constructor(onClick) {
    super();
    this.#onClick = onClick;
    this.element.addEventListener('click', this.#onClick);
  }


  get template() {
    return createShowMoreTemplate();
  }
}
