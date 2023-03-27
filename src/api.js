import PointsModel from './model/point.js';

export default class Api {
  constructor(endPoint, authorization, pointsModel) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._pointsModel = pointsModel;
  }

  getPoints() {
    return this._load({url: '/points', method: 'GET'})
      .then(Api.toJSON)
      .then((point) => point.map((el) => this._pointsModel.adaptPointToClient(el)));
  }

  getDestinations() {
    return this._load({url: '/destinations', method: 'GET'})
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({url: '/offers', method: 'GET'})
      .then(Api.toJSON)
      .then((offers) => offers.map((el) => this._pointsModel.adaptOffersToClient(el)));
  }

  updatePoint(point) {
    return this._load({
      url: `/points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(PointsModel.adaptPointToServer(point)),
      headers: new Headers({'Content-type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then((item) => this._pointsModel.adaptPointToClient(item));
  }

  deletePoint(point) {
    return this._load({
      url: `/points/${point.id}`,
      method: 'DELETE',
    });
  }

  addPoint(point) {
    return this._load({
      url: '/points',
      method: 'POST',
      body: JSON.stringify(PointsModel.adaptPointToServer(point, true)),
      headers: new Headers({'Content-type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then((item) => this._pointsModel.adaptPointToClient(item));
  }

  _load({
    url,
    method,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers} );
  }

  static toJSON(response) {
    return response.json();
  }
}
