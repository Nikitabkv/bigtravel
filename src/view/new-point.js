import Smart from './smart.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.css';

const appendOptionsDatalist = (allDataDestinations) => {
  let datalist = '';
  for (let i = 0; i < allDataDestinations.length; i++) {
    const {name} = allDataDestinations[i];
    datalist += `<option value='${name}'></option>`;
  }
  return datalist;
};

const appendOffers = (offer, isDisabled) =>  {
  let offers = '';
  for (let i = 0; i < offer.length; i++) {
    const {offerTitle, offerPrice, checked} = offer[i];
    const getCheckedOffer = (check) => {
      if (check) {
        return 'checked';
      } else {
        return '';
      }
    };
    offers += `<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitle.split(' ')[0]}-${i+1}" type="checkbox" name="event-offer-${offerTitle.split(' ')[0]}" ${getCheckedOffer(checked)} ${isDisabled ? 'disabled' : ''}>
                  <label class="event__offer-label" for="event-offer-${offerTitle.split(' ')[0]}-${i+1}">
                    <span class="event__offer-title">${offerTitle}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offerPrice}</span>
                  </label>
                </div>`;
  }
  return offers;
};

const appendPhotos = (photo) => {
  let photos = '';
  for (let i = 0; i < photo.length; i++) {
    photos += `<img class="event__photo" src="${photo[i].src}" alt="${photo[i].description}">`;
  }

  return `<div class="event__photos-container">
            <div class="event__photos-tape">
                ${photos}
            </div>
          </div>`;
};

const getCheckedEventType = (evtType, CurrentType) => {
  if (evtType === CurrentType) {
    return 'checked';
  } else {
    return '';
  }
};

