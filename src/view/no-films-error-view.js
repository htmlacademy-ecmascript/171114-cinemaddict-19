import AbstractView from '../framework/view/abstract-view.js';

function createNoFilmsErrorTemplate() {
  return (
    '<h2 class="films-list__title">Ooops.. Something happened! Please, reload the page.</h2>'
  );
}

export default class NoFilmsErrorView extends AbstractView {
  get template() {
    return createNoFilmsErrorTemplate();
  }
}
