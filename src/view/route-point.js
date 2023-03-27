import AbstractComponentView from './abstract.js';

const appendOffers = (point) => {
  let offers = '';
  for (let i = 0; i < point.length; i++) {
    const {offerTitle, offerPrice, checked} = point[i];
    if (checked) {
      offers += `<li class="event__offer">
    <span class="event__offer-title">${offerTitle}</span>
      &plus;&euro;&nbsp;
    <span class="event__offer-price">${offerPrice}</span>
   </li>`;
    }
  }
  return offers;
};
const getFavorite = (checked) => checked ? 'event__favorite-btn--active' : '';
const getDuration = (startTime, endTime) => {
  const days = Math.floor((endTime-startTime)/86400000);
  const hours = Math.floor((endTime-startTime)/3600000) - (days*24);
  const minutes = Math.floor(((endTime-startTime) - (hours*3600000) - (days*86400000))/60000);
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

const createTripPointTemplate = (point) => {
  const {eventType, destination, eventCost, startTrip, endTrip, favorite} = point;
  const date = startTrip.format('MMM D');
  const startDateTime = startTrip.format('YYYY-DD-MM HH:mm');
  const startTime = startTrip.format('HH:mm');
  const endDateTime = endTrip.format('YYYY-DD-MM HH:mm');
  const endTime = endTrip.format('HH:mm');
  return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${endDateTime.substring(0, 10)}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${eventType} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDateTime}">${startTime}</time>
                        &mdash;
            <time class="event__end-time" datetime="${endDateTime}">${endTime}</time>
          </p>
          <p class="event__duration">${getDuration(startTrip, endTrip)}</p>
        </div>
        <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${eventCost}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${appendOffers(point.offers)}
        </ul>
        <button class="event__favorite-btn ${getFavorite(favorite)}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
  </li>`;
};

export default class RoutePoint extends AbstractComponentView {
  constructor(point) {
    super();
    this._point = point;
    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTripPointTemplate(this._point);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClick(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  setOpenFormClick(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }
}
