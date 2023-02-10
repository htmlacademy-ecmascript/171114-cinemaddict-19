import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const {type, name, count} = filter;
  return (
    `<a href="#${type}" class="main-navigation__item
     ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
     data-filter = "${type}"
     >
      ${name}
      ${type === 'all' ? '' :
      `<span class="main-navigation__item-count">${count}</span>`}
     </a>`
  );
}

function createFiltersTemplate(filterItems, currentFilterType) {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>
    `
  );
}

export default class ListFiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('click', this.#onFilterTypeChange);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #onFilterTypeChange = (evt) => {
    evt.preventDefault();

    const newFilter = evt.target.closest('a').dataset.filter;

    if(newFilter) {
      this.#handleFilterTypeChange(newFilter);
    }
  };
}
