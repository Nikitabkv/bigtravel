import AbstractComponentView from './abstract.js';

const createFiltersTemplate = () =>
  `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
          <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
          <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
          <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
          <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
          <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
          <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class Filters extends AbstractComponentView {
  constructor() {
    super();

    this._filterClickHandler = this._filterClickHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate();
  }

  _filterClickHandler(evt) {
    this._callback.filterClick(evt);
  }

  setFilterClick(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterClickHandler);
  }
}
