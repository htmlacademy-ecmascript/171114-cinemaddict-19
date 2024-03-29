import FilmsPresenter from './presenter/films-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import ListFilterPresenter from './presenter/list-filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilmFiltersModel from './model/film-filters-model.js';
import FilmsApiService from './films-api-service.js';
import CommentsApiService from './comments-api-service.js';
import FooterPresenter from './presenter/footer-presenter.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel({
  filmsApiService: new FilmsApiService(END_POINT, AUTHORIZATION)
});

const commentsModel = new CommentsModel({
  commentsApiService: new CommentsApiService(END_POINT, AUTHORIZATION)
});

const filmFiltersModel = new FilmFiltersModel();

const filmsPresenter = new FilmsPresenter({
  filmContainer: siteMainElement,
  filmsModel,
  commentsModel,
  filmFiltersModel
});

const headerPresenter = new HeaderPresenter({
  headerContainer: siteHeaderElement,
  filmsModel
});

const footerPresenter = new FooterPresenter({
  footerContainer: siteFooterElement,
  filmsModel,
});

const listFilterPresenter = new ListFilterPresenter({
  listFilterContainer: siteMainElement,
  filmFiltersModel,
  filmsModel
});

headerPresenter.init();
footerPresenter.init();
listFilterPresenter.init();
filmsPresenter.init();
filmsModel.init();
