import {UPDATE_TYPE} from './util/const.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/point.js';
import FiltersModel from './model/filter.js';
import StatsView from './view/stats.js';
import Api from './api.js';


const filtersModel = new FiltersModel();
const pointsModel = new PointsModel();
const api = new Api('https://14.ecmascript.pages.academy/big-trip', 'Basic zxc', pointsModel);

const statsView = new StatsView(pointsModel);
const tripPresenter = new TripPresenter(pointsModel, filtersModel, statsView, api);
tripPresenter.init();

api.getDestinations()
  .then((destinations) => {
    pointsModel.setDestinations(destinations);
  })
  .then(() => {
    api.getOffers()
      .then((offers) => {
        pointsModel.setPointsOffers(offers);
      })
      .then(() => {
        api.getPoints()
          .then((points) => {
            pointsModel.setPoints(points, UPDATE_TYPE.INIT);
          });
      });
  });
