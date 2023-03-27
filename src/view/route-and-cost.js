import AbstractComponentView from './abstract.js';

const getStartDate = (point) => {
  let startDate = 'Start';
  if (point.length === 0) {
    return startDate;
  } else {
    startDate = point[0].startTrip.format('MMM D');
    return startDate;
  }
};

const getEndDate = (point) => {
  let endDate = 'End';
  if (point.length === 0) {
    return endDate;
  } else {
    endDate = point[point.length - 1].endTrip.format('MMM D');
    return endDate;
  }
};

const getFullPrice = (points) => {
  let price = 0;
  points.forEach((point) => {
    price += Number(point.eventCost);
  });
  return price;
};

const createRouteCostTemplate = (point) =>
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
        <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>
        <p class="trip-info__dates">${getStartDate(point)}&nbsp;&mdash;&nbsp;${getEndDate(point)}</p>
    </div>
    <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${getFullPrice(point)}</span>
    </p>
  </section>`;

export default class RouteAndCost extends AbstractComponentView {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createRouteCostTemplate(this._point);
  }

  setPoints(value) {
    this._point = value;
  }
}
