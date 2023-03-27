import Observer from '../util/observer.js';
import dayjs from 'dayjs';

export default class PointsModel extends Observer {
  constructor() {
    super();
    this._points = [];
    this._pointsOffers = [];
    this._pointDestinations = [];
  }

  getPointOffers() {
    return this._pointsOffers;
  }

  setPointsOffers(offers) {
    this._pointsOffers = offers.slice();
  }

  getPoint() {
    return this._points;
  }

  setPoints(points, updateType) {
    this._points = points;

    this._notify(updateType);
  }

  setDestinations(destinations) {
    this._pointDestinations = destinations;
  }

  getDestinations() {
    return this._pointDestinations;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Не получилось найти индекс для обновления');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Не получилось найти индекс для обновления');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  adaptPointToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        id: point.id,
        destination: point.destination.name,
        destinationDescription: {
          description: point.destination.description,
          photo: point.destination.pictures,
        },
        eventCost: point.base_price,
        eventType: point.type,
        startTrip: dayjs(point.date_from),
        endTrip: dayjs(point.date_to),
        offers: point.offers.map((elem) => Object.assign(
          {},
          elem,
          {
            offerTitle: elem.title,
          },
        )),
        favorite: point.is_favorite,
      },
    );

    adaptedPoint.offers.forEach((elem) => {
      delete elem.title;
      delete elem.price;
    });

    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;
    delete adaptedPoint.type;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;

    return this._adaptPointOffersToClient(adaptedPoint);
  }

  _adaptPointOffersToClient(adaptedPoint) {
    const allOffers = [];
    this._pointsOffers.forEach((element) => {
      if (adaptedPoint.eventType === element[element.length-1]) {
        element.forEach((item) => {
          allOffers.push(Object.assign({}, item));
        });
      }
    });
    const checkedTitles = adaptedPoint.offers.map((title) => title.offerTitle);

    allOffers.pop();
    allOffers.map((elem) => {
      if (checkedTitles.includes(elem.offerTitle)) {
        Object.assign(elem, {checked: true});
      } else {
        Object.assign(elem, {checked: false});
      }
    });

    adaptedPoint.offers = allOffers;
    return adaptedPoint;
  }

  adaptOffersToClient(offersData) {
    const offersArr = [];
    offersData.offers.map((elem) => {
      const adaptedOffer = Object.assign(
        {},
        elem,
        {
          offerTitle: elem.title,
          offerPrice: elem.price,
        },
      );

      delete adaptedOffer.title;
      delete adaptedOffer.price;

      offersArr.push(adaptedOffer);
    });

    offersArr.push(offersData.type);
    return offersArr;
  }

  static adaptPointToServer(point, post) {
    const adaptedOffers = [];
    point.offers.forEach((el) => {
      if (el.checked === true) {
        adaptedOffers.push(Object.assign({}, el));
      }
    });

    adaptedOffers.forEach((el) => {
      el.price = el.offerPrice;
      el.title = el.offerTitle;
      delete el.checked;
      delete el.offerPrice;
      delete el.offerTitle;
    });

    const adaptedPoint = Object.assign(
      {},
      point,
      {
        id: point.id,
        destination: {
          description: point.destinationDescription.description,
          name: point.destination,
          pictures: point.destinationDescription.photo,
        },
        'base_price': +point.eventCost,
        type: point.eventType.toLowerCase(),
        'date_from': point.startTrip.toISOString(),
        'date_to': point.endTrip.toISOString(),
        offers: adaptedOffers,
        'is_favorite': point.favorite,
      },
    );


    delete adaptedPoint.isDeleting;
    delete adaptedPoint.isSaving;
    delete adaptedPoint.isDisabled;
    delete adaptedPoint.eventCost;
    delete adaptedPoint.favorite;
    delete adaptedPoint.startTrip;
    delete adaptedPoint.endTrip;
    delete adaptedPoint.eventType;
    delete adaptedPoint.destinationDescription;
    if (post === true) {
      delete adaptedPoint.id;
    }

    return adaptedPoint;
  }
}
