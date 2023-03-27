import AbstractComponentView from './abstract.js';
import {SORT_TYPE} from '../util/const.js';

const crateSortTemplate = () =>
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" data-sortType="${SORT_TYPE.DAY}" checked>
        <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" data-sortType="${SORT_TYPE.EVENT}" >
        <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sortType="${SORT_TYPE.TIME}">
        <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sortType="${SORT_TYPE.PRICE}">
        <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" data-sortType="${SORT_TYPE}" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`;

export default class Sort extends AbstractComponentView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return crateSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.changeClick(evt.target.id);
  }

  setClickChangeType(callback) {
    this._callback.changeClick = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
