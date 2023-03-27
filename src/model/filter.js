import Observer from '../util/observer.js';
import {FILTER_TYPE, UPDATE_TYPE} from '../util/const.js';

export default class FiltersModel extends Observer {
  constructor() {
    super();
    this._filter = FILTER_TYPE.everything;
  }

  getFilter() {
    return this._filter;
  }

  setFilter(filter) {
    this._filter = filter;

    this._notify(UPDATE_TYPE.MINOR);
  }
}
