import NewPoint from '../view/new-point.js';
import {remove, render} from '../util/render.js';
import {RENDER_POSITION, UPDATE_TYPE, USER_ACTION} from '../util/const.js';
import {getRandomInRange} from '../util/util.js';
import dayjs from 'dayjs';

export default class NewPointPresenter {
  constructor(board, changeData, point, pointModel) {
    this._board = board;
    this._changeData = changeData;
    this._point = this._createNewPoint(point);
    // тут добавить надо 0 передавать если нет точке
    this._pointsModel = pointModel;


    this._newPoint = new NewPoint(this._point, this._pointsModel.getPointOffers(), this._pointsModel.getDestinations());

    this._createNewPointHandler = this._createNewPointHandler.bind(this);
    this._renderCreatePoint = this._renderCreatePoint.bind(this);

    this._handleFromSubmit = this._handleFromSubmit.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
  }

  init() {
    this._createNewPointHandler();
  }

  setSavingState(state) {
    const resetFormState = () => {
      this._newPoint.addSavingFlag({
        isDisabled: false,
        isSaving: false,
      });
    };
    switch (state) {
      case 'saving':
        this._newPoint.addSavingFlag({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case 'reset':
        this._newPoint.shake(resetFormState);
        break;
    }}

  _renderCreatePoint() {
    render(this._board, this._newPoint.getElement(), RENDER_POSITION.start);
    this._newPoint.setSubmitFormClick(this._handleFromSubmit);
    this._newPoint.setClosetFormClick(this._handleFormClose);
  }

  _createNewPoint(points) {
    return  {
      destination: 'Geneva',
      destinationDescription: {
        description: 'Geneva, is a beautiful city, a true asian pearl.',
        photo: [{src: 'http://picsum.photos/300/200?r=0.9445403945475519', description: 'Geneva kindergarten'},
          {src: 'http://picsum.photos/300/200?r=0.36879339745302464', description: 'Geneva zoo'},
          {src: 'http://picsum.photos/300/200?r=0.3880728435943632', description: 'Geneva zoo'},
          {src: 'http://picsum.photos/300/200?r=0.34977114329326886', description: 'Geneva zoo'},
          {src: 'http://picsum.photos/300/200?r=0.1188367281929823', description: 'Geneva city centre'},
          {src: 'http://picsum.photos/300/200?r=0.3628260477489573', description: 'Geneva zoo'}],
      },
      endTrip: dayjs().add(1, 'day'),
      eventCost: 0,
      eventType: 'flight',
      favorite: false,
      id: points.length+1,
      offers: [{offerTitle: 'Choose seats', offerPrice: 90, checked: false},
        {offerTitle: 'Upgrade to comfort class', offerPrice: 120, checked: false},
        {offerTitle: 'Add luggage', offerPrice: 170, checked: false},
        {offerTitle: 'Business lounge', offerPrice: 160, checked: false}],
      startTrip: dayjs(),
    };
  }

  _handleFromSubmit(data) {
    data.id = getRandomInRange(10, 1000);
    this._changeData(
      USER_ACTION.ADD_POINT,
      UPDATE_TYPE.MINOR,
      data,
    );
  }

  removeAndCreateNewPoint() {
    remove(this._newPoint);
    this._newPoint = new NewPoint(this._point, this._pointsModel.getPointOffers(), this._pointsModel.getDestinations());
  }

  _handleFormClose() {
    this.removeAndCreateNewPoint();
  }

  _createNewPointHandler() {
    const newPointButton = document.querySelector('.trip-main__event-add-btn');
    newPointButton.addEventListener('click', this._renderCreatePoint);
  }
}
