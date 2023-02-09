import dayjs from 'dayjs';
import fromnow from 'fromnow';
import { FilterType, UserRatings } from './const.js';

const FILM_DATE_FORMAT = 'YYYY';
const RELEASE_DATE_FORMAT = 'D MMMM YYYY';

function getReleaseDate(date) {
  return date ? dayjs(date).format(RELEASE_DATE_FORMAT) : '';
}

function getFilmYear(date) {
  return date ? dayjs(date).format(FILM_DATE_FORMAT) : '';
}

function getCommentDate(date) {
  return date ? fromnow(dayjs(date), { max:2, suffix:true, and:true }) : '';
}

const getDuration = (duration) => `${Math.round(duration / 60)}h ${duration % 60}m`;

const getItemById = (items, itemId) => items.find((item) => item.id === itemId);

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortByReleaseDate(filmA, filmB) {
  const weight = getWeightForNullDate(filmA.filmInfo.release.date, filmB.filmInfo.release.date);
  return weight ?? dayjs(filmA.filmInfo.release.date).diff(dayjs(filmB.filmInfo.release.date));
}

const isCtrlEnterEvent = (evt) => evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey);

const isEscapeEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const adaptToClient = (film) => {
  const adaptedFilm = {...film,
    filmInfo: {
      title: film['film_info'].title,
      alternativeTitle: film['film_info']['alternative_title'],
      poster: film['film_info'].poster,
      totalRating: film['film_info']['total_rating'],
      ageRating: film['film_info']['age_rating'],
      director: film['film_info'].director,
      writers: film['film_info'].writers,
      actors: film['film_info'].actors,
      release: {
        date: film['film_info'].release.date !== null ? new Date(film['film_info'].release.date) : film['film_info'].release.date,
        releaseCountry: film['film_info'].release['release_country']},
      duration: film['film_info'].duration,
      genre: film['film_info'].genre,
      description: film['film_info'].description},
    userDetails: {
      watchlist: film['user_details'].watchlist,
      alreadyWatched: film['user_details']['already_watched'],
      watchingDate: film['user_details']['watching_date'],
      favorite: film['user_details'].favorite}
  };

  delete adaptedFilm ['film_info'];
  delete adaptedFilm ['user_details'];

  return adaptedFilm;
};

const filter = {
  [FilterType.ALL]: (films) => films.slice(),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.userDetails.favorite),
};

const getUserRating = (films) => {

  const watchedFilmsCount = filter[FilterType.HISTORY](films).length;

  if (watchedFilmsCount <= UserRatings.NOVICE.max) {
    return UserRatings.NOVICE.rating;
  }

  if (watchedFilmsCount <= UserRatings.FAN.max) {
    return UserRatings.FAN.rating;
  }

  return UserRatings.MOVIE_BUFF.rating;
};

export {
  getReleaseDate,
  getFilmYear,
  getCommentDate,
  getDuration,
  getItemById,
  sortByReleaseDate,
  isCtrlEnterEvent,
  isEscapeEvent,
  adaptToClient,
  filter,
  getUserRating,
};
