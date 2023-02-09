import {render, RenderPosition, remove} from '../framework/render.js';
import {sortByReleaseDate, filter} from '../utils.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FilmPresenter from './film-presenter.js';
import PopupPresenter from './popup-presenter';
import FilmListView from '../view/film-list-view.js';
import ShowMorePresenter from './show-more-presenter.js';
import ExtraPresenter from './extra-presenter.js';
import EmptyView from '../view/empty-view.js';
import NoFilmsErrorView from '../view/no-films-view.js';
import LoadingView from '../view/loading-view.js';
import SortListView from '../view/sort-list-view.js';
import {FILM_COUNT_PER_STEP, SortType, TimeLimit, UpdateType, UserAction} from '../const.js';

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #sortComponent = null;
  #filmFiltersModel = null;


  #filmListComponent = new FilmListView();
  #emptyListComponent = new EmptyView();
  #loadingComponent = new LoadingView();
  #noFilmsErrorComponent = new NoFilmsErrorView();

  #showMorePresenter = null;
  #filmsPresenter = new Map();
  #extraPresenter = new Map();
  #popupPresenter = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;
  #uiBlocker = new UiBlocker ({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({filmContainer, filmsModel, commentsModel, filmFiltersModel}) {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filmFiltersModel = filmFiltersModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filmFiltersModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    const filterType = this.#filmFiltersModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[filterType](films);
    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredFilms.sort((a, b) =>sortByReleaseDate(a, b));
      case SortType.BY_RATING:
        return filteredFilms.sort((a, b) => a.filmInfo.totalRating - b.filmInfo.totalRating);
      case SortType.DEFAULT:
      default:
        return filteredFilms;
    }
  }

  init() {
    this.#renderFilmList();
    this.#popupPresenter = new PopupPresenter({
      filmsModel: this.#filmsModel,
      commentsModel: this.#commentsModel,
      filterModel: this.#filmFiltersModel,
      onDataChange: this.#handleViewAction
    });
  }

  #renderSort() {
    const prevsortComponent = this.#sortComponent;
    this.#sortComponent = new SortListView({
      onSortTypeChange: this.#onSortTypeChange
    });
    if (prevsortComponent === null) {
      render(this.#sortComponent, this.#filmListComponent.getFilmList(), RenderPosition.BEFOREBEGIN);
    } else {
      render(this.#sortComponent, this.#filmListComponent.getFilmList(), RenderPosition.BEFOREBEGIN);
    }
    this.#sortComponent.setButtonActive(this.#currentSortType);
  }

  #renderFilmList() {
    render(this.#filmListComponent, this.#filmContainer);
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const films = [...this.films];
    const filmCount = films.length;
    if(filmCount === 0) {
      this.#renderEmptyList(this.#filmFiltersModel.filter);
      this.#renderExtraFilms();
    } else {
      this.#renderSort();
      this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));
      if (filmCount > this.#renderedFilmCount) {
        this.#renderShowMoreButton();
      }

      this.#renderExtraFilms();
    }
  }


  #renderFilm(film, comments) {
    const filmPresenter = new FilmPresenter({
      filmContainer: this.#filmListComponent.getFilmListContainer(),
      onDataChange: this.#handleViewAction,
      currentFilterType: this.#filmFiltersModel.filter,
      commentsModel: this.#commentsModel,
      onOpenPopup: () => this.#handleOpenPopup(film)
    });
    filmPresenter.init(film, comments);
    this.#filmsPresenter.set(film.id, filmPresenter);
  }

  #renderShowMoreButton() {
    this.#showMorePresenter = new ShowMorePresenter({
      onClick: this.#onShowMoreClick,
      filmContainer: this.#filmListComponent.getFilmList(),
    });
    this.#showMorePresenter.init();
  }

  #renderExtraFilms() {
    const extraPresenter = new ExtraPresenter({
      filmExtraContainer: this.#filmListComponent.element,
      onDataChange: this.#handleViewAction,
      currentFilterType: this.#filmFiltersModel.filter,
      commentsModel: this.#commentsModel,
      filmsModel: this.#filmsModel,
      popupPresenter: this.#popupPresenter
    });
    extraPresenter.init(this.#extraPresenter);
  }

  #renderFilms(films) {
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#filmListComponent.getFilmList(), RenderPosition.AFTERBEGIN);
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyView(this.#filmFiltersModel.filter);
    render(this.#emptyListComponent, this.#filmListComponent.getFilmListContainer());
  }

  #renderNoFilmsError() {
    render(this.#noFilmsErrorComponent, this.#filmListComponent.getFilmListContainer(), RenderPosition.AFTERBEGIN);
  }

  #handleOpenPopup = (film) => {
    this.#popupPresenter.init(film);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#popupPresenter?.setSaving();
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          if(this.#popupPresenter.isOpen === true) {
            this.#popupPresenter.setAborting(UserAction.UPDATE_FILM);
          } else {
            if(this.#filmsPresenter.get(update.film.id)){
              this.#filmsPresenter.get(update.film.id).setAborting();
            }
            if(this.#extraPresenter.get(update.film.id)){
              this.#extraPresenter.get(update.film.id).setAborting();
            }
          }
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#popupPresenter.setSaving();
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch(err) {
          this.#popupPresenter.setAborting(UserAction.ADD_COMMENT);
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#popupPresenter.setDeleting(update.id);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch(err) {
          this.#popupPresenter.setAborting(UserAction.DELETE_COMMENT, update.id);
        }
        break;
      default:
        throw new Error(`Unknown state!, ${actionType}`);
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if(this.#filmsPresenter.get(data.film.id)) {
          this.#filmsPresenter.get(data.film.id).init(data.film);
        }
        if(this.#extraPresenter.get(data.film.id)) {
          this.#extraPresenter.get(data.film.id).init(data.film);
        }
        break;
      case UpdateType.MINOR:
        this.#clearFilmList();
        this.#renderFilmList();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmList();
        break;
      case UpdateType.INIT_ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderNoFilmsError();
        break;
      default:
        throw new Error('Unknown state!');
    }
  };

  #onShowMoreClick = (evt) => {
    evt.preventDefault();
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      this.#showMorePresenter.remove();
    }
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearFilmList({resetRenderedFilmCount: true});
    this.#renderFilmList();
  };

  #clearFilmList({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this.films.length;
    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();
    this.#extraPresenter.forEach((presenter) => presenter.destroy());
    this.#extraPresenter.clear();
    remove(this.#sortComponent);
    remove(this.#emptyListComponent);
    if(this.#showMorePresenter) {
      this.#showMorePresenter.remove();
    }
    remove(this.#filmListComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      const computedRenderedFilmCount = Math.min(Math.min(filmCount, this.#renderedFilmCount), FILM_COUNT_PER_STEP);
      this.#renderedFilmCount = computedRenderedFilmCount < FILM_COUNT_PER_STEP ? FILM_COUNT_PER_STEP : computedRenderedFilmCount;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }
}
