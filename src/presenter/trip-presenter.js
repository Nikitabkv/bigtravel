import {remove, render} from '../util/render.js';
import {RENDER_POSITION, SORT_TYPE, USER_ACTION, UPDATE_TYPE, FILTER_TYPE} from '../util/const.js';
import EmptyBoard from '../view/empty-board.js';
import BoardTemplate from '../view/event-board.js';
import SortView from '../view/trip-sort.js';
import PointPresenter from './point-presenter.js';
import {sortByDuration, sortByDay, sortByPrice, sortByEvent} from '../util/util.js';
import RouteAndCostView from '../view/route-and-cost.js';
import MenuView from '../view/menu.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

const tripEventsContainer = document.querySelector('.trip-events');

export default class TripPresenter {

  constructor(pointsModel, filterModel, statsView, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._api = api;
    this._pointPresenter = {};
    this._newPointPresenter = {};
    this._currentSortType = SORT_TYPE.DAY;
    this._isLoading = true;

    this._statsComponent = statsView;
    this._sortComponent = new SortView();
    this._routeAndCost = new RouteAndCostView(this._getPoints(this._filterModel.getFilter()));
    this._menuComponent = new MenuView();
    this.pointsContainer = new BoardTemplate().getElement();
    this.emptyList = new EmptyBoard();

    this._pointChangeMode = this._pointChangeMode.bind(this);
    this._sortTypeChange = this._sortTypeChange.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderList();
  }