const createEditTemplate = (point, pointDestinations) => {
  const {id, eventType, destination, destinationDescription, eventCost, isDisabled = false, isSaving = false} = point;
  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        <div class="event__type-item">
                          <input id="event-type-taxi-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="Taxi" ${getCheckedEventType('Taxi', eventType)}>
                          <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-${id}">Taxi</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-bus-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="Bus" ${getCheckedEventType('Bus', eventType)}>
                          <label class="event__type-label  event__type-label--bus" for="event-type-bus-${id}">Bus</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-train-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="Train" ${getCheckedEventType('Train', eventType)}>
                          <label class="event__type-label  event__type-label--train" for="event-type-train-${id}">Train</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-ship-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="Ship" ${getCheckedEventType('Ship', eventType)}>
                          <label class="event__type-label  event__type-label--ship" for="event-type-ship-${id}">Ship</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-transport-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="Transport" ${getCheckedEventType('Transport', eventType)}>
                          <label class="event__type-label  event__type-label--transport" for="event-type-transport-${id}">Transport</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-drive-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="Drive" ${getCheckedEventType('Drive', eventType)}>
                          <label class="event__type-label  event__type-label--drive" for="event-type-drive-${id}">Drive</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-flight-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="Flight" ${getCheckedEventType('Flight', eventType)}>
                          <label class="event__type-label  event__type-label--flight" for="event-type-flight-${id}">Flight</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-check-in-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="Check-in" ${getCheckedEventType('Check-in', eventType)}>
                          <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-${id}">Check-in</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-sightseeing-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="Sightseeing" ${getCheckedEventType('Sightseeing', eventType)}>
                          <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-${id}">Sightseeing</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-restaurant-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="Restaurant" ${getCheckedEventType('Restaurant', eventType)}>
                          <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-${id}">Restaurant</label>
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${id}">
                      ${eventType}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination}" list="destination-list-${id}" ${isDisabled ? 'disabled' : ''}>
                    <datalist id="destination-list-${id}">
                      ${appendOptionsDatalist(pointDestinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-${id}">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="" ${isDisabled ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-${id}">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="" ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${id}">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${eventCost}" ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
                  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Close</button>
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${appendOffers(point.offers, isDisabled)}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinationDescription.description}</p>
                    ${appendPhotos(destinationDescription.photo)}
                  </section>
                </section>
              </form>
            </li>`;
};

export default class NewPoint extends Smart {
  constructor(point, offers, destinations) {
    super();
    this._point = point;
    this._data = Object.assign({}, point);
    this._pointOffers = offers;
    this._pointDestinations = destinations;

    this._startDatepicker = null;
    this._endDatepicker = null;

    this._submitClickHandler = this._submitClickHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._eventPriceHandler = this._eventPriceHandler.bind(this);
    this._eventDestinationHandler = this._eventDestinationHandler.bind(this);
    this._eventTypeHandler = this._eventTypeHandler.bind(this);
    this._eventTimeHandler = this._eventTimeHandler.bind(this);
    this._eventOffersHandler = this._eventOffersHandler.bind(this);

    this.getElement().querySelector('.event__input--price').addEventListener('input', this._eventPriceHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._eventDestinationHandler);
    this.getElement().querySelector('.event__section--offers').addEventListener('click', this._eventOffersHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('click', this._eventTypeHandler);

    this._setDatepicker();
  }

  restoreHandlers() {
    this.setSubmitFormClick(this._callback.submitClick);
    this.setClosetFormClick(this._callback.closeClick);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._eventPriceHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._eventDestinationHandler);
    this.getElement().querySelector('.event__section--offers').addEventListener('click', this._eventOffersHandler);
    this.getElement().querySelector('.event__type-group').addEventListener('click', this._eventTypeHandler);
    this._setDatepicker();
  }

  addSavingFlag(flag) {
    return this.updateData(this._data, flag, false);
  }

  _eventPriceHandler(evt) {
    evt.preventDefault();
    const priceValue = this.getElement().querySelector('.event__input--price');
    evt.preventDefault();
    if (priceValue.value.split('').some((symb) => !/[0-9]/.test(symb))) {
      priceValue.setCustomValidity('Цена может состоять только из цифр');
      priceValue.reportValidity();
      return;
    } else {
      priceValue.setCustomValidity('');
    }
    this.updateData(this._data,{eventCost: priceValue.value}, true);
  }

  _eventDestinationHandler(evt) {
    evt.preventDefault();
    this.getElement().querySelector('.event__input--destination').setCustomValidity('Такого города нет в базе :c');

    this._pointDestinations.forEach((el) => {
      this.getElement().querySelector('.event__input--destination').reportValidity();

      if (this.getElement().querySelector('.event__input--destination').value.toLowerCase() === el.name.toLowerCase()) {

        this.getElement().querySelector('.event__input--destination').setCustomValidity('ху');

        const newDescription = Object.assign({}, el);
        newDescription.photo = newDescription.pictures;
        delete newDescription.pictures;
        delete newDescription.name;

        this.updateData(this._data,
          {
            destination: this.getElement().querySelector('.event__input--destination').value,
            destinationDescription: newDescription,
          },
          false);
      }
    });
  }

  _eventTypeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._data.offers = [];
    const currentTargetType = evt.target.value;
    const currentTargetDataOffers = this._data.offers;
    const newOffers = [];
    this._pointOffers.forEach((element) => {
      if (currentTargetType.toLowerCase() === element[element.length-1]) {
        element.forEach((item) => {
          newOffers.push(Object.assign({}, item));
        });
      }
    });

    newOffers.pop();
    Object.assign(currentTargetDataOffers, newOffers);

    this.updateData(this._data, {eventType: evt.target.value}, false);
  }

  _setDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;

      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._startDatepicker = flatpickr(this.getElement().querySelector(`#event-start-time-${this._data.id}`), {
      defaultDate: this._data.startTrip.toISOString(),
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      // eslint-disable-next-line camelcase
      time_24hr: true,
      onChange: this._eventTimeHandler,
    });

    this._endDatepicker = flatpickr(this.getElement().querySelector(`#event-end-time-${this._data.id}`), {
      defaultDate: this._data.endTrip.toISOString(),
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      // eslint-disable-next-line camelcase
      time_24hr: true,
      onChange: this._eventTimeHandler,
    });
  }

  _eventTimeHandler() {
    this.updateData(this._data,{
      startTrip: dayjs(this.getElement().querySelector('.event__input--time[name=event-start-time]').value, 'DD/MM/YY HH:mm' ),
      endTrip: dayjs(this.getElement().querySelector('.event__input--time[name=event-end-time]').value, 'DD/MM/YY HH:mm' ),
    }, true);
  }

  _eventOffersHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    const currentTarget = evt.target.id.substring(evt.target.id.length-1);
    const currentTargetDataOffers = this._data.offers[currentTarget-1];

    Object.assign(currentTargetDataOffers, {
      checked: evt.target.checked,
    });
  }

  getTemplate() {
    return createEditTemplate(this._data, this._pointDestinations);
  }

  _submitClickHandler(evt) {
    evt.preventDefault();
    this._callback.submitClick(this._data);
  }

  setSubmitFormClick(callback) {
    this._callback.submitClick = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._submitClickHandler);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setClosetFormClick(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._closeClickHandler);
  }
}
