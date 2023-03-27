import AbstractComponentView from './abstract.js';

const emptyBoardTemplate = () =>
  '<p className="trip-events__msg">Click New Event to create your first point</p>';

export default class EmptyBoard extends AbstractComponentView {
  getTemplate() {
    return emptyBoardTemplate();
  }
}
