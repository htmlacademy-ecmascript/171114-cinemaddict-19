import FilmCardView from '../view/film-card-view.js';
import { UpdateType, UserAction } from '../const.js';
import { render, replace, remove } from '../framework/render.js';

export default class FilmPresenter {
  #filmContainer = null;
  #filmComponent = null;
  #film = null;
  #handleDataChange = null;
  #handleOpenPopup = null;
  #currentFilterType = null;
  #commentsModel = null;

  constructor({filmContainer, onDataChange, onOpenPopup, currentFilterType, commentsModel}) {
    this.#filmContainer = filmContainer;
    this.#handleDataChange = onDataChange;
    this.#handleOpenPopup = onOpenPopup;
    this.#currentFilterType = currentFilterType;
    this.#commentsModel = commentsModel;
  }

  init(film) {
    this.#film = film;
    const prevFilmComponent = this.#filmComponent;
    this.#filmComponent = new FilmCardView({
      film,
      comments: this.#commentsModel,
      onOpenClick: () => this.#handleOpenPopup(film),
      onControlsClick: this.#handleControlsClick,
      currentFilterType: this.#currentFilterType,
    });

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmContainer);
    } else {
      replace(this.#filmComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  }

  destroy() {
    remove(this.#filmComponent);
  }

  setAborting() {
    this.#filmComponent.shake();
  }

  #handleControlsClick = (
    updatedDetails,
    updateType = UpdateType.PATCH
  ) => {
    this.#handleDataChange(UserAction.UPDATE_FILM, updateType, {
      film: {...this.#film, userDetails: updatedDetails},
    });
  };
}
