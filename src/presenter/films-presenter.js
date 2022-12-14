import {render} from '../framework/render.js';
import FilmListView from '../view/film-list.js';
import ShowMoreView from '../view/button-showmore';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import EmptyView from '../view/empty.js';

const FILM_COUNT_PER_STEP = 5;

const body = document.querySelector('body');

export default class FilmsPresenter {
  #filmContainer = null;
  #filmsModel = null;

  #filmListComponent = new FilmListView();

  #listOfFilms = [];
  #showMoreComponent = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor({filmContainer, filmsModel}) {
    this.#filmContainer = filmContainer;
    this.#filmsModel = filmsModel;
  }

  init() {
    this.#listOfFilms = [...this.#filmsModel.films];

    render(this.#filmListComponent, this.#filmContainer);

    if(this.#listOfFilms.length === 0) {
      render(new EmptyView(), this.#filmListComponent.getFilmListContainer());
    } else {

      for (let i = 0; i < Math.min(this.#listOfFilms.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(i);
      }
      if (this.#listOfFilms.length > FILM_COUNT_PER_STEP) {
        this.#showMoreComponent = new ShowMoreView();
        render(this.#showMoreComponent, this.#filmListComponent.getFilmList());

        this.#showMoreComponent.element.addEventListener('click', this.#showMoreClickHandler);
      }
    }
  }

  #renderFilm(id) {
    const filmCardView = new FilmCardView({film: this.#listOfFilms[id], onClick: () => this.renderFilmDetailsPopupById(id)});
    filmCardView.setUserControls();
    render(filmCardView, this.#filmListComponent.getFilmListContainer());
  }

  escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.closePopupControl();
      document.removeEventListener('keydown', this.escKeyDownHandler);
    }
  };

  renderFilmDetailsPopupById(filmId) {
    const filmDetails = this.#filmsModel.renderfilmDetailsById(filmId);
    const commentsList = this.#filmsModel.rendercommentsById(filmId);
    const filmDetailsView = new FilmDetailsView({filmDetails: filmDetails, commentsList: commentsList, onClick: () => this.closePopupControl()});
    filmDetailsView.setUserControls();
    render(filmDetailsView, this.#filmListComponent.getFilmListContainer());
    document.addEventListener('keydown', this.escKeyDownHandler);
    body.classList.add('hide-overflow');
  }

  closePopupControl = () => {
    this.#filmListComponent.getFilmListContainer().removeChild(document.querySelector('.film-details'));
    body.classList.remove('hide-overflow');
  };

  #showMoreClickHandler = (evt) => {
    evt.preventDefault();
    this.#listOfFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((_, index) => this.#renderFilm(index + this.#renderedFilmCount));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listOfFilms.length) {
      this.#showMoreComponent.element.remove();
      this.#showMoreComponent.removeElement();
    }
  };
}