  _clearPointsList() {
    Object.values(this._pointPresenter).forEach((el) => el.destroy());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case USER_ACTION.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState('saving');
        this._api.updatePoint(update)
          .then((response)=> {
            this._pointsModel.updatePoint(updateType, response);
            if (updateType === UPDATE_TYPE.PATCH) {
              this._pointPresenter[response.id]._replaceEditToPoint();
            }
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState('reset');
          });
        break;
      case USER_ACTION.ADD_POINT:
        this._newPointPresenter.setSavingState('saving');
        this._api.addPoint(update)
          .then((response)=> {
            this._pointsModel.addPoint(updateType, response);
            this._newPointPresenter.removeAndCreateNewPoint();
          })
          .catch(() => {
            this._newPointPresenter.setSavingState('reset');
          });
        break;
      case USER_ACTION.DELETE_POINT:
        this._pointPresenter[update.id].setViewState('deleting');
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState('reset');
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this._pointPresenter[data.id].init(data);
        this._reRenderRouteAndCost();
        this._reRenderStatsComponent();
        break;
      case UPDATE_TYPE.MINOR:
        if (this._pointsModel.getPoint().length === 0) {
          this._renderEmptyList();
        } else {
          remove(this.emptyList);
        }
        this._reRenderStatsComponent();
        this._reRenderRouteAndCost();
        this._setSortToDefault();
        this._clearPointsList();
        this._renderPoints();
        break;
      case UPDATE_TYPE.MAJOR:
        this._reRenderStatsComponent();
        this._clearBoard();
        this._renderList();
        break;
      case UPDATE_TYPE.INIT:
        this._isLoading = false;
        this._renderList();
        break;
    }
  }

  _reRenderRouteAndCost() {
    remove(this._routeAndCost);
    this._renderRouteAndCost();
  }

  _setSortToDefault() {
    this._currentSortType = SORT_TYPE.DAY;
    remove(this._sortComponent);
    this._renderSort();
  }

  _getPoints(filter = FILTER_TYPE.everything) {
    switch (filter) {
      case FILTER_TYPE.everything:
        return this._pointsModel.getPoint().slice();
      case FILTER_TYPE.future:
        return this._pointsModel.getPoint().slice().filter((point) => new Date(point.startTrip.toJSON()) > new Date());
      case FILTER_TYPE.past:
        return this._pointsModel.getPoint().slice().filter((point) => new Date(point.startTrip.toJSON()) < new Date());
    }
  }

  _getPointsBySortType(sortType) {
    switch (sortType) {
      case SORT_TYPE.TIME:
        return this._getPoints(this._filterModel.getFilter()).sort(sortByDuration);
      case SORT_TYPE.DAY:
        return this._getPoints(this._filterModel.getFilter()).sort(sortByDay);
      case SORT_TYPE.PRICE:
        return this._getPoints(this._filterModel.getFilter()).sort(sortByPrice);
      case SORT_TYPE.EVENT:
        return this._getPoints(this._filterModel.getFilter()).sort(sortByEvent);
      default:
        throw new Error('Произошел какой-то ошибка');
    }
  }

  _renderPoint(board, point, allOffers) {
    const pointPresenter = new PointPresenter(this.pointsContainer, this._handleViewAction, this._pointChangeMode, this._pointsModel);
    pointPresenter.init(point, allOffers);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _sortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      throw new Error('2x click on sort button');
    }
    this._currentSortType = sortType;
    this._clearPointsList();
    this._renderPoints();
  }

  _pointChangeMode() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderPoints() {
    const filteredPoints = this._getPointsBySortType(this._currentSortType);
    for (let i = 0; i < filteredPoints.length; i++) {
      this._renderPoint(this.pointsContainer, this._getPointsBySortType(this._currentSortType)[i]);
    }
  }

  _renderSort() {
    render(tripEventsContainer, this._sortComponent.getElement(), RENDER_POSITION.start);
    this._sortComponent.setClickChangeType(this._sortTypeChange);
  }

  _renderEmptyList() {
    render(this.pointsContainer, this.emptyList.getElement(), RENDER_POSITION.end);
  }

  _clearBoard() {
    remove(this._routeAndCost);
    remove(this._menuComponent);
    this._setSortToDefault();
    this._clearPointsList();
  }

  _reRenderStatsComponent() {
    remove(this._statsComponent);
    this._renderStats();
    this._statsComponent.hide();
  }

  _renderRouteAndCost() {
    const tripContainer = document.querySelector('.trip-main');
    this._routeAndCost.setPoints(this._getPoints(this._filterModel.getFilter()));
    render(tripContainer, this._routeAndCost.getElement(), RENDER_POSITION.start);
  }

  _renderMenu() {
    const menuContainer = document.querySelector('.trip-controls__navigation');
    render(menuContainer, this._menuComponent.getElement(), RENDER_POSITION.end);
  }

  _openStatsComponent(activeButton, nonActiveButton) {
    activeButton.classList.add('trip-tabs__btn--active');
    nonActiveButton.classList.remove('trip-tabs__btn--active');
    tripEventsContainer.classList.add('visually-hidden');
    this._statsComponent.show();
  }

  _closeStatsComponent(activeButton, nonActiveButton) {
    activeButton.classList.add('trip-tabs__btn--active');
    nonActiveButton.classList.remove('trip-tabs__btn--active');
    tripEventsContainer.classList.remove('visually-hidden');
    this._setSortToDefault();
    this._clearPointsList();
    this._renderPoints();
    this._statsComponent.hide();
  }

  _controlStatsComponent() {
    const statsButton = document.querySelectorAll('.trip-tabs__btn')[1];
    const tableButton = document.querySelectorAll('.trip-tabs__btn')[0];

    statsButton.addEventListener('click', () => this._openStatsComponent(statsButton, tableButton));
    tableButton.addEventListener('click', () => this._closeStatsComponent(tableButton, statsButton));

    this._statsComponent.hide();
  }

  _renderFilters() {
    const filterPresenter = new FilterPresenter(this._filterModel);
    filterPresenter.init();
  }

  _renderStats() {
    const bodyContainer = document.querySelector('.page-main').querySelector('.page-body__container');
    render(bodyContainer, this._statsComponent.getElement(), 'afterbegin');
    this._statsComponent.renderCharts();
  }

  _renderNewPoint() {
    const newPointPresenter = new NewPointPresenter(this.pointsContainer, this._handleViewAction, this._getPoints(), this._pointsModel);
    newPointPresenter.init();
    this._newPointPresenter = newPointPresenter;
  }

  _renderList() {
    if (this._isLoading) {
      return;
    }
    if (this._pointsModel.getPoint().length === 0) {
      this._renderEmptyList();
    }
    this._renderStats();
    this._renderFilters();
    this._renderRouteAndCost();
    this._renderMenu();
    render(tripEventsContainer, this.pointsContainer, RENDER_POSITION.end);
    this._renderSort();
    this._renderNewPoint();
    this._renderPoints();
    this._controlStatsComponent();
  }
}
