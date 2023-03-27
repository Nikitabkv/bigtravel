import AbstractComponentView from './abstract.js';

const createBoardTemplate = () =>
  `<ul class="trip-events__list">
   </ul>`;

export default class BoardTemplate extends AbstractComponentView {
  getTemplate() {
    return createBoardTemplate();
  }
}
