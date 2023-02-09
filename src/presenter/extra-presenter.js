import ExtraView from '../view/extra-view.js';
import FilmPresenter from './film-presenter.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import {UpdateType} from '../const.js';

export default class ExtraPresenter {
  #filmContainer = null;
  #handleDataChange = null;
  #currentFilterType = null;
  #commentsModel = null;
  #filmsModel = null;
  #films = null;
  #extraPresenter = null;
  #popupPresenter = null;

  #mostCommentedComponent = new ExtraView('Most commented');
  #topRatedComponent = new ExtraView('Top rated');

  constructor({filmExtraContainer, onDataChange, currentFilterType, commentsModel, filmsModel, popupPresenter}) {
    this.#filmContainer = filmExtraContainer;
    this.#handleDataChange = onDataChange;
    this.#currentFilterType = currentFilterType;
    this.#commentsModel = commentsModel;
    this.#filmsModel = filmsModel;
    this.#popupPresenter = popupPresenter;

    this.#filmsModel.addObserver(this.#handleFilmsEvent);
    this.#commentsModel.addObserver(this.#handleCommentsEvent);
  }

  init(extraPresenter) {
    this.#films = this.#filmsModel.films;
    this.#extraPresenter = extraPresenter;
    if(!(this.#filmsModel.films.every((film) => film.comments.length === 0))) {
      render(this.#mostCommentedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
      this.#mostCommentedComponent.setMostCommented();
      this.#renderMostCommentedFilms(this.#films);
    }
    if(!(this.#filmsModel.films.every((film) => film.filmInfo.totalRating === 0))) {
      render(this.#topRatedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
      this.#topRatedComponent.setTopRated();
      this.#renderTopRatedFilms(this.#films);
    }
  }

  update() {

    remove(this.#mostCommentedComponent);
    remove(this.#topRatedComponent);
    if(!(this.#filmsModel.films.every((item) => item.comments.length === 0))) {
      render(this.#mostCommentedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
      this.#mostCommentedComponent.setMostCommented();
      this.#renderMostCommentedFilms(this.#films);
    }
    if(!(this.#filmsModel.films.every((item) => item.filmInfo.totalRating === 0))) {
      render(this.#topRatedComponent, this.#filmContainer, RenderPosition.BEFOREEND);
      this.#topRatedComponent.setTopRated();
      this.#renderTopRatedFilms(this.#films);
    }
  }

  #renderFilm(film, filmContainer) {
    const filmPresenter = new FilmPresenter({
      filmContainer,
      onDataChange: this.#handleDataChange,
      onOpenPopup: () => this.#handleOpenPopup(film),
      currentFilterType: this.#currentFilterType,
      commentsModel: this.#commentsModel
    });
    filmPresenter.init(film);
    this.#extraPresenter.set(film.id, filmPresenter);
  }

  #handleOpenPopup = (film) => {
    this.#popupPresenter.init(film);
  };

  #renderMostCommentedFilms(films) {
    films.sort((a, b) => b.comments.length - a.comments.length);
    this.#renderFilm(films[0], this.#mostCommentedComponent.element.querySelector('.most_commented'));
    this.#renderFilm(films[1], this.#mostCommentedComponent.element.querySelector('.most_commented'));
  }

  #renderTopRatedFilms(films) {
    films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    this.#renderFilm(films[0], this.#topRatedComponent.element.querySelector('.top_rated'));
    this.#renderFilm(films[1], this.#topRatedComponent.element.querySelector('.top_rated'));
  }

  #handleFilmsEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
      case UpdateType.MINOR:
        this.update(update);
        break;
      case UpdateType.MAJOR:
      case UpdateType.INIT:
        this.#films = update;
        break;
    }
  };

  #handleCommentsEvent = (updateType, update) => {
    const index = this.#films.findIndex((item) => item.id === update.film.id);
    if (index === -1) {
      return;
    }
    this.#films = [
      ...this.#films.slice(0, index),
      update.film,
      ...this.#films.slice(index + 1),
    ];

    if(this.#extraPresenter.get(update.film.id)) {
      this.#extraPresenter.get(update.film.id).init(update.film, scroll);
      const extraFilms = [...this.#films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, 2)].concat(...this.#films.sort((a, b) => b.comments.length - a.comments.length).slice(0, 2));
      if(!extraFilms.some((item) => item.id === update.film.id)) {
        this.update(update);
      }
      return;
    }
    this.update(update);
  };

  destroy() {
    remove(this.#mostCommentedComponent);
    remove(this.#topRatedComponent);
  }
}
