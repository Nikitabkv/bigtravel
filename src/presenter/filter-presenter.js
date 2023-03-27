import {RENDER_POSITION} from '../util/const.js';
import {render} from '../util/render.js';
import FiltersView from '../view/filters.js';

export default class FilterPresenter {
  constructor(filterModel) {
    this._filterModel = filterModel;
    this._filterComponent = new FiltersView();

    this._filterClickListener = this._filterClickListener.bind(this);
    this._filterComponent.setFilterClick(this._filterClickListener);
  }

  init() {
    const tripFiltersContainer = document.querySelector('.trip-controls__filters');
    render(tripFiltersContainer, this._filterComponent.getElement(), RENDER_POSITION.end);
  }

  _filterClickListener(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._filterModel.setFilter(evt.target.value);
  }
}
