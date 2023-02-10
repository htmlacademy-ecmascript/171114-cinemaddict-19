import ListFilterView from '../view/list-filters-view.js';
import {render, replace, remove} from '../framework/render.js';
import {UpdateType, FilterType} from '../const.js';
import {filter} from '../utils.js';

export default class ListFilterPresenter {
  #listFilterContainer = null;
  #filmFiltersModel = null;
  #filmsModel = null;

  #listFilterComponent = null;

  constructor({listFilterContainer, filmFiltersModel, filmsModel}) {
    this.#listFilterContainer = listFilterContainer;
    this.#filmFiltersModel = filmFiltersModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filmFiltersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;
    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Wathlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITE,
        name: 'Favorite',
        count: filter[FilterType.FAVORITE](films).length,
      },
    ];
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#listFilterComponent;

    this.#listFilterComponent = new ListFilterView({
      filters,
      currentFilterType: this.#filmFiltersModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#listFilterComponent, this.#listFilterContainer);
      return;
    }
    replace(this.#listFilterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filmFiltersModel.filter === filterType) {
      return;
    }

    this.#filmFiltersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
