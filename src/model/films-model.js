import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';
import { adaptToClient, getItemById } from '../utils.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor({filmsApiService}) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  async init() {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(adaptToClient);
    } catch(err) {
      this._notify(UpdateType.INIT_ERROR);
      this.#films = [];
    }
    this._notify(UpdateType.INIT, this.films);
  }

  async updateFilm(updateType, { film, scroll }) {
    const index = this.#films.findIndex((item) => item.id === film.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const filmToUpdate = getItemById(this.#films, film.id);
      filmToUpdate.userDetails = film.userDetails;
      const response = await this.#filmsApiService.updateFilm(film);
      const updatedFilm = adaptToClient(response);

      const update = {
        film: updatedFilm,
        scroll,
      };

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  }
}
