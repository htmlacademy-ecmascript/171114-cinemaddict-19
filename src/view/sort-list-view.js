import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

function createSortListTemplate() {
  return `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active" data-sort-type="default">Sort by default</a></li>
  <li><a href="#" class="sort__button" data-sort-type="by_date">Sort by date</a></li>
  <li><a href="#" class="sort__button" data-sort-type="by_rating">Sort by rating</a></li>
</ul>`;
}

export default class SortListView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.querySelectorAll('.sort__button').forEach((button) => button.addEventListener('click', this.#onSortTypeChange));
  }

  get template() {
    return createSortListTemplate();
  }

  #onSortTypeChange = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
    this.setButtonActive(evt.target.dataset.sortType);
  };

  reset() {
    this.setButtonActive(SortType.DEFAULT);
  }

  setButtonActive = (sortType) => {
    this.element.querySelectorAll('.sort__button')
      .forEach((button) => {
        if(button.dataset.sortType === sortType) {
          button.classList.add('sort__button--active');
        } else {
          button.classList.remove('sort__button--active');
        }
      });
  };
}
