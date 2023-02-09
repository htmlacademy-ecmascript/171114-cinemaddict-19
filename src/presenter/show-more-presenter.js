import {render, remove} from '../framework/render.js';
import ShowMoreView from '../view/show-more-view.js';

export default class ShowMorePresenter {
  #filmContainer = null;
  #showMoreComponent = null;
  #onClick = null;

  constructor({onClick, filmContainer}) {
    this.#filmContainer = filmContainer;
    this.#onClick = onClick;
  }

  init() {
    this.#showMoreComponent = new ShowMoreView(this.#onClick);
    render(this.#showMoreComponent, this.#filmContainer);
  }

  remove() {
    remove(this.#showMoreComponent);
  }
}


