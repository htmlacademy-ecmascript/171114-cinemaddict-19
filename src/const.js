const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'by_date',
  BY_RATING: 'by_rating'
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorites',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  INIT_ERROR: 'INIT_ERROR'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UserRatings = {
  NOVICE: {
    rating: 'Novice',
    max: 10,
  },
  FAN: {
    rating: 'Fan',
    max: 20,
  },
  MOVIE_BUFF: {
    rating: 'Movie buff',
    max: Infinity,
  }
};

const EMOJI = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];
const FILM_COUNT_PER_STEP = 5;
const TEXT_LIMIT = 140;
const AUTHORIZATION = 'Basic er883jdzbdw';
const END_POINT = 'https://19.ecmascript.pages.academy/cinemaddict';
const SHAKE_ANIMATION_TIMEOUT = 600;
const SHAKE_CLASS_NAME = 'shake';

export {
  SortType,
  UpdateType,
  FilterType,
  TimeLimit,
  UserAction,
  UserRatings,
  EMOJI,
  FILM_COUNT_PER_STEP,
  TEXT_LIMIT,
  AUTHORIZATION,
  END_POINT,
  SHAKE_ANIMATION_TIMEOUT,
  SHAKE_CLASS_NAME
};
